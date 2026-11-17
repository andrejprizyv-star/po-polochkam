/* =========================================================================
   «По полочкам» — казуальная игра-сортировка предметов (версия для VK Mini Apps).
   SDK: VK Bridge — реклама (rewarded + баннер), облачное сохранение,
   покупки через VK Pay. Фичи: 12 категорий, награды, задания, достижения,
   скины, рекорды, музыка, звук, вибрация.
   ========================================================================= */

'use strict';

/* ------------------------- Категории и предметы ------------------------- */

const CATEGORY_DEFS = [
  { id: 'fruits', name: 'Фрукты', emoji: '🍎', items: [
    { emoji: '🍎', label: 'Яблоко' }, { emoji: '🍌', label: 'Банан' },
    { emoji: '🍇', label: 'Виноград' }, { emoji: '🍊', label: 'Апельсин' },
    { emoji: '🍓', label: 'Клубника' }, { emoji: '🍉', label: 'Арбуз' },
  ]},
  { id: 'veggies', name: 'Овощи', emoji: '🥕', items: [
    { emoji: '🥕', label: 'Морковь' }, { emoji: '🥦', label: 'Брокколи' },
    { emoji: '🍅', label: 'Помидор' }, { emoji: '🌽', label: 'Кукуруза' },
    { emoji: '🥔', label: 'Картофель' }, { emoji: '🧅', label: 'Лук' },
  ]},
  { id: 'tools', name: 'Инструменты', emoji: '🔨', items: [
    { emoji: '🔨', label: 'Молоток' }, { emoji: '🔧', label: 'Ключ' },
    { emoji: '🔩', label: 'Болт' }, { emoji: '🪛', label: 'Отвёртка' },
    { emoji: '🪚', label: 'Пила' }, { emoji: '🪓', label: 'Топор' },
  ]},
  { id: 'clothes', name: 'Одежда', emoji: '👕', items: [
    { emoji: '👕', label: 'Футболка' }, { emoji: '👖', label: 'Джинсы' },
    { emoji: '👗', label: 'Платье' }, { emoji: '🧥', label: 'Куртка' },
    { emoji: '🧦', label: 'Носки' }, { emoji: '👟', label: 'Кроссовки' },
  ]},
  { id: 'toys', name: 'Игрушки', emoji: '🧸', items: [
    { emoji: '🧸', label: 'Мишка' }, { emoji: '🚗', label: 'Машинка' },
    { emoji: '🪀', label: 'Йо-йо' }, { emoji: '🧩', label: 'Пазл' },
    { emoji: '🎲', label: 'Кубик' }, { emoji: '🪁', label: 'Воздушный змей' },
  ]},
  { id: 'drinks', name: 'Напитки', emoji: '🥤', items: [
    { emoji: '🥤', label: 'Кола' }, { emoji: '🧃', label: 'Сок' },
    { emoji: '☕', label: 'Кофе' }, { emoji: '🍵', label: 'Чай' },
    { emoji: '🥛', label: 'Молоко' }, { emoji: '🍹', label: 'Смузи' },
  ]},
  { id: 'animals', name: 'Животные', emoji: '🐱', items: [
    { emoji: '🐱', label: 'Кошка' }, { emoji: '🐶', label: 'Собака' },
    { emoji: '🐰', label: 'Кролик' }, { emoji: '🦊', label: 'Лиса' },
    { emoji: '🐻', label: 'Медведь' }, { emoji: '🐼', label: 'Панда' },
  ]},
  { id: 'gadgets', name: 'Техника', emoji: '📱', items: [
    { emoji: '📱', label: 'Телефон' }, { emoji: '💻', label: 'Ноутбук' },
    { emoji: '📷', label: 'Камера' }, { emoji: '🎧', label: 'Наушники' },
    { emoji: '⌚', label: 'Часы' }, { emoji: '🖨️', label: 'Принтер' },
  ]},
  { id: 'food', name: 'Еда', emoji: '🍕', items: [
    { emoji: '🍕', label: 'Пицца' }, { emoji: '🍔', label: 'Бургер' },
    { emoji: '🌭', label: 'Хот-дог' }, { emoji: '🍟', label: 'Картошка фри' },
    { emoji: '🥪', label: 'Сэндвич' }, { emoji: '🍩', label: 'Пончик' },
  ]},
  { id: 'sports', name: 'Спорт', emoji: '⚽', items: [
    { emoji: '⚽', label: 'Футбольный мяч' }, { emoji: '🏀', label: 'Баскетбольный мяч' },
    { emoji: '🎾', label: 'Теннисный мяч' }, { emoji: '🏈', label: 'Мяч для регби' },
    { emoji: '⚾', label: 'Бейсбольный мяч' }, { emoji: '🎱', label: 'Бильярдный шар' },
  ]},
  { id: 'music', name: 'Музыка', emoji: '🎸', items: [
    { emoji: '🎸', label: 'Гитара' }, { emoji: '🎹', label: 'Пианино' },
    { emoji: '🎺', label: 'Труба' }, { emoji: '🥁', label: 'Барабан' },
    { emoji: '🎻', label: 'Скрипка' }, { emoji: '🎷', label: 'Саксофон' },
  ]},
  { id: 'nature', name: 'Природа', emoji: '🌸', items: [
    { emoji: '🌸', label: 'Цветок' }, { emoji: '🌻', label: 'Подсолнух' },
    { emoji: '🌲', label: 'Дерево' }, { emoji: '🍄', label: 'Гриб' },
    { emoji: '🌵', label: 'Кактус' }, { emoji: '🍀', label: 'Клевер' },
  ]},
];

