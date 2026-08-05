"use strict";

/*
=========================================================
PHANTOM FORGE CORE OJ
Frontend V6

Tính năng:

- Chỉ admin mặc định
- Register user
- Login / Logout
- Community Chat
- Private Chat
- Online / Offline
- Unread badge
- Notification
- Settings
- Việt / English / 日本語
- Dark / Light
- Reduce Motion
- Emoji
- Attachment tên file
- Problems
- Contest
- Ranking
- Submission
- Admin

LƯU Ý:
Đây vẫn là FRONTEND DEMO.

localStorage:
- Dữ liệu chỉ nằm trên trình duyệt.

Muốn chat thật giữa nhiều máy:
- Backend
- Database
- WebSocket
- Authentication server
=========================================================
*/


/* =========================================================
   HELPERS
========================================================= */

const $ = (
  selector,
  root = document
) => root.querySelector(
  selector
);


const $$ = (
  selector,
  root = document
) => [
  ...root.querySelectorAll(
    selector
  )
];


/* =========================================================
   CONSTANTS
========================================================= */

const DB_KEY =
  "pfc_oj_database_v6";

const SESSION_KEY =
  "pfc_oj_session_v6";

const THEME_KEY =
  "pfc_oj_theme_v6";

const LANGUAGE_KEY =
  "pfc_oj_language_v6";

const MOTION_KEY =
  "pfc_oj_reduce_motion_v6";


const ALLOWED_LANGUAGES = [
  "HTML",
  "CSS",
  "JavaScript"
];


const ROLE_LABELS = {

  admin:
    "Quản trị viên",

  user:
    "Thành viên",

  muted:
    "Muted"

};


const RATING_TIERS = [

  {
    min: 0,
    max: 0,
    name: "Unrated",
    className: "rating-unrated"
  },

  {
    min: 1,
    max: 399,
    name: "Newbie",
    className: "rating-newbie"
  },

  {
    min: 400,
    max: 799,
    name: "Apprentice",
    className: "rating-apprentice"
  },

  {
    min: 800,
    max: 1199,
    name: "Specialist",
    className: "rating-specialist"
  },

  {
    min: 1200,
    max: 1599,
    name: "Expert",
    className: "rating-expert"
  },

  {
    min: 1600,
    max: 1999,
    name: "Master",
    className: "rating-master"
  },

  {
    min: 2000,
    max: 2399,
    name: "Grandmaster",
    className: "rating-grandmaster"
  },

  {
    min: 2400,
    max: Infinity,
    name: "Legend",
    className: "rating-legend"
  }

];


/* =========================================================
   TRANSLATION
========================================================= */

const TRANSLATIONS = {

  vi: {

    "nav.home":
      "Trang chủ",

    "nav.problems":
      "Bài tập",

    "nav.contests":
      "Kỳ thi",

    "nav.submissions":
      "Bài nộp",

    "nav.ranking":
      "Xếp hạng",

    "nav.users":
      "Thành viên",

    "nav.chat":
      "Chat",

    "auth.login":
      "Đăng nhập",

    "auth.register":
      "Đăng ký",

    "menu.profile":
      "Hồ sơ cá nhân",

    "menu.messages":
      "Tin nhắn",

    "menu.admin":
      "Quản trị",

    "menu.logout":
      "Đăng xuất",

    "footer.slogan":
      "Nơi ý tưởng được rèn thành thuật toán.",

    "notification.title":
      "Thông báo",

    "notification.markAll":
      "Đánh dấu đã đọc",

    "settings.title":
      "Cài đặt",

    "settings.language":
      "Ngôn ngữ",

    "settings.languageDesc":
      "Chọn ngôn ngữ hiển thị cho giao diện.",

    "settings.appearance":
      "Giao diện",

    "settings.darkMode":
      "Chế độ tối",

    "settings.reduceMotion":
      "Giảm hiệu ứng chuyển động",

    "settings.chat":
      "Chat",

    "settings.chatDesc":
      "Bạn có thể bật thông báo và mở nhanh phòng chat từ biểu tượng 💬."

  },


  en: {

    "nav.home":
      "Home",

    "nav.problems":
      "Problems",

    "nav.contests":
      "Contests",

    "nav.submissions":
      "Submissions",

    "nav.ranking":
      "Ranking",

    "nav.users":
      "Users",

    "nav.chat":
      "Chat",

    "auth.login":
      "Login",

    "auth.register":
      "Register",

    "menu.profile":
      "Profile",

    "menu.messages":
      "Messages",

    "menu.admin":
      "Admin",

    "menu.logout":
      "Logout",

    "footer.slogan":
      "Where ideas are forged into algorithms.",

    "notification.title":
      "Notifications",

    "notification.markAll":
      "Mark all as read",

    "settings.title":
      "Settings",

    "settings.language":
      "Language",

    "settings.languageDesc":
      "Choose the display language for the interface.",

    "settings.appearance":
      "Appearance",

    "settings.darkMode":
      "Dark mode",

    "settings.reduceMotion":
      "Reduce motion",

    "settings.chat":
      "Chat",

    "settings.chatDesc":
      "Use the 💬 icon to quickly open chat."

  },


  ja: {

    "nav.home":
      "ホーム",

    "nav.problems":
      "問題",

    "nav.contests":
      "コンテスト",

    "nav.submissions":
      "提出",

    "nav.ranking":
      "ランキング",

    "nav.users":
      "メンバー",

    "nav.chat":
      "チャット",

    "auth.login":
      "ログイン",

    "auth.register":
      "登録",

    "menu.profile":
      "プロフィール",

    "menu.messages":
      "メッセージ",

    "menu.admin":
      "管理",

    "menu.logout":
      "ログアウト",

    "footer.slogan":
      "アイデアをアルゴリズムへ鍛える場所。",

    "notification.title":
      "通知",

    "notification.markAll":
      "すべて既読",

    "settings.title":
      "設定",

    "settings.language":
      "言語",

    "settings.languageDesc":
      "インターフェースの表示言語を選択します。",

    "settings.appearance":
      "外観",

    "settings.darkMode":
      "ダークモード",

    "settings.reduceMotion":
      "アニメーションを減らす",

    "settings.chat":
      "チャット",

    "settings.chatDesc":
      "💬 アイコンからチャットをすばやく開けます。"

  }

};


/* =========================================================
   INITIAL DATABASE
   CHỈ ADMIN
========================================================= */

const initialDB = {

  settings: {

    siteName:
      "Phantom Forge Core OJ",

    slogan:
      "Nơi ý tưởng được rèn thành thuật toán."

  },


  users: [

    {

      id:
        1,

      username:
        "admin",

      displayName:
        "Administrator",

      email:
        "admin@phantomforge.local",

      passwordDemo:
        "admin123",

      passwordHash:
        "",

      role:
        "admin",

      rating:
        2400,

      orbs:
        -1,

      bio:
        "Quản trị viên hệ thống Phantom Forge Core OJ.",

      avatar:
        "",

      joined:
        new Date().toISOString(),

      lastSeen:
        new Date().toISOString()

    }

  ],


  problems: [

    {

      id:
        101,

      code:
        "PFC001",

      title:
        "Hello Forge",

      difficulty:
        "Dễ",

      difficultyKey:
        "easy",

      points:
        100,

      statement:
        "Viết chương trình hiển thị dòng chữ Hello, Phantom Forge!",

      languages:
        [
          ...ALLOWED_LANGUAGES
        ]

    },

    {

      id:
        102,

      code:
        "PFC002",

      title:
        "Profile Card",

      difficulty:
        "Trung bình",

      difficultyKey:
        "medium",

      points:
        250,

      statement:
        "Tạo một thẻ hồ sơ có tên, mô tả và nút tương tác.",

      languages:
        [
          ...ALLOWED_LANGUAGES
        ]

    },

    {

      id:
        103,

      code:
        "PFC003",

      title:
        "Dynamic Ranking",

      difficulty:
        "Khó",

      difficultyKey:
        "hard",

      points:
        500,

      statement:
        "Tạo bảng xếp hạng và sắp xếp dữ liệu bằng JavaScript.",

      languages:
        [
          ...ALLOWED_LANGUAGES
        ]

    }

  ],


  contests: [

    {

      id:
        201,

      title:
        "Forge Rookie Cup",

      description:
        "Kỳ thi làm quen dành cho thành viên mới.",

      startAt:
        new Date(
          Date.now()
          +
          86400000 * 3
        ).toISOString(),

      duration:
        120,

      rated:
        true

    },

    {

      id:
        202,

      title:
        "Phantom Practice",

      description:
        "Vòng luyện tập không ảnh hưởng rating.",

      startAt:
        new Date(
          Date.now()
          +
          86400000 * 7
        ).toISOString(),

      duration:
        180,

      rated:
        false

    }

  ],


  submissions:
    [],


  messages: [

    {

      id:
        50001,

      channel:
        "community",

      fromUserId:
        1,

      toUserId:
        null,

      text:
        "Chào mừng đến với Forge Chat! Hãy đăng ký để bắt đầu trò chuyện.",

      createdAt:
        new Date().toISOString(),

      readBy:
        [1]

    }

  ],


  notifications: [

    {

      id:
        90001,

      title:
        "Chào mừng đến Phantom Forge Core",

      body:
        "Tài khoản mặc định duy nhất là admin. Bạn có thể đăng ký tài khoản mới khi sẵn sàng.",

      type:
        "system",

      createdAt:
        new Date().toISOString(),

      readBy:
        []

    }

  ]

};


/* =========================================================
   STATE
========================================================= */

let db =
  loadDB();


let session =
  loadSession();


let currentRoute =
  getRoute();


let currentChat = {

  type:
    "community",

  userId:
    null

};


let chatSearch =
  "";


let userSearch =
  "";


let problemsSearch =
  "";


let language =
  localStorage.getItem(
    LANGUAGE_KEY
  )
  ||
  "vi";


