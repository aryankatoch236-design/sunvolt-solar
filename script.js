/**
 * ============================================================================
 * SUNVOLT SOLAR SOLUTIONS - JAVASCRIPT
 * Flat 2D Vanilla JavaScript | Sustainable Luxury Solar System
 * ============================================================================
 */

// ============================================================================
// 1. BUSINESS CONFIGURATION SETTINGS BLOCK
// Edit any detail here to automatically update across the entire website!
// ============================================================================
const BUSINESS_CONFIG = {
  name: "SunVolt Solar Solutions",
  shortName: "SunVolt",
  tagline: "Power your home with the sun.",
  location: "Kachehri Road, Dharamshala, Himachal Pradesh",
  phone: "+91 00000 00000",
  phoneRaw: "+910000000000",
  whatsapp: "+91 00000 00000",
  whatsappUrl: "https://wa.me/910000000000",
  email: "hello@yourbusiness.com",
  hours: "9 AM to 7 PM, Monday to Saturday. Free site visit on request."
};

// ============================================================================
// 2. AUTOMATIC SETTINGS POPULATION
// Populates text content and links dynamically from BUSINESS_CONFIG
// ============================================================================
function applyBusinessSettings() {
  // Update Text Nodes
  document.querySelectorAll('[data-business="name"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.name;
  });

  document.querySelectorAll('[data-business="shortName"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.shortName;
  });

  document.querySelectorAll('[data-business="tagline"]').forEach(el => {
    if (el.classList.contains('hero-subtext')) {
      el.textContent = `${BUSINESS_CONFIG.tagline} Premium rooftop solar installations engineered for Dharamshala homes and businesses.`;
    } else {
      el.textContent = BUSINESS_CONFIG.tagline;
    }
  });

  document.querySelectorAll('[data-business="location"], [data-business="address"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.location;
  });

  document.querySelectorAll('[data-business="phone"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.phone;
  });

  document.querySelectorAll('[data-business="email"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.email;
  });

  document.querySelectorAll('[data-business="hours"]').forEach(el => {
    el.textContent = BUSINESS_CONFIG.hours;
  });

  // Update Link Attributes
  document.querySelectorAll('[data-business-link="phone"]').forEach(el => {
    el.setAttribute('href', `tel:${BUSINESS_CONFIG.phoneRaw}`);
  });

  document.querySelectorAll('[data-business-link="whatsapp"]').forEach(el => {
    el.setAttribute('href', BUSINESS_CONFIG.whatsappUrl);
  });

  document.querySelectorAll('[data-business-link="email"]').forEach(el => {
    el.setAttribute('href', `mailto:${BUSINESS_CONFIG.email}`);
  });

  // Dynamic copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ============================================================================