/* ------------------------------- Контент ------------------------------- */

const DAILY_REWARDS = [50, 75, 100, 150, 200, 300, 500];

const TASK_POOL = [
  { type: 'sort', label: n => 'Отсортируй ' + n + ' предметов', target: () => 15 + Math.floor(Math.random() * 16), reward: t => Math.round(t * 2) },
  { type: 'levels', label: n => 'Пройди ' + n + ' ' + plural(n, 'уровень', 'уровня', 'уровней'), target: () => 1 + Math.floor(Math.random() * 3), reward: t => t * 80 },
  { type: 'score', label: n => 'Набери ' + n + ' очков', target: () => 60 + Math.floor(Math.random() * 91), reward: t => Math.round(t * 0.8) },
  { type: 'coins', label: n => 'Заработай ' + n + ' монет', target: () => 80 + Math.floor(Math.random() * 121), reward: t => Math.round(t * 0.5) },
  { type: 'combo', label: n => 'Достигни комбо ×' + n, target: () => 3 + Math.floor(Math.random() * 4), reward: t => t * 30 },
];

const ACHIEVEMENTS = [
  { id: 'first', name: 'Первый шаг', desc: 'Отсортируй первый предмет', check: s => s.sorted >= 1, reward: 20 },
  { id: 'combo5', name: 'Комбо ×5', desc: 'Достигни комбо 5 за уровень', check: s => s.bestCombo >= 5, reward: 50 },
  { id: 'perfect1', name: 'Идеально', desc: 'Пройди уровень на 3 звезды', check: s => s.perfect >= 1, reward: 100 },
  { id: 'lvl5', name: 'Разминка', desc: 'Дойди до 5 уровня', check: s => s.level >= 5, reward: 50 },
  { id: 'lvl10', name: 'Опытный', desc: 'Дойди до 10 уровня', check: s => s.level >= 10, reward: 100 },
  { id: 'lvl25', name: 'Мастер', desc: 'Дойди до 25 уровня', check: s => s.level >= 25, reward: 300 },
  { id: 'sorted100', name: 'Собиратель', desc: 'Отсортируй 100 предметов', check: s => s.sorted >= 100, reward: 150 },
  { id: 'sorted500', name: 'Перфекционист', desc: 'Отсортируй 500 предметов', check: s => s.sorted >= 500, reward: 500 },
  { id: 'rich', name: 'Богач', desc: 'Накопи 1000 монет', check: s => s.coins >= 1000, reward: 100 },
];

const SKINS = [
  { id: 'classic', name: 'Классика', shelf: '#ffffff', item: '#ffffff', price: 0 },
  { id: 'ocean', name: 'Океан', shelf: '#d8ecff', item: '#d8ecff', price: 200 },
  { id: 'forest', name: 'Лес', shelf: '#dcf2dc', item: '#dcf2dc', price: 500 },
  { id: 'sunset', name: 'Закат', shelf: '#ffe3d1', item: '#ffe3d1', price: 1000 },
  { id: 'neon', name: 'Неон', shelf: '#e9ddff', item: '#e9ddff', price: 2000 },
  { id: 'gold', name: 'Золото', shelf: '#ffeaa7', item: '#ffeaa7', price: 5000 },
];

// ID товаров должны совпадать с названиями товаров в настройках VK Mini App.
const PRODUCTS = {
  noads: { id: 'noads', name: 'Отключить рекламу', emoji: '🚫', desc: 'Все бонусы без рекламы, навсегда', consumable: false },
  coins_1000: { id: 'coins_1000', name: '1000 монет', emoji: '🪙', desc: 'Пакет монет', consumable: true, amount: 1000 },
};