let broadcastChannel =
  null;


/* =========================================================
   DATABASE
========================================================= */

function clone(
  value
) {

  return JSON.parse(
    JSON.stringify(
      value
    )
  );

}


function normalizeUser(
  user
) {

  return {

    id:
      user.id ??
      Date.now() +
      Math.random(),

    username:
      String(
        user.username ||
        "user"
      ),

    displayName:
      String(
        user.displayName ||
        user.username ||
        "User"
      ),

    email:
      String(
        user.email ||
        ""
      ),

    passwordDemo:
      String(
        user.passwordDemo ||
        ""
      ),

    passwordHash:
      String(
        user.passwordHash ||
        ""
      ),

    role:
      user.role ||
      "user",

    rating:
      Math.max(
        0,
        Number(
          user.rating ||
          0
        )
      ),

    orbs:
      user.orbs ===
      -1

        ? -1

        : Math.max(
            0,
            Number(
              user.orbs ??
              10
            )
          ),

    bio:
      String(
        user.bio ||
        ""
      ),

    avatar:
      String(
        user.avatar ||
        ""
      ),

    joined:
      user.joined
      ||
      new Date()
        .toISOString(),

    lastSeen:
      user.lastSeen
      ||
      new Date()
        .toISOString()

  };

}


function normalizeDB(
  data
) {

  const result = {

    ...clone(
      initialDB
    ),

    ...data

  };


  result.users =

    Array.isArray(
      data.users
    )

      ? data.users.map(
          normalizeUser
        )

      : clone(
          initialDB.users
        );


  result.problems =

    Array.isArray(
      data.problems
    )

      ? data.problems

      : clone(
          initialDB.problems
        );


  result.contests =

    Array.isArray(
      data.contests
    )

      ? data.contests

      : clone(
          initialDB.contests
        );


  result.submissions =

    Array.isArray(
      data.submissions
    )

      ? data.submissions

      : [];


  result.messages =

    Array.isArray(
      data.messages
    )

      ? data.messages

      : [];


  result.notifications =

    Array.isArray(
      data.notifications
    )

      ? data.notifications

      : clone(
          initialDB.notifications
        );


  return result;

}


function loadDB() {

  try {

    const raw =
      localStorage.getItem(
        DB_KEY
      );


    if (
      !raw
    ) {

      const fresh =
        clone(
          initialDB
        );


      localStorage.setItem(
        DB_KEY,
        JSON.stringify(
          fresh
        )
      );


      return fresh;

    }


    return normalizeDB(
      JSON.parse(
        raw
      )
    );

  } catch (
    error
  ) {

    console.error(
      "Load DB error:",
      error
    );


    return clone(
      initialDB
    );

  }

}


function saveDB() {

  try {

    localStorage.setItem(
      DB_KEY,
      JSON.stringify(
        db
      )
    );


    broadcast(
      {
        type:
          "database-updated"
      }
    );


    updateBadges();

  } catch (
    error
  ) {

    console.error(
      error
    );


    toast(
      "Không thể lưu dữ liệu."
    );

  }

}


/* =========================================================
   SESSION
========================================================= */

function loadSession() {

  try {

    const raw =
      localStorage.getItem(
        SESSION_KEY
      );


    return raw

      ? JSON.parse(
          raw
        )

      : null;

  } catch {

    return null;

  }

}


function saveSession() {

  if (
    !session
  ) {

    localStorage.removeItem(
      SESSION_KEY
    );

    return;

  }


  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(
      session
    )
  );

}


/* =========================================================
   USER
========================================================= */

function currentUser() {

  if (
    !session
  ) {

    return null;

  }


  return (

    db.users.find(
      user =>
        user.id ===
        session.userId
    )

    ||

    null

  );

}


function getUser(
  id
) {

  return (

    db.users.find(
      user =>
        user.id ===
        id
    )

    ||

    null

  );

}


function isAdmin() {

  return (

    currentUser()
      ?.role

    ===

    "admin"

  );

}


function isOnline(
  user
) {

  if (
    !user?.lastSeen
  ) {

    return false;

  }


  return (

    Date.now()

    -

    new Date(
      user.lastSeen
    ).getTime()

  )

  <

  90000;

}


function getTier(
  rating
) {

  return (

    RATING_TIERS.find(
      tier =>

        rating >=
        tier.min

        &&

        rating <=
        tier.max

    )

    ||

    RATING_TIERS[0]

  );

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ??
    ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


function avatarHTML(
  user,
  size = "small"
) {

  if (
    !user
  ) {

    return `

      <span class="
        avatar
        ${size}
      ">
        ?
      </span>

    `;

  }


  const initials =

    user.displayName

      .split(
        /\s+/
      )

      .filter(
        Boolean
      )

      .map(
        word =>
          word[0]
      )

      .join(
        ""
      )

      .slice(
        0,
        2
      )

      .toUpperCase();


  if (
    user.avatar
  ) {

    return `

      <span class="
        avatar
        ${size}
      ">

        <img
          src="${escapeHTML(
            user.avatar
          )}"
          alt="${escapeHTML(
            user.displayName
          )}"
        >

      </span>

    `;

  }


  return `

    <span class="
      avatar
      ${size}
    ">

      ${escapeHTML(
        initials
      )}

    </span>

  `;

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
  value
) {

  try {

    const locale =

      language ===
      "ja"

        ? "ja-JP"

        : language ===
          "en"

          ? "en-US"

          : "vi-VN";


    return new Intl
      .DateTimeFormat(
        locale,
        {
          dateStyle:
            "short",

          timeStyle:
            "short"
        }
      )

      .format(
        new Date(
          value
        )
      );

  } catch {

    return "";

  }

}


function formatTime(
  value
) {

  try {

    const locale =

      language ===
      "ja"

        ? "ja-JP"

        : language ===
          "en"

          ? "en-US"

          : "vi-VN";


    return new Intl
      .DateTimeFormat(
        locale,
        {
          hour:
            "2-digit",

          minute:
            "2-digit"
        }
      )

      .format(
        new Date(
          value
        )
      );

  } catch {

    return "";

  }

}


/* =========================================================
   ROUTING
========================================================= */

function getRoute() {

  return (

    location.hash

      .replace(
        "#",
        ""
      )

      .trim()

    ||

    "home"

  );

}


function goTo(
  route
) {

  location.hash =
    route;

}


/* =========================================================
   TRANSLATION
========================================================= */

function t(
  key
) {

  return (

    TRANSLATIONS[language]
      ?.
      [key]

    ||

    TRANSLATIONS.vi
      ?.
      [key]

    ||

    key

  );

}


function applyLanguage() {

  document.documentElement.lang =

    language ===
    "vi"

      ? "vi"

      : language ===
        "en"

        ? "en"

        : "ja";


  $$(
    "[data-i18n]"
  )

  .forEach(
    node => {

      const value =
        t(
          node.dataset.i18n
        );


      if (
        value
      ) {

        node.textContent =
          value;

      }

    }
  );


  $$(".language-button")
    .forEach(
      button => {

        button.classList.toggle(

          "active",

          button.dataset.language ===
          language

        );

      }
    );

}


function setLanguage(
  nextLanguage
) {

  if (
    !TRANSLATIONS[
      nextLanguage
    ]
  ) {

    return;

  }


  language =
    nextLanguage;


  localStorage.setItem(
    LANGUAGE_KEY,
    language
  );


  applyLanguage();

  render();


  toast(

    language ===
    "vi"

      ? "Đã chuyển sang Tiếng Việt."

      : language ===
        "en"

        ? "Language changed to English."

        : "日本語に変更しました。"

  );

}


/* =========================================================
   TOAST
========================================================= */

function toast(
  message
) {

  const container =
    $(
      "#toastContainer"
    );


  if (
    !container
  ) {

    return;

  }


  const item =
    document.createElement(
      "div"
    );


  item.className =
    "toast";


  item.textContent =
    message;


  container.appendChild(
    item
  );


  setTimeout(
    () => {

      item.remove();

    },

    3200

  );

}


/* =========================================================
   BROADCAST
========================================================= */

function setupBroadcast() {

  if (
    "BroadcastChannel"
    in window
  ) {

    broadcastChannel =

      new BroadcastChannel(
        "pfc-oj-v6-channel"
      );


    broadcastChannel.onmessage =

      event => {

        if (

          event.data
            ?.type

          ===

          "database-updated"

        ) {

          db =
            loadDB();


          render();


          updateBadges();

        }

      };

  }


  window.addEventListener(
    "storage",
    event => {

      if (
        event.key ===
        DB_KEY
      ) {

        db =
          loadDB();

        render();

        updateBadges();

      }


      if (
        event.key ===
        SESSION_KEY
      ) {

        session =
          loadSession();

        render();

        updateBadges();

      }

    }
  );

}


function broadcast(
  message
) {

  try {

    broadcastChannel
      ?.
      postMessage(
        message
      );

  } catch {

    // ignore

  }

}


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

  const saved =

    localStorage.getItem(
      THEME_KEY
    )

    ||

    "dark";


  document.body
    .classList
    .toggle(
      "light",
      saved ===
      "light"
    );


  const switcher =
    $(
      "#darkModeSwitch"
    );


  if (
    switcher
  ) {

    switcher.checked =
      saved ===
      "dark";

  }


  updateThemeButton();

}


function toggleTheme() {

  const isLight =

    document.body
      .classList
      .contains(
        "light"
      );


  const next =

    isLight

      ? "dark"

      : "light";


  document.body
    .classList
    .toggle(
      "light",
      next ===
      "light"
    );


  localStorage.setItem(
    THEME_KEY,
    next
  );


  const switcher =
    $(
      "#darkModeSwitch"
    );


  if (
    switcher
  ) {

    switcher.checked =
      next ===
      "dark";

  }


  updateThemeButton();

}


