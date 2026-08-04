const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const DB_KEY = "pfc_oj_database_v4";
const LEGACY_DB_KEYS = ["pfc_oj_database_v3", "pfc_oj_database_v2"];
const SESSION_KEY = "pfc_oj_session_v4";
const LEGACY_SESSION_KEYS = ["pfc_oj_session_v3", "pfc_oj_session_v2"];
const ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // admin123
const MAX_MEDIA_SIZE = 10 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const ALLOWED_LANGUAGES = ["HTML", "CSS", "JavaScript"];

const ROLE_DEFINITIONS = {
  admin: { label: "Admin", className: "role-admin" },
  problem_setter: { label: "Problem Setter", className: "role-problem" },
  contest_setter: { label: "Contest Setter", className: "role-contest" },
  muted: { label: "Muted", className: "role-muted" }
};

const RATING_TIERS = [
  { min: 0, max: 0, name: "Unrated", color: "#94a3b8" },
  { min: 1, max: 399, name: "Newbie", color: "#64748b" },
  { min: 400, max: 799, name: "Apprentice", color: "#22c55e" },
  { min: 800, max: 1199, name: "Specialist", color: "#06b6d4" },
  { min: 1200, max: 1599, name: "Expert", color: "#3b82f6" },
  { min: 1600, max: 1999, name: "Master", color: "#8b5cf6" },
  { min: 2000, max: 2399, name: "Grandmaster", color: "#f97316" },
  { min: 2400, max: Infinity, name: "Legend", color: "#ef4444" }
];

const RESERVED_RATING_COLORS = new Set(RATING_TIERS.map(tier => tier.color.toLowerCase()));

const FRAME_SHOP = [
  { id: "basic", name: "Forge cơ bản", cost: 0, description: "Khung xanh cam mặc định." },
  { id: "neon", name: "Neon Pulse", cost: 6, description: "Viền neon chuyển động." },
  { id: "ember", name: "Ember Core", cost: 8, description: "Viền lửa rực sáng." },
  { id: "crown", name: "Royal Crown", cost: 15, description: "Vương miện đặc biệt." },
  { id: "phantom", name: "Phantom Aura", cost: 20, description: "Hào quang tím hiếm." }
];

const BACKGROUND_PRESETS = {
  forge: {
    name: "Forge Core",
    css: "radial-gradient(circle at 16% 12%, rgba(125,211,252,.34), transparent 30%), radial-gradient(circle at 82% 18%, rgba(147,197,253,.30), transparent 28%), radial-gradient(circle at 50% 92%, rgba(103,232,249,.18), transparent 34%), linear-gradient(145deg, #dff3ff, #f8fcff 55%, #dbeeff)"
  },
  night: {
    name: "Phantom Night",
    css: "radial-gradient(circle at 72% 13%, rgba(133,89,255,.32), transparent 28%), radial-gradient(circle at 20% 80%, rgba(25,185,255,.12), transparent 30%), linear-gradient(145deg, #05030e, #151033 55%, #080713)"
  },
  sakura: {
    name: "Sakura",
    css: "radial-gradient(circle at 72% 14%, rgba(255,132,187,.32), transparent 30%), radial-gradient(circle at 12% 85%, rgba(180,78,143,.22), transparent 33%), linear-gradient(145deg, #241021, #5b2349 55%, #251229)"
  },
  matrix: {
    name: "Matrix",
    css: "repeating-linear-gradient(90deg, rgba(37,255,122,.07) 0 1px, transparent 1px 15px), radial-gradient(circle at 50% 0%, rgba(37,255,122,.15), transparent 35%), linear-gradient(#031109, #061c10)"
  },
  clean: {
    name: "Clean Sky",
    css: "radial-gradient(circle at 80% 15%, rgba(25,185,255,.20), transparent 28%), linear-gradient(145deg, #dceefa, #f7fbff 55%, #d6ebf9)"
  }
};

const now = Date.now();
const initialDB = {
  settings: {
    siteName: "Phantom Forge Core OJ",
    slogan: "Nơi ý tưởng được rèn thành thuật toán",
    maintenance: false,
    registration: true,
    ratingSystemV3: true,
    permissionsV4: true,
    accentMotion: true
  },
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@phantomforge.local",
      passwordHash: ADMIN_HASH,
      displayName: "Administrator",
      role: "admin",
      roles: ["admin"],
      nameColor: "#05070a",
      animatedName: true,
      rating: 0,
      ratingHistory: [{ value: 0, reason: "Khởi tạo hệ thống", createdAt: new Date(now).toISOString() }],
      orbs: -1,
      avatarKey: "",
      avatar: "",
      backgroundKey: "",
      backgroundData: "",
      backgroundPreset: "forge",
      overlay: 0.58,
      effect: "rain",
      theme: "light",
      unlockedFrames: ["basic", "neon", "ember", "crown", "phantom"],
      frame: "admin",
      bio: "Quản trị viên hệ thống Phantom Forge Core OJ.",
      joined: new Date(now).toISOString()
    }
  ],
  problems: [
    {
      id: 101,
      code: "PFC001",
      title: "Hello Forge",
      difficulty: "Dễ",
      points: 100,
      statement: "Viết một đoạn mã hiển thị dòng chữ Hello, Phantom Forge!",
      languages: [...ALLOWED_LANGUAGES]
    },
    {
      id: 102,
      code: "PFC002",
      title: "Thẻ hồ sơ cá nhân",
      difficulty: "Trung bình",
      points: 250,
      statement: "Tạo một thẻ hồ sơ có tên, mô tả và nút tương tác.",
      languages: [...ALLOWED_LANGUAGES]
    },
    {
      id: 103,
      code: "PFC003",
      title: "Bảng xếp hạng động",
      difficulty: "Khó",
      points: 500,
      statement: "Tạo giao diện bảng xếp hạng và sắp xếp dữ liệu bằng JavaScript.",
      languages: [...ALLOWED_LANGUAGES]
    }
  ],
  contests: [
    {
      id: 201,
      title: "Forge Rookie Cup",
      description: "Kỳ thi làm quen dành cho thành viên mới.",
      startAt: new Date(now + 7 * 86400000).toISOString(),
      duration: 120,
      rated: true,
      participants: []
    },
    {
      id: 202,
      title: "Phantom Practice",
      description: "Vòng luyện tập không ảnh hưởng rating.",
      startAt: new Date(now + 14 * 86400000).toISOString(),
      duration: 180,
      rated: false,
      participants: []
    }
  ],
  submissions: [],
  messages: [
    {
      id: 301,
      channel: "community",
      fromUserId: 1,
      toUserId: null,
      text: "Chào mừng đến với Forge Chat! Bạn có thể nhắn ở sảnh chung hoặc nhắn riêng cho từng thành viên.",
      createdAt: new Date(now).toISOString(),
      readBy: [1]
    }
  ],
  announcements: [
    {
      id: 401,
      title: "Hệ thống Rating & Orb đã hoạt động",
      content: "Mọi tài khoản bắt đầu từ 0 rating. Thành viên nhận 10 Orb và có thể kiếm thêm Orb khi AC bài tập.",
      createdAt: new Date(now).toISOString()
    }
  ],
  orbLedger: []
};

let db = loadDB();
let session = loadSession();
let adminTab = "overview";
let activeChat = { type: "community", userId: null };
let chatSearch = "";
let renderSequence = 0;
let currentEffect = "";
let lastRenderedRoute = "";
const mediaUrls = new Map();

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || LEGACY_SESSION_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
    return JSON.parse(raw || "null");
  } catch {
    return null;
  }
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY) || LEGACY_DB_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
    return raw ? migrate(JSON.parse(raw)) : structuredClone(initialDB);
  } catch (error) {
    console.warn("Không thể đọc dữ liệu cũ:", error);
    return structuredClone(initialDB);
  }
}

function migrate(source) {
  const x = source && typeof source === "object" ? source : structuredClone(initialDB);
  x.settings = { ...initialDB.settings, ...(x.settings || {}) };
  x.users = Array.isArray(x.users) ? x.users : [];
  x.problems = Array.isArray(x.problems) ? x.problems : [];
  x.contests = Array.isArray(x.contests) ? x.contests : [];
  x.submissions = Array.isArray(x.submissions) ? x.submissions : [];
  x.messages = Array.isArray(x.messages) ? x.messages : [];
  x.announcements = Array.isArray(x.announcements) ? x.announcements : [];
  x.orbLedger = Array.isArray(x.orbLedger) ? x.orbLedger : [];

  const mustResetRating = !source?.settings?.ratingSystemV3;
  const validRoles = new Set(Object.keys(ROLE_DEFINITIONS));

  x.users.forEach(u => {
    u.email ??= "";
    u.displayName ??= u.username || "Thành viên";
    const legacyRoles = u.role === "admin" ? ["admin"] : [];
    u.roles = Array.isArray(u.roles) ? [...new Set(u.roles.filter(role => validRoles.has(role)))] : legacyRoles;
    if (u.id === 1 && !u.roles.includes("admin")) u.roles.unshift("admin");
    if (u.id === 1) u.roles = u.roles.filter(role => role !== "muted");
    u.role = u.roles.includes("admin") ? "admin" : "user";
    u.nameColor = u.roles.includes("admin") ? normalizeHexColor(u.nameColor || "#05070a") : "";
    if (u.roles.includes("admin") && isReservedRatingColor(u.nameColor)) u.nameColor = "#05070a";
    u.animatedName = u.roles.includes("admin") ? Boolean(u.animatedName) : false;
    u.rating = mustResetRating ? 0 : Math.max(0, Number(u.rating || 0));
    u.ratingHistory = Array.isArray(u.ratingHistory)
      ? u.ratingHistory
      : [{ value: u.rating, reason: "Chuyển đổi dữ liệu", createdAt: new Date().toISOString() }];
    u.orbs = u.roles.includes("admin") ? -1 : Number.isFinite(Number(u.orbs)) ? Math.max(0, Number(u.orbs)) : 10;
    u.avatarKey ??= "";
    u.avatar ??= "";
    u.backgroundKey ??= "";
    u.backgroundData ??= "";
    u.backgroundPreset ??= "forge";
    u.overlay = Number.isFinite(Number(u.overlay)) ? Math.min(.9, Math.max(.15, Number(u.overlay))) : .42;
    u.effect ??= "none";
    u.theme ??= "light";
    u.unlockedFrames = Array.isArray(u.unlockedFrames) ? u.unlockedFrames : ["basic"];
    if (!u.unlockedFrames.includes("basic")) u.unlockedFrames.unshift("basic");
    if (u.roles.includes("admin")) {
      u.unlockedFrames = FRAME_SHOP.map(frame => frame.id);
      u.frame = u.frame || "admin";
    } else {
      u.frame = u.unlockedFrames.includes(u.frame) ? u.frame : "basic";
    }
    u.bio ??= "";
    u.joined ??= new Date().toISOString();
    if (u.password && !u.passwordHash) {
      u.passwordHash = u.username === "admin" ? ADMIN_HASH : "";
      delete u.password;
    }
  });

  if (!x.users.some(u => u.id === 1)) x.users.unshift(structuredClone(initialDB.users[0]));

  x.problems.forEach(p => {
    p.points = Number(p.points || 100);
    p.languages = [...ALLOWED_LANGUAGES];
    p.statement ??= "";
    p.difficulty ??= "Dễ";
  });

  x.contests.forEach(c => {
    c.rated = Boolean(c.rated);
    c.participants = Array.isArray(c.participants) ? c.participants : [];
    c.duration = Number(c.duration || 120);
    c.startAt ??= new Date().toISOString();
  });

  x.messages = x.messages.map(m => ({
    id: m.id || Date.now() + Math.random(),
    channel: m.channel || "community",
    fromUserId: m.fromUserId ?? m.userId,
    toUserId: m.toUserId ?? null,
    text: String(m.text || ""),
    system: Boolean(m.system),
    createdAt: m.createdAt || new Date().toISOString(),
    readBy: Array.isArray(m.readBy) ? m.readBy : [m.fromUserId ?? m.userId].filter(Boolean)
  }));

  x.settings.ratingSystemV3 = true;
  x.settings.permissionsV4 = true;
  x.settings.accentMotion = x.settings.accentMotion !== false;
  return x;
}

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error(error);
    toast("Không thể lưu dữ liệu. Hãy xóa bớt dữ liệu trình duyệt.");
  }
}