/* ----------------------------- Сохранение ------------------------------ */

const SAVE_KEY = 'shelf_sort_save_v1';
const HEARTS_MAX = 3;

const state = {
  coins: 0,
  level: 1,
  muted: false,
  music: true,
  noads: false,
  lastClaimDate: '',
  dailyStreak: 0,
  lastPlayTime: 0,     // время последнего визита (для бонуса за возвращение)
  stats: { sorted: 0, levels: 0, bestCombo: 0, perfect: 0 },
  tasks: { date: '', list: [] },
  achievements: {},
  skins: { owned: ['classic'], selected: 'classic' },
};

let level = null;

/* ------------------------------ VK Bridge ------------------------------ */

let vkBridge = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('load fail: ' + src));
    document.head.appendChild(s);
  });
}

function withTimeout(promise, ms, msg) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(msg || 'timeout')), ms)),
  ]);
}

function vkSend(method, params) {
  if (!vkBridge) return Promise.reject(new Error('no bridge'));
  return vkBridge.send(method, params);
}

// VK Mini Apps запускаются в iframe и приходят с параметрами запуска.
// Если их нет — мы не в VK, работаем в тестовом режиме.
function isVK() {
  try {
    if (window.parent === window) return false;
    const p = new URLSearchParams(window.location.search);
    return p.has('vk_app_id') || p.has('vk_platform') || p.has('vk_user_id') || p.has('vk_access_token_settings');
  } catch (e) { return false; }
}

async function initSDK() {
  if (!isVK()) {
    console.warn('[VK] Не в среде VK — тестовый режим (vkBridge отключён).');
    return; // vkBridge остаётся null
  }
  try {
    await withTimeout(loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js'), 5000, 'vk-bridge load');
    if (window.vkBridge) {
      await withTimeout(window.vkBridge.send('VKWebAppInit'), 5000, 'vk init');
      vkBridge = window.vkBridge;
      console.log('[VK] Bridge инициализирован');
    }
  } catch (e) {
    vkBridge = null;
    console.warn('[VK] Ошибка инициализации:', e && e.message);
  }
}

/* ------------------------------- Сохранение ---------------------------- */

async function loadSave() {
  if (vkBridge) {
    try {
      const res = await vkSend('VKWebAppStorageGet', { keys: [SAVE_KEY] });
      const item = res.keys.find(k => k.key === SAVE_KEY);
      if (item && item.value) Object.assign(state, JSON.parse(item.value));
      return;
    } catch (e) {}
  }
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (e) {}
}

async function saveGame() {
  state.lastPlayTime = Date.now();
  const data = {
    coins: state.coins, level: state.level, muted: state.muted, music: state.music,
    noads: state.noads, lastClaimDate: state.lastClaimDate, dailyStreak: state.dailyStreak,
    stats: state.stats, tasks: state.tasks, achievements: state.achievements, skins: state.skins,
    lastPlayTime: state.lastPlayTime,
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
  if (vkBridge) {
    try { await vkSend('VKWebAppStorageSet', { key: SAVE_KEY, value: JSON.stringify(data) }); } catch (e) {}
  }
}

/* ------------------------------- Реклама ------------------------------- */

function showRewardedAd(onReward) {
  if (state.noads || !vkBridge) { onReward(); return; }
  stopMusic();
  vkSend('VKWebAppShowNativeAds', { ad_format: 'reward' })
    .then((res) => {
      if (res && res.result_type === 'reward') onReward();
    })
    .catch((e) => { console.warn('[VK] Ошибка рекламы:', e && e.message); })
    .finally(() => { startMusic(); });
}

// Полноэкранная реклама между уровнями (не чаще раза в 90 секунд)
let lastInterstitialTime = 0;

function showInterstitialAd() {
  if (state.noads || !vkBridge) return;
  const now = Date.now();
  if (now - lastInterstitialTime < 90000) return;
  lastInterstitialTime = now;
  stopMusic();
  vkSend('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
    .catch(() => {})
    .finally(() => { startMusic(); });
}

let bannerShown = false;

async function showBanner() {
  if (state.noads || bannerShown || !vkBridge) return;
  try {
    await vkSend('VKWebAppShowBannerAd', { banner_location: 'bottom' });
    bannerShown = true;
    document.body.classList.add('has-banner');
  } catch (e) {}
}

async function hideBanner() {
  if (!vkBridge) return;
  try { await vkSend('VKWebAppHideBannerAd'); } catch (e) {}
  bannerShown = false;
  document.body.classList.remove('has-banner');
}

/* ---------------------------- Звук и музыка ---------------------------- */

let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
}

function note(freq, dur, type, vol, when) {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g); g.connect(audioCtx.destination);
  const t = audioCtx.currentTime + (when || 0);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
}
function tone(freq, dur, type = 'sine', vol = 0.08, when = 0) {
  if (state.muted) return;
  note(freq, dur, type, vol, when);
}
function musicNote(freq, dur) {
  if (!state.music) return;
  note(freq, dur, 'triangle', 0.035, 0);
}

const sfx = {
  select: () => { ensureAudio(); tone(500, .08, 'square', .04); },
  correct: () => { ensureAudio(); tone(660, .12, 'sine', .07); tone(880, .14, 'sine', .07, .1); },
  wrong: () => { ensureAudio(); tone(160, .25, 'sawtooth', .06); },
  win: () => { ensureAudio(); [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'sine', .08, i * .12)); },
  click: () => { ensureAudio(); tone(440, .06, 'square', .04); },
  hint: () => { ensureAudio(); tone(520, .1, 'sine', .06); tone(780, .14, 'sine', .06, .08); },
  claim: () => { ensureAudio(); [660, 880, 1320].forEach((f, i) => tone(f, .12, 'sine', .07, i * .07)); },
};