function updateThemeButton() {

  const button =
    $(
      "#themeToggle"
    );


  if (
    !button
  ) {

    return;

  }


  button.textContent =

    document.body
      .classList
      .contains(
        "light"
      )

      ? "🌙"

      : "☀️";

}


/* =========================================================
   MOTION
========================================================= */

function applyMotionSetting() {

  const reduceMotion =

    localStorage.getItem(
      MOTION_KEY
    )

    ===

    "1";


  document.body
    .classList
    .toggle(
      "reduce-motion",
      reduceMotion
    );


  const input =
    $(
      "#reduceMotionSwitch"
    );


  if (
    input
  ) {

    input.checked =
      reduceMotion;

  }

}


/* =========================================================
   PRESENCE
========================================================= */

function updatePresence() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return;

  }


  me.lastSeen =
    new Date()
      .toISOString();


  saveDB();

}


/* =========================================================
   AUTH
========================================================= */

async function hashText(
  text
) {

  if (
    window.crypto
      ?.
      subtle
  ) {

    const bytes =
      new TextEncoder()
        .encode(
          text
        );


    const digest =
      await crypto.subtle
        .digest(
          "SHA-256",
          bytes
        );


    return [

      ...

      new Uint8Array(
        digest
      )

    ]

      .map(
        byte =>

          byte
            .toString(
              16
            )

            .padStart(
              2,
              "0"
            )
      )

      .join(
        ""
      );

  }


  return text;

}


function openAuth(
  mode = "login"
) {

  $(
    "#authModal"
  )
    .classList
    .remove(
      "hidden"
    );


  switchAuth(
    mode
  );

}


function closeModal(
  id
) {

  $(
    `#${id}`
  )
    ?.
    classList
    .add(
      "hidden"
    );

}


function switchAuth(
  mode
) {

  $$(".auth-tab")
    .forEach(
      button => {

        button.classList.toggle(

          "active",

          button.dataset.authTab ===
          mode

        );

      }
    );


  $(
    "#loginForm"
  )

    .classList
    .toggle(
      "hidden",
      mode !==
      "login"
    );


  $(
    "#registerForm"
  )

    .classList
    .toggle(
      "hidden",
      mode !==
      "register"
    );


  $(
    "#authTitle"
  ).textContent =

    mode ===
    "login"

      ? "Đăng nhập"

      : "Tạo tài khoản";


  $(
    "#authDescription"
  ).textContent =

    mode ===
    "login"

      ? "Chào mừng bạn quay trở lại."

      : "Tham gia cộng đồng Phantom Forge.";

}


async function doLogin(
  username,
  password
) {

  const normalized =

    username
      .trim()
      .toLowerCase();


  const found =

    db.users.find(

      user =>

        user.username
          .toLowerCase()

        ===

        normalized

    );


  if (
    !found
  ) {

    throw new Error(
      "Tên đăng nhập không tồn tại."
    );

  }


  const hash =
    await hashText(
      password
    );


  const valid =

    (

      found.passwordDemo

      &&

      found.passwordDemo ===
      password

    )

    ||

    (

      found.passwordHash

      &&

      found.passwordHash ===
      hash

    );


  if (
    !valid
  ) {

    throw new Error(
      "Mật khẩu không chính xác."
    );

  }


  found.lastSeen =
    new Date()
      .toISOString();


  session = {

    userId:
      found.id

  };


  saveSession();

  saveDB();

  closeModal(
    "authModal"
  );


  toast(
    `Chào mừng ${found.displayName}!`
  );


  render();

}


async function doRegister(

  username,

  displayName,

  email,

  password,

  confirm

) {

  username =

    username
      .trim()
      .toLowerCase();


  displayName =

    displayName
      .trim();


  email =

    email
      .trim();


  if (
    password !==
    confirm
  ) {

    throw new Error(
      "Mật khẩu nhập lại không khớp."
    );

  }


  if (

    db.users.some(

      user =>

        user.username
          .toLowerCase()

        ===

        username

    )

  ) {

    throw new Error(
      "Username này đã tồn tại."
    );

  }


  const passwordHash =

    await hashText(
      password
    );


  const newUser = {

    id:
      Date.now(),

    username,

    displayName,

    email,

    passwordDemo:
      "",

    passwordHash,

    role:
      "user",

    rating:
      0,

    orbs:
      10,

    bio:
      "Thành viên mới của Phantom Forge OJ.",

    avatar:
      "",

    joined:
      new Date()
        .toISOString(),

    lastSeen:
      new Date()
        .toISOString()

  };


  db.users.push(
    newUser
  );


  db.notifications.unshift({

    id:
      Date.now()
      +
      100,

    title:
      "Tài khoản mới đã được tạo",

    body:
      `Chào mừng ${newUser.displayName} đến với Phantom Forge Core OJ.`,

    type:
      "system",

    createdAt:
      new Date()
        .toISOString(),

    readBy:
      []

  });


  session = {

    userId:
      newUser.id

  };


  saveSession();

  saveDB();

  closeModal(
    "authModal"
  );


  toast(
    "Tạo tài khoản thành công!"
  );


  render();

}


function logout() {

  const me =
    currentUser();


  if (
    me
  ) {

    me.lastSeen =

      new Date(
        Date.now()
        -
        999999
      )

      .toISOString();


    saveDB();

  }


  session =
    null;


  saveSession();


  currentChat = {

    type:
      "community",

    userId:
      null

  };


  goTo(
    "home"
  );


  toast(
    "Bạn đã đăng xuất."
  );

}


/* =========================================================
   BADGES
========================================================= */

function unreadChatCount() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return 0;

  }


  return db.messages.filter(

    message => {

      if (

        message.fromUserId ===
        me.id

      ) {

        return false;

      }


      if (

        message.channel ===
        "community"

      ) {

        return !(

          message.readBy

          ||

          []

        )

        .includes(
          me.id
        );

      }


      if (

        message.channel ===
        "direct"

      ) {

        return (

          message.toUserId ===
          me.id

        )

        &&

        !(

          message.readBy

          ||

          []

        )

        .includes(
          me.id
        );

      }


      return false;

    }

  ).length;

}


function unreadNotificationCount() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return 0;

  }


  return db.notifications.filter(

    notification =>

      !(

        notification.readBy

        ||

        []

      )

      .includes(
        me.id
      )

  ).length;

}


function updateBadges() {

  const chatCount =
    unreadChatCount();


  const notificationCount =
    unreadNotificationCount();


  const chatNodes = [

    $(
      "#chatBadge"
    ),

    $(
      "#chatFabBadge"
    )

  ];


  chatNodes.forEach(
    node => {

      if (
        !node
      ) {

        return;

      }


      node.textContent =

        chatCount >
        99

          ? "99+"

          : String(
              chatCount
            );


      node.classList.toggle(

        "hidden",

        chatCount ===
        0

      );

    }
  );


  const notificationBadge =
    $(
      "#notificationBadge"
    );


  if (
    notificationBadge
  ) {

    notificationBadge.textContent =

      notificationCount >
      99

        ? "99+"

        : String(
            notificationCount
          );


    notificationBadge.classList.toggle(

      "hidden",

      notificationCount ===
      0

    );

  }

}


/* =========================================================
   HEADER
========================================================= */

function renderHeader() {

  const me =
    currentUser();


  const loginBtn =
    $(
      "#loginBtn"
    );


  const registerBtn =
    $(
      "#registerBtn"
    );


  const accountMenu =
    $(
      "#accountMenu"
    );


  const wallet =
    $(
      "#orbWallet"
    );


  if (
    !me
  ) {

    loginBtn
      ?.
      classList
      .remove(
        "hidden"
      );


    registerBtn
      ?.
      classList
      .remove(
        "hidden"
      );


    accountMenu
      ?.
      classList
      .add(
        "hidden"
      );


    wallet
      ?.
      classList
      .add(
        "hidden"
      );


    return;

  }


  loginBtn
    ?.
    classList
    .add(
      "hidden"
    );


  registerBtn
    ?.
    classList
    .add(
      "hidden"
    );


  accountMenu
    ?.
    classList
    .remove(
      "hidden"
    );


  wallet
    ?.
    classList
    .remove(
      "hidden"
    );


  $(
    "#headerAvatar"
  )

    .innerHTML =

      avatarHTML(
        me,
        "small"
      );


  $(
    "#headerUsername"
  )

    .textContent =

      me.displayName;


  $(
    "#headerRole"
  )

    .textContent =

      ROLE_LABELS[
        me.role
      ]

      ||

      me.role;


  $(
    "#orbAmount"
  )

    .textContent =

      me.orbs ===
      -1

        ? "∞"

        : me.orbs;


  $(
    "#adminDashboardBtn"
  )
    ?.
    classList
    .toggle(
      "hidden",
      !isAdmin()
    );

}


/* =========================================================
   DRAWER
========================================================= */

function openDrawer(
  id
) {

  $$(
    ".side-drawer"
  )

  .forEach(
    drawer =>

      drawer.classList.add(
        "hidden"
      )

  );


  $(
    "#drawerBackdrop"
  )

    .classList
    .remove(
      "hidden"
    );


  $(
    `#${id}`
  )

    .classList
    .remove(
      "hidden"
    );

}


