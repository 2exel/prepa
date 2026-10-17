/* المساعد الذكي: مفاتيح متعددة + تبديل تلقائي + اكتشاف الموديل + لوحة عائمة في كل الصفحات */
(function(){
  "use strict";
  const KKEY = "prep_ai_keys";
  const CKEY = "prep_chat";
  const LKEY = "prep_lang";

  const PROVIDERS = {
    groq: {
      label: "Groq", kind: "openai",
      url: "https://api.groq.com/openai/v1/chat/completions",
      modelsUrl: "https://api.groq.com/openai/v1/models",
      model: "openai/gpt-oss-120b",
      models: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"]
    },
    gemini: {
      label: "Gemini", kind: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/models/",
      model: "gemini-3.8-flash",
      models: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"]
    },
    deepseek: {
      label: "DeepSeek", kind: "openai",
      url: "https://api.deepseek.com/chat/completions",
      modelsUrl: "https://api.deepseek.com/models",
      model: "deepseek-chat",
      models: ["deepseek-chat", "deepseek-reasoner"]
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
      c.providers[id] = {
        keys: Array.isArray(p.keys) ? p.keys : (p.key ? [p.key] : []),
        model: p.model || ""
      };
    });
    if(!c.preferred) c.preferred = ORDER.find(id => c.providers[id].keys.length) || "groq";
    return c;
  }
  let cfg = loadCfg();
  function saveCfg(){ try{ localStorage.setItem(KKEY, JSON.stringify(cfg)); }catch(e){} }
  function modelOf(id){ return (cfg.providers[id].model || "").trim() || PROVIDERS[id].model; }

  function loadChat(){
    try{ const a = JSON.parse(localStorage.getItem(CKEY) || "[]"); return Array.isArray(a) ? a : []; }catch(e){ return []; }
  }
  let chat = loadChat();
  function saveChat(){ try{ localStorage.setItem(CKEY, JSON.stringify(chat.slice(-60))); }catch(e){} }

  const $ = s => document.querySelector(s);
  function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function hasKeys(id){ return (cfg.providers[id].keys || []).filter(Boolean).length > 0; }
  function firstWithKeys(){ const p = cfg.preferred; if(hasKeys(p)) return p; return ORDER.find(hasKeys) || null; }

  /* ---------- العرض ---------- */
  function renderInto(box){
    if(!box) return;
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
    box.scrollTop = box.scrollHeight;
  }

  function renderChat(){
    renderInto($("#chat"));
    renderInto($("#chat2"));
    const p = firstWithKeys();
    const badge = p
      ? `<span class="badge ok">${PROVIDERS[p].label}</span> <span>${(cfg.providers[p].keys||[]).length} key(s)</span>`
      : `<span class="badge bad">${t("noKeys")}</span>`;
    const prov = $("#asstProvider");
    if(prov) prov.innerHTML = badge;
    ["#asstHint", "#asstHint2"].forEach(sel => {
      const el = $(sel); if(el) el.textContent = p ? "" : t("hintNoProvider");
    });
  }

  function push(role, text){
    chat.push({role, text});
    if(chat.length > 60) chat = chat.slice(-60);
    saveChat(); renderChat();
  }

  function typing(on){
    ["#chat", "#chat2"].forEach(sel => {
      const box = $(sel); if(!box) return;
      let el = box.querySelector(".typingMsg");
      if(on && !el){
        el = document.createElement("div");
        el.className = "msg ai typing typingMsg";
        el.textContent = t("thinking");
        box.appendChild(el); box.scrollTop = box.scrollHeight;
      }else if(!on && el){ el.remove(); }
    });
  }

  /* ---------- الرسائل ---------- */
  function systemPrompt(){
    const L = lang();
    const langName = {ar:"العربية", fr:"français", en:"English"}[L] || "العربية";
    let s = `أنت مساعد تعليمي لمباراة «مهندس دولة في المعلوميات» بالمغرب. أجب باللغة ${langName}، بإيجاز ووضوح، مع مثال عملي عند الحاجة، واشرح المصطلح التقني بالفرنسية بين قوسين إن كان يساعد. لا تخترع معلومات؛ إذا لم تكن متأكداً قل ذلك صراحة.`;
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

  /* ---------- اكتشاف الموديل تلقائياً ---------- */
  async function discoverModel(pid, key){
    try{
      if(pid === "gemini"){
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + encodeURIComponent(key));
        if(!r.ok) return null;
        const j = await r.json();
        const names = (j.models || [])
          .filter(m => (m.supportedGenerationMethods || []).indexOf("generateContent") > -1)
          .map(m => String(m.name || "").replace(/^models\//, ""))
          .filter(n => !/tts|image|live|audio|embedding/.test(n));
        return names.find(n => /^gemini-3\.\d+-flash$/.test(n))
            || names.find(n => /flash/.test(n))
            || names[0] || null;
      }
      const r = await fetch(PROVIDERS[pid].modelsUrl, {headers: {"authorization": "Bearer " + key}});
      if(!r.ok) return null;
      const j = await r.json();
      const ids = (j.data || []).map(x => x.id);
      for(const p of PROVIDERS[pid].models) if(ids.indexOf(p) > -1) return p;
      return ids.find(id => /gpt-oss-120b|qwen|llama|deepseek|gpt-oss|mistral/.test(id) && !/whisper|guard|tts/.test(id))
          || ids[0] || null;
    }catch(e){ return null; }
  }

  /* ---------- الاستدعاء ---------- */
  const bad = {};
  function isBad(pid, i){ const k = pid + ":" + i; return bad[k] && (Date.now() - bad[k] < 10 * 60 * 1000); }
  function markBad(pid, i){ bad[pid + ":" + i] = Date.now(); }

  function isModelError(status, body){
    if(status !== 404 && status !== 400) return false;
    const b = String(body || "").toLowerCase();
    if(b.indexOf("model") < 0) return false;
    return b.indexOf("does not exist") > -1 || b.indexOf("not found") > -1 ||
           b.indexOf("not supported") > -1 || b.indexOf("invalid") > -1 || b.indexOf("unknown") > -1;
  }

  async function callOne(pid, key, messages, allowDiscover){
    const p = PROVIDERS[pid];
    const model = modelOf(pid);
    if(p.kind === "openai"){
      const r = await fetch(p.url, {
        method: "POST",
        headers: {"content-type": "application/json", "authorization": "Bearer " + key},
        body: JSON.stringify({model, messages, temperature: 0.4, max_tokens: 900})
      });
      if(r.status === 401 || r.status === 403){ const e = new Error(t("invalidKey")); e.code = "AUTH"; throw e; }
      if(r.status === 429){ const e = new Error(t("rateLimited")); e.code = "RATE"; throw e; }
      if(!r.ok){
        const txt = await r.text();
        if(allowDiscover && isModelError(r.status, txt)){
          const found = await discoverModel(pid, key);
          if(found){ cfg.providers[pid].model = found; saveCfg(); return callOne(pid, key, messages, false); }
        }
        throw new Error("HTTP " + r.status + " " + txt.slice(0, 160));
      }
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
    const txt = await r.text();
    if(r.status === 400 || r.status === 401 || r.status === 403 || r.status === 404){
      if(allowDiscover && isModelError(r.status, txt)){
        const found = await discoverModel(pid, key);
        if(found){ cfg.providers[pid].model = found; saveCfg(); return callOne(pid, key, messages, false); }
      }
      const e = new Error(txt.indexOf("API key") > -1 ? t("invalidKey") : ("HTTP " + r.status + " " + txt.slice(0, 120)));
      e.code = "AUTH"; throw e;
    }
    if(r.status === 429){ const e = new Error(t("rateLimited")); e.code = "RATE"; throw e; }
    if(!r.ok) throw new Error("HTTP " + r.status + " " + txt.slice(0, 120));
    const j = JSON.parse(txt);
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
          return await callOne(pid, keys[i], messages, true);
        }catch(e){
          lastErr = e;
          if(e.code === "AUTH" || e.code === "RATE") markBad(pid, i);
        }
      }
    }
    throw lastErr || new Error(t("noKeys"));
  }

  /* ---------- الإرسال ---------- */
  let busy = false;
  async function send(input){
    if(busy) return;
    const text = (input && input.value || "").trim();
    if(!text) return;
    if(!firstWithKeys()){ renderChat(); return; }
    if(input) input.value = "";
    push("user", text);
    busy = true; typing(true);
    try{
      const out = await ask(buildMessages());
      typing(false); push("assistant", out);
    }catch(e){
      typing(false); push("assistant", t("errorPrefix") + (e.message || t("sendFail")));
    }finally{ busy = false; }
  }

  /* ---------- الإعدادات ---------- */
  function renderProviders(){
    const wrap = $("#provs"); if(!wrap) return;
    wrap.innerHTML = "";
    ORDER.forEach(id => {
      const p = PROVIDERS[id], c = cfg.providers[id];
      const el = document.createElement("div");
      el.className = "prov";
      el.innerHTML = `
        <h4>${p.label} <span class="badge ${hasKeys(id) ? "ok" : ""}">${hasKeys(id) ? (c.keys.filter(Boolean).length + " key(s)") : "—"}</span></h4>
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
  function openSettings(){ renderProviders(); $("#settings").classList.add("show"); window.scrollTo({top:0}); }
  function closeSettings(){ $("#settings").classList.remove("show"); }

  function saveSettings(){
    ORDER.forEach(id => {
      const ta = document.querySelector('[data-keys="' + id + '"]');
      const mi = document.querySelector('[data-model="' + id + '"]');
      if(ta) cfg.providers[id].keys = ta.value.split("\n").map(s => s.trim()).filter(Boolean);
      if(mi) cfg.providers[id].model = mi.value.trim();
    });
    const pref = $("#prefSel"); if(pref) cfg.preferred = pref.value;
    saveCfg(); closeSettings(); renderChat(); toast(t("keysSaved"));
  }

  async function testAll(){
    let any = false;
    for(const id of ORDER){
      const keys = (cfg.providers[id].keys || []).filter(Boolean);
      if(!keys.length) continue;
      any = true;
      const el = document.querySelector('[data-msg="' + id + '"]');
      if(el) el.textContent = t("thinking");
      try{
        const out = await callOne(id, keys[0], [{role:"user", content:"Réponds seulement: OK"}], true);
        if(el) el.innerHTML = `<span class="badge ok">${t("testOk")}</span> ${esc(out.slice(0, 40))}`;
      }catch(e){
        if(el) el.innerHTML = `<span class="badge bad">${t("testFail")}</span> ${esc(e.message || "")}`;
      }
    }
    if(!any) toast(t("noKeys"));
  }

  function toast(msg){
    const el = $("#toast"); if(!el) return;
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function exportCfg(){
    if(!ORDER.some(hasKeys)){ toast(t("exportEmpty")); return; }
    const data = JSON.stringify(cfg, null, 2);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(data).then(() => toast(t("exportDone"))).catch(() => prompt("JSON:", data));
    }else prompt("JSON:", data);
  }
  function importCfg(){
    const s = prompt(t("importPrompt"));
    if(!s) return;
    try{
      const c = JSON.parse(s);
      if(!c || !c.providers) throw new Error("bad");
      localStorage.setItem(KKEY, JSON.stringify(c));
      cfg = loadCfg(); renderProviders(); renderChat(); toast(t("importDone"));
    }catch(e){ toast(t("errorPrefix") + "JSON"); }
  }

  /* ---------- اللوحة العائمة ---------- */
  function openSheet(){
    const sh = $("#sheet"); if(!sh) return;
    renderChat();
    sh.classList.add("show");
    const inp = $("#asstInput2");
    if(inp) setTimeout(() => inp.focus(), 150);
  }
  function closeSheet(){ const sh = $("#sheet"); if(sh) sh.classList.remove("show"); }

  window.__askAssistantAboutLesson = function(){
    const ov = $("#overlay");
    if(ov && ov.classList.contains("show")){ const b = $("#ovBack"); if(b) b.click(); }
    openSheet();
    const inp = $("#asstInput2");
    if(inp){
      inp.value = lang() === "ar" ? "اشرح لي هذا الدرس بطريقة مبسطة، مع مثال."
                : (lang() === "fr" ? "Explique-moi cette leçon simplement, avec un exemple."
                                   : "Explain this lesson simply, with an example.");
    }
  };

  function applyAsstTexts(){
    document.querySelectorAll("[data-asst]").forEach(el => { el.textContent = t(el.getAttribute("data-asst")); });
    document.querySelectorAll("[data-asst-ph]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-asst-ph"))); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyAsstTexts(); renderChat();

    const fab = $("#fab"); if(fab) fab.onclick = openSheet;
    const sc = $("#sheetClose"); if(sc) sc.onclick = closeSheet;
    const ss = $("#sheetSettings"); if(ss) ss.onclick = openSettings;
    const sh = $("#sheet"); if(sh) sh.addEventListener("click", e => { if(e.target === sh) closeSheet(); });

    const s1 = $("#asstSend"); if(s1) s1.onclick = () => send($("#asstInput"));
    const s2 = $("#asstSend2"); if(s2) s2.onclick = () => send($("#asstInput2"));
    ["#asstInput", "#asstInput2"].forEach(sel => {
      const inp = $(sel); if(!inp) return;
      inp.addEventListener("keydown", e => {
        if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); send(inp); }
      });
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

    document.querySelectorAll(".langs button").forEach(b => {
      b.addEventListener("click", () => setTimeout(() => { applyAsstTexts(); renderChat(); }, 60));
    });
    document.querySelectorAll('nav.tabs button[data-tab="assistant"]').forEach(b => {
      b.addEventListener("click", () => renderChat());
    });
  });
})();