const MUSIC_NOTES = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 246.94, 293.66, 392.00, 329.63];
const MUSIC = { timer: null, step: 0 };

function startMusic() {
  if (!state.music || MUSIC.timer) return;
  ensureAudio();
  const stepMs = 260;
  MUSIC.timer = setInterval(() => {
    if (!state.music || !audioCtx) return;
    musicNote(MUSIC_NOTES[MUSIC.step % MUSIC_NOTES.length], 0.24);
    MUSIC.step++;
  }, stepMs);
}
function stopMusic() {
  if (MUSIC.timer) { clearInterval(MUSIC.timer); MUSIC.timer = null; }
}

function cycleSound() {
  if (!state.muted && state.music) { state.muted = true; }
  else if (state.muted && state.music) { state.music = false; stopMusic(); }
  else { state.muted = false; state.music = true; startMusic(); }
  saveGame();
  renderTopBar();
}

function vibrate(pattern) {
  if (state.muted) return;
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
}

/* ------------------------------- Утилиты ------------------------------- */

const $ = (id) => document.getElementById(id);
const itemsEl = () => $('items');
const shelvesEl = () => $('shelves');

function formatNumber(n) {
  return Math.floor(n).toLocaleString('ru-RU');
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dateStr(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}
function todayStr() { return dateStr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); }

let toastTimer = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  t.classList.remove('toast--show');
  void t.offsetWidth;
  t.classList.add('toast--show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; t.classList.remove('toast--show'); }, 2600);
}

function flashHint(msg) {
  const el = $('hintStatus');
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2500);
}

// Бонус за возвращение: игрок не заходил 2+ часа — получает подарок
function checkReturnBonus() {
  if (!state.lastPlayTime) return;
  const awayMs = Date.now() - state.lastPlayTime;
  const hours = Math.floor(awayMs / 3600000);
  if (hours < 2) return;
  const bonus = Math.min(300, 50 + hours * 25);
  state.coins += bonus;
  toast('🎁 С возвращением! +' + bonus + ' монет');
  sfx.claim();
  saveGame();
  renderTopBar();
}

/* ------------------------- Ежедневные награды -------------------------- */

function computeStreak() {
  return (state.lastClaimDate === yesterdayStr()) ? state.dailyStreak + 1 : 1;
}
function dailyRewardAmount(streak) {
  return DAILY_REWARDS[(streak - 1) % DAILY_REWARDS.length];
}
function canClaimDaily() { return state.lastClaimDate !== todayStr(); }

function showDailyModal() {
  const streak = computeStreak();
  const reward = dailyRewardAmount(streak);
  $('dailyStreak').textContent = streak;
  if (state.noads) {
    $('dailyReward').textContent = formatNumber(reward * 2);
    $('dailyDoubleBtn').style.display = 'none';
  } else {
    $('dailyReward').textContent = formatNumber(reward);
    $('dailyDoubleBtn').style.display = 'block';
  }
  showModal('dailyModal');
}

function claimDaily(doubled) {
  const streak = computeStreak();
  const reward = dailyRewardAmount(streak);
  state.dailyStreak = streak;
  state.lastClaimDate = todayStr();
  state.coins += reward * (doubled ? 2 : 1);
  sfx.claim(); vibrate(30);
  checkAchievements();
  saveGame();
  renderTopBar();
  hideModals();
}

/* ------------------------- Ежедневные задания -------------------------- */