function closeDrawers() {

  $$(
    ".side-drawer"
  )

  .forEach(
    drawer =>

      drawer.classList.add(
        "hidden"
      )

  );


  $(
    "#drawerBackdrop"
  )

    .classList
    .add(
      "hidden"
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function renderNotifications() {

  const me =
    currentUser();


  const list =
    $(
      "#notificationList"
    );


  if (
    !list
  ) {

    return;

  }


  if (
    !me
  ) {

    list.innerHTML = `

      <div class="
        empty-state
      ">

        <div>

          <strong>
            Đăng nhập để xem thông báo
          </strong>

          Thông báo cá nhân sẽ xuất hiện ở đây.

        </div>

      </div>

    `;

    return;

  }


  if (
    !db.notifications.length
  ) {

    list.innerHTML = `

      <div class="
        empty-state
      ">

        <div>

          <strong>
            Chưa có thông báo
          </strong>

          Mọi cập nhật mới sẽ hiển thị tại đây.

        </div>

      </div>

    `;

    return;

  }


  list.innerHTML =

    db.notifications

      .slice()

      .sort(

        (
          a,
          b
        ) =>

          new Date(
            b.createdAt
          )

          -

          new Date(
            a.createdAt
          )

      )

      .map(

        notification => {

          const unread =

            !(

              notification.readBy

              ||

              []

            )

            .includes(
              me.id
            );


          return `

            <article
              class="
                notification-item
                ${
                  unread
                    ? "unread"
                    : ""
                }
              "
              data-notification-id="${
                notification.id
              }"
            >

              <strong>

                ${
                  escapeHTML(
                    notification.title
                  )
                }

              </strong>


              <p>

                ${
                  escapeHTML(
                    notification.body
                  )
                }

              </p>


              <small>

                ${
                  formatDate(
                    notification.createdAt
                  )
                }

              </small>

            </article>

          `;

        }

      )

      .join(
        ""
      );

}


function markAllNotificationsRead() {

  const me =
    currentUser();


  if (
    !me
  ) {

    openAuth(
      "login"
    );

    return;

  }


  db.notifications
    .forEach(
      notification => {

        if (
          !Array.isArray(
            notification.readBy
          )
        ) {

          notification.readBy =
            [];

        }


        if (

          !notification.readBy
            .includes(
              me.id
            )

        ) {

          notification.readBy
            .push(
              me.id
            );

        }

      }
    );


  saveDB();

  renderNotifications();

  updateBadges();

}


function markNotificationRead(
  id
) {

  const me =
    currentUser();


  if (
    !me
  ) {

    return;

  }


  const notification =

    db.notifications.find(

      item =>
        item.id ===
        id

    );


  if (
    !notification
  ) {

    return;

  }


  if (
    !Array.isArray(
      notification.readBy
    )
  ) {

    notification.readBy =
      [];

  }


  if (

    !notification.readBy
      .includes(
        me.id
      )

  ) {

    notification.readBy
      .push(
        me.id
      );

  }


  saveDB();

  renderNotifications();

  updateBadges();

}


/* =========================================================
   CHAT
========================================================= */

function getCurrentMessages() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return [];

  }


  if (

    currentChat.type ===
    "community"

  ) {

    return db.messages

      .filter(

        message =>

          message.channel ===
          "community"

      )

      .sort(

        (
          a,
          b
        ) =>

          new Date(
            a.createdAt
          )

          -

          new Date(
            b.createdAt
          )

      );

  }


  return db.messages

    .filter(

      message =>

        message.channel ===
        "direct"

        &&

        (

          (

            message.fromUserId ===
            me.id

            &&

            message.toUserId ===
            currentChat.userId

          )

          ||

          (

            message.fromUserId ===
            currentChat.userId

            &&

            message.toUserId ===
            me.id

          )

        )

    )

    .sort(

      (
        a,
        b
      ) =>

        new Date(
          a.createdAt
        )

        -

        new Date(
          b.createdAt
        )

    );

}


function markCurrentChatRead() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return;

  }


  getCurrentMessages()
    .forEach(
      message => {

        if (
          !Array.isArray(
            message.readBy
          )
        ) {

          message.readBy =
            [];

        }


        if (

          !message.readBy
            .includes(
              me.id
            )

        ) {

          message.readBy.push(
            me.id
          );

        }

      }
    );


  saveDB();

}


function unreadCountForUser(
  userId
) {

  const me =
    currentUser();


  if (
    !me
  ) {

    return 0;

  }


  return db.messages.filter(

    message =>

      message.channel ===
      "direct"

      &&

      message.fromUserId ===
      userId

      &&

      message.toUserId ===
      me.id

      &&

      !(

        message.readBy

        ||

        []

      )

      .includes(
        me.id
      )

  ).length;

}


function openCommunityChat() {

  currentChat = {

    type:
      "community",

    userId:
      null

  };


  goTo(
    "chat"
  );

}


function openPrivateChat(
  userId
) {

  if (
    !currentUser()
  ) {

    openAuth(
      "login"
    );

    return;

  }


  if (
    !getUser(
      userId
    )
  ) {

    return;

  }


  currentChat = {

    type:
      "direct",

    userId

  };


  markCurrentChatRead();

  goTo(
    "chat"
  );

}


function sendMessage(
  text
) {

  const me =
    currentUser();


  if (
    !me
  ) {

    openAuth(
      "login"
    );

    return;

  }


  if (
    me.role ===
    "muted"
  ) {

    toast(
      "Tài khoản của bạn đang bị hạn chế chat."
    );

    return;

  }


  const clean =
    text.trim();


  if (
    !clean
  ) {

    return;

  }


  if (

    currentChat.type ===
    "direct"

    &&

    !getUser(
      currentChat.userId
    )

  ) {

    toast(
      "User không tồn tại."
    );

    return;

  }


  db.messages.push({

    id:
      Date.now() +
      Math.random(),

    channel:
      currentChat.type,

    fromUserId:
      me.id,

    toUserId:

      currentChat.type ===
      "direct"

        ? currentChat.userId

        : null,

    text:
      clean,

    createdAt:
      new Date()
        .toISOString(),

    readBy:
      [
        me.id
      ]

  });


  if (

    currentChat.type ===
    "direct"

  ) {

    db.notifications.unshift({

      id:
        Date.now()
        +
        200,

      title:
        `Tin nhắn mới từ ${me.displayName}`,

      body:
        clean.length > 80

          ? clean.slice(
              0,
              80
            )
            +
            "…"

          : clean,

      type:
        "message",

      createdAt:
        new Date()
          .toISOString(),

      readBy:
        [
          me.id
        ]

    });

  }


  saveDB();

  render();

}


function insertEmoji(
  emoji
) {

  const input =
    $(
      "#chatMessageInput"
    );


  if (
    !input
  ) {

    return;

  }


  const start =
    input.selectionStart
    ??
    input.value.length;


  const end =
    input.selectionEnd
    ??
    input.value.length;


  input.value =

    input.value.slice(
      0,
      start
    )

    +

    emoji

    +

    input.value.slice(
      end
    );


  input.focus();


  input.selectionStart =

    input.selectionEnd =

      start +
      emoji.length;

}


/* =========================================================
   AUTH / HEADER
========================================================= */

function openLogin() {

  openAuth(
    "login"
  );

}


/* =========================================================
   RENDER HOME
========================================================= */

function renderHome() {

  return `

    <section class="
      hero
      container
    ">

      <div>

        <span class="
          eyebrow
        ">
          ONLINE JUDGE PLATFORM
        </span>


        <h1>

          Code.

          <span class="
            gradient-text
          ">
            Compete.
          </span>

          Forge.

        </h1>


        <p class="
          hero-description
        ">

          Phantom Forge Core OJ là nơi luyện thuật toán,
          tham gia coding contest, theo dõi rating
          và kết nối với cộng đồng lập trình viên.

        </p>


        <div class="
          hero-actions
        ">

          <button
            class="
              btn
              btn-primary
            "
            data-route="problems"
          >
            🚀 Bắt đầu giải bài
          </button>


          <button
            class="
              btn
              btn-ghost
            "
            data-route="chat"
          >
            💬 Vào Forge Chat
          </button>

        </div>

      </div>


      <div class="
        hero-panel
      ">

        <img
          src="logo.png"
          class="hero-logo"
          alt="Phantom Forge Core OJ"
        >

      </div>

    </section>


    <section class="
      container
      page
    ">

      <div class="
        grid
        grid-4
      ">

        <div class="
          card
          stat-card
        ">

          <span class="
            stat-label
          ">
            Thành viên
          </span>

          <div class="
            stat-value
          ">
            ${
              db.users.length
            }
          </div>

        </div>


        <div class="
          card
          stat-card
        ">

          <span class="
            stat-label
          ">
            Bài tập
          </span>

          <div class="
            stat-value
          ">
            ${
              db.problems.length
            }
          </div>

        </div>


        <div class="
          card
          stat-card
        ">

          <span class="
            stat-label
          ">
            Bài nộp
          </span>

          <div class="
            stat-value
          ">
            ${
              db.submissions.length
            }
          </div>

        </div>


        <div class="
          card
          stat-card
        ">

          <span class="
            stat-label
          ">
            Đang Online
          </span>

          <div class="
            stat-value
          ">
            ${
              db.users.filter(
                isOnline
              ).length
            }
          </div>

        </div>

      </div>


      <div style="
        height:22px;
      "></div>


      <div class="
        grid
        grid-3
      ">


        <div class="
          card
        ">

          <h3>
            🧠 Luyện thuật toán
          </h3>

          <p class="
            muted
          ">
            Giải bài từ dễ đến khó và nâng rating.
          </p>

          <button
            class="
              btn
              btn-ghost
            "
            data-route="problems"
          >
            Xem bài tập
          </button>

        </div>


        <div class="
          card
        ">

          <h3>
            🏆 Coding Contest
          </h3>

          <p class="
            muted
          ">
            Tham gia kỳ thi và cạnh tranh trên bảng xếp hạng.
          </p>

          <button
            class="
              btn
              btn-ghost
            "
            data-route="contests"
          >
            Xem kỳ thi
          </button>

        </div>


        <div class="
          card
        ">

          <h3>
            💬 Cộng đồng
          </h3>

          <p class="
            muted
          ">
            Tìm user khác, chat cộng đồng và nhắn tin riêng.
          </p>

          <button
            class="
              btn
              btn-ghost
            "
            data-route="chat"
          >
            Mở Chat
          </button>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   PROBLEMS
========================================================= */

function renderProblems() {

  const problems =
    db.problems.filter(

      problem => {

        if (
          !problemsSearch
        ) {

          return true;

        }


        const q =
          problemsSearch
            .toLowerCase();


        return (

          problem.code
            .toLowerCase()
            .includes(
              q
            )

          ||

          problem.title
            .toLowerCase()
            .includes(
              q
            )

        );

      }

    );


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        PROBLEM SET
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Bài tập
      </h1>


      <p class="
        page-subtitle
      ">
        Chọn bài, viết code và submit.
      </p>


      <div
        class="
          search-box
        "
        style="
          max-width:520px;
          margin-bottom:22px;
        "
      >

        <input
          id="problemsSearchInput"
          value="${
            escapeHTML(
              problemsSearch
            )
          }"
          placeholder="Tìm code hoặc tên bài..."
        >

      </div>


      <div class="
        grid
        grid-3
      ">

        ${
          problems.length

            ?

              problems.map(

                problem => `

                  <article class="
                    card
                  ">

                    <div class="
                      section-header
                    ">

                      <div>

                        <div
                          class="
                            mono
                          "
                          style="
                            color:var(--blue);
                            font-size:11px;
                          "
                        >
                          ${
                            escapeHTML(
                              problem.code
                            )
                          }
                        </div>


                        <h3>

                          ${
                            escapeHTML(
                              problem.title
                            )
                          }

                        </h3>

                      </div>


                      <span class="
                        badge
                        ${
                          problem.difficultyKey
                        }
                      ">

                        ${
                          problem.difficulty
                        }

                      </span>

                    </div>


                    <p class="
                      muted
                    ">

                      ${
                        escapeHTML(
                          problem.statement
                        )
                      }

                    </p>


                    <div style="
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      gap:10px;
                      margin-top:18px;
                    ">

                      <span class="
                        muted
                      ">

                        ${
                          problem.points
                        }
                        điểm

                      </span>


                      <button
                        class="
                          btn
                          btn-primary
                          btn-sm
                        "
                        data-open-submit="${
                          problem.id
                        }"
                      >
                        Nộp bài
                      </button>

                    </div>

                  </article>

                `

              )
              .join(
                ""
              )

            :

              `

                <div class="
                  card
                  empty-state
                ">

                  <div>

                    <strong>
                      Không tìm thấy
                    </strong>

                    Thử từ khóa khác.

                  </div>

                </div>

              `

        }

      </div>

    </section>

  `;

}


