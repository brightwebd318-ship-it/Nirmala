/* ============================================================
   NIRMALA MEDICAL CENTER — PAGES JAVASCRIPT
   ============================================================ */

/* ============================================================
   APPOINTMENT PAGE — MULTI-STEP FORM
   ============================================================ */
const AppointmentForm = {
  currentStep: 1,
  totalSteps: 3,
  formData: {},

  doctorsByDept: {
    cardiology: ['Dr. Rajesh Kumar', 'Dr. Arun Sharma', 'Dr. Bindu Menon'],
    orthopedics: ['Dr. Vikram Nair', 'Dr. Karthik Rao', 'Dr. Shreya Pillai'],
    gynecology: ['Dr. Priya Sharma', 'Dr. Lalitha Devi', 'Dr. Sheela Krishnan'],
    pediatrics: ['Dr. Anitha Reddy', 'Dr. Joseph Thomas'],
    neurology: ['Dr. Suresh Menon', 'Dr. Preethi Iyer'],
    'general-medicine': ['Dr. Kavitha Iyer', 'Dr. Sanjay Nair', 'Dr. Meera Pillai'],
    emergency: ['Dr. Amit Verma', 'Dr. Sarah Jose'],
    dermatology: ['Dr. Meena Krishnan'],
    surgery: ['Dr. Samuel Thomas', 'Dr. Ravi Kumar'],
    radiology: ['Dr. Arjun Pillai'],
    laboratory: ['Dr. Deepa Nair'],
    gastroenterology: ['Dr. Roshan Shah'],
  },

  init() {
    const deptSelect = document.getElementById('appt-department');
    const doctorSelect = document.getElementById('appt-doctor');
    
    if (deptSelect && doctorSelect) {
      deptSelect.addEventListener('change', () => {
        const dept = deptSelect.value;
        const doctors = this.doctorsByDept[dept] || ['Select department first'];
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doc => {
          const opt = document.createElement('option');
          opt.value = doc.toLowerCase().replace(/\s+/g, '-');
          opt.textContent = doc;
          doctorSelect.appendChild(opt);
        });
      });
    }

    // Time slot selection
    document.querySelectorAll('.time-slot:not(.unavailable)').forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });

    // Consultation type selection
    document.querySelectorAll('.consultation-type-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.consultation-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  },

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (!this.validateCurrentStep()) return;
      this.currentStep++;
      this.updateUI();
      
      if (this.currentStep === 3) this.populateSummary();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  },

  updateUI() {
    document.querySelectorAll('.form-step').forEach((step, i) => {
      step.classList.toggle('active', i + 1 === this.currentStep);
    });

    document.querySelectorAll('.stepper-item').forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i + 1 === this.currentStep) step.classList.add('active');
      if (i + 1 < this.currentStep) step.classList.add('completed');
    });

    window.scrollTo({ top: 200, behavior: 'smooth' });
  },

  validateCurrentStep() {
    const step = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    if (!step) return true;
    
    let valid = true;
    step.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
        field.addEventListener('input', () => field.classList.remove('error'), { once: true });
      }
    });

    if (!valid) Toast.show('Please fill in all required fields.', 'danger');
    return valid;
  },

  populateSummary() {
    const fields = {
      '#summary-name': document.getElementById('appt-name')?.value || '—',
      '#summary-phone': document.getElementById('appt-phone')?.value || '—',
      '#summary-dept': document.getElementById('appt-department')?.options[document.getElementById('appt-department')?.selectedIndex]?.text || '—',
      '#summary-doctor': document.getElementById('appt-doctor')?.options[document.getElementById('appt-doctor')?.selectedIndex]?.text || '—',
      '#summary-date': document.getElementById('appt-date')?.value || '—',
      '#summary-time': document.querySelector('.time-slot.selected')?.textContent || '—',
    };
    Object.entries(fields).forEach(([selector, value]) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = value;
    });
  },

  submit() {
    if (!this.validateCurrentStep()) return;
    const apptId = 'NMC-2026-' + Math.floor(Math.random() * 9000 + 1000);
    const modal = document.getElementById('success-modal');
    const idEl = document.getElementById('appt-id');
    if (idEl) idEl.textContent = apptId;
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
};

