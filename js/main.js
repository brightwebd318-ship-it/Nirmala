/* ============================================================
   NIRMALA MEDICAL CENTER — MAIN JAVASCRIPT
   ============================================================ */

/* ============================================================
   THEME (DARK/LIGHT MODE)
   ============================================================ */
const ThemeManager = {
  STORAGE_KEY: 'nmc-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'light';
    this.apply(saved);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

/* ============================================================
   NAVBAR
   ============================================================ */
const NavManager = {
  init() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    // Mobile toggle
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      navMenu.querySelectorAll('a, .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          navMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });

    // Theme toggles
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => ThemeManager.toggle());
    });
  }
};

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
const ScrollAnimations = {
  init() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }
};

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animate(el) {
    const target = parseInt(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
};

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
const TestimonialSlider = {
  current: 0,
  total: 0,
  autoPlay: null,

  init() {
    const wrapper = document.querySelector('.testimonial-slider-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.slider-track');
    const slides = track?.querySelectorAll('.slider-slide');
    if (!slides?.length) return;

    this.total = slides.length;
    const dotsContainer = wrapper.querySelector('.slider-dots');
    const prevBtn = wrapper.querySelector('[data-slide="prev"]');
    const nextBtn = wrapper.querySelector('[data-slide="next"]');

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => this.goTo(i, track, slides, dotsContainer));
        dotsContainer.appendChild(dot);
      });
    }

    prevBtn?.addEventListener('click', () => {
      this.current = (this.current - 1 + this.total) % this.total;
      this.update(track, slides, dotsContainer);
    });

    nextBtn?.addEventListener('click', () => {
      this.current = (this.current + 1) % this.total;
      this.update(track, slides, dotsContainer);
    });

    this.startAutoPlay(track, slides, dotsContainer);
  },

  goTo(index, track, slides, dots) {
    this.current = index;
    this.update(track, slides, dots);
  },

  update(track, slides, dots) {
    track.style.transform = `translateX(-${this.current * 100}%)`;
    dots?.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  },

  startAutoPlay(track, slides, dots) {
    this.autoPlay = setInterval(() => {
      this.current = (this.current + 1) % this.total;
      this.update(track, slides, dots);
    }, 5000);
  }
};

/* ============================================================
   AI CHAT WIDGET
   ============================================================ */
const ChatWidget = {
  responses: {
    greeting: "Hello! I'm NirmalaCare AI 🏥 How can I assist you today?",
    appointment: "📅 You can book an appointment online or call us at +91-9876543210. Would you like me to take you to our booking page?",
    emergency: "🚨 For emergencies, call our 24/7 hotline: 108 or 1800-XXX-XXXX. Our emergency team is always ready!",
    doctors: "👨‍⚕️ We have 50+ specialist doctors. Visit our Doctors page to find the right specialist for you.",
    departments: "🏥 We have 12+ departments including Cardiology, Neurology, Gynecology, Pediatrics, and more.",
    timing: "⏰ OPD Hours: Mon–Sat 8AM–8PM. Emergency: 24/7. Lab: 7AM–9PM.",
    location: "📍 Nirmala Medical Center, Medical Campus Road, City – 500001. Near City Railway Station.",
    default: "I'm here to help! You can ask about appointments, doctors, departments, emergency services, or visiting hours. 😊"
  },

  init() {
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    const panel = document.querySelector('.chat-panel');
    const closeBtn = panel?.querySelector('.chat-close');
    const sendBtn = panel?.querySelector('.chat-send-btn');
    const input = panel?.querySelector('.chat-input');
    const quickReplies = panel?.querySelectorAll('.quick-reply');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) input?.focus();
    });

    closeBtn?.addEventListener('click', () => panel.classList.remove('open'));

    const send = () => {
      const text = input?.value.trim();
      if (!text) return;
      this.addMessage(text, 'user');
      input.value = '';
      setTimeout(() => this.addMessage(this.getResponse(text), 'bot'), 800);
    };

    sendBtn?.addEventListener('click', send);
    input?.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });

    quickReplies?.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent;
        this.addMessage(text, 'user');
        setTimeout(() => this.addMessage(this.getResponse(text), 'bot'), 800);
      });
    });

    // Welcome message
    setTimeout(() => {
      if (panel.classList.contains('open')) return;
      this.addMessage(this.responses.greeting, 'bot');
    }, 100);
  },

  addMessage(text, type) {
    const messages = document.querySelector('.chat-messages');
    if (!messages) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  },

  getResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('appoint') || t.includes('book')) return this.responses.appointment;
    if (t.includes('emerg') || t.includes('ambulan') || t.includes('urgent')) return this.responses.emergency;
    if (t.includes('doctor') || t.includes('specialist')) return this.responses.doctors;
    if (t.includes('depart') || t.includes('cardiolog') || t.includes('neurol')) return this.responses.departments;
    if (t.includes('time') || t.includes('hour') || t.includes('opd') || t.includes('open')) return this.responses.timing;
    if (t.includes('locat') || t.includes('address') || t.includes('where')) return this.responses.location;
    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) return this.responses.greeting;
    return this.responses.default;
  }
};

/* ============================================================
   MODALS
   ============================================================ */
const ModalManager = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  close(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  init() {
    // Open triggers
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => this.open(btn.dataset.modalOpen));
    });

    // Close triggers
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close(btn.dataset.modalClose));
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.close(overlay.id);
      });
    });

    // ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(modal => {
          this.close(modal.id);
        });
      }
    });
  }
};

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
const Toast = {
  show(message, type = 'success', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

/* ============================================================
   ACCORDION
   ============================================================ */
const AccordionManager = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

        // Open clicked if was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

/* ============================================================
   SMOOTH SCROLL TO ANCHOR
   ============================================================ */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

/* ============================================================
   FILTER TABS
   ============================================================ */
const FilterTabs = {
  init() {
    document.querySelectorAll('.filter-tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          tabGroup.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.filter;
          const targetSelector = tabGroup.dataset.target;
          if (targetSelector) {
            document.querySelectorAll(targetSelector).forEach(item => {
              if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            });
          }
          // Dispatch event
          document.dispatchEvent(new CustomEvent('filterChange', { detail: { filter } }));
        });
      });
    });
  }
};

/* ============================================================
   BACK TO TOP
   ============================================================ */
const BackToTop = {
  init() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position: fixed; bottom: 90px; right: 24px;
      width: 44px; height: 44px;
      border-radius: 50%; border: 2px solid var(--border);
      background: var(--bg-card); color: var(--primary);
      font-size: 1.2rem; font-weight: 700;
      display: none; align-items: center; justify-content: center;
      cursor: pointer; z-index: 99;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btn.addEventListener('mouseenter', () => btn.style.background = 'var(--primary)' + ' ' + btn.style.background.replace('var(--bg-card)', ''));
  }
};

/* ============================================================
   PROGRESS BAR (PAGE LOADING)
   ============================================================ */
const PageProgress = {
  init() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      z-index: 9999; transition: width 0.3s ease;
      width: 0%;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }, { passive: true });
  }
};

/* ============================================================
   GLOBAL INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  TestimonialSlider.init();
  ChatWidget.init();
  ModalManager.init();
  AccordionManager.init();
  SmoothScroll.init();
  FilterTabs.init();
  BackToTop.init();
  PageProgress.init();

  // Page transition
  document.body.classList.add('page-transition');
});