/* =========================================================
   CONTEST
========================================================= */

function renderContests() {

  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        CONTEST CENTER
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Kỳ thi
      </h1>


      <p class="
        page-subtitle
      ">
        Tham gia các contest và luyện tập.
      </p>


      <div class="
        grid
        grid-2
      ">

        ${
          db.contests.map(

            contest => `

              <article class="
                card
              ">

                <div class="
                  section-header
                ">

                  <div>

                    <h2>

                      ${
                        escapeHTML(
                          contest.title
                        )
                      }

                    </h2>


                    <p>

                      ${
                        escapeHTML(
                          contest.description
                        )
                      }

                    </p>

                  </div>


                  <span class="
                    badge
                    ${
                      contest.rated
                        ? "medium"
                        : "easy"
                    }
                  ">

                    ${
                      contest.rated
                        ? "Rated"
                        : "Practice"
                    }

                  </span>

                </div>


                <div class="
                  grid
                  grid-2
                ">

                  <div>

                    <span class="
                      stat-label
                    ">
                      Bắt đầu
                    </span>

                    <strong>

                      ${
                        formatDate(
                          contest.startAt
                        )
                      }

                    </strong>

                  </div>


                  <div>

                    <span class="
                      stat-label
                    ">
                      Thời gian
                    </span>

                    <strong>

                      ${
                        contest.duration
                      }
                      phút

                    </strong>

                  </div>

                </div>


                <div style="
                  margin-top:18px;
                ">

                  <button
                    class="
                      btn
                      btn-primary
                    "
                    data-join-contest="${
                      contest.id
                    }"
                  >
                    Tham gia
                  </button>

                </div>

              </article>

            `

          ).join(
            ""
          )
        }

      </div>

    </section>

  `;

}


/* =========================================================
   SUBMISSIONS
========================================================= */

function renderSubmissions() {

  const me =
    currentUser();


  const submissions =

    db.submissions

      .filter(

        item =>

          isAdmin()

          ||

          (

            me

            &&

            item.userId ===
            me.id

          )

      )

      .sort(

        (
          a,
          b
        ) =>

          new Date(
            b.createdAt
          )

          -

          new Date(
            a.createdAt
          )

      );


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        SUBMISSION HISTORY
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Bài nộp
      </h1>


      <p class="
        page-subtitle
      ">

        ${
          isAdmin()

            ? "Admin xem được toàn bộ bài nộp."

            : me

              ? "Lịch sử bài nộp của bạn."

              : "Đăng nhập để xem bài nộp."
        }

      </p>


      <div class="
        table-wrap
      ">

        <div class="
          table-scroll
        ">

          <table>

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Problem
                </th>

                <th>
                  Language
                </th>

                <th>
                  Verdict
                </th>

                <th>
                  Time
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                submissions.length

                  ?

                    submissions
                      .map(

                        submission => {

                          const user =
                            getUser(
                              submission.userId
                            );


                          const problem =

                            db.problems.find(

                              item =>

                                item.id ===
                                submission.problemId

                            );


                          return `

                            <tr>

                              <td>

                                ${
                                  escapeHTML(
                                    user?.username
                                    ||
                                    "Unknown"
                                  )
                                }

                              </td>


                              <td>

                                ${
                                  escapeHTML(
                                    problem?.title
                                    ||
                                    "Unknown"
                                  )
                                }

                              </td>


                              <td>

                                ${
                                  escapeHTML(
                                    submission.language
                                  )
                                }

                              </td>


                              <td>

                                <strong style="
                                  color:
                                  ${
                                    submission.verdict ===
                                    "Accepted"

                                      ? "var(--green)"

                                      : "var(--red)"
                                  };
                                ">

                                  ${
                                    submission.verdict
                                  }

                                </strong>

                              </td>


                              <td>

                                ${
                                  formatDate(
                                    submission.createdAt
                                  )
                                }

                              </td>

                            </tr>

                          `;

                        }

                      )

                      .join(
                        ""
                      )

                  :

                    `

                      <tr>

                        <td
                          colspan="5"
                          style="
                            text-align:center;
                            padding:40px;
                            color:var(--muted);
                          "
                        >
                          Chưa có bài nộp.
                        </td>

                      </tr>

                    `

              }

            </tbody>

          </table>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   RANKING
========================================================= */

function renderRanking() {

  const ranking =

    [
      ...db.users
    ]

      .sort(

        (
          a,
          b
        ) =>

          b.rating

          -

          a.rating

      );


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        GLOBAL RANKING
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Xếp hạng
      </h1>


      <p class="
        page-subtitle
      ">
        Xếp hạng theo rating hiện tại.
      </p>


      <div class="
        table-wrap
      ">

        <div class="
          table-scroll
        ">

          <table>

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  User
                </th>

                <th>
                  Username
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Rank
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                ranking.map(

                  (
                    user,
                    index
                  ) => {

                    const tier =
                      getTier(
                        user.rating
                      );


                    return `

                      <tr>

                        <td>

                          <span class="
                            rank-number
                          ">

                            ${
                              index +
                              1
                            }

                          </span>

                        </td>


                        <td>

                          <div style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                          ">

                            ${
                              avatarHTML(
                                user,
                                "small"
                              )
                            }


                            <strong>

                              ${
                                escapeHTML(
                                  user.displayName
                                )
                              }

                            </strong>

                          </div>

                        </td>


                        <td>

                          @${escapeHTML(
                            user.username
                          )}

                        </td>


                        <td>

                          <strong class="
                            ${
                              tier.className
                            }
                          ">

                            ${
                              user.rating
                            }

                          </strong>

                        </td>


                        <td>

                          <span class="
                            ${
                              tier.className
                            }
                          ">

                            ${
                              tier.name
                            }

                          </span>

                        </td>


                        <td>

                          <span class="
                            online-status
                          ">

                            <span class="
                              online-dot
                              ${
                                isOnline(
                                  user
                                )
                                  ? "online"
                                  : ""
                              }
                            "></span>

                            ${
                              isOnline(
                                user
                              )
                                ? "Online"
                                : "Offline"
                            }

                          </span>

                        </td>

                      </tr>

                    `;

                  }

                ).join(
                  ""
                )

              }

            </tbody>

          </table>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   USERS
========================================================= */

function renderUsers() {

  const users =

    db.users.filter(

      user => {

        if (
          !userSearch
        ) {

          return true;

        }


        const q =
          userSearch
            .toLowerCase();


        return (

          user.username
            .toLowerCase()
            .includes(
              q
            )

          ||

          user.displayName
            .toLowerCase()
            .includes(
              q
            )

        );

      }

    );


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        USER DIRECTORY
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Thành viên
      </h1>


      <p class="
        page-subtitle
      ">
        Mặc định hệ thống chỉ có Admin.
        User mới xuất hiện sau khi đăng ký.
      </p>


      <div
        class="
          search-box
        "
        style="
          max-width:520px;
          margin-bottom:22px;
        "
      >

        <input
          id="usersSearchInput"
          value="${
            escapeHTML(
              userSearch
            )
          }"
          placeholder="Tìm username hoặc tên..."
        >

      </div>


      <div class="
        grid
        grid-3
      ">

        ${
          users.map(

            user => {

              const tier =
                getTier(
                  user.rating
                );


              return `

                <article class="
                  card
                ">

                  <div style="
                    display:flex;
                    align-items:center;
                    gap:13px;
                  ">

                    ${
                      avatarHTML(
                        user,
                        "large"
                      )
                    }


                    <div>

                      <h3 style="
                        margin:
                        0
                        0
                        4px;
                      ">

                        ${
                          escapeHTML(
                            user.displayName
                          )
                        }

                      </h3>


                      <span class="
                        muted
                        mono
                      ">

                        @${escapeHTML(
                          user.username
                        )}

                      </span>

                    </div>

                  </div>


                  <p class="
                    muted
                  ">

                    ${
                      escapeHTML(
                        user.bio ||
                        "Chưa có mô tả."
                      )
                    }

                  </p>


                  <div style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:12px;
                  ">

                    <span class="
                      ${
                        tier.className
                      }
                    ">

                      ⭐
                      ${
                        user.rating
                      }

                      ·

                      ${
                        tier.name
                      }

                    </span>


                    <span class="
                      online-status
                    ">

                      <span class="
                        online-dot
                        ${
                          isOnline(
                            user
                          )
                            ? "online"
                            : ""
                        }
                      "></span>

                      ${
                        isOnline(
                          user
                        )
                          ? "Online"
                          : "Offline"
                      }

                    </span>

                  </div>


                  <div class="
                    profile-actions
                  ">

                    ${
                      currentUser()
                      &&
                      currentUser().id !==
                      user.id

                        ? `

                            <button
                              class="
                                btn
                                btn-primary
                                btn-sm
                              "
                              data-chat-user-id="${
                                user.id
                              }"
                            >
                              💬 Nhắn tin
                            </button>

                          `

                        : ""

                    }

                  </div>

                </article>

              `;

            }

          ).join(
            ""
          )

        }

      </div>

    </section>

  `;

}


