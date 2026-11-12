
"use strict";

/* ============================================================
   一、赛制定义（严格按需求，顺序不可调换）
   type: single = 单边计时 | dual = 双独立计时器
   ============================================================ */
const SEGMENTS = [
  { id:"s1",  no:1,  name:"正方开篇立论",             role:"正方一辩",              type:"single", side:"pro", dur:210,
    v:{ start:"正方开篇立论，计时开始", s30:"正方开篇立论剩余30秒", s10:"正方开篇立论剩余10秒", end:"正方开篇立论时间到，请停止发言" } },

  { id:"s2",  no:2,  name:"反方破题立论",             role:"反方一辩",              type:"single", side:"con", dur:210,
    v:{ start:"反方破题立论，计时开始", s30:"反方破题立论剩余30秒", s10:"反方破题立论剩余10秒", end:"反方破题立论时间到，请停止发言" } },

  { id:"s3",  no:3,  name:"反方四辩质询正方一辩",     role:"质询方：反方四辩",       type:"single", side:"con", dur:90,
    v:{ start:"反方四辩质询正方一辩，计时开始", s30:"本次质询剩余30秒", s10:"本次质询剩余10秒", end:"质询时间到，请停止提问" } },

  { id:"s4",  no:4,  name:"正方四辩质询反方一辩",     role:"质询方：正方四辩",       type:"single", side:"pro", dur:90,
    v:{ start:"正方四辩质询反方一辩，计时开始", s30:"本次质询剩余30秒", s10:"本次质询剩余10秒", end:"质询时间到，请停止提问" } },

  { id:"s5",  no:5,  name:"反方二辩驳论",             role:"反方二辩",              type:"single", side:"con", dur:120,
    v:{ start:"反方二辩驳论，计时开始", s30:"反方二辩驳论剩余30秒", s10:"反方二辩驳论剩余10秒", end:"反方二辩驳论时间到，请停止发言" } },

  { id:"s6",  no:6,  name:"正方二辩驳论",             role:"正方二辩",              type:"single", side:"pro", dur:120,
    v:{ start:"正方二辩驳论，计时开始", s30:"正方二辩驳论剩余30秒", s10:"正方二辩驳论剩余10秒", end:"正方二辩驳论时间到，请停止发言" } },

  { id:"s7",  no:7,  name:"二辩对辩",                 role:"正方二辩 ↔ 反方二辩",    type:"dual", durPro:90, durCon:90,
    vPro:{ start:"二辩对辩，正方计时开始", s30:"二辩对辩，正方剩余30秒", s10:"二辩对辩，正方剩余10秒", end:"正方对辩时间到" },
    vCon:{ start:"二辩对辩，反方计时开始", s30:"二辩对辩，反方剩余30秒", s10:"二辩对辩，反方剩余10秒", end:"反方对辩时间到" } },

  { id:"s8",  no:8,  name:"正方三辩质询",             role:"正方三辩质询反方一、二、四辩", type:"single", side:"pro", dur:120,
    v:{ start:"正方三辩质询，计时开始", s30:"本次质询剩余30秒", s10:"本次质询剩余10秒", end:"质询时间到，请停止提问" } },

  { id:"s9",  no:9,  name:"反方三辩质询",             role:"反方三辩质询正方一、二、四辩", type:"single", side:"con", dur:120,
    v:{ start:"反方三辩质询，计时开始", s30:"本次质询剩余30秒", s10:"本次质询剩余10秒", end:"质询时间到，请停止提问" } },

  { id:"s10", no:10, name:"正方三辩质询小结",         role:"正方三辩",              type:"single", side:"pro", dur:90,
    v:{ start:"正方三辩质询小结，计时开始", s30:"正方三辩小结剩余30秒", s10:"正方三辩小结剩余10秒", end:"正方三辩小结时间到，请停止发言" } },

  { id:"s11", no:11, name:"反方三辩质询小结",         role:"反方三辩",              type:"single", side:"con", dur:90,
    v:{ start:"反方三辩质询小结，计时开始", s30:"反方三辩小结剩余30秒", s10:"反方三辩小结剩余10秒", end:"反方三辩小结时间到，请停止发言" } },

  { id:"s12", no:12, name:"自由辩论",                 role:"双方辩手",              type:"dual", durPro:240, durCon:240,
    vPro:{ start:"自由辩论，正方计时开始", s30:"自由辩论，正方剩余30秒", s10:"自由辩论，正方剩余10秒", end:"正方自由辩论时间已用尽，正方不可继续发言" },
    vCon:{ start:"自由辩论，反方计时开始", s30:"自由辩论，反方剩余30秒", s10:"自由辩论，反方剩余10秒", end:"反方自由辩论时间已用尽，反方不可继续发言" } },

  { id:"s13", no:13, name:"反方四辩总结陈词",         role:"反方四辩",              type:"single", side:"con", dur:210,
    v:{ start:"反方四辩总结陈词，计时开始", s30:"反方总结剩余30秒", s10:"反方总结剩余10秒", end:"反方总结时间到，请停止发言" } },

  { id:"s14", no:14, name:"正方四辩总结陈词",         role:"正方四辩",              type:"single", side:"pro", dur:210,
    v:{ start:"正方四辩总结陈词，计时开始", s30:"正方总结剩余30秒", s10:"正方总结剩余10秒", end:"正方总结时间到，请停止发言" } },
];