function ensureTasks() {
  const today = todayStr();
  if (state.tasks && state.tasks.date === today && state.tasks.list && state.tasks.list.length) return;
  const types = shuffle(TASK_POOL).slice(0, 3);
  const list = types.map(p => {
    const target = p.target();
    return { type: p.type, target, progress: 0, reward: p.reward(target), claimed: false, _notified: false };
  });
  state.tasks = { date: today, list };
}

function taskLabel(t) {
  const p = TASK_POOL.find(p => p.type === t.type);
  return p ? p.label(t.target) : t.type;
}

function updateTasks(metric, value) {
  if (!state.tasks || state.tasks.date !== todayStr()) return;
  for (const t of state.tasks.list) {
    if (t.claimed || t.type !== metric) continue;
    if (metric === 'combo') t.progress = Math.max(t.progress, value);
    else t.progress = Math.min(t.target, t.progress + value);
  }
  checkTasks();
}

function checkTasks() {
  let newDone = 0;
  for (const t of state.tasks.list) {
    if (t.progress >= t.target && !t.claimed && !t._notified) {
      t._notified = true;
      newDone++;
    }
  }
  if (newDone) toast('🎯 Задание выполнено! Забери награду');
  updateTaskBadge();
}

function updateTaskBadge() {
  const list = (state.tasks && state.tasks.list) || [];
  const claimable = list.filter(t => t.progress >= t.target && !t.claimed).length;
  const b = $('tasksBadge');
  b.hidden = claimable === 0;
  b.textContent = claimable;
}

function renderTasks() {
  ensureTasks();
  $('tasksDate').textContent = 'Обновятся завтра';
  const box = $('tasksList');
  box.innerHTML = '';
  state.tasks.list.forEach((t, idx) => {
    const pct = Math.min(100, Math.round(t.progress / t.target * 100));
    const done = t.progress >= t.target;
    const el = document.createElement('div');
    el.className = 'task' + (done ? ' task--done' : '') + (t.claimed ? ' task--claimed' : '');
    el.innerHTML =
      '<div class="task__top"><span class="task__desc">' + taskLabel(t) + '</span>' +
      '<span class="task__reward">+' + t.reward + ' 🪙</span></div>' +
      '<div class="task__bar"><div class="task__fill" style="width:' + pct + '%"></div></div>' +
      '<div class="task__progress">' + Math.min(t.progress, t.target) + ' / ' + t.target + '</div>' +
      '<button class="btn btn--primary task__claim" data-idx="' + idx + '"' + (done && !t.claimed ? '' : ' disabled') + '>' +
        (t.claimed ? 'Получено ✓' : (done ? 'Забрать' : 'В процессе')) + '</button>';
    box.appendChild(el);
  });
}

function claimTask(idx) {
  const t = state.tasks.list[idx];
  if (!t || t.claimed || t.progress < t.target) return;
  t.claimed = true;
  state.coins += t.reward;
  sfx.claim(); vibrate(30);
  checkAchievements();
  saveGame();
  renderTopBar();
  renderTasks();
  updateTaskBadge();
  toast('+' + t.reward + ' 🪙');
}

/* ---------------------------- Достижения ------------------------------ */

function checkAchievements() {
  if (!state.achievements) state.achievements = {};
  const s = {
    sorted: state.stats.sorted, level: state.level, coins: state.coins,
    bestCombo: state.stats.bestCombo, perfect: state.stats.perfect,
  };
  let changed = false;
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    if (a.check(s)) {
      state.achievements[a.id] = true;
      state.coins += a.reward;
      changed = true;
      toast('🏆 ' + a.name + ' +' + a.reward + ' 🪙');
      sfx.claim();
    }
  }
  if (changed) { saveGame(); renderTopBar(); }
}

function renderAchievements() {
  const box = $('achieveList');
  box.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const unlocked = !!state.achievements[a.id];
    const el = document.createElement('div');
    el.className = 'achieve__item' + (unlocked ? ' achieve__item--on' : '');
    el.innerHTML =
      '<span class="achieve__icon">' + (unlocked ? '🏅' : '🔒') + '</span>' +
      '<div class="achieve__info"><div class="achieve__name">' + a.name + '</div>' +
      '<div class="achieve__desc">' + a.desc + '</div></div>' +
      '<span class="achieve__reward">+' + a.reward + ' 🪙</span>';
    box.appendChild(el);
  }
}

/* ------------------------------ Скины ---------------------------------- */

function applySkin() {
  const s = SKINS.find(k => k.id === state.skins.selected) || SKINS[0];
  document.documentElement.style.setProperty('--shelf-bg', s.shelf);
  document.documentElement.style.setProperty('--item-bg', s.item);
}

