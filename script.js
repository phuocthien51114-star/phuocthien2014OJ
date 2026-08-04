"use strict";

/* =========================================================
   PHANTOM FORGE CORE OJ V5
   Frontend-only demo
   - localStorage database
   - BroadcastChannel cross-tab sync
   - Community chat
   - Private messages
   - Users
   - Ranking
   - Problems
   - Contests
   - Submissions
   ========================================================= */


const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


const DB_KEY = "pfc_oj_database_v5";

const SESSION_KEY = "pfc_oj_session_v5";

const THEME_KEY = "pfc_oj_theme_v5";


const ALLOWED_LANGUAGES = [
  "HTML",
  "CSS",
  "JavaScript"
];


const ROLE_LABELS = {
  admin: "Quản trị viên",
  user: "Thành viên",
  problem_setter: "Problem Setter",
  contest_setter: "Contest Setter",
  muted: "Muted"
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


const now = Date.now();


const initialDB = {

  settings: {
    siteName:
      "Phantom Forge Core OJ",

    slogan:
      "Nơi ý tưởng được rèn thành thuật toán.",

    maintenance:
      false
  },


  users: [

    {
      id: 1,

      username:
        "admin",

      displayName:
        "Administrator",

      email:
        "admin@phantomforge.local",

      passwordHash:
        "8c6976e5b5410415bde908bd9733dd5d" +
        "0a5c5f2c5d3e4a7df5f1dbf1dbd9be2d",

      /*
        Lưu ý:
        Đây chỉ là demo frontend.
        Không dùng kiểu xác thực này cho production.
      */

      passwordDemo:
        "admin123",

      role:
        "admin",

      rating:
        2400,

      orbs:
        -1,

      bio:
        "Quản trị viên của Phantom Forge Core OJ.",

      avatar:
        "",

      joined:
        new Date(now).toISOString(),

      lastSeen:
        new Date(now).toISOString()
    },


    {
      id: 2,

      username:
        "coder1",

      displayName:
        "Code Master",

      email:
        "coder1@example.com",

      passwordHash:
        "",

      passwordDemo:
        "123456",

      role:
        "user",

      rating:
        1450,

      orbs:
        30,

      bio:
        "Thích thuật toán và Frontend.",

      avatar:
        "",

      joined:
        new Date(
          now - 86400000 * 20
        ).toISOString(),

      lastSeen:
        new Date().toISOString()
    },


    {
      id: 3,

      username:
        "coder2",

      displayName:
        "Algorithm Kid",

      email:
        "coder2@example.com",

      passwordHash:
        "",

      passwordDemo:
        "123456",

      role:
        "user",

      rating:
        820,

      orbs:
        18,

      bio:
        "Đang luyện Dynamic Programming.",

      avatar:
        "",

      joined:
        new Date(
          now - 86400000 * 12
        ).toISOString(),

      lastSeen:
        new Date().toISOString()
    }

  ],


  problems: [

    {
      id: 101,

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
          "HTML",
          "CSS",
          "JavaScript"
        ]
    },


    {
      id: 102,

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
        "Tạo một giao diện profile card có tên, mô tả và nút tương tác.",

      languages:
        [
          "HTML",
          "CSS",
          "JavaScript"
        ]
    },


    {
      id: 103,

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
        "Tạo bảng xếp hạng và sắp xếp dữ liệu người dùng bằng JavaScript.",

      languages:
        [
          "HTML",
          "CSS",
          "JavaScript"
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
        "Kỳ thi dành cho thành viên mới.",

      startAt:
        new Date(
          now + 86400000 * 3
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
        "Kỳ luyện tập không ảnh hưởng rating.",

      startAt:
        new Date(
          now + 86400000 * 7
        ).toISOString(),

      duration:
        180,

      rated:
        false
    }

  ],


  submissions: [],


  messages: [

    {
      id:
        10001,

      channel:
        "community",

      fromUserId:
        1,

      toUserId:
        null,

      text:
        "Chào mừng đến với Phantom Forge Chat! Bạn có thể trò chuyện ở sảnh chung hoặc nhắn riêng cho từng thành viên.",

      createdAt:
        new Date().toISOString(),

      readBy:
        [1]
    }

  ]

};


let db =
  loadDatabase();


let session =
  loadSession();


let currentRoute =
  getRoute();


let currentChat =
  {
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


let channelSearch =
  "";


let broadcastChannel =
  null;


const onlineHeartbeatTimer =
  setInterval(
    updatePresence,
    20000
  );


/* =========================================================
   STORAGE
   ========================================================= */


function clone(value) {

  return JSON.parse(
    JSON.stringify(value)
  );

}


function loadDatabase() {

  try {

    const raw =
      localStorage.getItem(
        DB_KEY
      );

    if (!raw) {

      const data =
        clone(initialDB);

      localStorage.setItem(
        DB_KEY,
        JSON.stringify(data)
      );

      return data;
    }

    const parsed =
      JSON.parse(raw);

    return normalizeDatabase(
      parsed
    );

  } catch (error) {

    console.error(
      "Không thể load database:",
      error
    );

    return clone(initialDB);

  }

}


function normalizeDatabase(data) {

  const result = {
    ...clone(initialDB),
    ...data
  };


  result.users =
    Array.isArray(data.users)
      ? data.users
      : [];


  result.problems =
    Array.isArray(data.problems)
      ? data.problems
      : clone(
          initialDB.problems
        );


  result.contests =
    Array.isArray(data.contests)
      ? data.contests
      : clone(
          initialDB.contests
        );


  result.submissions =
    Array.isArray(data.submissions)
      ? data.submissions
      : [];


  result.messages =
    Array.isArray(data.messages)
      ? data.messages
      : [];


  result.users =
    result.users.map(
      normalizeUser
    );


  return result;

}


function normalizeUser(user) {

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

    passwordHash:
      String(
        user.passwordHash ||
        ""
      ),

    passwordDemo:
      String(
        user.passwordDemo ||
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
      user.orbs === -1
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
      user.joined ||
      new Date().toISOString(),

    lastSeen:
      user.lastSeen ||
      new Date().toISOString()

  };

}


function saveDatabase() {

  try {

    localStorage.setItem(
      DB_KEY,
      JSON.stringify(db)
    );

    broadcast(
      {
        type:
          "database-updated"
      }
    );

  } catch (error) {

    console.error(
      error
    );

    toast(
      "Không thể lưu dữ liệu trình duyệt."
    );

  }

}


function loadSession() {

  try {

    const raw =
      localStorage.getItem(
        SESSION_KEY
      );

    if (!raw) {

      return null;

    }

    return JSON.parse(
      raw
    );

  } catch {

    return null;

  }

}


function saveSession() {

  if (!session) {

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
   BROADCAST CHANNEL
   ========================================================= */


function setupBroadcast() {

  if (
    "BroadcastChannel"
    in window
  ) {

    broadcastChannel =
      new BroadcastChannel(
        "pfc-oj-channel"
      );


    broadcastChannel.onmessage =
      event => {

        if (
          event.data?.type ===
          "database-updated"
        ) {

          db =
            loadDatabase();

          render();

        }


        if (
          event.data?.type ===
          "force-render"
        ) {

          render();

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
          loadDatabase();

        render();

      }

      if (
        event.key ===
        SESSION_KEY
      ) {

        session =
          loadSession();

        render();

      }

    }
  );

}


function broadcast(message) {

  try {

    broadcastChannel?.postMessage(
      message
    );

  } catch {

    // ignore

  }

}


/* =========================================================
   HELPERS
   ========================================================= */


function currentUser() {

  if (!session) {

    return null;

  }

  return db.users.find(
    user =>
      user.id ===
      session.userId
  ) || null;

}


function isAdmin() {

  return (
    currentUser()?.role ===
    "admin"
  );

}


function getUserById(id) {

  return db.users.find(
    user =>
      user.id ===
      id
  ) || null;

}


function escapeHTML(value) {

  return String(
    value ?? ""
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


function formatDate(
  value
) {

  try {

    return new Intl.DateTimeFormat(
      "vi-VN",
      {
        dateStyle:
          "short",

        timeStyle:
          "short"
      }
    ).format(
      new Date(value)
    );

  } catch {

    return "";

  }

}


function formatTime(
  value
) {

  try {

    return new Intl.DateTimeFormat(
      "vi-VN",
      {
        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    ).format(
      new Date(value)
    );

  } catch {

    return "";

  }

}


function isOnline(user) {

  if (!user?.lastSeen) {

    return false;

  }

  return (
    Date.now() -
    new Date(
      user.lastSeen
    ).getTime()
  ) <
  90000;

}


function getRatingTier(
  rating
) {

  return (
    RATING_TIERS.find(
      tier =>
        rating >= tier.min &&
        rating <= tier.max
    )
    ||
    RATING_TIERS[0]
  );

}


function avatarHTML(
  user,
  size = "small"
) {

  if (!user) {

    return `
      <span class="avatar ${size}">
        ?
      </span>
    `;

  }


  const initials =
    user.displayName
      .split(/\s+/)
      .map(
        word =>
          word[0]
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase();


  if (user.avatar) {

    return `
      <span class="avatar ${size}">
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
    <span class="avatar ${size}">
      ${escapeHTML(
        initials
      )}
    </span>
  `;

}


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


function setRoute(
  route
) {

  location.hash =
    route;

}


function toast(
  message
) {

  const container =
    $(
      "#toastContainer"
    );

  if (!container) {

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


function updatePresence() {

  const me =
    currentUser();

  if (!me) {

    return;

  }


  me.lastSeen =
    new Date().toISOString();


  saveDatabase();

}


function markMessageRead(
  message
) {

  const me =
    currentUser();

  if (!me) {

    return;

  }


  if (
    !Array.isArray(
      message.readBy
    )
  ) {

    message.readBy =
      [];

  }


  if (
    !message.readBy.includes(
      me.id
    )
  ) {

    message.readBy.push(
      me.id
    );

  }

}


function unreadCountForUser(
  userId
) {

  const me =
    currentUser();

  if (!me) {

    return 0;

  }


  return db.messages.filter(
    message => {

      const isDirect =
        message.channel ===
        "direct";


      const belongs =
        isDirect &&
        (
          (
            message.fromUserId ===
            me.id &&
            message.toUserId ===
            userId
          )
          ||
          (
            message.fromUserId ===
            userId &&
            message.toUserId ===
            me.id
          )
        );


      if (!belongs) {

        return false;

      }


      if (
        message.fromUserId ===
        me.id
      ) {

        return false;

      }


      return !(
        message.readBy ||
        []
      ).includes(
        me.id
      );

    }
  ).length;

}


/* =========================================================
   AUTH
   ========================================================= */


async function hashText(
  text
) {

  if (
    window.crypto?.subtle
  ) {

    const data =
      new TextEncoder()
        .encode(
          text
        );


    const hash =
      await crypto.subtle.digest(
        "SHA-256",
        data
      );


    return [
      ...new Uint8Array(
        hash
      )
    ]
      .map(
        byte =>
          byte
            .toString(16)
            .padStart(
              2,
              "0"
            )
      )
      .join("");

  }


  return text;

}


function openAuth(
  mode = "login"
) {

  const modal =
    $(
      "#authModal"
    );


  modal.classList.remove(
    "hidden"
  );


  switchAuthTab(
    mode
  );

}


function closeModal(
  id
) {

  $(
    `#${id}`
  )?.classList.add(
    "hidden"
  );

}


function switchAuthTab(
  mode
) {

  $$(".auth-tab").forEach(
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
  ).classList.toggle(
    "hidden",
    mode !== "login"
  );


  $(
    "#registerForm"
  ).classList.toggle(
    "hidden",
    mode !== "register"
  );


  $(
    "#authTitle"
  ).textContent =
    mode === "login"
      ? "Đăng nhập"
      : "Tạo tài khoản";


  $(
    "#authDescription"
  ).textContent =
    mode === "login"
      ? "Chào mừng bạn quay trở lại."
      : "Tham gia cộng đồng Phantom Forge.";
}


async function login(
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
          .toLowerCase() ===
        normalized
    );


  if (!found) {

    throw new Error(
      "Tên đăng nhập không tồn tại."
    );

  }


  const inputHash =
    await hashText(
      password
    );


  const valid =
    (
      found.passwordDemo &&
      found.passwordDemo ===
      password
    )
    ||
    (
      found.passwordHash &&
      found.passwordHash ===
      inputHash
    );


  if (!valid) {

    throw new Error(
      "Mật khẩu không chính xác."
    );

  }


  found.lastSeen =
    new Date().toISOString();


  session =
    {
      userId:
        found.id
    };


  saveSession();

  saveDatabase();

  closeModal(
    "authModal"
  );

  toast(
    `Chào mừng ${found.displayName}!`
  );

  render();

}


async function register(
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
    displayName.trim();


  email =
    email.trim();


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
          .toLowerCase() ===
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

    passwordHash,

    passwordDemo:
      "",

    role:
      "user",

    rating:
      0,

    orbs:
      10,

    bio:
      "Thành viên mới của Phantom Forge.",

    avatar:
      "",

    joined:
      new Date().toISOString(),

    lastSeen:
      new Date().toISOString()

  };


  db.users.push(
    newUser
  );


  session =
    {
      userId:
        newUser.id
    };


  saveSession();

  saveDatabase();

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


  if (me) {

    me.lastSeen =
      new Date(
        Date.now() -
        999999
      ).toISOString();

    saveDatabase();

  }


  session =
    null;


  saveSession();


  currentChat =
    {
      type:
        "community",

      userId:
        null
    };


  setRoute(
    "home"
  );


  toast(
    "Bạn đã đăng xuất."
  );

}


/* =========================================================
   CHAT
   ========================================================= */


function getChatMessages() {

  const me =
    currentUser();

  if (!me) {

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
          ) -
          new Date(
            b.createdAt
          )
      );

  }


  return db.messages
    .filter(
      message => {

        if (
          message.channel !==
          "direct"
        ) {

          return false;

        }


        return (
          (
            message.fromUserId ===
            me.id &&
            message.toUserId ===
            currentChat.userId
          )
          ||
          (
            message.fromUserId ===
            currentChat.userId &&
            message.toUserId ===
            me.id
          )
        );

      }
    )
    .sort(
      (
        a,
        b
      ) =>
        new Date(
          a.createdAt
        ) -
        new Date(
          b.createdAt
        )
    );

}


function sendMessage(
  text
) {

  const me =
    currentUser();


  if (!me) {

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


  if (!clean) {

    return;

  }


  const message = {

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
      new Date().toISOString(),

    readBy:
      [me.id]

  };


  db.messages.push(
    message
  );


  saveDatabase();


  render();


  setTimeout(
    () => {

      const messages =
        $(
          "#chatMessages"
        );

      if (messages) {

        messages.scrollTop =
          messages.scrollHeight;

      }

    },
    20
  );

}


function deleteMessage(
  messageId
) {

  const me =
    currentUser();


  const message =
    db.messages.find(
      item =>
        item.id ===
        messageId
    );


  if (!message) {

    return;

  }


  const canDelete =
    isAdmin()
    ||
    message.fromUserId ===
    me?.id;


  if (!canDelete) {

    toast(
      "Bạn không thể xóa tin nhắn này."
    );

    return;

  }


  db.messages =
    db.messages.filter(
      item =>
        item.id !==
        messageId
    );


  saveDatabase();

  render();

}


function selectCommunityChat() {

  currentChat =
    {
      type:
        "community",

      userId:
        null
    };


  setRoute(
    "chat"
  );

}


function selectDirectChat(
  userId
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
    userId ===
    me.id
  ) {

    setRoute(
      "profile"
    );

    return;

  }


  currentChat =
    {
      type:
        "direct",

      userId
    };


  const messages =
    getChatMessages();


  messages.forEach(
    markMessageRead
  );


  saveDatabase();

  setRoute(
    "chat"
  );

}


function renderChatSidebar() {

  const me =
    currentUser();


  if (!me) {

    return `
      <div class="empty-state">
        <div>
          <strong>Đăng nhập để chat</strong>
          Đăng nhập hoặc đăng ký để tham gia cộng đồng.
        </div>
      </div>
    `;

  }


  const users =
    db.users
      .filter(
        user =>
          user.id !==
          me.id
      )
      .filter(
        user =>
          !chatSearch
          ||
          user.username
            .toLowerCase()
            .includes(
              chatSearch
                .toLowerCase()
            )
          ||
          user.displayName
            .toLowerCase()
            .includes(
              chatSearch
                .toLowerCase()
            )
      )
      .sort(
        (
          a,
          b
        ) =>
          Number(
            isOnline(b)
          ) -
          Number(
            isOnline(a)
          )
      );


  return `

    <div class="conversation ${
      currentChat.type ===
      "community"
        ? "active"
        : ""
    }"
      data-chat-community
    >

      <div class="avatar small">
        💬
      </div>

      <div class="conversation-info">

        <strong>
          Community
        </strong>

        <small>
          Sảnh chat chung
        </small>

      </div>

    </div>


    <div style="
      margin:
        14px 10px 8px;
      color:
        var(--muted);
      font-size:
        10px;
      font-weight:
        800;
      text-transform:
        uppercase;
    ">
      Tin nhắn riêng
    </div>


    ${
      users.length
        ? users
            .map(
              user => {

                const unread =
                  unreadCountForUser(
                    user.id
                  );


                return `

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

                    ${avatarHTML(
                      user,
                      "small"
                    )}

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
                      unread > 0
                        ? `
                          <span class="
                            unread-badge
                          ">
                            ${
                              unread
                            }
                          </span>
                        `
                        : ""
                    }

                  </div>

                `;

              }
            )
            .join("")
        : `
          <div class="empty-state">
            Không tìm thấy user.
          </div>
        `
    }

  `;

}


function renderChatUsers() {

  const me =
    currentUser();


  if (!me) {

    return "";

  }


  const users =
    db.users
      .filter(
        user =>
          user.id !==
          me.id
      )
      .filter(
        user =>
          !userSearch
          ||
          user.username
            .toLowerCase()
            .includes(
              userSearch
                .toLowerCase()
            )
          ||
          user.displayName
            .toLowerCase()
            .includes(
              userSearch
                .toLowerCase()
            )
      )
      .sort(
        (
          a,
          b
        ) =>
          Number(
            isOnline(b)
          ) -
          Number(
            isOnline(a)
          )
      );


  return users.map(
    user => {

      const tier =
        getRatingTier(
          user.rating
        );


      return `

        <div
          class="user-row"
          data-chat-user-id="${
            user.id
          }"
        >

          ${avatarHTML(
            user,
            "small"
          )}

          <div class="user-meta">

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
                    isOnline(user)
                      ? "online"
                      : ""
                  }
                "></span>

                ${
                  isOnline(user)
                    ? "Online"
                    : "Offline"
                }

              </span>

              ·

              <span class="
                ${tier.className}
              ">
                ${
                  tier.name
                }
              </span>

            </small>

          </div>

        </div>

      `;

    }
  ).join("");

}


function renderChatMessages() {

  const me =
    currentUser();


  if (!me) {

    return `
      <div class="empty-state">
        <div>
          <strong>Chưa đăng nhập</strong>
          Đăng nhập để sử dụng Chat.
        </div>
      </div>
    `;

  }


  const messages =
    getChatMessages();


  messages.forEach(
    markMessageRead
  );


  if (!messages.length) {

    return `
      <div class="empty-state">
        <div>
          <strong>Chưa có tin nhắn</strong>
          Hãy gửi tin nhắn đầu tiên.
        </div>
      </div>
    `;

  }


  return messages.map(
    message => {

      const sender =
        getUserById(
          message.fromUserId
        );


      const mine =
        message.fromUserId ===
        me.id;


      return `

        <div class="
          message
          ${
            mine
              ? "mine"
              : ""
          }
        ">

          ${avatarHTML(
            sender,
            "small"
          )}

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
                      sender?.displayName ||
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
                ).replace(
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

              ${
                mine ||
                isAdmin()
                  ? `
                    ·
                    <button
                      class="btn-link"
                      data-delete-message-id="${
                        message.id
                      }"
                      style="
                        color:
                          var(--danger);
                        background:
                          none;
                        padding:
                          0;
                        cursor:
                          pointer;
                        font-size:
                          9px;
                      "
                    >
                      Xóa
                    </button>
                  `
                  : ""
              }

            </div>

          </div>

        </div>

      `;

    }
  ).join("");

}


function renderChatPage() {

  const me =
    currentUser();


  let headerTitle =
    "Community";


  let headerSub =
    "Sảnh chat chung của Phantom Forge";


  if (
    currentChat.type ===
    "direct"
  ) {

    const target =
      getUserById(
        currentChat.userId
      );


    if (!target) {

      currentChat =
        {
          type:
            "community",

          userId:
            null
        };

    } else {

      headerTitle =
        target.displayName;

      headerSub =
        `@${
          target.username
        } · ${
          isOnline(target)
            ? "Online"
            : "Offline"
        }`;

    }

  }


  return `

    <section class="
      page
      container
    ">

      <div class="
        section-header
      ">

        <div>

          <span class="
            eyebrow
          ">
            REALTIME COMMUNITY
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
            Trò chuyện với cộng đồng hoặc chọn một user để nhắn riêng.
          </p>

        </div>

      </div>


      <div class="
        chat-layout
      ">


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
              Tìm user để bắt đầu chat.
            </p>

            <div
              class="search-box"
              style="
                margin-top:
                  12px;
              "
            >

              <input
                id="chatSearchInput"
                value="${
                  escapeHTML(
                    chatSearch
                  )
                }"
                placeholder="Tìm username..."
              >

            </div>

          </div>


          <div
            class="
              chat-conversations
            "
            id="chatConversations"
          >
            ${
              renderChatSidebar()
            }
          </div>

        </aside>


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
                    getUserById(
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
                    headerTitle
                  )
                }
              </strong>

              <small>
                ${
                  escapeHTML(
                    headerSub
                  )
                }
              </small>

            </div>

          </header>


          <div
            class="
              chat-messages
            "
            id="chatMessages"
          >

            ${
              renderChatMessages()
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
              placeholder="${
                me
                  ? "Viết tin nhắn..."
                  : "Đăng nhập để chat..."
              }"
              ${
                me
                  ? ""
                  : "disabled"
              }
            ></textarea>

            <button
              class="
                btn
                btn-primary
              "
              type="submit"
            >
              Gửi
            </button>

          </form>


        </section>


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
              class="
                search-box
              "
              style="
                margin-top:
                  12px;
              "
            >

              <input
                id="userSearchInput"
                value="${
                  escapeHTML(
                    userSearch
                  )
                }"
                placeholder="Tìm thành viên..."
              >

            </div>

          </div>


          <div
            class="
              chat-users-list
            "
          >

            ${
              renderChatUsers()
            }

          </div>

        </aside>


      </div>

    </section>

  `;

}


/* =========================================================
   PAGES
   ========================================================= */


function renderHomePage() {

  const me =
    currentUser();


  const solvedCount =
    me
      ? db.submissions.filter(
          submission =>
            submission.userId ===
              me.id &&
            submission.verdict ===
              "Accepted"
        ).length
      : 0;


  return `

    <section class="
      container
      hero
    ">

      <div>

        <span class="eyebrow">
          <span
            style="
              width:
                7px;
              height:
                7px;
              border-radius:
                50%;
              background:
                var(--success);
            "
          ></span>

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

          Phantom Forge Core OJ là không gian luyện thuật toán,
          thi đấu coding, theo dõi rating và kết nối cộng đồng lập trình viên.

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
              btn-secondary
            "
            data-route="chat"
          >
            💬 Vào phòng Chat
          </button>

        </div>

      </div>


      <div class="
        hero-panel
      ">

        <div class="
          hero-orb
        ">
          PF
        </div>

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
            ${
              me
                ? "Bạn đã AC"
                : "Online"
            }
          </span>

          <div class="
            stat-value
          ">
            ${
              me
                ? solvedCount
                : db.users.filter(
                    isOnline
                  ).length
            }
          </div>

        </div>

      </div>


      <div style="
        height:
          22px;
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

          <p class="muted">
            Giải các bài tập theo độ khó và tích lũy thành tích.
          </p>

          <button
            class="
              btn
              btn-secondary
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
            🏆 Thi đấu
          </h3>

          <p class="muted">
            Tham gia contest, theo dõi bảng xếp hạng và rating.
          </p>

          <button
            class="
              btn
              btn-secondary
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
            💬 Kết nối
          </h3>

          <p class="muted">
            Tìm user khác, chat cộng đồng và nhắn riêng.
          </p>

          <button
            class="
              btn
              btn-secondary
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


function renderProblemsPage() {

  const list =
    db.problems.filter(
      problem => {

        if (
          !problemsSearch
        ) {

          return true;

        }


        const query =
          problemsSearch
            .toLowerCase();


        return (
          problem.code
            .toLowerCase()
            .includes(
              query
            )
          ||
          problem.title
            .toLowerCase()
            .includes(
              query
            )
        );

      }
    );


  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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
        Luyện tập từ bài cơ bản đến bài nâng cao.
      </p>


      <div class="
        search-box
        "
        style="
          max-width:
            520px;
          margin-bottom:
            22px;
        "
      >

        <input
          id="problemsSearchInput"
          value="${
            escapeHTML(
              problemsSearch
            )
          }"
          placeholder="Tìm theo code hoặc tên bài..."
        >

      </div>


      <div class="
        grid
        grid-3
      ">

        ${
          list.length
            ? list.map(
                problem =>
                  `

                    <article class="
                      card
                      problem-card
                    ">

                      <div class="
                        problem-card-head
                      ">

                        <div>

                          <div class="
                            problem-code
                          ">
                            ${
                              escapeHTML(
                                problem.code
                              )
                            }
                          </div>

                          <h3 class="
                            problem-title
                          ">
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
                        problem-description
                      ">
                        ${
                          escapeHTML(
                            problem.statement
                          )
                        }
                      </p>


                      <div
                        style="
                          display:
                            flex;
                          justify-content:
                            space-between;
                          align-items:
                            center;
                          margin-top:
                            auto;
                        "
                      >

                        <span class="muted">
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
              ).join("")
            : `
              <div class="
                card
                empty-state
              ">
                Không tìm thấy bài phù hợp.
              </div>
            `
        }

      </div>

    </section>

  `;

}


function renderContestsPage() {

  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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
        Luyện thi và cạnh tranh trên bảng xếp hạng.
      </p>


      <div class="
        grid
        grid-2
      ">

        ${
          db.contests.map(
            contest =>
              `

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
                    margin-top:
                      18px;
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
                      ${
                        contest.rated
                          ? "Tham gia Rated"
                          : "Luyện tập"
                      }
                    </button>

                  </div>

                </article>

              `
          ).join("")
        }

      </div>

    </section>

  `;

}


function renderSubmissionsPage() {

  const me =
    currentUser();


  const submissions =
    db.submissions
      .filter(
        submission =>
          isAdmin()
          ||
          !me
          ||
          submission.userId ===
          me.id
      )
      .sort(
        (
          a,
          b
        ) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );


  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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
            ? "Admin xem được bài nộp của tất cả user."
            : me
              ? "Lịch sử bài nộp của bạn."
              : "Đăng nhập để xem lịch sử bài nộp."
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
                  ? submissions.map(
                      submission => {

                        const user =
                          getUserById(
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
                                  user?.username ||
                                  "Unknown"
                                )
                              }
                            </td>

                            <td>
                              ${
                                escapeHTML(
                                  problem?.title ||
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
                              <strong
                                style="
                                  color:
                                  ${
                                    submission.verdict ===
                                    "Accepted"
                                      ? "var(--success)"
                                      : "var(--danger)"
                                  };
                                "
                              >
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
                    ).join("")
                  : `

                      <tr>

                        <td
                          colspan="5"
                          style="
                            text-align:
                              center;
                            padding:
                              40px;
                            color:
                              var(--muted);
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


function renderRankingPage() {

  const ranking =
    [...db.users]
      .sort(
        (
          a,
          b
        ) =>
          b.rating -
          a.rating
      );


  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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
        Bảng xếp hạng theo rating hiện tại.
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
                  Hạng
                </th>

                <th>
                  Trạng thái
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
                      getRatingTier(
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
                            display:
                              flex;
                            align-items:
                              center;
                            gap:
                              10px;
                          ">

                            ${avatarHTML(
                              user,
                              "small"
                            )}

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
                            ${tier.className}
                          ">
                            ${
                              user.rating
                            }
                          </strong>
                        </td>


                        <td>

                          <span class="
                            ${tier.className}
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
                ).join("")
              }

            </tbody>

          </table>

        </div>

      </div>

    </section>

  `;

}


function renderUsersPage() {

  const users =
    db.users.filter(
      user => {

        if (!userSearch) {

          return true;

        }


        const query =
          userSearch
            .toLowerCase();


        return (
          user.username
            .toLowerCase()
            .includes(
              query
            )
          ||
          user.displayName
            .toLowerCase()
            .includes(
              query
            )
        );

      }
    );


  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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
        Tìm user, xem trạng thái và nhắn tin riêng.
      </p>


      <div class="
        search-box
        "
        style="
          max-width:
            520px;
          margin-bottom:
            22px;
        "
      >

        <input
          id="usersSearchInput"
          value="${
            escapeHTML(
              userSearch
            )
          }"
          placeholder="Tìm tên hoặc username..."
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
                getRatingTier(
                  user.rating
                );


              return `

                <article class="
                  card
                ">

                  <div style="
                    display:
                      flex;
                    gap:
                      13px;
                    align-items:
                      center;
                  ">

                    ${avatarHTML(
                      user,
                      "large"
                    )}

                    <div>

                      <h3 style="
                        margin:
                          0 0 4px;
                      ">
                        ${
                          escapeHTML(
                            user.displayName
                          )
                        }
                      </h3>

                      <div class="
                        muted
                        mono
                      ">
                        @${escapeHTML(
                          user.username
                        )}
                      </div>

                    </div>

                  </div>


                  <p class="muted">
                    ${
                      escapeHTML(
                        user.bio ||
                        "Chưa có mô tả."
                      )
                    }
                  </p>


                  <div style="
                    display:
                      flex;
                    gap:
                      14px;
                    flex-wrap:
                      wrap;
                  ">

                    <span class="
                      ${tier.className}
                    ">
                      ⭐ ${
                        user.rating
                      } · ${
                        tier.name
                      }
                    </span>


                    <span class="
                      online-status
                    ">

                      <span class="
                        online-dot
                        ${
                          isOnline(user)
                            ? "online"
                            : ""
                        }
                      "></span>

                      ${
                        isOnline(user)
                          ? "Online"
                          : "Offline"
                      }

                    </span>

                  </div>


                  <div class="
                    profile-actions
                  ">

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

                    <button
                      class="
                        btn
                        btn-secondary
                        btn-sm
                      "
                      data-view-profile="${
                        user.id
                      }"
                    >
                      Xem hồ sơ
                    </button>

                  </div>

                </article>

              `;

            }
          ).join("")
        }

      </div>

    </section>

  `;

}


function renderProfilePage() {

  const me =
    currentUser();


  if (!me) {

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

            Đăng nhập để xem hồ sơ cá nhân.

            <div style="
              margin-top:
                15px;
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
    getRatingTier(
      me.rating
    );


  const solved =
    db.submissions.filter(
      submission =>
        submission.userId ===
          me.id &&
        submission.verdict ===
          "Accepted"
    ).length;


  return `

    <section class="
      page
      container
    ">

      <span class="eyebrow">
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

        ${avatarHTML(
          me,
          "large"
        )}


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
            display:
              flex;
            flex-wrap:
              wrap;
            gap:
              14px;
          ">

            <span class="
              ${tier.className}
            ">
              Rating:
              ${
                me.rating
              }
            </span>

            <span>
              🏆 ${
                solved
              }
              Accepted
            </span>

            <span>
              ◉ ${
                me.orbs === -1
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
                btn-secondary
              "
              data-route="submissions"
            >
              Xem bài nộp
            </button>

            <button
              class="
                btn
                btn-secondary
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


function renderAdminPage() {

  if (!isAdmin()) {

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

            Chỉ Admin mới xem được trang này.

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

      <span class="eyebrow">
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
        admin-banner
        "
        style="
          margin-bottom:
            18px;
        "
      >

        Admin có thể xem toàn bộ user và dữ liệu chat của hệ thống frontend demo.

      </div>


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


      <div style="
        height:
          20px;
      "></div>


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
                  Role
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                db.users.map(
                  user =>
                    `

                      <tr>

                        <td>

                          <div style="
                            display:
                              flex;
                            align-items:
                              center;
                            gap:
                              10px;
                          ">

                            ${avatarHTML(
                              user,
                              "small"
                            )}

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
                          ${
                            ROLE_LABELS[
                              user.role
                            ] ||
                            user.role
                          }
                        </td>


                        <td>
                          ${
                            user.rating
                          }
                        </td>


                        <td>

                          ${
                            isOnline(user)
                              ? "🟢 Online"
                              : "⚪ Offline"
                          }

                        </td>


                        <td>

                          ${
                            user.id !==
                            currentUser()
                              ?.id
                              ? `
                                <button
                                  class="
                                    btn
                                    btn-danger
                                    btn-sm
                                  "
                                  data-admin-delete-user="${
                                    user.id
                                  }"
                                >
                                  Xóa
                                </button>
                              `
                              : `
                                <span class="
                                  muted
                                ">
                                  Current
                                </span>
                              `
                          }

                        </td>

                      </tr>

                    `
                ).join("")
              }

            </tbody>

          </table>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   SUBMIT SIMULATION
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


  if (!problem) {

    return;

  }


  if (!currentUser()) {

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

    <h2 style="
      margin-bottom:
        5px;
    ">
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


    <div class="
      form-grid
    ">

      <label>

        Ngôn ngữ

        <select
          id="submitLanguage"
        >

          ${
            ALLOWED_LANGUAGES.map(
              language =>
                `
                  <option>
                    ${
                      language
                    }
                  </option>
                `
            ).join("")
          }

        </select>

      </label>


      <label>

        Bài nộp

        <input
          id="submitFileName"
          value="solution"
          placeholder="Tên file"
        >

      </label>

    </div>


    <label
      style="
        margin-top:
          14px;
      "
    >

      Source Code

      <textarea
        id="submitCode"
        style="
          min-height:
            240px;
          font-family:
            'JetBrains Mono',
            monospace;
          font-size:
            12px;
        "
        placeholder="Dán code của bạn vào đây..."
      ></textarea>

    </label>


    <div style="
      display:
        flex;
      justify-content:
        flex-end;
      gap:
        8px;
      margin-top:
        16px;
    ">

      <button
        class="
          btn
          btn-secondary
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
  ).classList.remove(
    "hidden"
  );

}


function submitSolution(
  problemId
) {

  const me =
    currentUser();


  if (!me) {

    openAuth(
      "login"
    );

    return;

  }


  const language =
    $(
      "#submitLanguage"
    ).value;


  const code =
    $(
      "#submitCode"
    ).value.trim();


  if (!code) {

    toast(
      "Hãy nhập source code."
    );

    return;

  }


  /*
    Đây là judge mô phỏng.
    Không phải compiler/judge thật.
  */


  const verdict =
    code.length >= 15
      ? "Accepted"
      : "Wrong Answer";


  const problem =
    db.problems.find(
      item =>
        item.id ===
        Number(
          problemId
        )
    );


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

    language,

    codeLength:
      code.length,

    verdict,

    createdAt:
      new Date().toISOString()

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


  saveDatabase();

  closeModal(
    "submitModal"
  );

  toast(
    verdict ===
      "Accepted"
      ? `Accepted: ${
          problem?.title ||
          "Problem"
        }`
      : "Wrong Answer: code mô phỏng chưa đạt."
  );

  setRoute(
    "submissions"
  );

}


/* =========================================================
   EVENTS
   ========================================================= */


function setupEvents() {

  document.addEventListener(
    "click",
    event => {

      const routeButton =
        event.target.closest(
          "[data-route]"
        );


      if (
        routeButton
      ) {

        event.preventDefault();


        const route =
          routeButton.dataset.route;


        setRoute(
          route
        );


        $(
          "#mainNav"
        )?.classList.remove(
          "open"
        );


        $(
          "#accountDropdown"
        )?.classList.add(
          "hidden"
        );


        return;

      }


      const closeButton =
        event.target.closest(
          "[data-close-modal]"
        );


      if (
        closeButton
      ) {

        closeModal(
          closeButton
            .dataset
            .closeModal
        );

        return;

      }


      const authButton =
        event.target.closest(
          "[data-auth-tab]"
        );


      if (
        authButton
      ) {

        switchAuthTab(
          authButton
            .dataset
            .authTab
        );

        return;

      }


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


      if (
        event.target.closest(
          "#logoutBtn"
        )
      ) {

        logout();

        return;

      }


      if (
        event.target.closest(
          "#themeToggle"
        )
      ) {

        toggleTheme();

        return;

      }


      if (
        event.target.closest(
          "#mobileMenuBtn"
        )
      ) {

        $(
          "#mainNav"
        )?.classList.toggle(
          "open"
        );

        return;

      }


      if (
        event.target.closest(
          "#accountTrigger"
        )
      ) {

        $(
          "#accountDropdown"
        )?.classList.toggle(
          "hidden"
        );

        return;

      }


      if (
        event.target.closest(
          "[data-chat-community]"
        )
      ) {

        selectCommunityChat();

        return;

      }


      const chatUser =
        event.target.closest(
          "[data-chat-user-id]"
        );


      if (
        chatUser
      ) {

        selectDirectChat(
          Number(
            chatUser.dataset
              .chatUserId
          )
        );

        return;

      }


      const deleteButton =
        event.target.closest(
          "[data-delete-message-id]"
        );


      if (
        deleteButton
      ) {

        deleteMessage(
          Number(
            deleteButton
              .dataset
              .deleteMessageId
          )
        );

        return;

      }


      const submitButton =
        event.target.closest(
          "[data-open-submit]"
        );


      if (
        submitButton
      ) {

        openSubmitModal(
          Number(
            submitButton
              .dataset
              .openSubmit
          )
        );

        return;

      }


      const submitCode =
        event.target.closest(
          "[data-submit-code]"
        );


      if (
        submitCode
      ) {

        submitSolution(
          Number(
            submitCode
              .dataset
              .submitCode
          )
        );

        return;

      }


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
          "Bạn đã tham gia kỳ thi. Đây là bản frontend demo."
        );

        return;

      }


      const profileButton =
        event.target.closest(
          "[data-view-profile]"
        );


      if (
        profileButton
      ) {

        selectDirectChat(
          Number(
            profileButton
              .dataset
              .viewProfile
          )
        );

        return;

      }


      const deleteUser =
        event.target.closest(
          "[data-admin-delete-user]"
        );


      if (
        deleteUser
      ) {

        adminDeleteUser(
          Number(
            deleteUser
              .dataset
              .adminDeleteUser
          )
        );

        return;

      }


      if (
        event.target.closest(
          "[data-open-login]"
        )
      ) {

        openAuth(
          "login"
        );

      }

    }
  );


  document.addEventListener(
    "submit",
    async event => {

      if (
        event.target.id ===
        "loginForm"
      ) {

        event.preventDefault();


        try {

          await login(
            $(
              "#loginUsername"
            ).value,

            $(
              "#loginPassword"
            ).value
          );

          event.target.reset();

        } catch (
          error
        ) {

          toast(
            error.message
          );

        }

      }


      if (
        event.target.id ===
        "registerForm"
      ) {

        event.preventDefault();


        try {

          await register(

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

        } catch (
          error
        ) {

          toast(
            error.message
          );

        }

      }


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

      }

    }
  );


  document.addEventListener(
    "input",
    event => {

      if (
        event.target.id ===
        "chatSearchInput"
      ) {

        chatSearch =
          event.target.value;

        renderChatSidebarOnly();

      }


      if (
        event.target.id ===
        "userSearchInput"
      ) {

        userSearch =
          event.target.value;

        renderChatUsersOnly();

      }


      if (
        event.target.id ===
        "usersSearchInput"
      ) {

        userSearch =
          event.target.value;

        render();

      }


      if (
        event.target.id ===
        "problemsSearchInput"
      ) {

        problemsSearch =
          event.target.value;

        render();

      }

    }
  );


  window.addEventListener(
    "hashchange",
    () => {

      currentRoute =
        getRoute();

      render();

    }
  );


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


function renderChatSidebarOnly() {

  const container =
    $(
      "#chatConversations"
    );


  if (
    container
  ) {

    container.innerHTML =
      renderChatSidebar();

  }

}


function renderChatUsersOnly() {

  const list =
    $(
      ".chat-users-list"
    );


  if (
    list
  ) {

    list.innerHTML =
      renderChatUsers();

  }

}


function adminDeleteUser(
  userId
) {

  if (!isAdmin()) {

    toast(
      "Không có quyền."
    );

    return;

  }


  if (
    userId ===
    currentUser()?.id
  ) {

    toast(
      "Không thể tự xóa chính mình."
    );

    return;

  }


  const target =
    getUserById(
      userId
    );


  if (!target) {

    return;

  }


  const confirmed =
    window.confirm(
      `Xóa user @${target.username}?`
    );


  if (!confirmed) {

    return;

  }


  db.users =
    db.users.filter(
      user =>
        user.id !==
        userId
    );


  db.messages =
    db.messages.filter(
      message =>
        message.fromUserId !==
        userId &&
        message.toUserId !==
        userId
    );


  saveDatabase();

  toast(
    "Đã xóa user."
  );

  render();

}


/* =========================================================
   THEME
   ========================================================= */


function loadTheme() {

  const saved =
    localStorage.getItem(
      THEME_KEY
    );


  const theme =
    saved ||
    "dark";


  document.body.classList.toggle(
    "light",
    theme ===
    "light"
  );


  updateThemeButton();

}


function toggleTheme() {

  const next =
    document.body.classList.contains(
      "light"
    )
      ? "dark"
      : "light";


  document.body.classList.toggle(
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


function updateThemeButton() {

  const button =
    $(
      "#themeToggle"
    );


  if (!button) {

    return;

  }


  button.textContent =
    document.body.classList.contains(
      "light"
    )
      ? "🌙"
      : "☀️";

}


/* =========================================================
   HEADER
   ========================================================= */


function renderHeader() {

  const me =
    currentUser();


  const loginButton =
    $(
      "#loginBtn"
    );


  const registerButton =
    $(
      "#registerBtn"
    );


  const accountMenu =
    $(
      "#accountMenu"
    );


  const orbWallet =
    $(
      "#orbWallet"
    );


  if (!me) {

    loginButton
      ?.classList.remove(
        "hidden"
      );

    registerButton
      ?.classList.remove(
        "hidden"
      );

    accountMenu
      ?.classList.add(
        "hidden"
      );

    orbWallet
      ?.classList.add(
        "hidden"
      );

    return;

  }


  loginButton
    ?.classList.add(
      "hidden"
    );


  registerButton
    ?.classList.add(
      "hidden"
    );


  accountMenu
    ?.classList.remove(
      "hidden"
    );


  orbWallet
    ?.classList.remove(
      "hidden"
    );


  $(
    "#headerAvatar"
  ).innerHTML =
    avatarHTML(
      me,
      "small"
    );


  $(
    "#headerUsername"
  ).textContent =
    me.displayName;


  $(
    "#headerRole"
  ).textContent =
    ROLE_LABELS[
      me.role
    ] ||
    me.role;


  $(
    "#orbAmount"
  ).textContent =
    me.orbs ===
    -1
      ? "∞"
      : me.orbs;


  $(
    "#adminDashboardBtn"
  )?.classList.toggle(
    "hidden",
    !isAdmin()
  );

}


/* =========================================================
   MAIN RENDER
   ========================================================= */


function renderPage() {

  switch (
    currentRoute
  ) {

    case "home":
      return renderHomePage();


    case "problems":
      return renderProblemsPage();


    case "contests":
      return renderContestsPage();


    case "submissions":
      return renderSubmissionsPage();


    case "ranking":
      return renderRankingPage();


    case "users":
      return renderUsersPage();


    case "chat":
      return renderChatPage();


    case "profile":
      return renderProfilePage();


    case "admin":
      return renderAdminPage();


    default:
      currentRoute =
        "home";

      return renderHomePage();

  }

}


function render() {

  const app =
    $(
      "#app"
    );


  if (!app) {

    return;

  }


  app.innerHTML =
    renderPage();


  renderHeader();


  $$(".main-nav a").forEach(
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

        const messages =
          $(
            "#chatMessages"
          );

        if (
          messages
        ) {

          messages.scrollTop =
            messages.scrollHeight;

        }

      }
    );

  }

}


/* =========================================================
   BOOT
   ========================================================= */


function boot() {

  setupBroadcast();

  setupEvents();

  loadTheme();

  render();

  updatePresence();


  $(
    "#currentYear"
  ).textContent =
    new Date()
      .getFullYear();

}


boot();