function user() {
  return session ? db.users.find(item => item.id === session.userId) || null : null;
}

function rolesOf(member) {
  if (!member) return [];
  if (Array.isArray(member.roles)) return member.roles;
  return member.role === "admin" ? ["admin"] : [];
}

function hasRole(member, role) {
  return rolesOf(member).includes(role);
}

function admin(member = user()) {
  return hasRole(member, "admin");
}

function canManageProblems(member = user()) {
  return admin(member) || hasRole(member, "problem_setter");
}

function canManageContests(member = user()) {
  return admin(member) || hasRole(member, "contest_setter");
}

function canAccessControlPanel(member = user()) {
  return canManageProblems(member) || canManageContests(member) || admin(member);
}

function isMuted(member = user()) {
  return hasRole(member, "muted");
}

function roleSummary(member) {
  const roles = rolesOf(member).filter(role => role !== "muted");
  if (!roles.length) return "Thành viên";
  return roles.map(role => ROLE_DEFINITIONS[role]?.label || role).join(" · ");
}

function roleBadgesHTML(member) {
  const roles = rolesOf(member);
  if (!roles.length) return `<span class="role-badge role-member">Member</span>`;
  return roles.map(role => `<span class="role-badge ${ROLE_DEFINITIONS[role]?.className || ""}">${esc(ROLE_DEFINITIONS[role]?.label || role)}</span>`).join(" ");
}

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[char]);
}

function fmt(value) {
  try {
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return "—";
  }
}

function route() {
  return location.hash.slice(1) || "home";
}

function toast(text) {
  const wrap = $("#toastWrap");
  if (!wrap) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = text;
  wrap.append(node);
  setTimeout(() => node.remove(), 3200);
}

async function hash(text) {
  if (globalThis.crypto?.subtle) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buffer)].map(value => value.toString(16).padStart(2, "0")).join("");
  }
  return sha256Fallback(String(text));
}

function sha256Fallback(value) {
  const rightRotate = (number, amount) => (number >>> amount) | (number << (32 - amount));
  const maxWord = 2 ** 32;
  const words = [];
  const ascii = unescape(encodeURIComponent(value));
  const bitLength = ascii.length * 8;
  let hashWords = [];
  const constants = [];
  const isComposite = {};
  let primeCounter = 0;

  for (let candidate = 2; primeCounter < 64; candidate += 1) {
    if (isComposite[candidate]) continue;
    for (let multiple = candidate * candidate; multiple < 312; multiple += candidate) isComposite[multiple] = true;
    hashWords[primeCounter] = (Math.sqrt(candidate) * maxWord) | 0;
    constants[primeCounter] = (Math.cbrt(candidate) * maxWord) | 0;
    primeCounter += 1;
  }

  let padded = `${ascii}`;
  while (padded.length % 64 !== 56) padded += " ";
  for (let index = 0; index < padded.length; index += 1) {
    words[index >> 2] |= padded.charCodeAt(index) << ((3 - index) % 4) * 8;
  }
  words.push((bitLength / maxWord) | 0, bitLength | 0);

  for (let offset = 0; offset < words.length; offset += 16) {
    const schedule = words.slice(offset, offset + 16);
    const oldHash = hashWords.slice(0, 8);
    let working = oldHash.slice();
    for (let index = 0; index < 64; index += 1) {
      const w15 = schedule[index - 15];
      const w2 = schedule[index - 2];
      const a = working[0];
      const e = working[4];
      const scheduleWord = index < 16 ? schedule[index] : (
        schedule[index - 16] +
        (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
        schedule[index - 7] +
        (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
      ) | 0;
      schedule[index] = scheduleWord;
      const temp1 = (working[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & working[5]) ^ (~e & working[6])) +
        constants[index] + scheduleWord) | 0;
      const temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & working[1]) ^ (a & working[2]) ^ (working[1] & working[2]))) | 0;
      working = [(temp1 + temp2) | 0, working[0], working[1], working[2], (working[3] + temp1) | 0, working[4], working[5], working[6]];
    }
    hashWords = working.map((word, index) => (word + oldHash[index]) | 0);
  }

  return hashWords.slice(0, 8).map(word => (word >>> 0).toString(16).padStart(8, "0")).join("");
}

function validUsername(value) {
  return /^[A-Za-z0-9_]{3,24}$/.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function userById(id) {
  return db.users.find(u => u.id === Number(id));
}

function problemById(id) {
  return db.problems.find(p => p.id === Number(id));
}

function contestById(id) {
  return db.contests.find(c => c.id === Number(id));
}

function nextId(collection) {
  return Math.max(0, ...collection.map(item => Number(item.id) || 0), Date.now()) + 1;
}

function mediaSourceFor(u, kind) {
  if (!u) return "";
  const key = kind === "avatar" ? u.avatarKey : u.backgroundKey;
  const legacy = kind === "avatar" ? u.avatar : u.backgroundData;
  return (key && mediaUrls.get(key)) || legacy || "";
}

function frameFor(u) {
  if (!u) return "basic";
  if (admin(u) && (u.frame === "admin" || !FRAME_SHOP.some(frame => frame.id === u.frame))) return "admin";
  return FRAME_SHOP.some(frame => frame.id === u.frame) ? u.frame : "basic";
}

function avatarHTML(u, extraClass = "") {
  const source = mediaSourceFor(u, "avatar");
  const initial = esc((u?.displayName || u?.username || "U")[0].toUpperCase());
  return `<span class="avatar-shell frame-${esc(frameFor(u))} ${esc(extraClass)}"><span class="avatar-core">${source ? `<img src="${esc(source)}" alt="Avatar của ${esc(u?.displayName || u?.username || "thành viên")}">` : initial}</span></span>`;
}

function normalizeHexColor(value = "") {
  const raw = String(value).trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) return `#${raw.slice(1).split("").map(char => char + char).join("")}`;
  return "#05070a";
}

function isReservedRatingColor(value) {
  return RESERVED_RATING_COLORS.has(normalizeHexColor(value));
}

function orbText(u) {
  return admin(u) || u?.orbs === -1 ? "∞" : String(Math.max(0, Number(u?.orbs || 0)));
}

function ratingTier(value) {
  const rating = Math.max(0, Number(value || 0));
  return RATING_TIERS.find(tier => rating >= tier.min && rating <= tier.max) || RATING_TIERS[0];
}

function userNameColor(u) {
  if (!u) return RATING_TIERS[0].color;
  return admin(u) ? normalizeHexColor(u.nameColor || "#05070a") : ratingTier(u.rating).color;
}

function nameHTML(u, withBadge = false) {
  if (!u) return `<span class="user-name">Ẩn danh</span>`;
  const classes = ["user-name"];
  if (admin(u)) classes.push("name-admin");
  if (admin(u) && u.animatedName) classes.push("name-animated");
  if (!admin(u) && Number(u.rating || 0) === 0) classes.push("name-unrated");
  return `<span class="${classes.join(" ")}" style="--user-color:${esc(userNameColor(u))}">${esc(u.displayName || u.username)}</span>${withBadge ? ` <span class="role-badges">${roleBadgesHTML(u)}</span>` : ""}`;
}

function ratingProgress(value) {
  const rating = Math.max(0, Number(value || 0));
  const tier = ratingTier(rating);
  if (rating === 0) return 4;
  if (!Number.isFinite(tier.max)) return 100;
  const width = ((rating - tier.min) / (tier.max - tier.min + 1)) * 100;
  return Math.max(4, Math.min(100, width));
}

function ratingBarHTML(u, compact = false) {
  const tier = ratingTier(u?.rating || 0);
  const next = Number.isFinite(tier.max) ? tier.max + 1 : "MAX";
  return `<div class="rating-track ${compact ? "compact" : ""}" style="--tier-color:${tier.color}">
    <div class="rating-track-head"><span class="rating-tier">${esc(tier.name)}</span><span>${Number(u?.rating || 0)} / ${next}</span></div>
    <div class="rating-track-bar"><div class="rating-track-fill" style="--rating-width:${ratingProgress(u?.rating)}%"></div></div>
  </div>`;
}

function addOrbLedger(userId, amount, reason) {
  db.orbLedger.push({
    id: nextId(db.orbLedger),
    userId: Number(userId),
    amount: Number(amount),
    reason: String(reason),
    createdAt: new Date().toISOString()
  });
}

function acceptedProblemsFor(userId) {
  return new Set(db.submissions.filter(s => s.userId === userId && s.status === "AC").map(s => s.problemId));
}