function renderSkins() {
  const box = $('skinsList');
  box.innerHTML = '';
  for (const s of SKINS) {
    const owned = state.skins.owned.includes(s.id);
    const selected = state.skins.selected === s.id;
    const el = document.createElement('div');
    el.className = 'skin' + (selected ? ' skin--selected' : '');
    el.innerHTML =
      '<span class="skin__swatch" style="background:' + s.shelf + '"></span>' +
      '<span class="skin__name">' + s.name + '</span>' +
      '<button class="skin__btn" data-id="' + s.id + '"' + (selected ? ' disabled' : '') + '>' +
        (selected ? 'Выбран' : (owned ? 'Выбрать' : s.price + ' 🪙')) + '</button>';
    box.appendChild(el);
  }
}

function onSkinClick(id) {
  const s = SKINS.find(k => k.id === id);
  if (!s) return;
  if (state.skins.owned.includes(id)) {
    state.skins.selected = id;
  } else if (state.coins >= s.price) {
    state.coins -= s.price;
    state.skins.owned.push(id);
    state.skins.selected = id;
    sfx.claim();
  } else {
    toast('Не хватает монет 😕');
    return;
  }
  applySkin();
  saveGame();
  renderTopBar();
  renderSkins();
}

/* --------------------------- Инап-покупки ------------------------------ */

function renderShop() {
  const box = $('shopItems');
  box.innerHTML = '';
  for (const id of Object.keys(PRODUCTS)) {
    const p = PRODUCTS[id];
    const owned = (id === 'noads' && state.noads);
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML =
      '<span class="shop-item__emoji">' + p.emoji + '</span>' +
      '<div class="shop-item__info"><div class="shop-item__name">' + p.name + '</div>' +
      '<div class="shop-item__desc">' + p.desc + '</div></div>' +
      '<button class="shop-item__buy" data-id="' + id + '"' + (owned ? ' disabled' : '') + '>' +
        (owned ? 'Куплено ✓' : 'Купить') + '</button>';
    box.appendChild(el);
  }
}

function grantProduct(id) {
  if (id === 'noads') {
    state.noads = true;
    hideBanner();
  } else if (id === 'coins_1000') {
    state.coins += PRODUCTS[id].amount;
  }
  saveGame();
  renderTopBar();
  renderShop();
  sfx.claim(); vibrate(30);
  checkAchievements();
  flashHint('Покупка совершена! 🎉');
}

async function buyProduct(id) {
  if (!vkBridge) { grantProduct(id); return; } // тестовый режим
  try {
    const res = await vkSend('VKWebAppShowOrderBox', { type: 'item', item: id });
    if (res && (res.status === 'success' || res.status === 'chargeable')) {
      grantProduct(id);
    } else {
      flashHint('Покупка отменена');
    }
  } catch (e) {
    console.warn('[VK] Ошибка покупки:', e && e.message);
    flashHint('Покупка не завершена');
  }
}

/* --------------------------- Таблица рекордов -------------------------- */

function loadLeaderboard() {
  const box = $('leaderboardList');
  box.innerHTML =
    '<div class="lb-row"><span class="lb-name">Твой рекорд</span><span class="lb-score">' + state.level + ' ур.</span></div>' +
    '<p class="lb-empty">Глобальная таблица рекордов требует свой сервер — можно добавить позже.</p>';
}

/* ---------------------------- Генерация уровня ------------------------- */

function difficulty(levelNum) {
  const numCategories = Math.min(2 + Math.floor((levelNum - 1) / 2), 8);
  const itemsPerCat = Math.min(3 + Math.floor((levelNum - 1) / 3), 6);
  return { numCategories, itemsPerCat };
}

function buildLevel(levelNum) {
  const { numCategories, itemsPerCat } = difficulty(levelNum);
  const cats = shuffle(CATEGORY_DEFS).slice(0, numCategories);

  const categories = cats.map((c, i) => ({ id: c.id, name: c.name, emoji: c.emoji, index: i }));

  const items = [];
  let uid = 0;
  for (const c of cats) {
    for (const it of shuffle(c.items).slice(0, itemsPerCat)) {
      items.push({ id: uid++, catId: c.id, emoji: it.emoji, label: it.label });
    }
  }

  return {
    categories,
    items: shuffle(items),
    hearts: HEARTS_MAX,
    combo: 0,
    score: 0,
    selectedItemId: null,
    sortedCount: 0,
    won: false,
  };
}

/* ------------------------------ Рендеринг ------------------------------ */

function renderTopBar() {
  $('levelNum').textContent = state.level;
  $('coinsNum').textContent = formatNumber(state.coins);
  $('hearts').textContent = '❤️'.repeat(level.hearts) + '🖤'.repeat(HEARTS_MAX - level.hearts);
  $('soundBtn').textContent = (!state.muted && state.music) ? '🔊' : (state.music ? '🎵' : '🔇');
}