/* =========================================================
   CHAT
========================================================= */

function renderChat() {

  const me =
    currentUser();


  if (
    me
  ) {

    markCurrentChatRead();

  }


  let title =
    "Community";


  let subtitle =
    "Sảnh chat chung Phantom Forge";


  if (

    currentChat.type ===
    "direct"

  ) {

    const target =
      getUser(
        currentChat.userId
      );


    if (
      !target
    ) {

      currentChat = {

        type:
          "community",

        userId:
          null

      };

    }

    else {

      title =
        target.displayName;


      subtitle =

        `@${target.username} · ${
          isOnline(
            target
          )
            ? "Online"
            : "Offline"
        }`;

    }

  }


  const users =

    db.users

      .filter(
        user =>
          user.id !==
          me?.id
      )

      .filter(

        user => {

          if (
            !userSearch
          ) {

            return true;

          }


          const q =
            userSearch
              .toLowerCase();


          return (

            user.username
              .toLowerCase()
              .includes(
                q
              )

            ||

            user.displayName
              .toLowerCase()
              .includes(
                q
              )

          );

        }

      )

      .sort(

        (
          a,
          b
        ) =>

          Number(
            isOnline(
              b
            )
          )

          -

          Number(
            isOnline(
              a
            )
          )

      );


  const messages =
    getCurrentMessages();


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        COMMUNITY CHAT
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Forge Chat
      </h1>


      <p class="
        page-subtitle
      ">
        Trò chuyện ở sảnh chung hoặc nhắn tin riêng.
      </p>


      <div class="
        chat-layout
      ">


        <!-- LEFT -->

        <aside class="
          chat-sidebar
        ">

          <div class="
            chat-sidebar-header
          ">

            <h3>
              Tin nhắn
            </h3>

            <p>
              Chọn phòng hoặc user.
            </p>


            <div
              class="search-box"
              style="
                margin-top:12px;
              "
            >

              <input
                id="chatSearchInput"
                value="${
                  escapeHTML(
                    chatSearch
                  )
                }"
                placeholder="Tìm user..."
              >

            </div>

          </div>


          <div class="
            chat-conversations
          ">


            <div
              class="
                conversation
                ${
                  currentChat.type ===
                  "community"
                    ? "active"
                    : ""
                }
              "
              data-chat-community
            >

              <div class="
                avatar
                small
              ">
                💬
              </div>


              <div class="
                conversation-info
              ">

                <strong>
                  Community
                </strong>

                <small>
                  Sảnh chat chung
                </small>

              </div>

            </div>


            ${
              users.map(

                user => `

                  <div
                    class="
                      conversation
                      ${
                        currentChat.type ===
                        "direct"

                        &&

                        currentChat.userId ===
                        user.id

                          ? "active"

                          : ""
                      }
                    "
                    data-chat-user-id="${
                      user.id
                    }"
                  >

                    ${
                      avatarHTML(
                        user,
                        "small"
                      )
                    }


                    <div class="
                      conversation-info
                    ">

                      <strong>

                        ${
                          escapeHTML(
                            user.displayName
                          )
                        }

                      </strong>

                      <small>

                        @${escapeHTML(
                          user.username
                        )}

                      </small>

                    </div>


                    ${
                      unreadCountForUser(
                        user.id
                      )

                        ?

                          `

                            <span class="
                              unread-badge
                            ">

                              ${
                                unreadCountForUser(
                                  user.id
                                )
                              }

                            </span>

                          `

                        :

                          ""

                    }

                  </div>

                `

              ).join(
                ""
              )

            }

          </div>

        </aside>


        <!-- MAIN -->

        <section class="
          chat-main
        ">


          <header class="
            chat-header
          ">

            ${
              currentChat.type ===
              "direct"

                ? avatarHTML(
                    getUser(
                      currentChat.userId
                    ),
                    "small"
                  )

                : `

                  <div class="
                    avatar
                    small
                  ">
                    💬
                  </div>

                `
            }


            <div class="
              chat-header-meta
            ">

              <strong>

                ${
                  escapeHTML(
                    title
                  )
                }

              </strong>


              <small>

                ${
                  escapeHTML(
                    subtitle
                  )
                }

              </small>

            </div>


            <div class="
              chat-header-tools
            ">

              <button
                class="
                  chat-tool-btn
                "
                id="chatHeaderSettings"
                type="button"
                title="Cài đặt"
              >
                ⚙
              </button>


              <button
                class="
                  chat-tool-btn
                "
                id="chatScrollBottom"
                type="button"
                title="Cuộn xuống"
              >
                ↓
              </button>

            </div>

          </header>


          <div
            class="
              chat-messages
            "
            id="chatMessages"
          >


            ${
              messages.length

                ?

                  messages.map(

                    message => {

                      const sender =
                        getUser(
                          message.fromUserId
                        );


                      const mine =

                        message.fromUserId ===
                        me?.id;


                      return `

                        <div
                          class="
                            message
                            ${
                              mine
                                ? "mine"
                                : ""
                            }
                          "
                        >

                          ${
                            avatarHTML(
                              sender,
                              "small"
                            )
                          }


                          <div class="
                            message-content
                          ">

                            <div class="
                              message-name
                            ">

                              ${
                                mine

                                  ? "Bạn"

                                  : escapeHTML(
                                      sender
                                        ?.displayName
                                      ||
                                      "User"
                                    )
                              }

                            </div>


                            <div class="
                              message-bubble
                            ">

                              ${
                                escapeHTML(
                                  message.text
                                )

                                  .replace(
                                    /\n/g,
                                    "<br>"
                                  )
                              }

                            </div>


                            <div class="
                              message-time
                            ">

                              ${
                                formatTime(
                                  message.createdAt
                                )
                              }

                            </div>

                          </div>

                        </div>

                      `;

                    }

                  ).join(
                    ""
                  )

                :

                  `

                    <div class="
                      empty-state
                    ">

                      <div>

                        <strong>
                          Chưa có tin nhắn
                        </strong>

                        Hãy gửi tin nhắn đầu tiên.

                      </div>

                    </div>

                  `

            }

          </div>


          <form
            class="
              chat-input
            "
            id="chatForm"
          >

            <textarea
              id="chatMessageInput"
              placeholder="Viết tin nhắn..."
              ${
                me
                  ? ""
                  : "disabled"
              }
            ></textarea>


            <div class="
              chat-input-tools
            ">

              <button
                class="
                  chat-input-tool
                "
                id="emojiButton"
                type="button"
                title="Emoji"
              >
                😊
              </button>


              <button
                class="
                  chat-input-tool
                "
                id="attachButton"
                type="button"
                title="Attachment"
              >
                📎
              </button>

            </div>


            <button
              class="
                btn
                btn-primary
                send-button
              "
              type="submit"
            >
              Gửi
            </button>


            <input
              type="file"
              id="chatFileInput"
              class="hidden"
              accept="image/*,.pdf,.txt,.zip"
            >


            <div
              class="
                emoji-panel
                hidden
              "
              id="emojiPanel"
            >

              ${
                [
                  "😀",
                  "😂",
                  "😍",
                  "🔥",
                  "👍",
                  "👏",
                  "🎉",
                  "💯",
                  "❤️",
                  "😎",
                  "🤖",
                  "🚀"
                ]

                  .map(

                    emoji => `

                      <button
                        type="button"
                        data-emoji="${emoji}"
                      >
                        ${emoji}
                      </button>

                    `

                  )

                  .join(
                    ""
                  )
              }

            </div>

          </form>

        </section>


        <!-- RIGHT -->

        <aside class="
          chat-users
        ">

          <div class="
            chat-users-header
          ">

            <h3>
              Thành viên
            </h3>

            <p>
              ${
                db.users.length
              }
              tài khoản
            </p>


            <div
              class="search-box"
              style="
                margin-top:12px;
              "
            >

              <input
                id="userSearchChatInput"
                value="${
                  escapeHTML(
                    userSearch
                  )
                }"
                placeholder="Tìm user..."
              >

            </div>

          </div>


          <div class="
            chat-users-list
          ">

            ${
              users.map(

                user => `

                  <div
                    class="
                      user-row
                    "
                    data-chat-user-id="${
                      user.id
                    }"
                  >

                    ${
                      avatarHTML(
                        user,
                        "small"
                      )
                    }


                    <div class="
                      user-meta
                    ">

                      <strong>

                        ${
                          escapeHTML(
                            user.displayName
                          )
                        }

                      </strong>


                      <small>

                        <span class="
                          online-status
                        ">

                          <span class="
                            online-dot
                            ${
                              isOnline(
                                user
                              )
                                ? "online"
                                : ""
                            }
                          "></span>

                          ${
                            isOnline(
                              user
                            )
                              ? "Online"
                              : "Offline"
                          }

                        </span>

                        ·

                        ${
                          getTier(
                            user.rating
                          ).name
                        }

                      </small>

                    </div>

                  </div>

                `

              ).join(
                ""
              )

            }

          </div>

        </aside>

      </div>

    </section>

  `;

}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile() {

  const me =
    currentUser();


  if (
    !me
  ) {

    return `

      <section class="
        page
        container
      ">

        <div class="
          card
          empty-state
        ">

          <div>

            <strong>
              Bạn chưa đăng nhập.
            </strong>

            Đăng nhập để xem hồ sơ.


            <div style="
              margin-top:15px;
            ">

              <button
                class="
                  btn
                  btn-primary
                "
                data-open-login
              >
                Đăng nhập
              </button>

            </div>

          </div>

        </div>

      </section>

    `;

  }


  const tier =
    getTier(
      me.rating
    );


  const solved =

    db.submissions.filter(

      item =>

        item.userId ===
        me.id

        &&

        item.verdict ===
        "Accepted"

    ).length;


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        YOUR PROFILE
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Hồ sơ cá nhân
      </h1>


      <div class="
        card
        profile-card
      ">


        ${
          avatarHTML(
            me,
            "large"
          )
        }


        <div class="
          profile-main
        ">

          <div>

            <h2>

              ${
                escapeHTML(
                  me.displayName
                )
              }

            </h2>


            <span class="
              muted
              mono
            ">

              @${escapeHTML(
                me.username
              )}

            </span>

          </div>


          <p>

            ${
              escapeHTML(
                me.bio ||
                "Chưa có mô tả."
              )
            }

          </p>


          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:14px;
          ">

            <span class="
              ${
                tier.className
              }
            ">

              Rating:
              ${
                me.rating
              }

            </span>


            <span>

              🏆
              ${
                solved
              }
              Accepted

            </span>


            <span>

              ◉
              ${
                me.orbs ===
                -1

                  ? "∞"

                  : me.orbs
              }
              Orb

            </span>


            <span class="
              muted
            ">

              Tham gia:
              ${
                formatDate(
                  me.joined
                )
              }

            </span>

          </div>


          <div class="
            profile-actions
          ">

            <button
              class="
                btn
                btn-ghost
              "
              data-route="submissions"
            >
              Xem bài nộp
            </button>


            <button
              class="
                btn
                btn-ghost
              "
              data-route="chat"
            >
              Mở Chat
            </button>

          </div>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   ADMIN
========================================================= */

function renderAdmin() {

  if (
    !isAdmin()
  ) {

    return `

      <section class="
        page
        container
      ">

        <div class="
          card
          empty-state
        ">

          <div>

            <strong>
              Không có quyền truy cập.
            </strong>

            Chỉ Admin mới được xem trang này.

          </div>

        </div>

      </section>

    `;

  }


  return `

    <section class="
      page
      container
    ">

      <span class="
        eyebrow
      ">
        ADMIN CONTROL
      </span>


      <h1 class="
        page-title
        gradient-text
      ">
        Quản trị
      </h1>


      <div class="
        card
      ">

        <strong>
          Chỉ có tài khoản Admin mặc định khi cài mới.
        </strong>

        <p class="
          muted
        ">

          Các tài khoản khác chỉ xuất hiện sau khi người dùng đăng ký.

        </p>

      </div>


      <div style="
        height:18px;
      "></div>


      <div class="
        grid
        grid-3
      ">

        <div class="
          card
        ">

          <span class="
            stat-label
          ">
            Users
          </span>

          <div class="
            stat-value
          ">

            ${
              db.users.length
            }

          </div>

        </div>


        <div class="
          card
        ">

          <span class="
            stat-label
          ">
            Messages
          </span>

          <div class="
            stat-value
          ">

            ${
              db.messages.length
            }

          </div>

        </div>


        <div class="
          card
        ">

          <span class="
            stat-label
          ">
            Submissions
          </span>

          <div class="
            stat-value
          ">

            ${
              db.submissions.length
            }

          </div>

        </div>

      </div>


    </section>

  `;

}


/* =========================================================
   SUBMIT
========================================================= */

function openSubmitModal(
  problemId
) {

  const problem =

    db.problems.find(

      item =>

        item.id ===
        Number(
          problemId
        )

    );


  if (
    !problem
  ) {

    return;

  }


  if (
    !currentUser()
  ) {

    openAuth(
      "login"
    );

    return;

  }


  $(
    "#submitModalContent"
  ).innerHTML = `

    <span class="
      eyebrow
    ">
      SUBMIT SOLUTION
    </span>


    <h2>

      ${
        escapeHTML(
          problem.title
        )
      }

    </h2>


    <p class="
      muted
    ">

      ${
        escapeHTML(
          problem.statement
        )
      }

    </p>


    <label>

      Ngôn ngữ


      <select
        id="submitLanguage"
      >

        ${
          ALLOWED_LANGUAGES.map(

            language => `

              <option>
                ${
                  language
                }
              </option>

            `

          ).join(
            ""
          )
        }

      </select>

    </label>


    <label style="
      margin-top:14px;
    ">

      Source Code


      <textarea
        id="submitCode"
        style="
          min-height:240px;
          font-family:'JetBrains Mono',monospace;
          font-size:12px;
        "
        placeholder="Dán code vào đây..."
      ></textarea>

    </label>


    <div style="
      display:flex;
      justify-content:flex-end;
      gap:8px;
      margin-top:16px;
    ">

      <button
        class="
          btn
          btn-ghost
        "
        data-close-modal="submitModal"
      >
        Hủy
      </button>


      <button
        class="
          btn
          btn-primary
        "
        data-submit-code="${
          problem.id
        }"
      >
        Submit
      </button>

    </div>

  `;


  $(
    "#submitModal"
  )

    .classList
    .remove(
      "hidden"
    );

}


function submitSolution(
  problemId
) {

  const me =
    currentUser();


  if (
    !me
  ) {

    openAuth(
      "login"
    );

    return;

  }


  const code =
    $(
      "#submitCode"
    )

    .value
    .trim();


  const languageValue =
    $(
      "#submitLanguage"
    )

    .value;


  if (
    !code
  ) {

    toast(
      "Hãy nhập source code."
    );

    return;

  }


  const verdict =

    code.length >=
    20

      ? "Accepted"

      : "Wrong Answer";


  db.submissions.push({

    id:
      Date.now() +
      Math.random(),

    userId:
      me.id,

    problemId:
      Number(
        problemId
      ),

    language:
      languageValue,

    verdict,

    createdAt:
      new Date()
        .toISOString()

  });


  if (
    verdict ===
    "Accepted"
  ) {

    if (
      me.orbs !==
      -1
    ) {

      me.orbs +=
        1;

    }


    if (
      me.rating <
      2400
    ) {

      me.rating +=
        10;

    }

  }


  saveDB();


  closeModal(
    "submitModal"
  );


  toast(

    verdict ===
    "Accepted"

      ? "✅ Accepted!"

      : "❌ Wrong Answer"

  );


  goTo(
    "submissions"
  );

}


/* =========================================================
   ADMIN DELETE USER
========================================================= */

function adminDeleteUser(
  userId
) {

  if (
    !isAdmin()
  ) {

    toast(
      "Bạn không có quyền."
    );

    return;

  }


  if (

    userId ===
    currentUser()
      ?.id

  ) {

    toast(
      "Không thể xóa chính mình."
    );

    return;

  }


  const user =
    getUser(
      userId
    );


  if (
    !user
  ) {

    return;

  }


  const confirmed =

    window.confirm(
      `Xóa user @${user.username}?`
    );


  if (
    !confirmed
  ) {

    return;

  }


  db.users =

    db.users.filter(

      item =>

        item.id !==
        userId

    );


  db.messages =

    db.messages.filter(

      message =>

        message.fromUserId !==
        userId

        &&

        message.toUserId !==
        userId

    );


  saveDB();

  render();


  toast(
    "Đã xóa user."
  );

}


/* =========================================================
   RENDER ROUTE
========================================================= */

function renderPage() {

  switch (
    currentRoute
  ) {

    case "home":

      return renderHome();


    case "problems":

      return renderProblems();


    case "contests":

      return renderContests();


    case "submissions":

      return renderSubmissions();


    case "ranking":

      return renderRanking();


    case "users":

      return renderUsers();


    case "chat":

      return renderChat();


    case "profile":

      return renderProfile();


    case "admin":

      return renderAdmin();


    default:

      currentRoute =
        "home";


      return renderHome();

  }

}


function render() {

  const app =
    $(
      "#app"
    );


  if (
    !app
  ) {

    return;

  }


  app.innerHTML =
    renderPage();


  renderHeader();

  applyLanguage();

  updateBadges();


  $$(".main-nav a")
    .forEach(

      link => {

        link.classList.toggle(

          "active",

          link.dataset.route ===
          currentRoute

        );

      }

    );


  if (

    currentRoute ===
    "chat"

  ) {

    requestAnimationFrame(

      () => {

        const box =
          $(
            "#chatMessages"
          );


        if (
          box
        ) {

          box.scrollTop =
            box.scrollHeight;

        }

      }

    );

  }

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  document.addEventListener(

    "click",

    event => {


      /* ROUTE */

      const routeButton =

        event.target.closest(
          "[data-route]"
        );


      if (
        routeButton
      ) {

        event.preventDefault();


        goTo(

          routeButton
            .dataset
            .route

        );


        $(
          "#mainNav"
        )
          ?.
          classList
          .remove(
            "open"
          );


        $(
          "#accountDropdown"
        )
          ?.
          classList
          .add(
            "hidden"
          );


        closeDrawers();


        return;

      }


      /* CLOSE MODAL */

      const closeModalButton =

        event.target.closest(
          "[data-close-modal]"
        );


      if (
        closeModalButton
      ) {

        closeModal(

          closeModalButton
            .dataset
            .closeModal

        );


        return;

      }


      /* AUTH TAB */

      const authTab =

        event.target.closest(
          "[data-auth-tab]"
        );


      if (
        authTab
      ) {

        switchAuth(

          authTab
            .dataset
            .authTab

        );


        return;

      }


      /* LOGIN */

      if (

        event.target.closest(
          "#loginBtn"
        )

      ) {

        openAuth(
          "login"
        );


        return;

      }


      /* REGISTER */

      if (

        event.target.closest(
          "#registerBtn"
        )

      ) {

        openAuth(
          "register"
        );


        return;

      }


      /* LOGOUT */

      if (

        event.target.closest(
          "#logoutBtn"
        )

      ) {

        logout();


        return;

      }


      /* THEME */

      if (

        event.target.closest(
          "#themeToggle"
        )

      ) {

        toggleTheme();


        return;

      }


      /* MOBILE MENU */

      if (

        event.target.closest(
          "#mobileMenuBtn"
        )

      ) {

        const nav =
          $(
            "#mainNav"
          );


        nav
          ?.
          classList
          .toggle(
            "open"
          );


        return;

      }


      /* ACCOUNT */

      if (

        event.target.closest(
          "#accountTrigger"
        )

      ) {

        $(
          "#accountDropdown"
        )
          ?.
          classList
          .toggle(
            "hidden"
          );


        return;

      }


      /* CHAT */

      if (

        event.target.closest(
          "#chatHeaderButton"
        )

        ||

        event.target.closest(
          "#chatFab"
        )

      ) {

        goTo(
          "chat"
        );


        return;

      }


      /* NOTIFICATION */

      if (

        event.target.closest(
          "#notificationButton"
        )

      ) {

        renderNotifications();

        openDrawer(
          "notificationDrawer"
        );


        return;

      }


      /* SETTINGS */

      if (

        event.target.closest(
          "#settingsButton"
        )

        ||

        event.target.closest(
          "#chatHeaderSettings"
        )

      ) {

        applyMotionSetting();

        openDrawer(
          "settingsDrawer"
        );


        return;

      }


      /* CLOSE DRAWER */

      if (

        event.target.closest(
          "[data-close-drawer]"
        )

        ||

        event.target.closest(
          "#drawerBackdrop"
        )

      ) {

        closeDrawers();


        return;

      }


      /* MARK ALL */

      if (

        event.target.closest(
          "#markAllReadButton"
        )

      ) {

        markAllNotificationsRead();


        return;

      }


      /* NOTIFICATION ITEM */

      const notificationItem =

        event.target.closest(
          "[data-notification-id]"
        );


      if (
        notificationItem
      ) {

        markNotificationRead(

          Number(
            notificationItem
              .dataset
              .notificationId
          )

        );


        return;

      }


      /* LANGUAGE */

      const languageButton =

        event.target.closest(
          "[data-language]"
        );


      if (
        languageButton
      ) {

        setLanguage(

          languageButton
            .dataset
            .language

        );


        return;

      }


      /* CHAT SCROLL */

      if (

        event.target.closest(
          "#chatScrollBottom"
        )

      ) {

        const box =
          $(
            "#chatMessages"
          );


        if (
          box
        ) {

          box.scrollTop =
            box.scrollHeight;

        }


        return;

      }


      /* EMOJI */

      if (

        event.target.closest(
          "#emojiButton"
        )

      ) {

        $(
          "#emojiPanel"
        )
          ?.
          classList
          .toggle(
            "hidden"
          );


        return;

      }


      const emojiButton =

        event.target.closest(
          "[data-emoji]"
        );


      if (
        emojiButton
      ) {

        insertEmoji(

          emojiButton
            .dataset
            .emoji

        );


        $(
          "#emojiPanel"
        )
          ?.
          classList
          .add(
            "hidden"
          );


        return;

      }


      /* ATTACH */

      if (

        event.target.closest(
          "#attachButton"
        )

      ) {

        $(
          "#chatFileInput"
        )
          ?.
          click();


        return;

      }


      /* COMMUNITY */

      if (

        event.target.closest(
          "[data-chat-community]"
        )

      ) {

        openCommunityChat();


        return;

      }


      /* PRIVATE CHAT */

      const chatUserButton =

        event.target.closest(
          "[data-chat-user-id]"
        );


      if (
        chatUserButton
      ) {

        openPrivateChat(

          Number(
            chatUserButton
              .dataset
              .chatUserId
          )

        );


        return;

      }


      /* SUBMIT */

      const openSubmitButton =

        event.target.closest(
          "[data-open-submit]"
        );


      if (
        openSubmitButton
      ) {

        openSubmitModal(

          Number(
            openSubmitButton
              .dataset
              .openSubmit
          )

        );


        return;

      }


      /* SUBMIT SOLUTION */

      const submitButton =

        event.target.closest(
          "[data-submit-code]"
        );


      if (
        submitButton
      ) {

        submitSolution(

          Number(
            submitButton
              .dataset
              .submitCode
          )

        );


        return;

      }


      /* CONTEST */

      const joinButton =

        event.target.closest(
          "[data-join-contest]"
        );


      if (
        joinButton
      ) {

        if (
          !currentUser()
        ) {

          openAuth(
            "login"
          );

          return;

        }


        toast(
          "Đã ghi nhận tham gia contest demo."
        );


        return;

      }


      /* OPEN LOGIN */

      if (

        event.target.closest(
          "[data-open-login]"
        )

      ) {

        openLogin();


        return;

      }


      /* ADMIN DELETE */

      const deleteUserButton =

        event.target.closest(
          "[data-admin-delete-user]"
        );


      if (
        deleteUserButton
      ) {

        adminDeleteUser(

          Number(
            deleteUserButton
              .dataset
              .adminDeleteUser
          )

        );

      }

    }

  );


  /* FORMS */

  document.addEventListener(

    "submit",

    async event => {


      /* LOGIN */

      if (

        event.target.id ===
        "loginForm"

      ) {

        event.preventDefault();


        try {

          await doLogin(

            $(
              "#loginUsername"
            ).value,

            $(
              "#loginPassword"
            ).value

          );


          event.target.reset();

        }

        catch (
          error
        ) {

          toast(
            error.message
          );

        }

      }


      /* REGISTER */

      if (

        event.target.id ===
        "registerForm"

      ) {

        event.preventDefault();


        try {

          await doRegister(

            $(
              "#registerUsername"
            ).value,

            $(
              "#registerDisplayName"
            ).value,

            $(
              "#registerEmail"
            ).value,

            $(
              "#registerPassword"
            ).value,

            $(
              "#registerPasswordConfirm"
            ).value

          );


          event.target.reset();

        }

        catch (
          error
        ) {

          toast(
            error.message
          );

        }

      }


      /* CHAT */

      if (

        event.target.id ===
        "chatForm"

      ) {

        event.preventDefault();


        sendMessage(

          $(
            "#chatMessageInput"
          ).value

        );


        $(
          "#chatMessageInput"
        ).value =
          "";


        $(
          "#emojiPanel"
        )
          ?.
          classList
          .add(
            "hidden"
          );

      }

    }

  );


  /* INPUT */

  document.addEventListener(

    "input",

    event => {


      if (

        event.target.id ===
        "chatSearchInput"

      ) {

        chatSearch =
          event.target.value;


        render();


        return;

      }


      if (

        event.target.id ===
        "userSearchChatInput"

      ) {

        userSearch =
          event.target.value;


        render();


        return;

      }


      if (

        event.target.id ===
        "usersSearchInput"

      ) {

        userSearch =
          event.target.value;


        render();


        return;

      }


      if (

        event.target.id ===
        "problemsSearchInput"

      ) {

        problemsSearch =
          event.target.value;


        render();


        return;

      }

    }

  );


  /* CHANGE */

  document.addEventListener(

    "change",

    event => {


      /* DARK MODE */

      if (

        event.target.id ===
        "darkModeSwitch"

      ) {

        const next =

          event.target.checked

            ? "dark"

            : "light";


        document.body
          .classList
          .toggle(

            "light",

            next ===
            "light"

          );


        localStorage.setItem(
          THEME_KEY,
          next
        );


        updateThemeButton();

      }


      /* MOTION */

      if (

        event.target.id ===
        "reduceMotionSwitch"

      ) {

        localStorage.setItem(

          MOTION_KEY,

          event.target.checked
            ? "1"
            : "0"

        );


        applyMotionSetting();

      }


      /* ATTACHMENT */

      if (

        event.target.id ===
        "chatFileInput"

        &&

        event.target.files
          ?.
          [0]

      ) {

        const file =
          event.target.files[0];


        const input =
          $(
            "#chatMessageInput"
          );


        if (
          input
        ) {

          input.value =

            input.value

            ?

              `${input.value} [${file.name}]`

            :

              `[${file.name}]`;


          input.focus();

        }

      }

    }

  );


  /* HASH */

  window.addEventListener(

    "hashchange",

    () => {

      currentRoute =
        getRoute();


      closeDrawers();


      render();

    }

  );


  /* VISIBILITY */

  document.addEventListener(

    "visibilitychange",

    () => {

      if (
        !document.hidden
      ) {

        updatePresence();

      }

    }

  );

}


/* =========================================================
   BOOT
========================================================= */

function boot() {

  setupBroadcast();

  setupEvents();

  loadTheme();

  applyMotionSetting();

  applyLanguage();

  render();


  $(
    "#currentYear"
  ).textContent =

    new Date()
      .getFullYear();


  updatePresence();

  updateBadges();


  setInterval(

    updatePresence,

    20000

  );

}


boot();