const OPENING_VOICE = "辩论赛即将开始，请辩手、评委就位。";
const FINAL_VOICE   = "本场辩论赛所有环节结束！";

/* ============================================================
   二、工具：时间格式化
   ============================================================ */
function fmt(sec){
  sec = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sec/60), s = sec%60;
  return String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
}

/* ============================================================
   三、语音播报
   ============================================================ */
let voiceUnlocked = false;
let zhVoice = null;

function pickVoice(){
  if (!("speechSynthesis" in window)) return null;
  const vs = speechSynthesis.getVoices();
  zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang)) 
         || vs.find(v => /^zh/i.test(v.lang))
         || vs.find(v => /Chinese|中文|普通话/i.test(v.name))
         || null;
  return zhVoice;
}
if ("speechSynthesis" in window){
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function speak(text, interrupt){
  if (!("speechSynthesis" in window) || !text) return;
  try{
    if (interrupt !== false) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    if (zhVoice) u.voice = zhVoice;
    speechSynthesis.speak(u);
    voiceUnlocked = true;
  }catch(e){ /* 静默失败，不影响计时 */ }
}

/* ============================================================
   四、倒计时器
   ============================================================ */
class Countdown {
  constructor(duration){
    this.dur = duration;
    this.remain = duration;
    this.state = "idle";      // idle | running | paused | ended
    this._timer = null;
    this._last = 0;
    this._marks = {};
    this.onTick = null;       // (remain, self)
    this.onMark = null;       // ("s30"|"s10")
    this.onEnd  = null;       // (self)
  }
  reset(){
    this._stopInterval();
    this.remain = this.dur;
    this.state = "idle";
    this._marks = {};
    if (this.onTick) this.onTick(this.remain, this);
  }
  start(){
    if (this.state === "ended") return false;      // 已耗尽，禁止再启动
    if (this.state === "running") return true;
    if (this.state === "idle"){ this.remain = this.dur; this._marks = {}; }
    this.state = "running";
    this._last = performance.now();
    this._timer = setInterval(() => this._tick(), 80);
    if (this.onTick) this.onTick(this.remain, this);
    return true;
  }
  pause(){
    if (this.state !== "running") return;
    this._stopInterval();
    this.state = "paused";
    if (this.onTick) this.onTick(this.remain, this);
  }
  _stopInterval(){
    if (this._timer){ clearInterval(this._timer); this._timer = null; }
  }
  _tick(){
    if (this.state !== "running") return;
    const now = performance.now();
    const dt = (now - this._last) / 1000;
    this._last = now;
    this.remain -= dt;
    if (this.remain < 0) this.remain = 0;

    if (this.onTick) this.onTick(this.remain, this);

    // 30 秒提醒（只触发一次）
    if (!this._marks.s30 && this.remain <= 30 && this.remain > 10){
      this._marks.s30 = true;
      if (this.onMark) this.onMark("s30", this);
    }
    // 10 秒提醒（只触发一次）
    if (!this._marks.s10 && this.remain <= 10 && this.remain > 0){
      this._marks.s10 = true;
      if (this.onMark) this.onMark("s10", this);
    }
    // 到点
    if (this.remain <= 0){
      this._stopInterval();
      this.state = "ended";
      if (this.onTick) this.onTick(0, this);
      if (this.onEnd) this.onEnd(this);
    }
  }
}

/* ============================================================
   五、全局状态
   ============================================================ */
const S = {
  topic: "",
  pro: "",
  con: "",
  cur: 0,                     // 当前环节索引
  singleTimer: null,
  dual: { pro: null, con: null },
  dualActive: null,           // "pro" | "con" | null
};

/* DOM 引用 */
const $ = id => document.getElementById(id);
const el = {
  setup:$("setup"), match:$("match"),
  inTopic:$("inTopic"), inPro:$("inPro"), inCon:$("inCon"),
  hdTopic:$("hdTopic"), hdPro:$("hdPro"), hdCon:$("hdCon"),
  segbar:$("segbar"), segName:$("segName"), segRole:$("segRole"),
  singleWrap:$("singleWrap"), dualWrap:$("dualWrap"),
  singleSide:$("singleSide"), singleClock:$("singleClock"),
  singleProg:$("singleProg"), singleState:$("singleState"),
  clockPro:$("clockPro"), clockCon:$("clockCon"),
  statePro:$("statePro"), stateCon:$("stateCon"),
  colPro:$("colPro"), colCon:$("colCon"),
  badgePro:$("badgePro"), badgeCon:$("badgeCon"),
  proStart:$("proStart"), proPause:$("proPause"),
  conStart:$("conStart"), conPause:$("conPause"),
  startBtn:$("startBtn"), pauseBtn:$("pauseBtn"), resetBtn:$("resetBtn"),
  prevBtn:$("prevBtn"), nextBtn:$("nextBtn"),
  editBtn:$("editBtn"), fsBtn:$("fsBtn"),
};

/* ============================================================
   六、设置页逻辑
   ============================================================ */
function loadSaved(){
  try{
    const raw = localStorage.getItem("debate_setup_v1");
    if (!raw) return;
    const o = JSON.parse(raw);
    el.inTopic.value = o.topic || "";
    el.inPro.value   = o.pro   || "";
    el.inCon.value   = o.con   || "";
  }catch(e){}
}
function saveSetup(){
  try{
    localStorage.setItem("debate_setup_v1", JSON.stringify({
      topic: el.inTopic.value.trim(),
      pro:   el.inPro.value.trim(),
      con:   el.inCon.value.trim()
    }));
  }catch(e){}
}
function applyHeader(){
  el.hdTopic.textContent = S.topic || "（未填写辩题）";
  el.hdPro.textContent   = S.pro   || "正方";
  el.hdCon.textContent   = S.con   || "反方";
}
function enterMatch(){
  S.topic = el.inTopic.value.trim();
  S.pro   = el.inPro.value.trim();
  S.con   = el.inCon.value.trim();
  saveSetup();
  applyHeader();
  el.setup.classList.add("hidden");
  el.match.classList.remove("hidden");
  // 解锁语音（用户手势内）
  speak(OPENING_VOICE, true);
  buildSegbar();
  openSegment(0);
}

/* ============================================================
   七、环节切换
   ============================================================ */
function buildSegbar(){
  el.segbar.innerHTML = "";
  SEGMENTS.forEach((sg, i) => {
    const b = document.createElement("button");
    b.className = "segchip";
    b.dataset.idx = i;
    b.innerHTML = `<span class="n">${sg.no}.</span>${sg.name}<br><span style="opacity:.6">${fmt(sg.type==="dual"?Math.max(sg.durPro,sg.durCon):sg.dur)}</span>`;
    b.addEventListener("click", () => openSegment(i));
    el.segbar.appendChild(b);
  });
}

function markSegbarActive(idx){
  [...el.segbar.children].forEach((c, i) => {
    c.classList.toggle("active", i === idx);
    if (i === idx) c.scrollIntoView({behavior:"smooth", block:"nearest", inline:"center"});
  });
}

/** 停止并作废当前所有计时器 */
function disposeTimers(){
  if (S.singleTimer){ S.singleTimer.onTick = S.singleTimer.onMark = S.singleTimer.onEnd = null; }
  if (S.dual.pro){ S.dual.pro.onTick = S.dual.pro.onMark = S.dual.pro.onEnd = null; }
  if (S.dual.con){ S.dual.con.onTick = S.dual.con.onMark = S.dual.con.onEnd = null; }
  S.singleTimer = null;
  S.dual.pro = S.dual.con = null;
  S.dualActive = null;
}

function openSegment(idx){
  idx = Math.max(0, Math.min(SEGMENTS.length - 1, idx));
  disposeTimers();
  S.cur = idx;
  const sg = SEGMENTS[idx];

  el.segName.textContent = `${sg.no}. ${sg.name}`;
  el.segRole.textContent = sg.role;
  markSegbarActive(idx);

  if (sg.type === "single"){
    el.singleWrap.classList.remove("hidden");
    el.dualWrap.classList.add("hidden");
    setupSingle(sg);
  } else {
    el.singleWrap.classList.add("hidden");
    el.dualWrap.classList.remove("hidden");
    setupDual(sg);
  }
  syncBottomButtons();
}

/* ============================================================
   八、单边计时
   ============================================================ */
function setupSingle(sg){
  const t = new Countdown(sg.dur);
  S.singleTimer = t;

  el.singleSide.textContent = sg.side === "pro" ? "正 方" : "反 方";
  el.singleSide.style.color = sg.side === "pro" ? "#8ec1ff" : "#ff9d9d";

  const paint = () => {
    const sec = t.remain;
    el.singleClock.textContent = fmt(sec);
    el.singleClock.classList.remove("warn","danger","done");
    if (t.state === "ended") el.singleClock.classList.add("done");
    else if (sec <= 10) el.singleClock.classList.add("danger");
    else if (sec <= 30) el.singleClock.classList.add("warn");

    const ratio = Math.max(0, Math.min(1, sec / sg.dur));
    el.singleProg.style.width = (ratio*100) + "%";
    el.singleProg.className = t.state==="ended" ? "danger" : (sec<=10 ? "danger" : (sec<=30 ? "warn" : ""));

    el.singleState.className = "state-tag";
    if (t.state === "idle")     el.singleState.textContent = "待开始";
    if (t.state === "running"){ el.singleState.textContent = "计 时 中"; el.singleState.classList.add("running"); }
    if (t.state === "paused"){  el.singleState.textContent = "已 暂 停"; el.singleState.classList.add("paused"); }
    if (t.state === "ended"){   el.singleState.textContent = "时间已到 · 已锁定"; el.singleState.classList.add("ended"); }
    syncBottomButtons();
  };

  t.onTick = paint;
  t.onMark = (kind) => speak(kind === "s30" ? sg.v.s30 : sg.v.s10, true);
  t.onEnd  = () => {
    speak(sg.v.end, true);
    // 最后一个环节结束 → 全场结束播报
    if (sg.id === SEGMENTS[SEGMENTS.length-1].id){
      setTimeout(() => speak(FINAL_VOICE, true), 2600);
    }
  };

  paint();
}

/* ============================================================
   九、双边计时（二辩对辩 / 自由辩论）
   ============================================================ */
function setupDual(sg){
  const makeSide = (side) => {
    const dur = side === "pro" ? sg.durPro : sg.durCon;
    const v   = side === "pro" ? sg.vPro   : sg.vCon;
    const clockEl = side === "pro" ? el.clockPro : el.clockCon;
    const stateEl = side === "pro" ? el.statePro : el.stateCon;
    const badgeEl = side === "pro" ? el.badgePro : el.badgeCon;

    const t = new Countdown(dur);

    const paint = () => {
      const sec = t.remain;
      clockEl.textContent = fmt(sec);
      clockEl.classList.remove("warn","danger","done");
      if (t.state === "ended") clockEl.classList.add("done");
      else if (sec <= 10) clockEl.classList.add("danger");
      else if (sec <= 30) clockEl.classList.add("warn");

      stateEl.textContent =
        t.state === "idle"    ? "未开始" :
        t.state === "running" ? "计时中" :
        t.state === "paused"  ? "已暂停" : "时间已用尽";

      badgeEl.textContent =
        t.state === "ended"   ? "已耗尽" :
        t.state === "running" ? "发言中" :
        t.state === "paused"  ? "暂停" : "待机";

      const col = side === "pro" ? el.colPro : el.colCon;
      col.classList.toggle("active", S.dualActive === side && t.state === "running");

      const btn = side === "pro" ? el.proStart : el.conStart;
      btn.disabled = (t.state === "ended");

      syncBottomButtons();
    };

    t.onTick = paint;
    t.onMark = (kind) => speak(kind === "s30" ? v.s30 : v.s10, true);
    t.onEnd  = () => {
      speak(v.end, true);
      if (S.dualActive === side) S.dualActive = null;
      paint();
    };

    paint();
    return t;
  };

  S.dual.pro = makeSide("pro");
  S.dual.con = makeSide("con");
  S.dualActive = null;
  el.colPro.classList.remove("active");
  el.colCon.classList.remove("active");
  syncBottomButtons();
}

/** 切换发言权：一方启动，另一方强制暂停 */
function dualControl(side){
  const me  = side === "pro" ? S.dual.pro : S.dual.con;
  const opp = side === "pro" ? S.dual.con : S.dual.pro;
  if (!me) return;

  if (me.state === "ended") return;      // 自己已耗尽，不能启动
  opp.pause();                            // 对方强制暂停锁定

  if (me.state === "idle" || me.state === "paused"){
    const sg = SEGMENTS[S.cur];
    const v = side === "pro" ? sg.vPro : sg.vCon;
    if (me.state === "idle") speak(v.start, true);
    S.dualActive = side;
    me.start();
  }
}

function dualPause(side){
  const me = side === "pro" ? S.dual.pro : S.dual.con;
  if (!me) return;
  me.pause();
  if (S.dualActive === side) S.dualActive = null;
  syncBottomButtons();
}

/* ============================================================
   十、底部控制按钮状态同步
   ============================================================ */
function currentPrimaryTimer(){
  const sg = SEGMENTS[S.cur];
  if (!sg) return null;
  return sg.type === "single" ? S.singleTimer : (S.dualActive === "con" ? S.dual.con : S.dual.pro);
}

function syncBottomButtons(){
  const sg = SEGMENTS[S.cur];
  if (!sg) return;
  if (sg.type === "single"){
    const t = S.singleTimer;
    el.startBtn.disabled = !t || t.state === "ended";
    el.pauseBtn.disabled = !t || t.state !== "running";
    el.startBtn.textContent = (t && t.state === "paused") ? "继 续" : "开 始";
  } else {
    // 双边模式：底部“开始”用于启动当前可控的一方（默认正方）
    const anyRunning = (S.dual.pro && S.dual.pro.state === "running") || (S.dual.con && S.dual.con.state === "running");
    const anyEndedIdle = (S.dual.pro && S.dual.pro.state === "ended") && (S.dual.con && S.dual.con.state === "ended");
    el.startBtn.disabled = anyEndedIdle;
    el.pauseBtn.disabled = !anyRunning;
    el.startBtn.textContent = "开 始";
  }
  el.prevBtn.disabled = S.cur <= 0;
  el.nextBtn.disabled = S.cur >= SEGMENTS.length - 1;
}

/* ============================================================
   十一、事件绑定
   ============================================================ */
el.enterBtn.addEventListener("click", enterMatch);

el.editBtn.addEventListener("click", () => {
  // 回到设置页（保留当前数据）
  el.inTopic.value = S.topic;
  el.inPro.value = S.pro;
  el.inCon.value = S.con;
  el.match.classList.add("hidden");
  el.setup.classList.remove("hidden");
  el.inTopic.focus();
});

// 设置页回车直接进入
[el.inTopic, el.inPro, el.inCon].forEach(inp => {
  inp.addEventListener("keydown", e => { if (e.key === "Enter") enterMatch(); });
});

// 上一环节 / 下一环节
el.prevBtn.addEventListener("click", () => openSegment(S.cur - 1));
el.nextBtn.addEventListener("click", () => openSegment(S.cur + 1));

// 单边：开始/暂停/重置
el.startBtn.addEventListener("click", () => {
  const sg = SEGMENTS[S.cur];
  if (sg.type === "single"){
    const t = S.singleTimer;
    if (!t) return;
    if (t.state === "idle"){ speak(sg.v.start, true); t.start(); }
    else if (t.state === "paused") t.start();
    else if (t.state === "running") { /* 已在跑 */ }
  } else {
    // 双边：启动默认可控的一方（正方优先，若正方耗尽则反方）
    if (S.dual.pro && S.dual.pro.state !== "ended"){
      if (S.dual.pro.state === "running") return;
      dualControl("pro");
    } else if (S.dual.con && S.dual.con.state !== "ended"){
      if (S.dual.con.state === "running") return;
      dualControl("con");
    }
  }
});

el.pauseBtn.addEventListener("click", () => {
  const sg = SEGMENTS[S.cur];
  if (sg.type === "single"){
    const t = S.singleTimer;
    if (t && t.state === "running") t.pause();
  } else {
    if (S.dual.pro && S.dual.pro.state === "running") dualPause("pro");
    else if (S.dual.con && S.dual.con.state === "running") dualPause("con");
  }
});

el.resetBtn.addEventListener("click", () => {
  const sg = SEGMENTS[S.cur];
  if (sg.type === "single"){
    if (S.singleTimer){ S.singleTimer.reset(); S.singleTimer.onTick(S.singleTimer.remain, S.singleTimer); }
  } else {
    if (S.dual.pro){ S.dual.pro.reset(); S.dual.pro.onTick(S.dual.pro.remain, S.dual.pro); }
    if (S.dual.con){ S.dual.con.reset(); S.dual.con.onTick(S.dual.con.remain, S.dual.con); }
    S.dualActive = null;
    el.colPro.classList.remove("active");
    el.colCon.classList.remove("active");
  }
  syncBottomButtons();
});

// 双边各自按钮
el.proStart.addEventListener("click", () => dualControl("pro"));
el.conStart.addEventListener("click", () => dualControl("con"));
el.proPause.addEventListener("click", () => dualPause("pro"));
el.conPause.addEventListener("click", () => dualPause("con"));

// 快捷键
document.addEventListener("keydown", e => {
  if (el.match.classList.contains("hidden")) return;
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space"){ e.preventDefault(); (el.pauseBtn.disabled ? el.startBtn : el.pauseBtn).click(); }
  else if (e.key === "r" || e.key === "R"){ e.preventDefault(); el.resetBtn.click(); }
  else if (e.key === "ArrowLeft"){ e.preventDefault(); el.prevBtn.click(); }
  else if (e.key === "ArrowRight"){ e.preventDefault(); el.nextBtn.click(); }
});

// 全屏
el.fsBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen().catch(()=>{});
});

/* ============================================================
   十二、初始化
   ============================================================ */
loadSaved();
applyHeader();

/* ============================================================
   十三、Service Worker 注册（PWA 离线支持）
   ============================================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* 支持 manifest shortcut 的 ?autostart=1：自动进入比赛页 */
if (new URLSearchParams(location.search).get("autostart") === "1") {
  // 等一帧确保 DOM 就绪，再自动进入（设置留空时使用占位名）
  setTimeout(() => { try { enterMatch(); } catch (e) {} }, 60);
}