function renderShelves() {
  const container = shelvesEl();
  container.innerHTML = '';
  for (const c of level.categories) {
    const remaining = level.items.filter(i => i.catId === c.id && !i.sorted).length;
    const el = document.createElement('div');
    el.className = 'shelf';
    el.dataset.catId = c.id;
    if (level.selectedItemId != null) el.classList.add('shelf--target');
    el.innerHTML =
      '<span class="shelf__emoji">' + c.emoji + '</span>' +
      '<span class="shelf__name">' + c.name + '</span>' +
      '<span class="shelf__count">' + remaining + '</span>';
    container.appendChild(el);
  }
}

function renderItems() {
  const container = itemsEl();
  container.innerHTML = '';
  for (const it of level.items) {
    const el = document.createElement('div');
    el.className = 'item';
    el.dataset.itemId = it.id;
    el.textContent = it.emoji;
    el.title = it.label;
    if (it.sorted) el.classList.add('item--sorted');
    if (level.selectedItemId === it.id) el.classList.add('item--selected');
    container.appendChild(el);
  }
}

function render() {
  renderTopBar();
  renderShelves();
  renderItems();
}

function spawnFloatText(text, targetEl, color) {
  const t = document.createElement('div');
  t.className = 'float-text';
  t.textContent = text;
  if (color) t.style.color = color;
  const r = targetEl.getBoundingClientRect();
  t.style.left = (r.left + r.width / 2 - 20) + 'px';
  t.style.top = (r.top - 8) + 'px';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1000);
}

/* ------------------------------ Игровая логика ------------------------- */

function selectItem(itemId) {
  if (level.won) return;
  const item = level.items.find(i => i.id === itemId);
  if (!item || item.sorted) return;
  level.selectedItemId = (level.selectedItemId === itemId) ? null : itemId;
  sfx.select();
  render();
}

function placeToShelf(catId) {
  if (level.won) return;
  if (level.selectedItemId == null) {
    flashHint('Сначала выбери предмет 👆');
    return;
  }
  const item = level.items.find(i => i.id === level.selectedItemId);
  if (!item) return;

  if (item.catId === catId) {
    item.sorted = true;
    level.sortedCount++;
    level.combo++;
    const points = 10 + (level.combo - 1) * 2;
    level.score += points;
    level.selectedItemId = null;

    state.stats.sorted++;
    state.stats.bestCombo = Math.max(state.stats.bestCombo, level.combo);
    updateTasks('sort', 1);
    updateTasks('score', points);
    updateTasks('combo', level.combo);
    checkAchievements();

    sfx.correct();
    vibrate(20);
    render();
    const shelfEl = shelvesEl().querySelector('[data-cat-id="' + catId + '"]');
    if (shelfEl) {
      shelfEl.classList.add('shelf--correct');
      spawnFloatText('+' + points, shelfEl, '#2ecc71');
    }

    if (level.sortedCount === level.items.length) {
      setTimeout(winLevel, 350);
    }
  } else {
    level.combo = 0;
    level.hearts--;
    level.selectedItemId = null;
    sfx.wrong();
    vibrate([80, 40, 80]);
    render();
    const shelfEl = shelvesEl().querySelector('[data-cat-id="' + catId + '"]');
    if (shelfEl) {
      shelfEl.classList.add('shelf--wrong');
      spawnFloatText('✖', shelfEl, '#ff6b6b');
    }

    if (level.hearts <= 0) {
      setTimeout(() => showModal('loseModal'), 400);
    }
  }
}