// 3. ANIMATED COUNT-UP FOR HIGHLIGHT NUMBERS (INTERSECTION OBSERVER)
// Respects prefers-reduced-motion
// ============================================================================
function initCountUp() {
  const statElements = document.querySelectorAll('[data-count]');
  if (!statElements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseFloat(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        
        if (prefersReducedMotion) {
          el.textContent = prefix + (decimals > 0 ? targetValue.toFixed(decimals) : Math.round(targetValue)) + suffix;
        } else {
          animateNumber(el, targetValue, decimals, prefix, suffix, 1500);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

function animateNumber(element, target, decimals, prefix, suffix, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease-out cubic curve
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = target * easeOut;
    
    element.textContent = prefix + (decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : Math.round(target)) + suffix;
    }
  }
  requestAnimationFrame(update);
}

// ============================================================================
// 4. NAVBAR SCROLL BLUR / SOLID BACKGROUND EFFECT
// ============================================================================
function initNavbarScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================================
// 5. SAVINGS CALCULATOR ENGINE
// Formula Assumptions:
// - Rate: ~Rs 8 per unit (kWh)
// - Generation: ~120 units per kW per month
// - Target Offset: ~90% of electricity bill
// ============================================================================
function initSavingsCalculator() {
  const numberInput = document.getElementById('monthly-bill-input');
  const rangeSlider = document.getElementById('monthly-bill-slider');
  const billDisplay = document.getElementById('bill-display');
  const presetButtons = document.querySelectorAll('.preset-btn');

  const resultKw = document.getElementById('result-kw');
  const resultUnits = document.getElementById('result-units');
  const resultMonthly = document.getElementById('result-monthly');
  const resultYearly = document.getElementById('result-yearly');
  const resultLifetime = document.getElementById('result-lifetime');

  if (!numberInput || !rangeSlider) return;

  // Format currency in Indian locale (e.g. ₹4,000)
  function formatRupees(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  // Format Lakhs for lifetime
  function formatLakhs(num) {
    const lakhs = (num / 100000).toFixed(1);
    return `Over ₹${lakhs} Lakhs saved across 25 years`;
  }

  function calculate(billAmount) {
    let bill = parseFloat(billAmount);
    if (isNaN(bill) || bill < 0) {
      bill = 0;
    }

    // 1. Calculate monthly units consumed:
    // Units = Bill / Rs 8 per unit
    const monthlyUnits = bill / 8;

    // 2. Recommended System Size in kW:
    // Each 1 kW produces approx. 120 units per month
    // Sizing in kW = monthlyUnits / 120
    let recommendedKw = monthlyUnits / 120;
    
    // Ensure minimum realistic size of 1.0 kW if bill > 0
    if (bill > 0 && recommendedKw < 1.0) {
      recommendedKw = 1.0;
    }

    // Round to 1 decimal place (e.g. 4.2 kW)
    const displayKw = recommendedKw > 0 ? recommendedKw.toFixed(1) : '0.0';

    // Monthly units generated by this system
    const generatedUnits = Math.round(parseFloat(displayKw) * 120);

    // 3. Estimated Monthly Savings:
    // Solar saves up to 90% of monthly bill
    const monthlySaving = Math.round(bill * 0.90);
    const yearlySaving = monthlySaving * 12;
    const lifetimeSaving = yearlySaving * 25;

    // Update DOM
    if (billDisplay) {
      billDisplay.textContent = formatRupees(bill);
    }
    if (resultKw) {
      resultKw.textContent = `${displayKw} kW`;
    }
    if (resultUnits) {
      resultUnits.textContent = `Produces ~${generatedUnits.toLocaleString('en-IN')} units/month`;
    }
    if (resultMonthly) {
      resultMonthly.textContent = formatRupees(monthlySaving);
    }
    if (resultYearly) {
      resultYearly.textContent = formatRupees(yearlySaving);
    }
    if (resultLifetime) {
      resultLifetime.textContent = formatLakhs(lifetimeSaving);
    }

    // Update preset buttons active highlight
    presetButtons.forEach(btn => {
      const val = parseInt(btn.dataset.value, 10);
      if (val === Math.round(bill)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Event Listeners for Number Input
  numberInput.addEventListener('input', (e) => {
    const val = e.target.value;
    rangeSlider.value = val;
    calculate(val);
  });

  // Event Listeners for Range Slider
  rangeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    numberInput.value = val;
    calculate(val);
  });

  // Preset Buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      numberInput.value = val;
      rangeSlider.value = val;
      calculate(val);
    });
  });

  // Initial Calculation
  calculate(numberInput.value || 4000);
}

// ============================================================================
// 6. FAQ ACCORDION COMPONENT
// Accessible click-to-expand list with aria-expanded attributes
// ============================================================================
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close all other panels for a clean accordion experience
      faqButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherBtn.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.hidden = true;
          }
        }
      });

      // Toggle current panel
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;
      }
    });
  });
}

// ============================================================================
// 7. MOBILE NAVIGATION MENU (HAMBURGER)
// ============================================================================
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-quote-btn');

  if (!hamburgerBtn || !mobileMenu) return;

  function toggleMenu(isOpen) {
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (isOpen) {
      mobileMenu.classList.add('open');
    } else {
      mobileMenu.classList.remove('open');
    }
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isOpen);
  });

  // Close when clicking any nav link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target) &&
      mobileMenu.classList.contains('open')
    ) {
      toggleMenu(false);
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
      hamburgerBtn.focus();
    }
  });
}

// ============================================================================
// 8. CONTACT ENQUIRY FORM HANDLER
// Validates inputs and shows "Thanks, we will call you soon" message
// ============================================================================
function initContactForm() {
  const form = document.getElementById('enquiry-form');
  const successBanner = document.getElementById('form-success-banner');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !successBanner) return;

  const nameInput = document.getElementById('form-name');
  const phoneInput = document.getElementById('form-phone');

  // Clear errors on typing
  [nameInput, phoneInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.form-group').classList.remove('has-error');
    }

    // Validate Phone (At least 8 digits)
    const phoneClean = phoneInput.value.replace(/[^0-9]/g, '');
    if (!phoneInput.value.trim() || phoneClean.length < 8) {
      phoneInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      phoneInput.closest('.form-group').classList.remove('has-error');
    }

    if (!isValid) return;

    // Show loading state briefly
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';

    setTimeout(() => {
      // Show Success Banner
      successBanner.hidden = false;
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset form fields
      form.reset();

      // Reset submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 400);
  });
}

// ============================================================================
// 9. ACTIVE NAVIGATION ON SCROLL (SCROLLSPY)
// Updates active class in desktop navbar based on current scroll position
// ============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// ============================================================================
// 10. INITIALIZE APPLICATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyBusinessSettings();
  initCountUp();
  initNavbarScroll();
  initSavingsCalculator();
  initFaqAccordion();
  initMobileNavigation();
  initContactForm();
  initScrollSpy();
});
