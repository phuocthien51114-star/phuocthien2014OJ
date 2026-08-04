/* ============================================
   ENHANCED FEATURES v2 - Advanced Functionality
   ============================================ */

// ===== Toast & Notification System =====
class NotificationCenter {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  notify(text, type = 'info', duration = 3000) {
    this.queue.push({ text, type, duration });
    if (!this.isProcessing) this.process();
  }

  process() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }
    this.isProcessing = true;
    const { text, type, duration } = this.queue.shift();
    this.show(text, type, duration);
  }

  show(text, type, duration) {
    const wrap = $("#toastWrap");
    if (!wrap) return;
    const node = document.createElement("div");
    node.className = `toast toast-${type}`;
    node.textContent = text;
    node.style.animationDuration = duration + 'ms';
    wrap.append(node);

    setTimeout(() => {
      node.remove();
      this.process();
    }, duration);
  }
}

const notifyCenter = new NotificationCenter();

// ===== Advanced Search System =====
class SearchEngine {
  constructor(data) {
    this.data = data;
    this.cache = new Map();
  }

  search(query, limit = 10) {
    if (!query) return [];
    const key = `${query}:${limit}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const q = query.toLowerCase();
    const results = this.data
      .map(item => ({
        ...item,
        score: this.calculateScore(item, q)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...item }) => item);

    this.cache.set(key, results);
    return results;
  }

  calculateScore(item, query) {
    let score = 0;
    const searchFields = [
      { field: 'title', weight: 3 },
      { field: 'code', weight: 2 },
      { field: 'username', weight: 2 },
      { field: 'displayName', weight: 1 },
      { field: 'statement', weight: 0.5 }
    ];

    searchFields.forEach(({ field, weight }) => {
      if (item[field]) {
        const text = String(item[field]).toLowerCase();
        if (text === query) score += 10 * weight;
        else if (text.startsWith(query)) score += 5 * weight;
        else if (text.includes(query)) score += 2 * weight;
      }
    });

    return score;
  }

  clearCache() {
    this.cache.clear();
  }
}

// ===== Performance Monitor =====
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTime: [],
      loadTime: [],
      apiCalls: 0
    };
  }

  startMeasure(label) {
    return performance.now();
  }

  endMeasure(label, start) {
    const duration = performance.now() - start;
    if (label === 'render') this.metrics.renderTime.push(duration);
    if (label === 'load') this.metrics.loadTime.push(duration);
    return duration;
  }

  getStats() {
    return {
      avgRenderTime: this.avg(this.metrics.renderTime),
      avgLoadTime: this.avg(this.metrics.loadTime),
      apiCalls: this.metrics.apiCalls
    };
  }

  avg(arr) {
    if (!arr.length) return 0;
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }
}

const perfMonitor = new PerformanceMonitor();

// ===== Lazy Load Images =====
function enableLazyLoading() {
  if (!window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      }
    });
  });

  $$('img[data-src]').forEach(img => observer.observe(img));
}

// ===== Analytics Tracker =====
class AnalyticsTracker {
  constructor() {
    this.events = [];
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data
    };
    this.events.push(event);
    
    // Log to console in dev mode
    if (location.hostname === 'localhost') {
      console.log('📊 Event:', event);
    }
  }

  getTopEvents(limit = 5) {
    const counts = {};
    this.events.forEach(e => {
      counts[e.name] = (counts[e.name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  exportEvents() {
    return JSON.stringify(this.events, null, 2);
  }
}

const analytics = new AnalyticsTracker();

// ===== Debounce Helper =====
function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== Throttle Helper =====
function throttle(fn, delay = 300) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// ===== Local Storage Manager =====
class StorageManager {
  static set(key, value, ttl = null) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    const item = JSON.parse(localStorage.getItem(key) || 'null');
    if (!item) return null;
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

// ===== Network Status =====
class NetworkStatus {
  constructor() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  handleOnline() {
    this.isOnline = true;
    notifyCenter.notify('🌐 Online', 'success', 2000);
  }

  handleOffline() {
    this.isOnline = false;
    notifyCenter.notify('⚠️ Offline - Some features may not work', 'error', 3000);
  }
}

const networkStatus = new NetworkStatus();

// ===== Validation Helpers =====
const Validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  username: (value) => /^[A-Za-z0-9_]{3,24}$/.test(value),
  password: (value) => value.length >= 6,
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  phone: (value) => /^\d{10,}$/.test(value.replace(/\D/g, '')),
  creditCard: (value) => /^\d{13,19}$/.test(value.replace(/\D/g, ''))
};

// ===== Format Helpers =====
const Formatters = {
  currency: (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  },

  number: (value, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  duration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  },

  fileSize: (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  },

  percentage: (value, total) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  }
};

// ===== DOM Helpers =====
const DOM = {
  create: (tag, attrs = {}, content = '') => {
    const el = document.createElement(tag);
    Object.assign(el, attrs);
    if (content) el.innerHTML = content;
    return el;
  },

  addClass: (el, ...classes) => {
    el.classList.add(...classes);
  },

  removeClass: (el, ...classes) => {
    el.classList.remove(...classes);
  },

  toggleClass: (el, className) => {
    el.classList.toggle(className);
  },

  hasClass: (el, className) => {
    return el.classList.contains(className);
  },

  on: (el, event, handler) => {
    el.addEventListener(event, handler);
  },

  off: (el, event, handler) => {
    el.removeEventListener(event, handler);
  },

  delegate: (parent, selector, event, handler) => {
    parent.addEventListener(event, (e) => {
      if (e.target.matches(selector)) handler.call(e.target, e);
    });
  }
};

// ===== Keyboard Shortcuts =====
class KeyboardManager {
  constructor() {
    this.shortcuts = new Map();
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  register(key, handler, ctrl = false, alt = false, shift = false) {
    const keyCombo = `${ctrl ? 'ctrl+' : ''}${alt ? 'alt+' : ''}${shift ? 'shift+' : ''}${key}`;
    this.shortcuts.set(keyCombo, handler);
  }

  handleKeydown(event) {
    const { key, ctrlKey, altKey, shiftKey } = event;
    const keyCombo = `${ctrlKey ? 'ctrl+' : ''}${altKey ? 'alt+' : ''}${shiftKey ? 'shift+' : ''}${key.toLowerCase()}`;
    
    const handler = this.shortcuts.get(keyCombo);
    if (handler) {
      event.preventDefault();
      handler();
    }
  }
}

const keyboardManager = new KeyboardManager();

// ===== Enhanced Analytics =====
function initEnhancedAnalytics() {
  // Track page views
  analytics.track('page_view', { 
    route: route(),
    timestamp: new Date().toISOString()
  });

  // Track user actions
  $$('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      analytics.track(el.dataset.track, {
        element: el.tagName,
        text: el.textContent
      });
    });
  });

  // Track form submissions
  $$('form').forEach(form => {
    form.addEventListener('submit', () => {
      analytics.track('form_submit', {
        formId: form.id || 'unknown',
        fields: [...new FormData(form).keys()]
      });
    });
  });
}

// ===== Initialize All Enhanced Features =====
function initEnhancedFeatures() {
  // Enable lazy loading
  enableLazyLoading();

  // Initialize analytics
  initEnhancedAnalytics();

  // Setup keyboard shortcuts
  keyboardManager.register('/', () => {
    const search = $("#problemSearch");
    if (search) search.focus();
  });

  keyboardManager.register('k', () => {
    // Open command palette (future feature)
  }, true);

  // Monitor performance
  const renderStart = perfMonitor.startMeasure('render');
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    console.log('📈 Performance Stats:', perfMonitor.getStats());
  });
}

// ===== Export Functions =====
window.enhancedUI = {
  notifyCenter,
  SearchEngine,
  analytics,
  debounce,
  throttle,
  StorageManager,
  Validators,
  Formatters,
  DOM,
  keyboardManager,
  networkStatus,
  perfMonitor,
  initEnhancedFeatures
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancedFeatures);
} else {
  initEnhancedFeatures();
}