function winLevel() {
  level.won = true;
  sfx.win();

  const stars = level.hearts;
  const earned = 20 + state.level * 5 + stars * 10;
  state.coins += earned;

  state.stats.levels++;
  if (stars === HEARTS_MAX) state.stats.perfect++;
  updateTasks('levels', 1);
  updateTasks('coins', earned);
  checkAchievements();

  $('winStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(HEARTS_MAX - stars);
  $('winCoins').textContent = formatNumber(earned);
  $('doubleBtn').disabled = false;
  $('doubleBtn').style.display = state.noads ? 'none' : 'block';
  showModal('winModal');

  saveGame();
}

function nextLevel() {
  state.level++;
  checkAchievements();
  startLevel();
  showInterstitialAd();
}

function startLevel() {
  level = buildLevel(state.level);
  render();
  hideModals();
  saveGame();
}

/* ------------------------------ Подсказка ------------------------------ */

let hintActive = false;

function useHint() {
  if (level.won || hintActive) return;
  const unsorted = level.items.filter(i => !i.sorted);
  if (!unsorted.length) return;

  showRewardedAd(() => {
    hintActive = true;
    const target = level.selectedItemId != null
      ? level.items.find(i => i.id === level.selectedItemId)
      : unsorted[0];
    if (!target) { hintActive = false; return; }

    const shelfEl = shelvesEl().querySelector('[data-cat-id="' + target.catId + '"]');
    if (shelfEl) {
      shelfEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      shelfEl.style.outline = '4px solid var(--gold)';
      shelfEl.style.outlineOffset = '2px';
      sfx.hint();
      flashHint('Подсказка: ' + target.label + ' → ' + level.categories.find(c => c.id === target.catId).name);
      setTimeout(() => { shelfEl.style.outline = 'none'; hintActive = false; }, 2500);
    }
  });
}

/* ------------------------------- Модалки ------------------------------- */

function showModal(id) {
  hideBanner();
  $(id).hidden = false;
}
function hideModals() {
  ['winModal', 'loseModal', 'dailyModal', 'tasksModal', 'achieveModal', 'shopModal'].forEach(id => {
    $(id).hidden = true;
  });
  showBanner();
}

/* ------------------------------- События ------------------------------- */

function bindEvents() {
  itemsEl().addEventListener('click', (e) => {
    const el = e.target.closest('.item');
    if (el && !el.classList.contains('item--sorted')) {
      ensureAudio();
      selectItem(Number(el.dataset.itemId));
    }
  });

  shelvesEl().addEventListener('click', (e) => {
    const el = e.target.closest('.shelf');
    if (el) placeToShelf(el.dataset.catId);
  });

  $('hintBtn').addEventListener('click', () => { sfx.click(); useHint(); });
  $('tasksBtn').addEventListener('click', () => { sfx.click(); renderTasks(); showModal('tasksModal'); });
  $('tasksCloseBtn').addEventListener('click', () => { sfx.click(); hideModals(); });
  $('achieveBtn').addEventListener('click', () => { sfx.click(); renderAchievements(); showModal('achieveModal'); loadLeaderboard(); });
  $('achieveCloseBtn').addEventListener('click', () => { sfx.click(); hideModals(); });

  $('soundBtn').addEventListener('click', cycleSound);
  $('shopBtn').addEventListener('click', () => { sfx.click(); renderShop(); renderSkins(); showModal('shopModal'); });
  $('shopCloseBtn').addEventListener('click', () => { sfx.click(); hideModals(); });

  $('tasksList').addEventListener('click', (e) => {
    const btn = e.target.closest('.task__claim');
    if (!btn || btn.disabled) return;
    claimTask(Number(btn.dataset.idx));
  });

  $('skinsList').addEventListener('click', (e) => {
    const btn = e.target.closest('.skin__btn');
    if (!btn || btn.disabled) return;
    sfx.click();
    onSkinClick(btn.dataset.id);
  });

  $('shopItems').addEventListener('click', (e) => {
    const btn = e.target.closest('.shop-item__buy');
    if (!btn || btn.disabled) return;
    sfx.click();
    buyProduct(btn.dataset.id);
  });

  $('doubleBtn').addEventListener('click', () => {
    $('doubleBtn').disabled = true;
    showRewardedAd(() => {
      const earned = parseInt($('winCoins').textContent.replace(/\D/g, ''), 10) || 0;
      state.coins += earned;
      $('winCoins').textContent = formatNumber(earned * 2);
      checkAchievements();
      saveGame();
      renderTopBar();
    });
  });

  $('nextBtn').addEventListener('click', nextLevel);
  $('reviveBtn').addEventListener('click', () => {
    showRewardedAd(() => {
      level.hearts = 1;
      hideModals();
      render();
    });
  });
  $('retryBtn').addEventListener('click', startLevel);

  $('dailyClaimBtn').addEventListener('click', () => { claimDaily(state.noads); });
  $('dailyDoubleBtn').addEventListener('click', () => { showRewardedAd(() => claimDaily(true)); });

  document.addEventListener('pointerdown', () => {
    ensureAudio();
    if (state.music) startMusic();
  }, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMusic();
    else if (state.music && audioCtx) startMusic();
  });
}

/* ------------------------------- Запуск -------------------------------- */

async function init() {
  await initSDK();
  await loadSave();
  ensureTasks();
  level = buildLevel(state.level);
  bindEvents();
  applySkin();
  render();
  updateTaskBadge();
  checkAchievements();
  checkReturnBonus();

  if (canClaimDaily()) setTimeout(showDailyModal, 600);
  showBanner();
}

init();
