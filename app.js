/* منصة تحضير — منطق التطبيق (عربية / فرنسية / إنجليزية) */
(function(){
  "use strict";
  const KEY = "concours_prep_v1";
  const LKEY = "prep_lang";
  const TOTAL_HOURS = 120;

  const modules = window.CONTENT.modules;
  const QCM = window.CONTENT.qcm;
  const LOC = { fr: window.FR || {}, en: window.EN || {} };
  const MODS = {
    fr: { m1:"Réseaux — bases", m2:"Linux", m3:"Bases de données — SQL", m4:"Conception et normalisation",
          m5:"Algorithmes et structures", m6:"Programmation orientée objet", m7:"Windows Server et Active Directory",
          m8:"Sécurité de l'information", m9:"Réseaux avancés et HTTP", m10:"Génie logiciel",
          m11:"Architecture et SI", m12:"Culture générale et droit administratif" },
    en: { m1:"Networks — basics", m2:"Linux", m3:"Databases — SQL", m4:"Design and normalisation",
          m5:"Algorithms and data structures", m6:"Object-oriented programming", m7:"Windows Server and Active Directory",
          m8:"Information security", m9:"Advanced networking and HTTP", m10:"Software engineering",
          m11:"Architecture and IS", m12:"General culture and administrative law" }
  };
  const ERR_WORD = { ar:"سؤال", fr:"erreur(s)", en:"saved error(s)" };
  const HOUR_WORD = { ar:"ساعة", fr:"h", en:"h" };

  let LANG = "ar";
  try{ LANG = localStorage.getItem(LKEY) || "ar"; }catch(e){}
  if(["ar","fr","en"].indexOf(LANG) < 0) LANG = "ar";

  const allLessons = [];
  modules.forEach(m => m.lessons.forEach(l => allLessons.push({m, l})));

  let S = load();
  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(raw) return Object.assign({lessons:{}, hours:0, blocks:0, asked:0, correct:0, errors:[]}, JSON.parse(raw));
    }catch(e){}
    return {lessons:{}, hours:0, blocks:0, asked:0, correct:0, errors:[]};
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  function t(k){ return (window.UI[LANG] && window.UI[LANG][k]) || window.UI.ar[k] || k; }
  function modTitle(m){ return LANG === "ar" ? m.title : ((MODS[LANG] && MODS[LANG][m.id]) || m.title); }
  function lessonTitle(l){ return LANG === "ar" ? l.title : ((LOC[LANG].titles && LOC[LANG].titles[l.id]) || l.title); }
  function qloc(i){
    const base = QCM[i];
    if(LANG === "ar") return base;
    const tr = (LOC[LANG].qcm && LOC[LANG].qcm[i]) || {};
    return { m: base.m, a: base.a, q: tr.q || base.q, o: tr.o || base.o, why: tr.why || base.why };
  }
  function sumOf(l){ return (LOC[LANG] && LOC[LANG].sums && LOC[LANG].sums[l.id]) || null; }

  function toast(msg){
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(()=>el.classList.remove("show"), 2200);
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function shuffle(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

  /* ---------- اللغة ---------- */
  function applyLang(){
    document.documentElement.lang = LANG;
    document.documentElement.dir = (LANG === "ar") ? "rtl" : "ltr";
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    $("#brandTxt").textContent = t("appTitle");
    $("#hdrSub").textContent = t("appSub") + " · " + (Math.round(S.hours*10)/10) + "/120 " + HOUR_WORD[LANG];
    $$("#langSwitch button").forEach(b => b.classList.toggle("on", b.getAttribute("data-lang") === LANG));
    document.title = t("appTitle") + " — " + t("appSub");
    renderHome(); renderProgram(); renderQuizChoices(); renderErrors();
  }
  $$("#langSwitch button").forEach(b => b.addEventListener("click", () => {
    LANG = b.getAttribute("data-lang");
    try{ localStorage.setItem(LKEY, LANG); }catch(e){}
    closeOverlay();
    applyLang();
    toast(LANG === "ar" ? "العربية" : (LANG === "fr" ? "Français" : "English"));
  }));

  /* ---------- التنقل ---------- */
  function go(tab){
    $$("section").forEach(s => s.classList.toggle("active", s.id === "tab-"+tab));
    $$("nav.tabs button").forEach(b => b.classList.toggle("on", b.getAttribute("data-tab") === tab));
    window.scrollTo({top:0});
    if(tab === "home") renderHome();
    if(tab === "program") renderProgram();
    if(tab === "qcm") renderQuizChoices();
    if(tab === "errors") renderErrors();
  }
  $$("nav.tabs button").forEach(b => b.addEventListener("click", () => go(b.getAttribute("data-tab"))));

  /* ---------- الرئيسية ---------- */
  function renderHome(){
    const done = Object.keys(S.lessons).filter(k => S.lessons[k]).length;
    $("#doneLessons").textContent = done;
    $("#totalLessons").textContent = allLessons.length;
    const pct = Math.min(100, Math.round(S.hours / TOTAL_HOURS * 100));
    $("#progBar").style.width = pct + "%";
    $("#hdrPct").textContent = pct + "%";
    $("#hdrSub").textContent = t("appSub") + " · " + (Math.round(S.hours*10)/10) + "/120 " + HOUR_WORD[LANG];
    $("#statHours").textContent = (Math.round(S.hours*10)/10);
    $("#statBlocks").textContent = S.blocks;
    $("#statQcm").textContent = S.asked ? Math.round(S.correct / S.asked * 100) + "%" : "—";
    $("#statErrors").textContent = S.errors.length;

    const next = allLessons.find(x => !S.lessons[x.l.id]);
    const box = $("#nextLesson");
    if(next){
      box.innerHTML = "<b>" + esc(modTitle(next.m)) + "</b><br>" + esc(lessonTitle(next.l)) + " · " + next.l.minutes + " " + t("minutes");
      $("#startNext").onclick = () => openLesson(next.m, next.l);
    }else{
      box.innerHTML = esc(t("allDone"));
      $("#startNext").onclick = () => go("qcm");
    }
  }

  /* ---------- البرنامج ---------- */
  function renderProgram(){
    const wrap = $("#modules");
    wrap.innerHTML = "";
    modules.forEach(m => {
      const doneN = m.lessons.filter(l => S.lessons[l.id]).length;
      const el = document.createElement("div");
      el.className = "mod";
      el.innerHTML = `
        <div class="head">
          <div class="ico">${m.icon || "▤"}</div>
          <div style="flex:1">
            <div class="title">${esc(modTitle(m))}</div>
            <div class="meta">${doneN}/${m.lessons.length} ${esc(t("lessonsOf"))} · ${m.hours} ${HOUR_WORD[LANG]}</div>
          </div>
          <div class="muted">▾</div>
        </div>
        <div class="lessons"></div>`;
      const list = el.querySelector(".lessons");
      m.lessons.forEach(l => {
        const row = document.createElement("div");
        row.className = "lesson" + (S.lessons[l.id] ? " done" : "");
        row.innerHTML = `<div class="lt">${esc(lessonTitle(l))}</div>
          <div class="tick ${S.lessons[l.id]?"ok":""}">${S.lessons[l.id] ? "✓" : l.minutes + " " + esc(t("minutes"))}</div>`;
        row.onclick = () => openLesson(m, l);
        list.appendChild(row);
      });
      el.querySelector(".head").onclick = () => el.classList.toggle("open");
      wrap.appendChild(el);
    });
  }

  /* ---------- الدرس ---------- */
  function openLesson(m, l){
    const title = lessonTitle(l);
    const sums = sumOf(l);
    let html = `<h1>${esc(title)}</h1>`;
    const full = (window.BODIES && window.BODIES[LANG] && window.BODIES[LANG][l.id]) || null;
    if(full){
      html += full;
    }else if(LANG !== "ar" && sums){
      html += `<div class="banner"><b>${esc(t("summaryTitle"))} — ${esc(modTitle(m))}</b><br>${esc(t("arOnly"))}</div>
        <ul class="sums">${sums.map(s => "<li>" + esc(s) + "</li>").join("")}</ul>
        <details class="full"><summary>${esc(t("fullAr"))}</summary>${l.body}</details>`;
    }else{
      html += l.body;
    }
    html += `<div style="margin-top:26px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn primary" id="markDone">${esc(S.lessons[l.id] ? t("unmarkDone") : t("markDone"))}</button>
        <button class="btn" id="lessonQuiz">${esc(t("testModule"))}</button>
      </div>`;
    $("#ovLabel").textContent = modTitle(m);
    $("#ovBody").innerHTML = html;
    $("#overlay").classList.add("show");
    window.scrollTo({top:0});
    $("#markDone").onclick = () => {
      S.lessons[l.id] = !S.lessons[l.id];
      if(!S.lessons[l.id]) delete S.lessons[l.id];
      save();
      $("#markDone").textContent = S.lessons[l.id] ? t("unmarkDone") : t("markDone");
      toast(S.lessons[l.id] ? t("markedMsg") : t("unmarkedMsg"));
      renderHome(); renderProgram();
    };
    $("#lessonQuiz").onclick = () => {
      const idx = QCM.map((q,i)=>i).filter(i => QCM[i].m === m.id);
      if(!idx.length){ toast(t("noQuestions")); return; }
      startQuiz(shuffle(idx).slice(0, 10), modTitle(m));
    };
  }
  $("#ovBack").onclick = closeOverlay;
  function closeOverlay(){
    $("#overlay").classList.remove("show");
    $("#ovBody").innerHTML = "";
  }

  /* ---------- الاختبارات ---------- */
  function renderQuizChoices(){
    const wrap = $("#quizChoices");
    wrap.innerHTML = "";
    modules.forEach(m => {
      const n = QCM.filter(q => q.m === m.id).length;
      if(!n) return;
      const b = document.createElement("button");
      b.className = "btn wide";
      b.style.marginBottom = "8px";
      b.innerHTML = `${m.icon || "▤"} ${esc(modTitle(m))} <span class="muted">(${n})</span>`;
      b.onclick = () => {
        const idx = shuffle(QCM.map((q,i)=>i).filter(i => QCM[i].m === m.id));
        startQuiz(idx.slice(0, 10), modTitle(m));
      };
      wrap.appendChild(b);
    });
    $("#startAll").onclick = () => startQuiz(shuffle(QCM.map((q,i)=>i)), t("allTest"));
    $("#quickQuiz").onclick = () => startQuiz(shuffle(QCM.map((q,i)=>i)).slice(0, 10), t("quickQuiz"));
  }

  let quiz = null;
  function startQuiz(indices, label){
    quiz = {list: indices, i: 0, correct: 0, label};
    $("#ovLabel").textContent = label || "";
    $("#overlay").classList.add("show");
    window.scrollTo({top:0});
    renderQuestion();
  }

  function renderQuestion(){
    const body = $("#ovBody");
    if(quiz.i >= quiz.list.length) return renderResult();
    const qi = quiz.list[quiz.i];
    const q = qloc(qi);
    const m = modules.find(x => x.id === q.m);
    body.innerHTML = `
      <div class="qmeta">${esc(t("questionOf"))} ${quiz.i + 1} / ${quiz.list.length} · ${esc(m ? modTitle(m) : "")}</div>
      <h1 style="font-size:18px; line-height:1.7">${esc(q.q)}</h1>
      <div id="opts"></div>
      <div id="whyBox"></div>`;
    const opts = body.querySelector("#opts");
    q.o.forEach((txt, k) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.textContent = txt;
      b.onclick = () => answer(k, q, opts);
      opts.appendChild(b);
    });
    window.scrollTo({top:0});
  }

  function answer(k, q, opts){
    const buttons = Array.from(opts.children);
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if(idx === q.a) b.classList.add("correct");
      if(idx === k && k !== q.a) b.classList.add("wrong");
    });
    S.asked += 1;
    if(k === q.a){
      S.correct += 1; quiz.correct += 1;
      const ei = S.errors.indexOf(quiz.list[quiz.i]);
      if(ei >= 0) S.errors.splice(ei, 1);
    }else if(S.errors.indexOf(quiz.list[quiz.i]) < 0){
      S.errors.push(quiz.list[quiz.i]);
    }
    save();
    $("#whyBox").innerHTML = `<div class="why"><b>${esc(k === q.a ? t("correct") : t("incorrect"))}</b> ${esc(q.why)}</div>
      <button class="btn primary wide" id="nextQ" style="margin-top:14px">${esc(quiz.i + 1 < quiz.list.length ? t("next") : t("result"))}</button>`;
    $("#nextQ").onclick = () => { quiz.i += 1; renderQuestion(); };
    $("#nextQ").scrollIntoView({behavior:"smooth", block:"center"});
  }

  function renderResult(){
    const total = quiz.list.length;
    const pct = Math.round(quiz.correct / total * 100);
    const wrong = total - quiz.correct;
    $("#ovBody").innerHTML = `
      <h1>${esc(t("result"))}</h1>
      <div class="card" style="text-align:center">
        <div style="font-size:44px; font-weight:800; color:${pct>=70?'var(--accent)':'var(--warn)'}">${pct}%</div>
        <div class="muted">${quiz.correct} ${esc(t("correctOf"))} ${total}${wrong ? " · " + wrong + " " + esc(ERR_WORD[LANG]) : ""}</div>
      </div>
      <div class="row" style="gap:10px; flex-wrap:wrap">
        <button class="btn primary" id="againQ">${esc(t("again"))}</button>
        <button class="btn" id="closeQ">${esc(t("close"))}</button>
      </div>`;
    $("#againQ").onclick = () => { quiz.i = 0; quiz.correct = 0; renderQuestion(); };
    $("#closeQ").onclick = () => { closeOverlay(); renderHome(); renderErrors(); };
    save();
  }

  /* ---------- دفتر الأخطاء ---------- */
  function renderErrors(){
    const line = $("#errCountLine");
    if(line) line.textContent = S.errors.length + " " + ERR_WORD[LANG];
    const wrap = $("#errorsList");
    wrap.innerHTML = "";
    if(!S.errors.length){
      wrap.innerHTML = `<div class="card empty">${esc(t("emptyErrors"))}</div>`;
      return;
    }
    S.errors.forEach(qi => {
      const q = qloc(qi); if(!q) return;
      const m = modules.find(x => x.id === q.m);
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `<div class="qmeta">${esc(m ? modTitle(m) : "")}</div>
        <div style="font-weight:700; margin-bottom:8px">${esc(q.q)}</div>
        <div class="muted">${esc(t("answerIs"))}: <b style="color:var(--accent)">${esc(q.o[q.a])}</b></div>
        <div class="why">${esc(q.why)}</div>`;
      wrap.appendChild(el);
    });
    $("#clearErrors").onclick = () => {
      if(confirm(t("confirmClear"))){ S.errors = []; save(); renderErrors(); renderHome(); toast(t("clearedMsg")); }
    };
  }

  /* ---------- المؤقت ---------- */
  const BLOCK_SECONDS = 75 * 60;
  let remain = BLOCK_SECONDS, running = false, tick = null;
  function fmt(s){
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return h + ":" + String(m).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
  }
  function paintTimer(){ $("#timerText").textContent = fmt(remain); }
  function startTimer(){
    if(running) return;
    running = true;
    tick = setInterval(() => {
      remain -= 1; paintTimer();
      if(remain <= 0) completeBlock();
    }, 1000);
    toast(t("startedMsg"));
  }
  function pauseTimer(){ running = false; clearInterval(tick); tick = null; }
  function resetTimer(){ pauseTimer(); remain = BLOCK_SECONDS; paintTimer(); }
  function completeBlock(){
    pauseTimer();
    S.hours = Math.round((S.hours + 1.25) * 100) / 100;
    S.blocks += 1;
    save(); renderHome(); resetTimer();
    toast(t("doneMsg"));
  }
  $("#tStart").onclick = startTimer;
  $("#tPause").onclick = () => { pauseTimer(); toast(t("pausedMsg")); };
  $("#tReset").onclick = resetTimer;
  paintTimer();

  /* ---------- بدء ---------- */
  applyLang();
  window.addEventListener("hashchange", () => go((location.hash || "#home").slice(1)));

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
