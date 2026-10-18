/* المساعد: مفاتيح متعددة + دوران + مزامنة مشفّرة بين الأجهزة + لوحة عائمة */
(function(){
  "use strict";
  const KKEY = "prep_ai_keys";
  const CKEY = "prep_chat";
  const LKEY = "prep_lang";
  const SKEY = "prep_ai_sync";
  const RKEY = "prep_ai_rr";
  const COOLKEY = "prep_ai_cool";
  const API = "https://extendsclass.com/api/json-storage/bin";

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
  function ls(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

  /* ---------- التهيئة ---------- */
  function loadCfg(){
    let c = ls(KKEY, null);
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
  function saveCfg(){ lsSet(KKEY, cfg); }
  function modelOf(id){ return (cfg.providers[id].model || "").trim() || PROVIDERS[id].model; }

  let chat = ls(CKEY, []);
  if(!Array.isArray(chat)) chat = [];
  function saveChat(){ lsSet(CKEY, chat.slice(-60)); }

  let sync = ls(SKEY, null);
  if(sync && (!sync.id || !sync.keyB64)) sync = null;

  const $ = s => document.querySelector(s);
  function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function hasKeys(id){ return (cfg.providers[id].keys || []).filter(Boolean).length > 0; }
  function firstWithKeys(){ const p = cfg.preferred; if(hasKeys(p)) return p; return ORDER.find(hasKeys) || null; }

  /* ---------- التشفير ---------- */
  const enc = new TextEncoder(), dec = new TextDecoder();
  function b64(buf){ let s = ""; const a = new Uint8Array(buf); for(let i=0;i<a.length;i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function unb64(s){ return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
  async function deriveKey(pass, saltB64){
    const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
    const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      {name:"PBKDF2", salt, iterations: 310000, hash: "SHA-256"},
      base, {name:"AES-GCM", length: 256}, true, ["encrypt", "decrypt"]
    );
    return {key, salt: b64(salt)};
  }
  async function exportKeyB64(key){ return b64(await crypto.subtle.exportKey("raw", key)); }
  async function importKeyB64(s){ return crypto.subtle.importKey("raw", unb64(s), {name:"AES-GCM"}, true, ["encrypt", "decrypt"]); }
  async function encryptJSON(key, obj){
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, enc.encode(JSON.stringify(obj)));
    return {iv: b64(iv), ct: b64(ct)};
  }
  async function decryptJSON(key, blob){
    const pt = await crypto.subtle.decrypt({name:"AES-GCM", iv: unb64(blob.iv)}, key, unb64(blob.ct));
    return JSON.parse(dec.decode(pt));
  }

  /* ---------- نقل المفاتيح لجهاز آخر (رابط مشفّر) ---------- */
  function toB64Url(bytes){ return b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function fromB64Url(s){ s = s.replace(/-/g, "+").replace(/_/g, "/"); while(s.length % 4) s += "="; return unb64(s); }

  async function makeLink(pass){
    const k = await deriveKey(pass, null);
    const blob = await encryptJSON(k.key, {providers: cfg.providers, preferred: cfg.preferred, savedAt: Date.now()});
    const raw = enc.encode(JSON.stringify({s: k.salt, i: blob.iv, c: blob.ct}));
    return location.origin + location.pathname + "#k=" + toB64Url(raw);
  }
  async function importLink(hash, pass){
    const obj = JSON.parse(dec.decode(fromB64Url(String(hash).replace(/^#k=/, ""))));
    const k = await deriveKey(pass, obj.s);
    const data = await decryptJSON(k.key, {iv: obj.i, ct: obj.c});
    const changed = mergeVault(data);
    saveCfg();
    return changed;
  }
  function mergeVault(remote){
    if(!remote || !remote.providers) return false;
    let changed = false;
    ORDER.forEach(id => {
      const r = remote.providers[id] || {keys:[], model:""};
      const l = cfg.providers[id];
      const merged = Array.from(new Set([...(l.keys || []), ...(r.keys || [])].filter(Boolean)));
      if(merged.length !== (l.keys || []).length){ l.keys = merged; changed = true; }
      if(!l.model && r.model){ l.model = r.model; changed = true; }
    });
    if(remote.savedAt && remote.savedAt > (cfg.savedAt || 0) && remote.preferred && remote.preferred !== cfg.preferred){
      cfg.preferred = remote.preferred; changed = true;
    }
    if(changed){ cfg.savedAt = Date.now(); saveCfg(); }
    return changed;
  }

  /* ---------- الدوران و cooldown ---------- */
  function loadCool(){ return ls(COOLKEY, {}) || {}; }
  function coolLeft(pid, i){ const m = loadCool(); const ts = m[pid + ":" + i] || 0; return Math.max(0, ts - Date.now()); }
  function setCool(pid, i, ms){ const m = loadCool(); m[pid + ":" + i] = Date.now() + ms; lsSet(COOLKEY, m); }
  function loadRR(){ return ls(RKEY, {}) || {}; }
  function pickOrder(pid, n){
    const rr = loadRR();
    const start = (rr[pid] || 0) % n;
    const idxs = [];
    for(let k = 0; k < n; k++) idxs.push((start + k) % n);
    rr[pid] = (start + 1) % n;
    lsSet(RKEY, rr);
    return idxs;
  }

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
    const hist = chat.slice(-8).map(m => ({role: m.role === "user" ? "user" : "assistant", content: m.text}));
    return [{role:"system", content: systemPrompt()}].concat(hist);
  }

  /* ---------- اكتشاف الموديل ---------- */
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
      if(r.status === 429){
        const ra = parseInt(r.headers.get("retry-after") || "0", 10);
        const e = new Error(t("rateLimited")); e.code = "RATE"; e.retryAfter = ra; throw e;
      }
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
    if(r.status === 429){
      const ra = parseInt(r.headers.get("retry-after") || "0", 10);
      const e = new Error(t("rateLimited")); e.code = "RATE"; e.retryAfter = ra; throw e;
    }
    if(!r.ok) throw new Error("HTTP " + r.status + " " + txt.slice(0, 120));
    const j = JSON.parse(txt);
    const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
    const out = parts.map(x => x.text || "").join("").trim();
    if(!out) throw new Error("empty response");
    return out;
  }

  async function ask(messages){
    const order = [cfg.preferred].concat(ORDER.filter(x => x !== cfg.preferred));
    let lastErr = null, tried = 0, cooling = 0;
    for(const pid of order){
      const keys = (cfg.providers[pid].keys || []).filter(Boolean);
      if(!keys.length) continue;
      for(const i of pickOrder(pid, keys.length)){
        const left = coolLeft(pid, i);
        if(left > 0){ cooling++; continue; }
        tried++;
        try{
          return await callOne(pid, keys[i], messages, true);
        }catch(e){
          lastErr = e;
          if(e.code === "AUTH") setCool(pid, i, 60 * 60 * 1000);
          else if(e.code === "RATE") setCool(pid, i, Math.max(30 * 1000, (e.retryAfter || 60) * 1000));
        }
      }
    }
    if(!tried && cooling) throw new Error(t("rateLimited"));
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
  function keyChips(id){
    const keys = (cfg.providers[id].keys || []).filter(Boolean);
    if(!keys.length) return "";
    return keys.map((k, i) => {
      const left = coolLeft(id, i);
      const cls = left ? "bad" : "ok";
      const lbl = left ? (t("keyCool") + " " + Math.ceil(left / 60000) + "m") : t("keyOk");
      return `<span class="badge ${cls}" style="margin:2px 3px 0 0">#${i+1} ${esc(String(k).slice(-4))} · ${lbl}</span>`;
    }).join("");
  }
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
        <div class="st" data-kst="${id}">${keyChips(id)}</div>
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
      </select>
      <div class="muted" style="margin-top:8px">${t("keysAutoSave")}</div>`;
    wrap.appendChild(sel);
    renderSync();
  }
  function refreshChips(){
    ORDER.forEach(id => {
      const el = document.querySelector('[data-kst="' + id + '"]');
      if(el) el.innerHTML = keyChips(id);
    });
  }

  function commitSettings(){
    ORDER.forEach(id => {
      const ta = document.querySelector('[data-keys="' + id + '"]');
      const mi = document.querySelector('[data-model="' + id + '"]');
      if(ta) cfg.providers[id].keys = ta.value.split("\n").map(s => s.trim()).filter(Boolean);
      if(mi) cfg.providers[id].model = mi.value.trim();
    });
    const pref = $("#prefSel"); if(pref) cfg.preferred = pref.value;
    cfg.savedAt = Date.now();
    saveCfg();
    refreshChips();
    renderChat();
  }

  function renderSync(){
    const box = $("#syncBox"); if(!box) return;
    box.innerHTML = `
      <div class="prov" style="margin-top:14px">
        <h4>${t("transferTitle")}</h4>
        <div class="muted">${t("transferHint")}</div>
        <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn small primary" id="mkLink">${t("makeLink")}</button>
        </div>
        <div id="linkOut" class="muted" style="margin-top:8px;word-break:break-all;font-size:12px"></div>
        <div class="muted" style="margin-top:10px;font-size:12px">${t("syncWarn")}</div>
      </div>`;
    const b = $("#mkLink"); if(b) b.onclick = shareLink;
  }

  async function shareLink(){
    const pass = await askText(t("syncPassAsk"), {password: true});
    if(pass === null) return;
    if(pass.length < 8){ toast(t("syncPassShort")); return; }
    try{
      const url = await makeLink(pass);
      const out = $("#linkOut");
      if(out) out.innerHTML = `<div style="margin-top:6px">${t("linkCopyHint")}</div>
        <textarea readonly style="width:100%;min-height:74px;background:var(--surface2);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:8px;font-size:11px;direction:ltr;text-align:left">${esc(url)}</textarea>`;
      try{ await navigator.clipboard.writeText(url); toast(t("linkCopied")); }catch(e){}
    }catch(e){ toast(t("syncFail") + " — " + e.message); }
  }

  async function maybeImportFromHash(){
    const h = location.hash || "";
    if(h.indexOf("#k=") !== 0) return;
    const pass = await askText(t("linkAsk"), {password: true});
    if(pass === null){ history.replaceState(null, "", location.pathname); return; }
    importLink(h, pass).then(() => {
      history.replaceState(null, "", location.pathname);
      renderChat();
      toast(t("linkImported"));
    }).catch(() => {
      history.replaceState(null, "", location.pathname);
      toast(t("linkBad"));
    });
  }

  function openSettings(){ renderProviders(); $("#settings").classList.add("show"); window.scrollTo({top:0}); }
  function closeSettings(){ $("#settings").classList.remove("show"); }

  async function testAll(){
    let any = false;
    const m = loadCool();
    ORDER.forEach(id => Object.keys(m).forEach(k => { if(k.indexOf(id + ":") === 0) delete m[k]; }));
    lsSet(COOLKEY, m);
    refreshChips();
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
    refreshChips();
    if(!any) toast(t("noKeys"));
  }

  function toast(msg){
    const el = $("#toast"); if(!el) return;
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* نافذة إدخال داخلية (prompt() كيتحبس فبعض المتصفحات ديال الهاتف) */
  function askText(title, opts){
    opts = opts || {};
    return new Promise(resolve => {
      const ov = document.createElement("div");
      ov.className = "sheet show";
      ov.style.zIndex = "70";
      ov.innerHTML = `<div class="inner" style="max-width:420px;border-radius:16px;margin:auto 12px">
        <div class="sheet-head"><b>${esc(title)}</b></div>
        <input id="askInp" type="${opts.password ? "password" : "text"}" autocomplete="off" spellcheck="false"
          style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--text);font-family:inherit;font-size:15px">
        <div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px">
          <button class="btn small ghost" id="askCancel">✕</button>
          <button class="btn small primary" id="askOk">OK</button>
        </div></div>`;
      document.body.appendChild(ov);
      const inp = ov.querySelector("#askInp");
      setTimeout(() => inp.focus(), 60);
      const done = v => { ov.remove(); resolve(v); };
      ov.querySelector("#askCancel").onclick = () => done(null);
      ov.querySelector("#askOk").onclick = () => done(inp.value);
      inp.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); done(inp.value); } });
    });
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
      lsSet(KKEY, c);
      cfg = loadCfg(); renderProviders(); renderChat(); toast(t("importDone"));
    }catch(e){ toast(t("errorPrefix") + "JSON"); }
  }

  /* ---------- اللوحة العائمة ---------- */
  function openSheet(){
    const sh = $("#sheet"); if(!sh) return;
    renderChat(); sh.classList.add("show");
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
    const setSave = $("#setSave"); if(setSave) setSave.onclick = () => { commitSettings(); closeSettings(); toast(t("keysSaved")); };
    const setTest = $("#setTest"); if(setTest) setTest.onclick = testAll;
    const setExp = $("#setExport"); if(setExp) setExp.onclick = exportCfg;
    const setImp = $("#setImport"); if(setImp) setImp.onclick = importCfg;
    const clr = $("#asstClear"); if(clr) clr.onclick = () => {
      if(confirm(t("cleared") + "?")){ chat = []; saveChat(); renderChat(); }
    };

    // حفظ أوتوماتيكي أثناء الكتابة، بدون إعادة رسم باش ما يطيرش التركيز
    const provs = $("#provs");
    if(provs){
      let deb = null;
      provs.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(commitSettings, 700); });
      provs.addEventListener("change", () => { clearTimeout(deb); deb = setTimeout(commitSettings, 300); });
    }

    document.querySelectorAll(".langs button").forEach(b => {
      b.addEventListener("click", () => setTimeout(() => { applyAsstTexts(); renderChat(); renderSync(); refreshChips(); }, 60));
    });
    document.querySelectorAll('nav.tabs button[data-tab="assistant"]').forEach(b => {
      b.addEventListener("click", () => renderChat());
    });

    // استيراد المفاتيح من رابط مشفّر (#k=...)
    maybeImportFromHash();
  });
})();