function closeAuth() {
  $("#authModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function setAuthView(view = "login") {
  const registrationOpen = Boolean(db.settings.registration);
  if (view === "register" && !registrationOpen) {
    toast("Hệ thống đang tắt đăng ký tài khoản");
    view = "login";
  }
  const isRegister = view === "register";
  $("#loginForm").classList.toggle("hidden", isRegister);
  $("#registerForm").classList.toggle("hidden", !isRegister);
  $$('[data-auth-view]').forEach(button => {
    button.classList.toggle("active", button.dataset.authView === view && Boolean(button.closest(".auth-tabs")));
  });
  $("#authTitle").textContent = isRegister ? "Tạo tài khoản" : "Đăng nhập";
  $("#authSubtitle").textContent = isRegister
    ? "Bắt đầu với 0 rating, 10 Orb và một hồ sơ riêng."
    : "Tiếp tục hành trình chinh phục thuật toán.";
  setTimeout(() => $(isRegister ? "#registerUsername" : "#loginUsername")?.focus(), 0);
}

function openAuth(view = "login") {
  $("#authModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  setAuthView(view);
}

function closeEditor() {
  $("#editorModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function closeSubmit() {
  $("#submitModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function headerSync() {
  let current = user();
  if (session && !current) {
    session = null;
    localStorage.removeItem(SESSION_KEY);
  }

  const registrationOpen = Boolean(db.settings.registration);
  $("#loginBtn").classList.toggle("hidden", Boolean(current));
  $("#registerBtn").classList.toggle("hidden", Boolean(current) || !registrationOpen);
  $("#userMenu").classList.toggle("hidden", !current);
  $("#orbWallet").classList.toggle("hidden", !current);
  $("#registerTab").disabled = !registrationOpen;
  $$('.auth-switch [data-auth-view="register"]').forEach(button => button.classList.toggle("hidden", !registrationOpen));

  $("#brandName").textContent = db.settings.siteName.toUpperCase();
  $("#footerName").textContent = db.settings.siteName;
  $("#footerSlogan").textContent = db.settings.slogan;
  document.title = db.settings.siteName;

  if (current) {
    $("#headerAvatarWrap").innerHTML = avatarHTML(current);
    $("#headerUsername").textContent = current.username;
    $("#headerUsername").className = admin(current) && current.animatedName ? "name-admin name-animated" : admin(current) ? "name-admin" : "rating-colored-name";
    $("#headerUsername").style.setProperty("--user-color", userNameColor(current));
    $("#headerRole").textContent = roleSummary(current) === "Thành viên" ? `${ratingTier(current.rating).name} · ${current.rating} rating` : roleSummary(current);
    $("#orbAmount").textContent = orbText(current);
    $("#adminMenuItem").classList.toggle("hidden", !canAccessControlPanel(current));
  }

  const unread = unreadPrivateCount(current?.id);
  $("#chatBadge").textContent = unread > 99 ? "99+" : String(unread);
  $("#chatBadge").classList.toggle("hidden", unread === 0);
}

function empty(type, title, text, adminTarget = "") {
  const icons = { problems: "⌘", contests: "◫", submissions: "↗", users: "◎", chat: "💬" };
  return `<div class="card empty">
    <div class="empty-icon">${icons[type] || "◇"}</div>
    <h3>${esc(title)}</h3>
    <p class="muted">${esc(text)}</p>
    ${((adminTarget === "problems" && canManageProblems()) || (adminTarget === "contests" && canManageContests()) || admin()) && adminTarget ? `<button class="btn btn-primary" data-admin-go="${esc(adminTarget)}">Tạo ngay trong bảng điều khiển</button>` : ""}
  </div>`;
}

function homePage() {
  const top = [...db.users].sort((a, b) => b.rating - a.rating || a.id - b.id).slice(0, 7);
  const joinButton = !user() && db.settings.registration
    ? `<button class="btn btn-ghost" data-open-register>Đăng ký miễn phí</button>`
    : `<button class="btn btn-ghost" data-route="chat">Mở Forge Chat</button>`;

  return `<div class="container">
    <section class="hero">
      <div>
        <span class="eyebrow"><span class="pulse"></span> RATED · ORB · PRIVATE CHAT</span>
        <h1>Rèn tư duy.<br><span class="gradient-text">Chinh phục thuật toán.</span></h1>
        <p>Online Judge phong cách LQDOJ với kỳ thi rated hoặc non-rated, thanh rating, Orb, avatar đặc biệt, nền toàn website và chat riêng giữa các thành viên.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="problems">Khám phá bài tập</button>
          ${joinButton}
        </div>
      </div>
      <div class="hero-logo-wrap"><img class="hero-logo" src="logo.png" alt="Phantom Forge Core Online Judge"></div>
    </section>

    <section class="stats">
      <div class="stat-card"><small>Bài tập</small><strong>${db.problems.length}</strong></div>
      <div class="stat-card"><small>Kỳ thi rated</small><strong>${db.contests.filter(c => c.rated).length}</strong></div>
      <div class="stat-card"><small>Thành viên</small><strong>${db.users.length}</strong></div>
      <div class="stat-card"><small>Bài nộp</small><strong>${db.submissions.length}</strong></div>
    </section>

    <div class="home-grid">
      <section>
        <div class="section-head"><div><h2>Thông báo mới</h2><p>Cập nhật từ ban quản trị</p></div></div>
        <div class="card">
          ${db.announcements.length ? db.announcements.slice().reverse().map(item => `<article class="announcement">
            <div class="announce-icon">✦</div>
            <div><h3>${esc(item.title)}</h3><p>${esc(item.content)}</p><small>${fmt(item.createdAt)}</small></div>
          </article>`).join("") : `<div class="empty">Chưa có thông báo.</div>`}
        </div>
      </section>
      <aside>
        <div class="section-head"><div><h2>Top Rating</h2><p>Mọi tài khoản bắt đầu từ 0</p></div></div>
        <div class="card rating-list">
          ${top.map((member, index) => `<div class="rating-row" style="--w:${Math.max(10, Math.min(100, member.rating / 24))}%">
            <b>#${index + 1}</b><span>${nameHTML(member)}</span><span class="rating-value">${member.rating}</span>
          </div>`).join("")}
        </div>
      </aside>
    </div>
  </div>`;
}

function problemsPage() {
  return `<div class="container page">
    <div class="page-head">
      <div><h1>Kho bài tập</h1><p>AC lần đầu để nhận Orb theo số điểm của bài.</p></div>
      <input class="input search" id="problemSearch" placeholder="Tìm mã hoặc tên bài...">
    </div>
    <div id="problemList">${problemList(db.problems)}</div>
  </div>`;
}

function problemList(items) {
  if (!items.length) return empty("problems", "Chưa có bài tập", "Kho bài tập hiện đang trống.", "problems");
  const solved = user() ? acceptedProblemsFor(user().id) : new Set();
  return `<div class="problem-grid">${items.map(problem => {
    const reward = Math.max(1, Math.ceil(problem.points / 100));
    const difficultyClass = problem.difficulty === "Dễ" ? "green" : problem.difficulty === "Khó" ? "red" : "yellow";
    return `<article class="card problem-card">
      <div class="problem-code">${esc(problem.code)}</div>
      <div>
        <h3>${esc(problem.title)} ${solved.has(problem.id) ? `<span class="badge badge-green">✓ Đã AC</span>` : ""}</h3>
        <p>${esc(problem.statement || "Chưa có mô tả.")}</p>
        <div class="problem-meta">
          <span class="badge badge-${difficultyClass}">${esc(problem.difficulty)}</span>
          <span class="badge badge-blue">${problem.points} điểm</span>
          <span class="badge badge-purple">+${reward} Orb lần đầu</span>
          <span class="badge badge-dark">HTML · CSS · JavaScript</span>
        </div>
      </div>
      <div><button class="btn btn-primary" data-submit-problem="${problem.id}">${user() ? "Làm bài" : "Đăng nhập để làm"}</button></div>
    </article>`;
  }).join("")}</div>`;
}

function contestStatus(contest) {
  const start = new Date(contest.startAt).getTime();
  const end = start + Number(contest.duration || 0) * 60000;
  const timestamp = Date.now();
  if (timestamp < start) return { text: "Sắp diễn ra", className: "blue" };
  if (timestamp <= end) return { text: "Đang diễn ra", className: "green" };
  return { text: "Đã kết thúc", className: "red" };
}

function contestsPage() {
  if (!db.contests.length) return `<div class="container page">${empty("contests", "Chưa có kỳ thi", "Hiện chưa có kỳ thi nào được tạo.", "contests")}</div>`;
  const current = user();
  return `<div class="container page">
    <div class="page-head"><div><h1>Kỳ thi</h1><p>Rated sẽ ảnh hưởng rating; non-rated chỉ dùng để luyện tập.</p></div></div>
    <div class="contest-grid">${db.contests.map(contest => {
      const status = contestStatus(contest);
      const joined = current && contest.participants.includes(current.id);
      return `<article class="card contest-card">
        <div class="contest-info-grid">
          <div>
            <h3>${esc(contest.title)}</h3>
            <p>${esc(contest.description || "")}</p>
            <div class="contest-meta">
              <span class="badge ${contest.rated ? "badge-red" : "badge-blue"}">${contest.rated ? "★ RATED" : "NON-RATED"}</span>
              <span class="badge badge-${status.className}">${status.text}</span>
            </div>
          </div>
          <div><small class="muted">Bắt đầu</small><p><b>${fmt(contest.startAt)}</b></p><small class="muted">Thời lượng: ${contest.duration} phút</small></div>
          <div><small class="muted">Người tham gia</small><p><b>${contest.participants.length}</b></p></div>
        </div>
        <div class="contest-actions">
          <button class="btn ${joined ? "btn-success" : "btn-primary"}" data-join-contest="${contest.id}" ${joined ? "disabled" : ""}>${joined ? "✓ Đã tham gia" : current ? "Tham gia" : "Đăng nhập"}</button>
          ${contest.rated ? `<small class="muted">Có tính rating</small>` : `<small class="muted">Không tính rating</small>`}
        </div>
      </article>`;
    }).join("")}</div>
  </div>`;
}

function submissionsPage() {
  const submissions = db.submissions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return `<div class="container page">
    <div class="page-head"><div><h1>Bài nộp</h1><p>Chỉ có đúng 3 ngôn ngữ: HTML, CSS và JavaScript.</p></div></div>
    ${submissions.length ? `<div class="table-wrap"><table>
      <thead><tr><th>Thời gian</th><th>Thành viên</th><th>Bài</th><th>Ngôn ngữ</th><th>Kết quả</th><th>Orb</th></tr></thead>
      <tbody>${submissions.map(submission => {
        const member = userById(submission.userId);
        const problem = problemById(submission.problemId);
        return `<tr>
          <td>${fmt(submission.createdAt)}</td>
          <td>${nameHTML(member, true)}</td>
          <td><b>${esc(problem?.code || "Đã xóa")}</b> ${esc(problem?.title || "")}</td>
          <td><span class="badge badge-dark">${esc(submission.language)}</span></td>
          <td><span class="badge ${submission.status === "AC" ? "badge-green" : "badge-red"}">${esc(submission.status)}</span></td>
          <td>${submission.orbReward ? `<span class="orb-positive">+${submission.orbReward}</span>` : "—"}</td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>` : empty("submissions", "Chưa có bài nộp", "Hãy mở một bài tập và chấm thử.")}
  </div>`;
}

function rankingPage() {
  const members = [...db.users].sort((a, b) => b.rating - a.rating || a.id - b.id);
  return `<div class="container page">
    <div class="page-head"><div><h1>Bảng xếp hạng</h1><p>Rating của mọi tài khoản được khởi tạo bằng 0.</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Hạng</th><th>Thành viên</th><th>Vai trò</th><th>Rating</th><th>Thanh rating</th><th></th></tr></thead>
      <tbody>${members.map((member, index) => `<tr>
        <td><b>#${index + 1}</b></td>
        <td><div style="display:flex;align-items:center;gap:10px">${avatarHTML(member)}<span>${nameHTML(member, true)}<br><small class="muted">@${esc(member.username)}</small></span></div></td>
        <td>${roleBadgesHTML(member)}</td>
        <td><b class="rating-value">${member.rating}</b></td>
        <td>${ratingBarHTML(member, true)}</td>
        <td>${user() && user().id !== member.id ? `<button class="btn btn-sm btn-ghost" data-message-user="${member.id}">Nhắn riêng</button>` : ""}</td>
      </tr>`).join("")}</tbody>
    </table></div>
  </div>`;
}

function aboutPage() {
  return `<div class="container page">
    <div class="about-hero">
      <img src="logo.png" alt="PFC OJ">
      <div>
        <span class="eyebrow">PHANTOM FORGE CORE</span>
        <h1>Giới thiệu<br><span class="gradient-text">Online Judge</span></h1>
        <p class="muted">Phiên bản giao diện mới bổ sung rated/non-rated contest, rating khởi tạo 0, thanh rating, chat riêng, Orb, avatar động, khung avatar và nền toàn website.</p>
        <div class="feature-grid">
          <div class="feature"><b>Rating rõ ràng</b><p>Mỗi tài khoản bắt đầu từ 0 và có thanh tiến độ theo cấp.</p></div>
          <div class="feature"><b>Orb & Media</b><p>Kiếm Orb bằng bài tập để mở khung avatar đặc biệt.</p></div>
          <div class="feature"><b>Chat riêng</b><p>Sảnh chung và tin nhắn trực tiếp nằm trong một trang riêng.</p></div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:22px">
      <h2>Thông tin kỹ thuật</h2>
      <p class="muted">Bản này chạy hoàn toàn bằng HTML, CSS và JavaScript, dữ liệu tài khoản được lưu trong localStorage, còn avatar/nền dung lượng lớn được lưu bằng IndexedDB.</p>
      <div class="notice"><b>Lưu ý:</b> Chấm bài hiện là mô phỏng giao diện frontend. Muốn chạy code thật an toàn cần backend, cơ sở dữ liệu máy chủ và sandbox judge.</div>
    </div>
  </div>`;
}

function profilePage() {
  const current = user();
  if (!current) return `<div class="container page">${empty("users", "Cần đăng nhập", "Bạn cần đăng nhập để xem hồ sơ.")}</div>`;
  const solved = acceptedProblemsFor(current.id).size;
  const recentLedger = db.orbLedger.filter(item => item.userId === current.id).slice(-6).reverse();
  return `<div class="container page">
    <div class="profile-layout">
      <section class="card profile-card">
        ${avatarHTML(current)}
        <h2>${nameHTML(current, true)}</h2>
        <p class="muted">@${esc(current.username)}</p>
        <span class="badge badge-blue">${esc(ratingTier(current.rating).name)} · Rating ${current.rating}</span>
        <span class="badge badge-purple">◉ ${orbText(current)} Orb</span>
        <div class="profile-rating">${ratingBarHTML(current)}</div>
        <div class="profile-stats">
          <div class="mini-stat"><b>${current.rating}</b><small>Rating</small></div>
          <div class="mini-stat"><b>${db.submissions.filter(s => s.userId === current.id).length}</b><small>Bài nộp</small></div>
          <div class="mini-stat"><b>${solved}</b><small>Đã AC</small></div>
        </div>
        <button class="btn btn-primary full" style="margin-top:15px" data-route="appearance">Đổi avatar & nền</button>
      </section>

      <section class="card">
        <h2>Thông tin cá nhân</h2>
        <form id="profileForm" class="form-grid">
          <label>Tên hiển thị<input class="input locked-field" value="${esc(current.displayName || "")}" disabled></label>
          <label>Tên đăng nhập<input class="input locked-field" value="${esc(current.username)}" disabled></label>
          <div class="span-2 permission-note">🔒 Thành viên không thể tự đổi tên hoặc username. Chỉ admin có quyền đổi trong bảng quản trị.</div>
          <label class="span-2">Email<input class="input" value="${esc(current.email || "Chưa cập nhật")}" disabled></label>
          <label class="span-2">Giới thiệu<textarea name="bio" maxlength="300">${esc(current.bio || "")}</textarea></label>
          <div class="span-2"><button class="btn btn-primary">Lưu giới thiệu</button></div>
        </form>

        <hr style="border:0;border-top:1px solid var(--line);margin:25px 0">
        <h3>Đổi mật khẩu</h3>
        <form id="passwordForm" class="form-grid">
          <label>Mật khẩu hiện tại<input class="input" type="password" name="old" required></label>
          <label>Mật khẩu mới<input class="input" type="password" name="new" minlength="6" required></label>
          <div class="span-2"><button class="btn btn-ghost">Cập nhật mật khẩu</button></div>
        </form>

        <hr style="border:0;border-top:1px solid var(--line);margin:25px 0">
        <h3>Lịch sử Orb gần đây</h3>
        ${recentLedger.length ? `<div class="ledger-list">${recentLedger.map(item => `<div class="ledger-row"><small>${fmt(item.createdAt)}</small><span>${esc(item.reason)}</span><b class="${item.amount >= 0 ? "orb-positive" : "orb-negative"}">${item.amount >= 0 ? "+" : ""}${item.amount}</b></div>`).join("")}</div>` : `<p class="muted">Chưa có giao dịch Orb.</p>`}
      </section>
    </div>
  </div>`;
}

function appearancePage() {
  const current = user();
  if (!current) return `<div class="container page">${empty("users", "Cần đăng nhập", "Đăng nhập để đổi giao diện, avatar và nền.")}</div>`;
  const avatarSource = mediaSourceFor(current, "avatar");
  const backgroundSource = mediaSourceFor(current, "background");
  const frames = FRAME_SHOP;
  return `<div class="container page appearance-layout">
    <div class="page-head"><div><h1>Giao diện & Media</h1><p>Avatar động và nền toàn website được phép tối đa 10 MB.</p></div><span class="badge badge-purple">◉ ${orbText(current)} Orb</span></div>

    ${admin(current) ? `<section class="card settings-section admin-color-panel">
      <div class="section-head"><div><h2>Màu tên quản trị viên</h2><p>Admin được chọn màu riêng, nhưng không được trùng màu các hạng rating.</p></div>${nameHTML(current, true)}</div>
      <form id="adminColorForm" class="form-grid">
        <label>Màu tên<input class="color-input" type="color" name="nameColor" value="${esc(normalizeHexColor(current.nameColor || "#05070a"))}"></label>
        <label class="check-card"><input type="checkbox" name="animatedName" ${current.animatedName ? "checked" : ""}> <span>Bật màu chuyển động cho tên</span></label>
        <div class="span-2 rating-color-legend">${RATING_TIERS.map(tier => `<span style="--legend-color:${tier.color}"><i></i>${esc(tier.name)}</span>`).join("")}</div>
        <div class="span-2"><button class="btn btn-primary">Lưu màu admin</button></div>
      </form>
    </section>` : `<section class="card settings-section"><h2>Màu hạng rating</h2><p class="muted">Màu tên của thành viên được tự động theo hạng và không thể tự chọn.</p><div class="rating-color-legend">${RATING_TIERS.map(tier => `<span style="--legend-color:${tier.color}"><i></i>${esc(tier.name)}</span>`).join("")}</div></section>`}

    <section class="card settings-section">
      <h2>Chế độ hiển thị</h2>
      <div class="mode-grid">
        <button class="btn ${current.theme === "light" ? "btn-primary" : "btn-ghost"} mode-button" data-theme-mode="light">☀ Sáng</button>
        <button class="btn ${current.theme !== "light" ? "btn-primary" : "btn-ghost"} mode-button" data-theme-mode="dark">☾ Tối</button>
      </div>
    </section>

    <section class="card settings-section">
      <h2>Nền mẫu toàn website</h2>
      <div class="choice-grid">${Object.entries(BACKGROUND_PRESETS).map(([id, preset]) => `<button class="choice-card ${current.backgroundPreset === id && !current.backgroundKey && !current.backgroundData ? "active" : ""}" data-background-preset="${id}">
        <span class="choice-preview preview-${id}"></span><b>${esc(preset.name)}</b>
      </button>`).join("")}</div>
    </section>

    <section class="card settings-section">
      <h2>Media cá nhân</h2>
      <div class="media-grid">
        <div class="media-box">
          <h3>Avatar</h3>
          <div class="media-preview">${avatarSource ? `<img src="${esc(avatarSource)}" alt="Avatar hiện tại">` : avatarHTML(current)}</div>
          <div class="media-actions">
            <label class="btn btn-primary btn-sm" for="avatarInput">Tải avatar</label>
            <button class="btn btn-ghost btn-sm" id="removeAvatar">Xóa avatar</button>
            <input class="hidden" id="avatarInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
          </div>
          <p class="file-note">PNG, JPG, WebP hoặc GIF động. Dung lượng nhỏ hơn 10 MB.</p>
        </div>
        <div class="media-box">
          <h3>Nền toàn website</h3>
          <div class="media-preview background">${backgroundSource ? `<img src="${esc(backgroundSource)}" alt="Nền hiện tại">` : `<span class="muted">Đang dùng nền mẫu ${esc(BACKGROUND_PRESETS[current.backgroundPreset]?.name || "Forge Core")}</span>`}</div>
          <div class="media-actions">
            <label class="btn btn-primary btn-sm" for="backgroundInput">Tải nền</label>
            <button class="btn btn-ghost btn-sm" id="removeBackground">Bỏ nền tải lên</button>
            <input class="hidden" id="backgroundInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
          </div>
          <p class="file-note">Ảnh hoặc GIF/WebP động dưới 10 MB, phủ toàn bộ website.</p>
        </div>
      </div>
      <div style="margin-top:18px">
        <label class="range-row"><span>Độ tối lớp phủ nền</span><b id="overlayValue">${Math.round(current.overlay * 100)}%</b></label>
        <input id="overlayRange" type="range" min="15" max="90" value="${Math.round(current.overlay * 100)}">
      </div>
    </section>

    <section class="card settings-section">
      <h2>Hiệu ứng động</h2>
      <div class="choice-grid">
        ${[
          ["none", "Không hiệu ứng", "◌"],
          ["rain", "Mưa", "☂"],
          ["stars", "Sao", "✦"],
          ["embers", "Tàn lửa", "✹"]
        ].map(([id, label, icon]) => `<button class="choice-card ${current.effect === id ? "active" : ""}" data-effect="${id}"><span style="font-size:28px">${icon}</span><b>${label}</b></button>`).join("")}
      </div>
    </section>

    <section class="card settings-section">
      <div class="section-head"><div><h2>Khung avatar đặc biệt</h2><p>Dùng Orb để mở khóa; admin được dùng miễn phí và có Orb vô hạn.</p></div></div>
      <div class="frame-shop">${frames.map(frame => {
        const unlocked = admin(current) || current.unlockedFrames.includes(frame.id);
        const equipped = frameFor(current) === frame.id || (frame.id === "basic" && frameFor(current) === "admin");
        const previewUser = { ...current, role: "user", roles: [], frame: frame.id };
        return `<div class="frame-item">
          ${avatarHTML(previewUser)}
          <h3>${esc(frame.name)}</h3>
          <p>${esc(frame.description)}</p>
          <button class="btn btn-sm ${equipped ? "btn-success" : unlocked ? "btn-primary" : "btn-ghost"}" data-frame="${frame.id}" ${equipped ? "disabled" : ""}>
            ${equipped ? "Đang dùng" : unlocked ? "Trang bị" : `Mở khóa · ${frame.cost} Orb`}
          </button>
        </div>`;
      }).join("")}</div>
    </section>
  </div>`;
}

function threadMessages(current, otherId = null) {
  if (!current) return [];
  if (activeChat.type === "community") return db.messages.filter(message => message.channel === "community");
  return db.messages.filter(message => message.channel === "private" && (
    (message.fromUserId === current.id && message.toUserId === otherId) ||
    (message.fromUserId === otherId && message.toUserId === current.id)
  ));
}

function unreadFrom(userId, currentId) {
  if (!currentId) return 0;
  return db.messages.filter(message =>
    message.channel === "private" &&
    message.fromUserId === userId &&
    message.toUserId === currentId &&
    !message.readBy.includes(currentId)
  ).length;
}

function unreadPrivateCount(currentId) {
  if (!currentId) return 0;
  return db.messages.filter(message =>
    message.channel === "private" &&
    message.toUserId === currentId &&
    !message.readBy.includes(currentId)
  ).length;
}

function chatPage() {
  const current = user();
  if (!current) return `<div class="container page"><div class="card chat-login-state"><div><div class="empty-icon">💬</div><h2>Forge Chat</h2><p class="muted">Đăng nhập để vào sảnh chung và nhắn riêng với thành viên khác.</p><button class="btn btn-primary" data-open-login>Đăng nhập</button></div></div></div>`;

  const users = db.users
    .filter(member => member.id !== current.id)
    .filter(member => `${member.username} ${member.displayName}`.toLowerCase().includes(chatSearch.toLowerCase()))
    .sort((a, b) => Number(admin(b)) - Number(admin(a)) || a.username.localeCompare(b.username));

  if (activeChat.type === "private" && !userById(activeChat.userId)) activeChat = { type: "community", userId: null };
  const target = activeChat.type === "private" ? userById(activeChat.userId) : null;
  const messages = threadMessages(current, target?.id).slice(-250);

  return `<div class="container page">
    <section class="card chat-page-shell">
      <aside class="chat-sidebar">
        <div class="chat-side-head"><h2>Forge Chat</h2><input class="input" id="chatUserSearch" placeholder="Tìm thành viên..." value="${esc(chatSearch)}"></div>
        <div class="chat-thread-list">
          <button class="chat-thread ${activeChat.type === "community" ? "active" : ""}" data-chat-community>
            <span class="community-icon">🌐</span><span><b>Sảnh chung</b><small>${db.messages.filter(m => m.channel === "community").length} tin nhắn</small></span>
          </button>
          ${users.map(member => {
            const unread = unreadFrom(member.id, current.id);
            return `<button class="chat-thread ${activeChat.type === "private" && activeChat.userId === member.id ? "active" : ""}" data-chat-user="${member.id}">
              ${avatarHTML(member)}<span><b>${nameHTML(member)}</b><small>@${esc(member.username)} · ${roleSummary(member) === "Thành viên" ? `${member.rating} rating` : roleSummary(member)}</small></span>${unread ? `<i class="unread-pill">${unread}</i>` : ""}
            </button>`;
          }).join("") || `<p class="muted" style="padding:12px">Không tìm thấy thành viên.</p>`}
        </div>
      </aside>

      <div class="chat-main">
        <header class="chat-main-head">
          ${target ? avatarHTML(target) : `<span class="community-icon">🌐</span>`}
          <div><b>${target ? nameHTML(target, true) : "Sảnh chung"}</b><small>${target ? `Tin nhắn riêng với @${esc(target.username)}` : "Kênh trò chuyện cộng đồng"}</small></div>
        </header>
        <div class="chat-messages" id="chatMessages">
          ${messages.length ? messages.map(message => chatMessageHTML(message, current)).join("") : `<div class="chat-empty">Chưa có tin nhắn.<br>Hãy bắt đầu cuộc trò chuyện đầu tiên.</div>`}
        </div>
        ${isMuted(current) ? `<div class="chat-muted-state">🔇 Tài khoản đang bị muted. Bạn vẫn xem được tin nhắn nhưng không thể gửi.</div>` : `<form class="chat-input-form" id="fullChatForm">
          <input class="input" id="fullChatInput" maxlength="500" autocomplete="off" placeholder="${target ? `Nhắn riêng cho @${esc(target.username)}...` : "Nhập tin nhắn vào sảnh chung..."}">
          <button class="btn btn-primary" aria-label="Gửi tin nhắn">Gửi</button>
        </form>`}
      </div>
    </section>
  </div>`;
}

function chatMessageHTML(message, current) {
  const sender = userById(message.fromUserId) || { username: "Ẩn danh", displayName: "Ẩn danh", role: "user", frame: "basic" };
  return `<div class="chat-message ${message.fromUserId === current.id ? "own" : ""}">
    ${avatarHTML(sender)}
    <div class="chat-bubble">
      <div class="chat-bubble-head">${nameHTML(sender, true)}</div>
      <p>${esc(message.text)}</p>
      <small>${fmt(message.createdAt)}</small>
    </div>
  </div>`;
}

function markPrivateThreadRead(otherId) {
  const current = user();
  if (!current) return;
  let changed = false;
  db.messages.forEach(message => {
    if (message.channel === "private" && message.fromUserId === Number(otherId) && message.toUserId === current.id && !message.readBy.includes(current.id)) {
      message.readBy.push(current.id);
      changed = true;
    }
  });
  if (changed) saveDB();
}

function adminPage() {
  const current = user();
  if (!canAccessControlPanel(current)) return `<div class="container page">${empty("users", "Không có quyền truy cập", "Bạn cần quyền Admin, Problem Setter hoặc Contest Setter.")}</div>`;

  const tabs = [["overview", "Tổng quan"]];
  if (canManageProblems(current)) tabs.push(["problems", "Bài tập"]);
  if (canManageContests(current)) tabs.push(["contests", "Kỳ thi"]);
  if (admin(current)) tabs.push(
    ["announcements", "Thông báo"],
    ["users", "Người dùng & Quyền"],
    ["chat", "Toàn bộ Chat"],
    ["economy", "Orb & Economy"],
    ["settings", "Cài đặt"]
  );
  if (!tabs.some(tab => tab[0] === adminTab)) adminTab = "overview";

  return `<div class="container page">
    <div class="page-head"><div><h1>${admin(current) ? "Bảng quản trị toàn quyền" : "Setter Studio"}</h1><p>${admin(current) ? "Can thiệp người dùng, quyền, rating, màu tên, nội dung, Orb và toàn bộ chat." : "Quản lý đúng khu vực được admin cấp quyền."}</p></div><span class="admin-badge">${admin(current) ? "FULL CONTROL" : esc(roleSummary(current))}</span></div>
    <div class="admin-layout">
      <aside class="card admin-side">${tabs.map(tab => `<button class="${adminTab === tab[0] ? "active" : ""}" data-admin-tab="${tab[0]}">${tab[1]}</button>`).join("")}</aside>
      <section>${adminContent()}</section>
    </div>
  </div>`;
}

function adminContent() {
  const current = user();
  if (adminTab === "overview") {
    const quick = [];
    if (canManageProblems(current)) quick.push(`<button class="quick-action" data-create="problem"><b>＋ Tạo bài tập</b><small>Chỉ HTML, CSS, JavaScript.</small></button>`);
    if (canManageContests(current)) quick.push(`<button class="quick-action" data-create="contest"><b>＋ Tạo kỳ thi</b><small>Chọn rated hoặc non-rated.</small></button>`);
    if (admin(current)) quick.push(`<button class="quick-action" data-create="announcement"><b>＋ Đăng thông báo</b><small>Cập nhật trang chủ.</small></button>`);
    return `<div class="stats">
      <div class="stat-card"><small>Bài tập</small><strong>${db.problems.length}</strong></div>
      <div class="stat-card"><small>Kỳ thi rated</small><strong>${db.contests.filter(c => c.rated).length}</strong></div>
      <div class="stat-card"><small>Người dùng</small><strong>${db.users.length}</strong></div>
      <div class="stat-card"><small>Tin nhắn</small><strong>${db.messages.length}</strong></div>
    </div>
    <div class="card"><h2>Quyền hiện tại</h2><div class="permission-summary">${roleBadgesHTML(current)}<p>${admin(current) ? "Admin có toàn quyền với toàn bộ dữ liệu trong bản frontend này." : "Setter chỉ thấy và sửa đúng loại nội dung được cấp."}</p></div><div class="quick-grid">${quick.join("")}</div></div>`;
  }

  if (adminTab === "problems" && canManageProblems(current)) {
    return adminTable("Bài tập", "problem", db.problems, ["Mã", "Tên", "Độ khó", "Điểm", "Orb"], p => [p.code, p.title, p.difficulty, p.points, Math.max(1, Math.ceil(p.points / 100))]);
  }

  if (adminTab === "contests" && canManageContests(current)) {
    return adminTable("Kỳ thi", "contest", db.contests, ["Tên", "Bắt đầu", "Thời lượng", "Chế độ", "Tham gia"], c => [c.title, fmt(c.startAt), `${c.duration} phút`, c.rated ? "RATED" : "NON-RATED", c.participants.length]);
  }

  if (!admin(current)) return `<div class="card">${empty("users", "Không đủ quyền", "Tab này chỉ dành cho admin.")}</div>`;

  if (adminTab === "announcements") {
    return adminTable("Thông báo", "announcement", db.announcements, ["Tiêu đề", "Nội dung", "Ngày"], a => [a.title, a.content.slice(0, 55), fmt(a.createdAt)]);
  }

  if (adminTab === "users") {
    return `<div class="card admin-callout"><b>Quyền Admin:</b> đổi username/tên hiển thị, đặt lại mật khẩu, cấp nhiều vai trò, muted, rating, Orb và màu tên của admin khác.</div>` +
      adminTable("Người dùng", "user", db.users, ["Username", "Tên hiển thị", "Quyền", "Rating", "Orb"], u => [u.username, u.displayName, rolesOf(u).length ? rolesOf(u).map(role => ROLE_DEFINITIONS[role]?.label).join(" + ") : "Member", u.rating, orbText(u)]);
  }

  if (adminTab === "chat") {
    const messages = db.messages.slice().reverse();
    return `<div class="card">
      <div class="section-head"><div><h2>Toàn bộ tin nhắn</h2><p>Admin có thể xem và xóa cả sảnh chung lẫn tin nhắn riêng trong bản dữ liệu local này.</p></div><button class="btn btn-danger" id="clearAllChat">Xóa toàn bộ chat</button></div>
      <form id="systemMessageForm" class="form-grid system-message-form">
        <label class="span-2">Chèn thông báo hệ thống vào sảnh chung<input class="input" name="text" maxlength="500" required placeholder="Nội dung thông báo..."></label>
        <div class="span-2"><button class="btn btn-primary">Gửi thông báo hệ thống</button></div>
      </form>
      ${messages.length ? `<div class="table-wrap"><table><thead><tr><th>Kênh</th><th>Người gửi</th><th>Người nhận</th><th>Nội dung</th><th>Thời gian</th><th></th></tr></thead><tbody>${messages.map(message => {
        const sender = userById(message.fromUserId);
        const target = userById(message.toUserId);
        return `<tr><td>${message.channel === "private" ? "Riêng tư" : "Sảnh chung"}</td><td>${message.system ? "HỆ THỐNG" : nameHTML(sender, true)}</td><td>${message.channel === "private" ? nameHTML(target) : "Mọi người"}</td><td>${esc(message.text)}</td><td>${fmt(message.createdAt)}</td><td><button class="btn btn-sm btn-danger" data-delete-message="${message.id}">Xóa</button></td></tr>`;
      }).join("")}</tbody></table></div>` : empty("chat", "Chưa có tin nhắn", "Hệ thống chat đang trống.")}
    </div>`;
  }

  if (adminTab === "economy") {
    const normalUsers = db.users.filter(member => !admin(member));
    const ledger = db.orbLedger.slice().reverse().slice(0, 100);
    return `<div class="card">
      <h2>Điều chỉnh Orb</h2>
      <form id="orbAdjustForm" class="form-grid">
        <label>Thành viên<select class="select" name="userId" required>${normalUsers.map(member => `<option value="${member.id}">@${esc(member.username)} · ${member.orbs} Orb</option>`).join("")}</select></label>
        <label>Số Orb<input class="input" type="number" name="amount" required placeholder="Ví dụ: 5 hoặc -3"></label>
        <label class="span-2">Lý do<input class="input" name="reason" maxlength="120" required value="Điều chỉnh bởi quản trị viên"></label>
        <div class="span-2"><button class="btn btn-primary" ${normalUsers.length ? "" : "disabled"}>Áp dụng</button></div>
      </form>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="section-head"><div><h2>Sổ giao dịch Orb</h2><p>${db.orbLedger.length} giao dịch</p></div></div>
      ${ledger.length ? `<div class="ledger-list">${ledger.map(item => {
        const member = userById(item.userId);
        return `<div class="ledger-row"><span>${nameHTML(member)}</span><span>${esc(item.reason)}<br><small class="muted">${fmt(item.createdAt)}</small></span><b class="${item.amount >= 0 ? "orb-positive" : "orb-negative"}">${item.amount >= 0 ? "+" : ""}${item.amount}</b></div>`;
      }).join("")}</div>` : `<p class="muted">Chưa có giao dịch Orb.</p>`}
    </div>`;
  }

  return `<div class="card">
    <h2>Cài đặt website</h2>
    <form id="settingsForm" class="form-grid">
      <label>Tên website<input class="input" name="siteName" value="${esc(db.settings.siteName)}"></label>
      <label>Cho phép đăng ký<select class="select" name="registration"><option value="true" ${db.settings.registration ? "selected" : ""}>Bật</option><option value="false" ${!db.settings.registration ? "selected" : ""}>Tắt</option></select></label>
      <label class="span-2">Khẩu hiệu<input class="input" name="slogan" value="${esc(db.settings.slogan)}"></label>
      <label>Chế độ bảo trì<select class="select" name="maintenance"><option value="false" ${!db.settings.maintenance ? "selected" : ""}>Tắt</option><option value="true" ${db.settings.maintenance ? "selected" : ""}>Bật</option></select></label>
      <label>Màu chuyển động toàn web<select class="select" name="accentMotion"><option value="true" ${db.settings.accentMotion !== false ? "selected" : ""}>Bật</option><option value="false" ${db.settings.accentMotion === false ? "selected" : ""}>Tắt</option></select></label>
      <div class="span-2"><button class="btn btn-primary">Lưu cài đặt</button></div>
    </form>
    <hr style="border:0;border-top:1px solid var(--line);margin:24px 0">
    <button class="btn btn-danger" id="resetData">Khôi phục dữ liệu ban đầu</button>
  </div>`;
}

function adminTable(title, type, items, heads, row) {
  return `<div class="card">
    <div class="section-head"><div><h2>Quản lý ${title}</h2><p>${items.length} mục</p></div><button class="btn btn-primary" data-create="${type}">＋ Thêm mới</button></div>
    ${items.length ? `<div class="table-wrap"><table><thead><tr>${heads.map(head => `<th>${esc(head)}</th>`).join("")}<th>Thao tác</th></tr></thead><tbody>${items.map(item => `<tr>${row(item).map(value => `<td>${esc(value)}</td>`).join("")}<td><button class="btn btn-sm btn-ghost" data-edit="${type}" data-id="${item.id}">Sửa</button> <button class="btn btn-sm btn-danger" data-delete="${type}" data-id="${item.id}">Xóa</button></td></tr>`).join("")}</tbody></table></div>` : empty("users", "Chưa có dữ liệu", "Hãy tạo mục đầu tiên.")}
  </div>`;
}

async function render() {
  const sequence = ++renderSequence;
  await hydrateMedia();
  if (sequence !== renderSequence) return;
  applyAppearance();
  headerSync();

  const currentRoute = route();
  const routeChanged = currentRoute !== lastRenderedRoute;
  lastRenderedRoute = currentRoute;
  const pages = {
    home: homePage,
    problems: problemsPage,
    contests: contestsPage,
    submissions: submissionsPage,
    ranking: rankingPage,
    chat: chatPage,
    about: aboutPage,
    profile: profilePage,
    appearance: appearancePage,
    admin: adminPage
  };

  $$(".nav a").forEach(link => link.classList.toggle("active", link.dataset.route === currentRoute));
  $("#app").innerHTML = (pages[currentRoute] || homePage)();
  bind();
  if (routeChanged) window.scrollTo({ top: 0, behavior: "instant" });
  requestAnimationFrame(() => {
    const messages = $("#chatMessages");
    if (messages) messages.scrollTop = messages.scrollHeight;
  });
}

function bind() {
  $$('[data-route]').forEach(element => {
    element.onclick = () => {
      location.hash = element.dataset.route;
      $("#mainNav").classList.remove("open");
      $("#mobileMenu").setAttribute("aria-expanded", "false");
      $("#userDropdown").classList.add("hidden");
    };
  });

  $$('[data-open-register]').forEach(element => element.onclick = () => openAuth("register"));
  $$('[data-open-login]').forEach(element => element.onclick = () => openAuth("login"));

  $$('[data-admin-go]').forEach(element => element.onclick = () => {
    adminTab = element.dataset.adminGo;
    location.hash = "admin";
    render();
  });

  $$('[data-admin-tab]').forEach(element => element.onclick = () => {
    adminTab = element.dataset.adminTab;
    render();
  });

  $$('[data-create]').forEach(element => element.onclick = () => editor(element.dataset.create));
  $$('[data-edit]').forEach(element => element.onclick = () => editor(element.dataset.edit, Number(element.dataset.id)));
  $$('[data-delete]').forEach(element => element.onclick = () => removeItem(element.dataset.delete, Number(element.dataset.id)));

  $$('[data-delete-message]').forEach(element => element.onclick = () => {
    if (!admin()) return toast("Chỉ admin được xóa tin nhắn");
    db.messages = db.messages.filter(message => message.id !== Number(element.dataset.deleteMessage));
    saveDB();
    render();
  });

  $("#problemSearch")?.addEventListener("input", event => {
    const query = event.target.value.toLowerCase();
    $("#problemList").innerHTML = problemList(db.problems.filter(problem => `${problem.code} ${problem.title}`.toLowerCase().includes(query)));
    $$('[data-submit-problem]').forEach(button => button.onclick = () => openSubmit(Number(button.dataset.submitProblem)));
  });

  $$('[data-submit-problem]').forEach(button => button.onclick = () => openSubmit(Number(button.dataset.submitProblem)));

  $$('[data-join-contest]').forEach(button => button.onclick = () => joinContest(Number(button.dataset.joinContest)));

  $$('[data-message-user]').forEach(button => button.onclick = () => {
    if (!user()) return openAuth("login");
    activeChat = { type: "private", userId: Number(button.dataset.messageUser) };
    markPrivateThreadRead(activeChat.userId);
    location.hash = "chat";
    render();
  });

  $("#profileForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const current = user();
    current.bio = String(form.get("bio") || "").trim();
    saveDB();
    render();
    toast("Đã lưu hồ sơ");
  });

  $("#passwordForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const current = user();
    if (await hash(form.get("old")) !== current.passwordHash) return toast("Mật khẩu hiện tại không đúng");
    current.passwordHash = await hash(form.get("new"));
    saveDB();
    event.target.reset();
    toast("Đã đổi mật khẩu");
  });

  $("#avatarInput")?.addEventListener("change", event => handleMediaUpload("avatar", event.target.files?.[0]));
  $("#backgroundInput")?.addEventListener("change", event => handleMediaUpload("background", event.target.files?.[0]));
  $("#removeAvatar")?.addEventListener("click", () => removeUserMedia("avatar"));
  $("#removeBackground")?.addEventListener("click", () => removeUserMedia("background"));

  $$('[data-theme-mode]').forEach(button => button.onclick = () => {
    const current = user();
    current.theme = button.dataset.themeMode;
    saveDB();
    render();
  });

  $$('[data-background-preset]').forEach(button => button.onclick = async () => {
    const current = user();
    current.backgroundPreset = button.dataset.backgroundPreset;
    if (current.backgroundKey) await deleteMedia(current.backgroundKey);
    current.backgroundKey = "";
    current.backgroundData = "";
    saveDB();
    render();
  });

  $("#overlayRange")?.addEventListener("input", event => {
    const current = user();
    current.overlay = Number(event.target.value) / 100;
    $("#overlayValue").textContent = `${event.target.value}%`;
    document.documentElement.style.setProperty("--background-overlay", String(current.overlay));
  });
  $("#overlayRange")?.addEventListener("change", () => saveDB());

  $$('[data-effect]').forEach(button => button.onclick = () => {
    user().effect = button.dataset.effect;
    saveDB();
    render();
  });

  $$('[data-frame]').forEach(button => button.onclick = () => selectFrame(button.dataset.frame));

  $("#chatUserSearch")?.addEventListener("input", event => {
    chatSearch = event.target.value;
    render();
  });

  $("[data-chat-community]")?.addEventListener("click", () => {
    activeChat = { type: "community", userId: null };
    render();
  });

  $$('[data-chat-user]').forEach(button => button.onclick = () => {
    activeChat = { type: "private", userId: Number(button.dataset.chatUser) };
    markPrivateThreadRead(activeChat.userId);
    render();
  });

  $("#fullChatForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#fullChatInput");
    const text = input.value.trim();
    if (!text || !user()) return;
    if (isMuted()) return toast("Tài khoản đang bị muted và không thể gửi tin nhắn");
    const message = {
      id: nextId(db.messages),
      channel: activeChat.type,
      fromUserId: user().id,
      toUserId: activeChat.type === "private" ? activeChat.userId : null,
      text,
      createdAt: new Date().toISOString(),
      readBy: [user().id]
    };
    db.messages.push(message);
    saveDB();
    input.value = "";
    render();
  });

  $("#settingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!admin()) return toast("Chỉ admin được đổi cài đặt website");
    const form = new FormData(event.target);
    db.settings = {
      ...db.settings,
      siteName: String(form.get("siteName") || "Phantom Forge Core OJ").trim(),
      slogan: String(form.get("slogan") || "").trim(),
      registration: form.get("registration") === "true",
      maintenance: form.get("maintenance") === "true",
      accentMotion: form.get("accentMotion") === "true"
    };
    saveDB();
    render();
    toast("Đã lưu cài đặt");
  });

  $("#orbAdjustForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!admin()) return toast("Chỉ admin được điều chỉnh Orb");
    const form = new FormData(event.target);
    const member = userById(Number(form.get("userId")));
    const amount = Number(form.get("amount"));
    const reason = String(form.get("reason") || "Điều chỉnh bởi quản trị viên").trim();
    if (!member || admin(member) || !Number.isFinite(amount) || amount === 0) return toast("Dữ liệu điều chỉnh Orb không hợp lệ");
    member.orbs = Math.max(0, Number(member.orbs || 0) + amount);
    addOrbLedger(member.id, amount, reason);
    saveDB();
    render();
    toast("Đã cập nhật Orb");
  });

  $("#clearAllChat")?.addEventListener("click", () => {
    if (!admin() || !confirm("Xóa toàn bộ sảnh chung và tin nhắn riêng?")) return;
    db.messages = [];
    saveDB();
    render();
  });

  $("#systemMessageForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!admin()) return toast("Chỉ admin được gửi thông báo hệ thống");
    const text = String(new FormData(event.target).get("text") || "").trim();
    if (!text) return;
    db.messages.push({ id: nextId(db.messages), channel: "community", fromUserId: user().id, toUserId: null, text, system: true, createdAt: new Date().toISOString(), readBy: [user().id] });
    saveDB();
    render();
    toast("Đã chèn thông báo hệ thống");
  });

  $("#adminColorForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!admin()) return toast("Chỉ admin được chọn màu tên riêng");
    const form = new FormData(event.target);
    const color = normalizeHexColor(form.get("nameColor"));
    if (isReservedRatingColor(color)) return toast("Màu này đang được dùng cho một hạng rating. Hãy chọn màu khác.");
    user().nameColor = color;
    user().animatedName = form.get("animatedName") === "on";
    saveDB();
    render();
    toast("Đã cập nhật màu tên admin");
  });

  $("#resetData")?.addEventListener("click", async () => {
    if (!admin()) return toast("Chỉ admin được khôi phục dữ liệu");
    if (!confirm("Khôi phục toàn bộ dữ liệu ban đầu?")) return;
    db = structuredClone(initialDB);
    saveDB();
    session = null;
    localStorage.removeItem(SESSION_KEY);
    location.hash = "home";
    await render();
    toast("Đã khôi phục dữ liệu");
  });
}

function joinContest(contestId) {
  if (!user()) return openAuth("login");
  const contest = contestById(contestId);
  if (!contest) return toast("Không tìm thấy kỳ thi");
  if (contest.participants.includes(user().id)) return toast("Bạn đã tham gia kỳ thi này");
  contest.participants.push(user().id);
  saveDB();
  render();
  toast(contest.rated ? "Đã tham gia kỳ thi rated" : "Đã tham gia kỳ thi non-rated");
}

function openSubmit(problemId) {
  if (!user()) return openAuth("login");
  const problem = problemById(problemId);
  if (!problem) return toast("Không tìm thấy bài tập");
  const reward = Math.max(1, Math.ceil(problem.points / 100));
  $("#submitContent").innerHTML = `<h2>Nộp bài · ${esc(problem.code)}</h2>
    <div class="submit-summary"><div><b>${esc(problem.title)}</b><p class="muted">${esc(problem.statement)}</p></div><span class="badge badge-purple">+${reward} Orb lần AC đầu</span></div>
    <form id="submitForm" class="form-grid">
      <label class="span-2">Ngôn ngữ<select class="select" name="language">${ALLOWED_LANGUAGES.map(language => `<option>${language}</option>`).join("")}</select></label>
      <label class="span-2">Mã nguồn<textarea class="code-editor" name="code" required placeholder="Nhập mã HTML, CSS hoặc JavaScript..."></textarea></label>
      <div class="span-2 notice"><b>Chấm thử frontend:</b> phiên bản này ghi nhận AC khi mã nguồn có nội dung hợp lệ. Không có C++ hoặc Python.</div>
      <div class="span-2" style="display:flex;justify-content:flex-end;gap:10px"><button type="button" class="btn btn-ghost" data-close-submit>Hủy</button><button class="btn btn-primary">Chấm bài</button></div>
    </form>`;
  $("#submitModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $$('[data-close-submit]').forEach(button => button.onclick = closeSubmit);
  $("#submitForm").onsubmit = event => submitProblem(event, problem);
}

function submitProblem(event, problem) {
  event.preventDefault();
  const form = new FormData(event.target);
  const language = String(form.get("language"));
  const code = String(form.get("code") || "").trim();
  if (!ALLOWED_LANGUAGES.includes(language)) return toast("Ngôn ngữ không được hỗ trợ");
  if (code.length < 10) return toast("Mã nguồn quá ngắn để chấm");

  const current = user();
  const firstAccepted = !db.submissions.some(submission => submission.userId === current.id && submission.problemId === problem.id && submission.status === "AC");
  const reward = firstAccepted && !admin(current) ? Math.max(1, Math.ceil(problem.points / 100)) : 0;

  db.submissions.push({
    id: nextId(db.submissions),
    userId: current.id,
    problemId: problem.id,
    language,
    code,
    status: "AC",
    points: problem.points,
    orbReward: reward,
    createdAt: new Date().toISOString()
  });

  if (reward) {
    current.orbs = Number(current.orbs || 0) + reward;
    addOrbLedger(current.id, reward, `AC ${problem.code} (${problem.points} điểm)`);
  }

  saveDB();
  closeSubmit();
  render();
  toast(reward ? `Accepted! Bạn nhận ${reward} Orb` : "Accepted! Bài này không còn thưởng Orb lần đầu");
}

function selectFrame(frameId) {
  const current = user();
  const frame = FRAME_SHOP.find(item => item.id === frameId);
  if (!current || !frame) return;

  if (admin(current)) {
    current.frame = frame.id;
    saveDB();
    render();
    return toast("Admin đã trang bị khung avatar");
  }

  if (!current.unlockedFrames.includes(frame.id)) {
    if (Number(current.orbs || 0) < frame.cost) return toast("Bạn không đủ Orb để mở khóa khung này");
    current.orbs -= frame.cost;
    current.unlockedFrames.push(frame.id);
    addOrbLedger(current.id, -frame.cost, `Mở khóa khung ${frame.name}`);
  }

  current.frame = frame.id;
  saveDB();
  render();
  toast(`Đã trang bị ${frame.name}`);
}

function editor(type, id = null) {
  if (type === "problem" && !canManageProblems()) return toast("Bạn không có quyền Problem Setter");
  if (type === "contest" && !canManageContests()) return toast("Bạn không có quyền Contest Setter");
  if (["announcement", "user"].includes(type) && !admin()) return toast("Chỉ admin được thực hiện thao tác này");

  const map = { problem: "problems", contest: "contests", announcement: "announcements", user: "users" };
  const collection = db[map[type]];
  const item = id ? collection.find(entry => entry.id === id) || {} : {};
  const itemRoles = rolesOf(item);
  const rootLocked = type === "user" && item.id === 1;

  const fields = {
    problem: `<label>Mã bài<input class="input" name="code" required value="${esc(item.code || "")}"></label>
      <label>Tên bài<input class="input" name="title" required value="${esc(item.title || "")}"></label>
      <label>Độ khó<select class="select" name="difficulty">${["Dễ", "Trung bình", "Khó"].map(value => `<option ${item.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <label>Điểm<input class="input" type="number" min="1" name="points" value="${item.points || 100}"></label>
      <label class="span-2">Đề bài<textarea name="statement">${esc(item.statement || "")}</textarea></label>
      <div class="span-2 notice">Ngôn ngữ cố định: HTML, CSS và JavaScript. Không thể thêm C++ hoặc Python.</div>`,
    contest: `<label class="span-2">Tên kỳ thi<input class="input" name="title" required value="${esc(item.title || "")}"></label>
      <label>Bắt đầu<input class="input" type="datetime-local" name="startAt" required value="${item.startAt ? new Date(item.startAt).toISOString().slice(0, 16) : ""}"></label>
      <label>Thời lượng<input class="input" type="number" min="1" name="duration" value="${item.duration || 120}"></label>
      <label>Chế độ<select class="select" name="rated"><option value="true" ${item.rated ? "selected" : ""}>Rated</option><option value="false" ${!item.rated ? "selected" : ""}>Non-rated</option></select></label>
      <label class="span-2">Mô tả<textarea name="description">${esc(item.description || "")}</textarea></label>`,
    announcement: `<label class="span-2">Tiêu đề<input class="input" name="title" required value="${esc(item.title || "")}"></label>
      <label class="span-2">Nội dung<textarea name="content" required>${esc(item.content || "")}</textarea></label>`,
    user: `<label>Tên đăng nhập<input class="input" name="username" minlength="3" maxlength="24" required value="${esc(item.username || "")}"></label>
      <label>Email<input class="input" type="email" name="email" value="${esc(item.email || "")}"></label>
      <label>Tên hiển thị<input class="input" name="displayName" maxlength="40" value="${esc(item.displayName || "")}"></label>
      <label>Mật khẩu ${id ? "mới (để trống nếu giữ nguyên)" : ""}<input class="input" type="password" minlength="6" name="password" ${id ? "" : "required"} autocomplete="new-password"></label>
      <fieldset class="span-2 role-fieldset"><legend>Cấp quyền (có thể chọn nhiều)</legend>
        ${Object.entries(ROLE_DEFINITIONS).map(([role, info]) => `<label class="check-card"><input type="checkbox" name="roles" value="${role}" ${itemRoles.includes(role) ? "checked" : ""} ${rootLocked && ["admin", "muted"].includes(role) ? "disabled" : ""}> <span>${esc(info.label)}</span></label>`).join("")}
        ${rootLocked ? `<input type="hidden" name="roles" value="admin"><small>Admin gốc không thể bị hạ quyền hoặc muted.</small>` : ""}
      </fieldset>
      <label>Rating<input class="input" type="number" min="0" name="rating" value="${Number(item.rating || 0)}"></label>
      <label>Orb (-1 = vô hạn cho admin)<input class="input" type="number" min="-1" name="orbs" value="${admin(item) ? -1 : Number(item.orbs ?? 10)}"></label>
      <label>Màu tên admin<input class="color-input" type="color" name="nameColor" value="${esc(normalizeHexColor(item.nameColor || "#05070a"))}"></label>
      <label class="check-card"><input type="checkbox" name="animatedName" ${item.animatedName ? "checked" : ""}> <span>Màu tên chuyển động</span></label>
      <div class="span-2 permission-note">Username và tên hiển thị chỉ có thể đổi tại đây bởi admin. Màu admin không được trùng màu rating.</div>`
  };

  $("#editorContent").innerHTML = `<h2>${id ? "Chỉnh sửa" : "Thêm mới"} ${type}</h2>
    <form id="editorForm" class="form-grid">${fields[type]}
      <div class="span-2" style="display:flex;justify-content:flex-end;gap:10px"><button type="button" class="btn btn-ghost" data-close-editor>Hủy</button><button class="btn btn-primary">Lưu dữ liệu</button></div>
    </form>`;

  $("#editorModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $$('[data-close-editor]').forEach(button => button.onclick = closeEditor);

  $("#editorForm").onsubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.id = id || nextId(collection);

    if (type === "problem") {
      data.points = Math.max(1, Number(data.points));
      data.languages = [...ALLOWED_LANGUAGES];
    }

    if (type === "contest") {
      data.duration = Math.max(1, Number(data.duration));
      data.startAt = new Date(data.startAt).toISOString();
      data.rated = data.rated === "true";
      data.participants = item.participants || [];
    }

    if (type === "announcement") data.createdAt = item.createdAt || new Date().toISOString();

    if (type === "user") {
      data.username = String(data.username).trim();
      data.email = String(data.email || "").trim().toLowerCase();
      data.displayName = String(data.displayName || "").trim() || data.username;
      data.roles = [...new Set(formData.getAll("roles").filter(role => ROLE_DEFINITIONS[role]))];
      if (id === 1 && !data.roles.includes("admin")) data.roles.unshift("admin");
      if (id === 1) data.roles = data.roles.filter(role => role !== "muted");
      data.role = data.roles.includes("admin") ? "admin" : "user";
      if (!validUsername(data.username)) return toast("Username chỉ gồm chữ, số, dấu gạch dưới và dài 3–24 ký tự");
      if (data.email && !validEmail(data.email)) return toast("Email không hợp lệ");
      if (db.users.some(member => member.id !== id && member.username.toLowerCase() === data.username.toLowerCase())) return toast("Tên đăng nhập đã tồn tại");
      if (data.email && db.users.some(member => member.id !== id && (member.email || "").toLowerCase() === data.email)) return toast("Email đã được sử dụng");

      data.rating = Math.max(0, Number(data.rating || 0));
      data.orbs = data.roles.includes("admin") ? -1 : Math.max(0, Number(data.orbs ?? 10));
      data.nameColor = data.roles.includes("admin") ? normalizeHexColor(data.nameColor) : "";
      if (data.roles.includes("admin") && isReservedRatingColor(data.nameColor)) return toast("Màu admin không được trùng màu của hạng rating");
      data.animatedName = data.roles.includes("admin") && formData.get("animatedName") === "on";
      data.joined = item.joined || new Date().toISOString();
      data.avatarKey = item.avatarKey || "";
      data.avatar = item.avatar || "";
      data.backgroundKey = item.backgroundKey || "";
      data.backgroundData = item.backgroundData || "";
      data.backgroundPreset = item.backgroundPreset || "forge";
      data.overlay = item.overlay ?? .42;
      data.effect = item.effect || "none";
      data.theme = item.theme || "light";
      data.bio = item.bio || "";
      data.unlockedFrames = data.roles.includes("admin") ? FRAME_SHOP.map(frame => frame.id) : item.unlockedFrames || ["basic"];
      data.frame = data.roles.includes("admin") ? (item.frame || "admin") : item.frame || "basic";
      data.ratingHistory = Array.isArray(item.ratingHistory) ? [...item.ratingHistory] : [];
      if (id && Number(item.rating || 0) !== data.rating) {
        data.ratingHistory.push({ value: data.rating, reason: "Điều chỉnh bởi quản trị viên", createdAt: new Date().toISOString() });
      } else if (!id) {
        data.ratingHistory.push({ value: data.rating, reason: "Khởi tạo tài khoản", createdAt: new Date().toISOString() });
      }
      if (data.password) data.passwordHash = await hash(data.password);
      else data.passwordHash = item.passwordHash;
      delete data.password;
    }

    if (id) collection[collection.findIndex(entry => entry.id === id)] = { ...item, ...data };
    else collection.push(data);

    saveDB();
    closeEditor();
    render();
    toast("Đã lưu dữ liệu");
  };
}

function removeItem(type, id) {
  if (type === "problem" && !canManageProblems()) return toast("Bạn không có quyền xóa bài tập");
  if (type === "contest" && !canManageContests()) return toast("Bạn không có quyền xóa kỳ thi");
  if (["announcement", "user"].includes(type) && !admin()) return toast("Chỉ admin được xóa dữ liệu này");
  const map = { problem: "problems", contest: "contests", announcement: "announcements", user: "users" };
  if (type === "user" && id === 1) return toast("Không thể xóa quản trị viên gốc");
  if (type === "user" && id === user()?.id) return toast("Không thể xóa tài khoản đang đăng nhập");
  if (!confirm("Bạn chắc chắn muốn xóa?")) return;
  db[map[type]] = db[map[type]].filter(item => item.id !== id);
  if (type === "user") {
    db.messages = db.messages.filter(message => message.fromUserId !== id && message.toUserId !== id);
    db.orbLedger = db.orbLedger.filter(item => item.userId !== id);
  }
  saveDB();
  render();
  toast("Đã xóa");
}

function openMediaDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("IndexedDB không được hỗ trợ"));
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback(value);
    };
    const timer = setTimeout(() => finish(reject, new Error("IndexedDB phản hồi quá chậm")), 4500);
    const request = indexedDB.open("pfc_oj_media_v1", 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("files")) database.createObjectStore("files");
    };
    request.onsuccess = () => finish(resolve, request.result);
    request.onerror = () => finish(reject, request.error || new Error("Không mở được IndexedDB"));
    request.onblocked = () => finish(reject, new Error("IndexedDB đang bị khóa bởi tab khác"));
  });
}

async function putMedia(key, file) {
  const database = await openMediaDB();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readwrite");
    transaction.objectStore("files").put(file, key);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function getMedia(key) {
  const database = await openMediaDB();
  const result = await new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readonly");
    const request = transaction.objectStore("files").get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result;
}

async function deleteMedia(key) {
  if (!key) return;
  try {
    const database = await openMediaDB();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("files", "readwrite");
      transaction.objectStore("files").delete(key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  } catch (error) {
    console.warn(error);
  }
  if (mediaUrls.has(key)) {
    URL.revokeObjectURL(mediaUrls.get(key));
    mediaUrls.delete(key);
  }
}

async function cacheMediaKey(key) {
  if (!key || mediaUrls.has(key)) return;
  try {
    const blob = await getMedia(key);
    if (blob) mediaUrls.set(key, URL.createObjectURL(blob));
  } catch (error) {
    console.warn("Không tải được media:", error);
  }
}

async function hydrateMedia() {
  const keys = new Set();
  db.users.forEach(member => {
    if (member.avatarKey) keys.add(member.avatarKey);
  });
  const current = user();
  if (current?.backgroundKey) keys.add(current.backgroundKey);
  await Promise.all([...keys].map(cacheMediaKey));
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function handleMediaUpload(kind, file) {
  if (!file || !user()) return;
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) return toast("Chỉ nhận PNG, JPG, WebP hoặc GIF");
  if (file.size >= MAX_MEDIA_SIZE) return toast("Tệp phải nhỏ hơn 10 MB");

  const current = user();
  const keyField = kind === "avatar" ? "avatarKey" : "backgroundKey";
  const legacyField = kind === "avatar" ? "avatar" : "backgroundData";
  const oldKey = current[keyField];
  const newKey = `${kind}:${current.id}:${Date.now()}`;

  try {
    await putMedia(newKey, file);
    if (oldKey) await deleteMedia(oldKey);
    current[keyField] = newKey;
    current[legacyField] = "";
    await cacheMediaKey(newKey);
  } catch (error) {
    console.warn(error);
    if (file.size > 3 * 1024 * 1024) return toast("Trình duyệt chặn IndexedDB. Hãy mở website qua localhost để dùng tệp lớn.");
    current[keyField] = "";
    current[legacyField] = await fileToDataURL(file);
  }

  saveDB();
  await render();
  toast(kind === "avatar" ? "Đã cập nhật avatar" : "Đã cập nhật nền toàn website");
}

async function removeUserMedia(kind) {
  const current = user();
  if (!current) return;
  const keyField = kind === "avatar" ? "avatarKey" : "backgroundKey";
  const legacyField = kind === "avatar" ? "avatar" : "backgroundData";
  if (current[keyField]) await deleteMedia(current[keyField]);
  current[keyField] = "";
  current[legacyField] = "";
  saveDB();
  render();
  toast(kind === "avatar" ? "Đã xóa avatar" : "Đã bỏ nền tải lên");
}

function applyAppearance() {
  const current = user();
  const guestTheme = localStorage.getItem("pfc_guest_theme") || "light";
  const theme = current?.theme || guestTheme;
  document.body.classList.toggle("light", theme === "light");
  document.body.classList.toggle("ambient-motion", db.settings.accentMotion !== false);
  $("#themeToggle").textContent = theme === "light" ? "☀" : "☾";

  const customBackground = mediaSourceFor(current, "background");
  const preset = BACKGROUND_PRESETS[current?.backgroundPreset || "forge"] || BACKGROUND_PRESETS.forge;
  const backgroundValue = customBackground ? `url("${customBackground.replace(/"/g, "%22")}")` : preset.css;
  document.documentElement.style.setProperty("--background-image", backgroundValue);
  document.documentElement.style.setProperty("--background-overlay", String(current?.overlay ?? .58));
  buildEffect(current?.effect || "none");
}

function buildEffect(effect) {
  if (currentEffect === effect) return;
  currentEffect = effect;
  const layer = $("#fxLayer");
  layer.className = `fx-layer ${effect}`;
  layer.innerHTML = "";
  if (effect === "none") return;
  const count = effect === "rain" ? 58 : effect === "stars" ? 45 : 34;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.opacity = String(.2 + Math.random() * .7);
    particle.style.animationDelay = `${-Math.random() * 9}s`;
    particle.style.animationDuration = `${effect === "rain" ? 1.1 + Math.random() * 1.5 : 3 + Math.random() * 7}s`;
    if (effect === "stars") particle.style.top = `${Math.random() * 100}%`;
    layer.append(particle);
  }
}

$("#loginBtn").onclick = () => openAuth("login");
$("#registerBtn").onclick = () => openAuth("register");
$$('[data-close-auth]').forEach(button => button.onclick = closeAuth);
$$('[data-auth-view]').forEach(button => button.onclick = () => setAuthView(button.dataset.authView));
$$('[data-close-editor]').forEach(button => button.onclick = closeEditor);
$$('[data-close-submit]').forEach(button => button.onclick = closeSubmit);

$("#loginForm").onsubmit = async event => {
  event.preventDefault();
  const username = $("#loginUsername").value.trim().toLowerCase();
  const passwordHash = await hash($("#loginPassword").value);
  const member = db.users.find(item => item.username.toLowerCase() === username && item.passwordHash === passwordHash);
  if (!member) return toast("Sai tên đăng nhập hoặc mật khẩu");
  session = { userId: member.id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  closeAuth();
  event.target.reset();
  activeChat = { type: "community", userId: null };
  location.hash = admin(member) ? "admin" : "home";
  await render();
  toast("Đăng nhập thành công");
};

$("#registerForm").onsubmit = async event => {
  event.preventDefault();
  if (!db.settings.registration) return toast("Hệ thống đang tắt đăng ký tài khoản");

  const username = $("#registerUsername").value.trim();
  const displayName = $("#registerDisplayName").value.trim();
  const email = $("#registerEmail").value.trim().toLowerCase();
  const password = $("#registerPassword").value;
  const confirmPassword = $("#registerPasswordConfirm").value;

  if (!validUsername(username)) return toast("Username chỉ gồm chữ, số, dấu gạch dưới và dài 3–24 ký tự");
  if (displayName.length < 2) return toast("Tên hiển thị cần ít nhất 2 ký tự");
  if (!validEmail(email)) return toast("Email không hợp lệ");
  if (password.length < 6) return toast("Mật khẩu cần ít nhất 6 ký tự");
  if (password !== confirmPassword) return toast("Mật khẩu nhập lại chưa khớp");
  if (db.users.some(member => member.username.toLowerCase() === username.toLowerCase())) return toast("Tên đăng nhập đã tồn tại");
  if (db.users.some(member => (member.email || "").toLowerCase() === email)) return toast("Email đã được sử dụng");

  const newUser = {
    id: nextId(db.users),
    username,
    email,
    passwordHash: await hash(password),
    displayName,
    role: "user",
    roles: [],
    nameColor: "",
    animatedName: false,
    rating: 0,
    ratingHistory: [{ value: 0, reason: "Khởi tạo tài khoản", createdAt: new Date().toISOString() }],
    orbs: 10,
    avatarKey: "",
    avatar: "",
    backgroundKey: "",
    backgroundData: "",
    backgroundPreset: "forge",
    overlay: .42,
    effect: "none",
    theme: "light",
    unlockedFrames: ["basic"],
    frame: "basic",
    bio: "",
    joined: new Date().toISOString()
  };

  db.users.push(newUser);
  addOrbLedger(newUser.id, 10, "Orb khởi tạo tài khoản");
  saveDB();
  session = { userId: newUser.id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  closeAuth();
  event.target.reset();
  location.hash = "profile";
  await render();
  toast("Đăng ký thành công · 0 rating · 10 Orb");
};

$("#userMenuBtn").onclick = () => {
  const dropdown = $("#userDropdown");
  dropdown.classList.toggle("hidden");
  $("#userMenuBtn").setAttribute("aria-expanded", String(!dropdown.classList.contains("hidden")));
};

$("#logoutBtn").onclick = () => {
  session = null;
  localStorage.removeItem(SESSION_KEY);
  $("#userDropdown").classList.add("hidden");
  activeChat = { type: "community", userId: null };
  location.hash = "home";
  render();
  toast("Đã đăng xuất");
};

$("#themeToggle").onclick = () => {
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  if (user()) {
    user().theme = nextTheme;
    saveDB();
  } else {
    localStorage.setItem("pfc_guest_theme", nextTheme);
  }
  render();
};

$("#mobileMenu").onclick = () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#mobileMenu").setAttribute("aria-expanded", String(open));
};

$("#chatFab").onclick = () => {
  if (!user()) openAuth("login");
  else {
    location.hash = "chat";
    render();
  }
};

window.addEventListener("hashchange", render);
window.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeAuth();
  closeEditor();
  closeSubmit();
  $("#userDropdown").classList.add("hidden");
});
window.addEventListener("click", event => {
  if (!event.target.closest(".user-menu")) $("#userDropdown").classList.add("hidden");
});
window.addEventListener("beforeunload", () => {
  mediaUrls.forEach(url => URL.revokeObjectURL(url));
});

$("#year").textContent = new Date().getFullYear();
saveDB();
render();