/* ============================================================
   PATIENT PORTAL
   ============================================================ */
const PatientPortal = {
  DEMO_EMAIL: 'demo@nirmala.com',
  DEMO_PASS: 'demo123',

  init() {
    this.bindLoginForm();
    this.bindRegisterForm();
    this.bindDashboard();
  },

  bindLoginForm() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const togglePass = document.getElementById('toggle-password');
    const passInput = document.getElementById('login-password');

    if (togglePass && passInput) {
      togglePass.addEventListener('click', () => {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
        togglePass.textContent = passInput.type === 'password' ? '👁️' : '🙈';
      });
    }

    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;

      if (email === this.DEMO_EMAIL && pass === this.DEMO_PASS) {
        this.showDashboard('Demo Patient');
        Toast.show('Welcome back, Demo Patient! 👋', 'success');
      } else {
        Toast.show('Invalid credentials. Use demo@nirmala.com / demo123', 'danger');
      }
    });

    logoutBtn?.addEventListener('click', () => {
      document.getElementById('portal-login-view')?.classList.add('active');
      document.getElementById('portal-dashboard-view')?.classList.remove('active');
    });
  },

  bindRegisterForm() {
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value || 'New Patient';
      this.showDashboard(name);
      Toast.show(`Welcome to Nirmala Medical, ${name}! 🎉`, 'success');
    });
  },

  showDashboard(name) {
    document.getElementById('portal-login-view')?.classList.remove('active');
    document.getElementById('portal-dashboard-view')?.classList.add('active');
    const nameEl = document.getElementById('patient-welcome-name');
    if (nameEl) nameEl.textContent = name;
  },

  bindDashboard() {
    document.querySelectorAll('.dash-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const panel = link.dataset.panel;
        document.querySelectorAll('.dash-nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.dash-panel').forEach(p => p.style.display = 'none');
        const target = document.getElementById(`panel-${panel}`);
        if (target) target.style.display = 'block';
      });
    });
  }
};

/* ============================================================
   DEPARTMENT FILTER (departments.html)
   ============================================================ */
const DeptFilter = {
  init() {
    const searchInput = document.getElementById('dept-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        document.querySelectorAll('.dept-card-item').forEach(card => {
          const name = card.querySelector('.dept-card-title')?.textContent.toLowerCase() || '';
          card.style.display = name.includes(q) ? '' : 'none';
        });
      });
    }
  }
};

/* ============================================================
   DOCTOR FILTER (doctors.html)
   ============================================================ */
const DoctorFilter = {
  init() {
    const searchInput = document.getElementById('doctor-search');
    const deptFilter = document.getElementById('filter-dept');
    const availFilter = document.getElementById('filter-avail');

    const applyFilters = () => {
      const q = searchInput?.value.toLowerCase() || '';
      const dept = deptFilter?.value || 'all';
      const avail = availFilter?.value || 'all';

      let visible = 0;
      document.querySelectorAll('.doctor-card-item').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const cardDept = card.dataset.dept || '';
        const cardAvail = card.dataset.availability || '';

        const matchName = name.includes(q);
        const matchDept = dept === 'all' || cardDept === dept;
        const matchAvail = avail === 'all' || cardAvail === avail;

        const show = matchName && matchDept && matchAvail;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      const countEl = document.getElementById('results-count');
      if (countEl) countEl.innerHTML = `Showing <span>${visible}</span> of <span>50+</span> doctors`;
    };

    searchInput?.addEventListener('input', applyFilters);
    deptFilter?.addEventListener('change', applyFilters);
    availFilter?.addEventListener('change', applyFilters);

    document.getElementById('clear-filters')?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (deptFilter) deptFilter.value = 'all';
      if (availFilter) availFilter.value = 'all';
      applyFilters();
    });
  }
};

