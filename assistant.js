/* المساعد الذكي: مفاتيح متعددة + تبديل تلقائي + سياق الدرس */
(function(){
  "use strict";
  const KKEY = "prep_ai_keys";
  const CKEY = "prep_chat";
  const LKEY = "prep_lang";

  const PROVIDERS = {
    groq: {
      label: "Groq", kind: "openai",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
    },
    gemini: {
      label: "Gemini", kind: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/models/",
      model: "gemini-2.0-flash",
      models: ["gemini-2.0-flash", "gemini-1.5-flash"]
    },
    deepseek: {
      label: "DeepSeek", kind: "openai",
      url: "https://api.deepseek.com/chat/completions",
      model: "deepseek-chat",
      models: ["deepseek-chat"]
    }
  };
  const ORDER = ["groq", "gemini", "deepseek"];

  function lang(){ try{ return localStorage.getItem(LKEY) || "ar"; }catch(e){ return "ar"; } }
  function t(k){ const L = window.ASST[lang()] || window.ASST.ar; return L[k] || window.ASST.ar[k] || k; }

  function loadCfg(){
    let c = null;
    try{ c = JSON.parse(localStorage.getItem(KKEY) || "null"); }catch(e){}
    if(!c || typeof c !== "object") c = {};
    c.providers = c.providers || {};
    ORDER.forEach(id => {
      const p = c.providers[id] || {};
      c.providers[id] = { keys: Array.isArray(p.keys) ? p.keys : (p.key ? [p.key] : []), model: p.model || "" };
    });
    if(!c.preferred) c.preferred = ORDER.find(id => c.providers[id].keys.length) || "groq";
    return c;
  }
  let cfg = loadCfg();
  function saveCfg(){ try{ localStorage.setItem(KKEY, JSON.stringify(cfg)); }catch(e){} }

  function loadChat(){
    try{ const a = JSON.parse(localStorage.getItem(CKEY) || "[]"); return Array.isArray(a) ? a : []; }catch(e){ return []; }
  }
  let chat = loadChat();
  function saveChat(){ try{ localStorage.setItem(CKEY, JSON.stringify(chat.slice(-60))); }catch(e){} }

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function hasKeys(id){ return (cfg.providers[id].keys || []).filter(Boolean).length > 0; }
  function firstWithKeys(){ const p = cfg.preferred; if(hasKeys(p)) return p; return ORDER.find(hasKeys) || null; }

  /* ---------- واجهة المحادثة ---------- */
  function renderChat(){
    const box = $("#chat"); if(!box) return;
    box.innerHTML = "";
    if(!chat.length){
      const intro = document.createElement("div");
      intro.className = "msg sys";
      intro.textContent = t("intro");
      box.appendChild(intro);
    }
    chat.forEach(m => {
      const d = document.createElement("div");
      d.className = "msg " + (m.role === "user" ? "me" : "ai");
      d.textContent = m.text;
      box.appendChild(d);
    });
    const p = firstWithKeys();
    const prov = $("#asstProvider");
    if(prov){
      prov.innerHTML = p
        ? `<span class="badge ok">${PROVIDERS[p].label}</span> <span>${(cfg.providers[p].keys||[]).length} key(s)</span>`
        : `<span class="badge bad">${t("noKeys")}</span>`;
    }
    $("#asstHint").textContent = p ? "" : t("hintNoProvider");
    box.scrollTop = box.scrollHeight;
  }

  function push(role, text){
    chat.push({role, text});
    if(chat.length > 60) chat = chat.slice(-60);
    saveChat(); renderChat();
  }

  function typing(on){
    const box = $("#chat");
    let el = document.getElementById("typingMsg");
    if(on && !el){
      el = document.createElement("div");
      el.id = "typingMsg"; el.className = "msg ai typing";
      el.textContent = t("thinking");
      box.appendChild(el); box.scrollTop = box.scrollHeight;
    }else if(!on && el){ el.remove(); }
  }

  /* ---------- بناء الرسائل ---------- */
  function systemPrompt(){
    const L = lang();
    const langName = {ar:"العربية", fr:"français", en:"English"}[L] || "العربية";
    let s = `أنت مساعد تعليمي لمباراة «مهندس دولة في المعلوميات» بالمغرب. أجب باللغة ${langName}، بإيجاز ووضوح، مع مثال عملي عند الحاجة، واشرح المصطلح التقني بالفرنسية بين قوسين إن كان يساعد على الفهم. لا تخترع معلومات، وإذا لم تكن متأكداً قل ذلك صراحة.`;
    const ctx = window.__lessonCtx;
    if(ctx && ctx.title){
      s += `\n\nالدرس الحالي الذي يقرأه الطالب: «${ctx.title}».\nمقتطف من الدرس:\n${ctx.text}`;
    }
    return s;
  }
  function buildMessages(){
    const sys = {role:"system", content: systemPrompt()};
    const hist = chat.slice(-8).map(m => ({role: m.role === "user" ? "user" : "assistant", content: m.text}));
    return [sys].concat(hist);
  }

  /* ---------- استدعاء المزوّدين مع تبديل المفاتيح ---------- */
  const bad = {}; // runtime cooldown: bad[pid+":"+idx] = timestamp
  function isBad(pid, i){ const k = pid + ":" + i; return bad[k] && (Date.now() - bad[k] < 10 * 60 * 1000); }
  function markBad(pid, i){ bad[pid + ":" + i] = Date.now(); }

  async function callOne(pid, key, messages){
    const p = PROVIDERS[pid];
    const model = (cfg.providers[pid].model || "").trim() || p.model;
    if(p.kind === "openai"){
      const r = await fetch(p.url, {
        method: "POST",
        headers: {"content-type": "application/json", "authorization": "Bearer " + key},
        body: JSON.stringify({model, messages, temperature: 0.4, max_tokens: 900})
      });
      if(r.status === 401 || r.status === 403) { const e = new Error(t("invalidKey")); e.code = "AUTH"; throw e; }
      if(r.status === 429) { const e = new Error(t("rateLimited")); e.code = "RATE"; throw e; }
      if(!r.ok) { const txt = await r.text(); throw new Error("HTTP " + r.status + " " + txt.slice(0, 140)); }
      const j = await r.json();
      const out = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if(!out) throw new Error("empty response");
      return out.trim();
    }
    // Gemini
    const url = p.url + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(key);
    const sys = (messages.find(m => m.role === "system") || {}).content || "";
    const contents = messages.filter(m => m.role !== "system").map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{text: m.content}]
    }));
    const body = {contents, generationConfig: {temperature: 0.4, maxOutputTokens: 1200}};
    if(sys) body.systemInstruction = {parts: [{text: sys}]};
    const r = await fetch(url, {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify(body)});
    if(r.status === 400 || r.status === 401 || r.status === 403) {
      const txt = await r.text();
      const e = new Error(txt.indexOf("API key") > -1 ? t("invalidKey") : ("HTTP " + r.status));
      e.code = "AUTH"; throw e;
    }
    if(r.status === 429) { const e = new Error(t("rateLimited")); e.code = "RATE"; throw e; }
    if(!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
    const out = parts.map(x => x.text || "").join("").trim();
    if(!out) throw new Error("empty response");
    return out;
  }

  async function ask(messages){
    const order = [cfg.preferred].concat(ORDER.filter(x => x !== cfg.preferred));
    let lastErr = null;
    for(const pid of order){
      const keys = (cfg.providers[pid].keys || []).filter(Boolean);
      if(!keys.length) continue;
      for(let i = 0; i < keys.length; i++){
        if(isBad(pid, i)) continue;
        try{
          return await callOne(pid, keys[i], messages);
        }catch(e){
          lastErr = e;
          if(e.code === "AUTH" || e.code === "RATE") markBad(pid, i);
        }
      }
    }
    throw lastErr || new Error(t("noKeys"));
  }

  /* ---------- إرسال ---------- */
  let busy = false;
  async function send(){
    if(busy) return;
    const inp = $("#asstInput");
    const text = (inp.value || "").trim();
    if(!text) return;
    if(!firstWithKeys()){ renderChat(); return; }
    inp.value = "";
    push("user", text);
    busy = true; typing(true);
    try{
      const out = await ask(buildMessages());
      typing(false);
      push("assistant", out);
    }catch(e){
      typing(false);
      push("assistant", t("errorPrefix") + (e.message || t("sendFail")));
    }finally{
      busy = false;
    }
  }

  /* ---------- الإعدادات ---------- */
  function renderProviders(){
    const wrap = $("#provs"); if(!wrap) return;
    wrap.innerHTML = "";
    ORDER.forEach(id => {
      const p = PROVIDERS[id];
      const c = cfg.providers[id];
      const el = document.createElement("div");
      el.className = "prov";
      el.innerHTML = `
        <h4>${p.label} <span class="badge ${hasKeys(id) ? "ok" : ""}" data-st="${id}">${hasKeys(id) ? (c.keys.filter(Boolean).length + " key(s)") : "—"}</span></h4>
        <div class="muted">${t("keysLabel")}</div>
        <textarea data-keys="${id}" spellcheck="false" placeholder="sk-...">${esc((c.keys || []).join("\n"))}</textarea>
        <div class="muted" style="margin-top:8px">${t("modelLabel")}</div>
        <input data-model="${id}" value="${esc(c.model || "")}" placeholder="${esc(p.model)}" spellcheck="false">
        <div class="st" data-msg="${id}"></div>`;
      wrap.appendChild(el);
    });
    const sel = document.createElement("div");
    sel.className = "prov";
    sel.innerHTML = `<h4>${t("preferred")}</h4>
      <select id="prefSel" style="width:100%;padding:10px;border-radius:10px;background:var(--surface);color:var(--text);border:1px solid var(--line);font-family:inherit">
        ${ORDER.map(id => `<option value="${id}" ${cfg.preferred === id ? "selected" : ""}>${PROVIDERS[id].label}</option>`).join("")}
      </select>`;
    wrap.appendChild(sel);
  }

  function openSettings(){
    renderProviders();
    $("#settings").classList.add("show");
    window.scrollTo({top:0});
  }
  function closeSettings(){ $("#settings").classList.remove("show"); }

  function saveSettings(){
    ORDER.forEach(id => {
      const ta = document.querySelector(`[data-keys="${id}"]`);
      const mi = document.querySelector(`[data-model="${id}"]`);
      if(ta) cfg.providers[id].keys = ta.value.split("\n").map(s => s.trim()).filter(Boolean);
      if(mi) cfg.providers[id].model = mi.value.trim();
    });
    const pref = document.getElementById("prefSel");
    if(pref) cfg.preferred = pref.value;
    saveCfg();
    closeSettings();
    renderChat();
    toast(t("keysSaved"));
  }

  async function testAll(){
    const st = {};
    ORDER.forEach(id => { const c = cfg.providers[id]; st[id] = (c.keys || []).filter(Boolean); });
    let any = false;
    for(const id of ORDER){
      if(!st[id].length) continue;
      any = true;
      const el = document.querySelector(`[data-msg="${id}"]`);
      if(el) el.textContent = t("thinking");
      try{
        const out = await callOne(id, st[id][0], [{role:"user", content:"Réponds seulement: OK"}]);
        if(el) el.innerHTML = `<span class="badge ok">${t("testOk")}</span> ${esc(out.slice(0, 40))}`;
      }catch(e){
        if(el) el.innerHTML = `<span class="badge bad">${t("testFail")}</span> ${esc(e.message || "")}`;
      }
    }
    if(!any) toast(t("noKeys"));
  }

  function toast(msg){
    const el = document.getElementById("toast");
    if(!el) return;
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------- ربط ---------- */
  function bind(){
    const send = $("#asstSend");
    if(send) send.onclick = () => module_send();
    const inp = $("#asstInput");
    if(inp) inp.addEventListener("keydown", e => {
      if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); module_send(); }
    });
    const setBtn = $("#asstSettings"); if(setBtn) setBtn.onclick = openSettings;
    const setBack = $("#setBack"); if(setBack) setBack.onclick = closeSettings;
    const setSave = $("#setSave"); if(setSave) setSave.onclick = saveSettings;
    const setTest = $("#setTest"); if(setTest) setTest.onclick = testAll;
    const setExp = $("#setExport"); if(setExp) setExp.onclick = exportCfg;
    const setImp = $("#setImport"); if(setImp) setImp.onclick = importCfg;
    const clr = $("#asstClear"); if(clr) clr.onclick = () => {
      if(confirm(t("cleared") + "?")){ chat = []; saveChat(); renderChat(); }
    };
  }
  function module_send(){ send(); }

  function exportCfg(){
    const has = ORDER.some(id => hasKeys(id));
    if(!has){ toast(t("exportEmpty")); return; }
    const data = JSON.stringify(cfg, null, 2);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(data).then(() => toast(t("exportDone"))).catch(() => {
        prompt("JSON:", data);
      });
    }else{
      prompt("JSON:", data);
    }
  }
  function importCfg(){
    const s = prompt(t("importPrompt"));
    if(!s) return;
    try{
      const c = JSON.parse(s);
      if(!c || !c.providers) throw new Error("bad");
      localStorage.setItem(KKEY, JSON.stringify(c));
      cfg = loadCfg();
      renderProviders(); renderChat(); toast(t("importDone"));
    }catch(e){ toast(t("errorPrefix") + "JSON"); }
  }

  window.__askAssistantAboutLesson = function(){
    const ov = document.getElementById("overlay");
    if(ov && ov.classList.contains("show")){ const b = document.getElementById("ovBack"); if(b) b.click(); }
    const tab = document.querySelector('nav.tabs button[data-tab="assistant"]');
    if(tab) tab.click();
    const inp = document.getElementById("asstInput");
    if(inp){
      inp.value = lang() === "ar" ? "اشرح لي هذا الدرس بطريقة مبسطة، مع مثال." :
                  (lang() === "fr" ? "Explique-moi cette leçon simplement, avec un exemple." :
                                     "Explain this lesson simply, with an example.");
      inp.focus();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    bind(); renderChat();
    document.querySelectorAll('nav.tabs button').forEach(b => {
      if(b.getAttribute("data-tab") === "assistant") b.addEventListener("click", () => { renderChat(); });
    });
    // ترجمة نصوص المساعد عند تبديل اللغة
    document.querySelectorAll("[data-asst]").forEach(el => {
      el.textContent = t(el.getAttribute("data-asst"));
    });
    const ph = document.querySelector("[data-asst-ph]");
    if(ph) ph.setAttribute("placeholder", t(ph.getAttribute("data-asst-ph")));
    document.querySelectorAll(".langs button").forEach(b => {
      b.addEventListener("click", () => setTimeout(() => {
        document.querySelectorAll("[data-asst]").forEach(el => { el.textContent = t(el.getAttribute("data-asst")); });
        const p = document.querySelector("[data-asst-ph]");
        if(p) p.setAttribute("placeholder", t(p.getAttribute("data-asst-ph")));
        renderChat();
      }, 60));
    });
  });
})();