/* ============================================================
   GALLERY LIGHTBOX (gallery.html)
   ============================================================ */
const GalleryLightbox = {
  items: [],
  current: 0,

  init() {
    this.items = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    this.items.forEach((item, i) => {
      item.addEventListener('click', () => this.open(i));
    });

    closeBtn?.addEventListener('click', () => this.close());
    prevBtn?.addEventListener('click', () => this.navigate(-1));
    nextBtn?.addEventListener('click', () => this.navigate(1));

    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox?.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
  },

  open(index) {
    this.current = index;
    this.updateLightbox();
    document.getElementById('lightbox')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('lightbox')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  navigate(direction) {
    this.current = (this.current + direction + this.items.length) % this.items.length;
    this.updateLightbox();
  },

  updateLightbox() {
    const item = this.items[this.current];
    const title = item.querySelector('.gallery-item-title')?.textContent || '';
    const imgSrc = item.querySelector('img')?.src;
    const emoji = item.querySelector('.gallery-emoji-placeholder')?.textContent || '';
    const bg = item.querySelector('.gallery-emoji-placeholder')?.parentElement?.style.background || '';

    const contentArea = document.getElementById('lightbox-image-area');
    if (contentArea) {
      if (imgSrc) {
        contentArea.innerHTML = `<img src="${imgSrc}" alt="${title}" />`;
      } else {
        contentArea.innerHTML = `<div style="min-height:300px;display:flex;align-items:center;justify-content:center;font-size:6rem;background:${bg};width:100%;">${emoji}</div>`;
      }
    }

    const titleEl = document.getElementById('lightbox-title');
    if (titleEl) titleEl.textContent = title;

    const counter = document.getElementById('lightbox-counter');
    if (counter) counter.textContent = `${this.current + 1} / ${this.items.length}`;
  }
};

/* ============================================================
   BLOG SEARCH & FILTER (blog.html)
   ============================================================ */
const BlogFilter = {
  init() {
    const searchInput = document.getElementById('blog-search');
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.blog-article-card').forEach(card => {
        const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
        card.style.display = title.includes(q) ? '' : 'none';
      });
    });

    document.querySelectorAll('.sidebar-category-item').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.category;
        document.querySelectorAll('.blog-article-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }
};

/* ============================================================
   EMERGENCY PAGE - AMBULANCE FORM
   ============================================================ */
const EmergencyForm = {
  init() {
    document.getElementById('ambulance-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('emg-name')?.value || 'Patient';
      Toast.show(`🚑 Ambulance dispatched for ${name}! ETA: 8 minutes. Stay calm.`, 'success', 8000);
      e.target.reset();
    });
  }
};

/* ============================================================
   CONTACT PAGE FORM
   ============================================================ */
const ContactForm = {
  init() {
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Visitor';
      Toast.show(`Thank you ${name}! Your message has been received. We'll respond within 24 hours.`, 'success');
      e.target.reset();
    });
  }
};

/* ============================================================
   INIT BASED ON PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  if (page === 'appointment.html') AppointmentForm.init();
  if (page === 'patient-portal.html') PatientPortal.init();
  if (page === 'departments.html') DeptFilter.init();
  if (page === 'doctors.html') DoctorFilter.init();
  if (page === 'gallery.html') GalleryLightbox.init();
  if (page === 'blog.html') BlogFilter.init();
  if (page === 'emergency.html') EmergencyForm.init();
  if (page === 'contact.html') ContactForm.init();

  // Make these globally accessible
  window.AppointmentForm = AppointmentForm;
  window.PatientPortal = PatientPortal;
  window.GalleryLightbox = GalleryLightbox;
});
