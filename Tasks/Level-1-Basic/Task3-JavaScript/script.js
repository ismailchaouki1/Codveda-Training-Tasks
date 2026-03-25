const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document
  .querySelectorAll(
    'a, button, .dd-trigger, .dd-menu li, .feature-badge, .modal-trigger-btn, .project-card, .hc-tag, .checkbox-label',
  )
  .forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function openDropdown(id) {
  const dd = document.getElementById(id);
  const trigger = dd.querySelector('.dd-trigger');
  const menu = dd.querySelector('.dd-menu');
  trigger.classList.add('open');
  menu.classList.add('open');
}

function closeDropdown(id) {
  const dd = document.getElementById(id);
  const trigger = dd.querySelector('.dd-trigger');
  const menu = dd.querySelector('.dd-menu');
  trigger.classList.remove('open');
  menu.classList.remove('open');
}

function closeAllDropdowns(except) {
  ['dd1', 'dd2', 'dd3', 'dd4'].forEach((id) => {
    if (id !== except) closeDropdown(id);
  });
}

document.querySelectorAll('.dd-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = trigger.dataset.target;
    const menu = document.querySelector(`#${id} .dd-menu`);
    const open = menu.classList.contains('open');
    closeAllDropdowns(null);
    if (!open) openDropdown(id);
  });
});

document.querySelectorAll('.dd-menu li').forEach((item) => {
  item.addEventListener('click', () => {
    const menu = item.closest('.dd-menu');
    const dd = item.closest('.dropdown');
    const id = dd.id;
    const trigger = dd.querySelector('.dd-trigger');
    const valSpan = trigger.querySelector('.dd-value');
    const output = document.getElementById(`${id}-output`);
    const val = item.dataset.val;

    menu.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));
    item.classList.add('selected');

    valSpan.textContent = val;
    trigger.classList.add('selected');
    closeDropdown(id);

    output.textContent = val;
    output.classList.add('show');
  });
});

document.addEventListener('click', () => closeAllDropdowns(null));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns(null);
    closeAllModals();
  }
});

function openModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach((o) => o.classList.remove('open'));
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

document.querySelectorAll('[data-close]').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.getElementById('confirmReset').addEventListener('click', () => {
  resetForm();
  closeModal('modal-warning');
});

const validators = {
  fname(val) {
    if (!val) return 'Name is required.';
    if (!/^[a-zA-Z\s]{3,}$/.test(val)) return 'Min 3 characters, letters only.';
    return '';
  },
  femail(val) {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return '';
  },
  fphone(val) {
    if (!val) return '';
    if (!/^\d{10}$/.test(val)) return 'Phone must be exactly 10 digits.';
    return '';
  },
  fsubject(val) {
    if (!val) return 'Please select a subject.';
    return '';
  },
  fmessage(val) {
    if (!val) return 'Message is required.';
    if (val.length < 20) return `Too short — ${20 - val.length} more character(s) needed.`;
    return '';
  },
  fagree(checked) {
    if (!checked) return 'You must accept the terms.';
    return '';
  },
};

const ruleIds = {
  fname: 'rule-name',
  femail: 'rule-email',
  fphone: 'rule-phone',
  fsubject: 'rule-subject',
  fmessage: 'rule-message',
  fagree: 'rule-agree',
};

function setFieldState(id, errorMsg) {
  const wrap =
    document.getElementById(id).closest('.input-wrap') ||
    document.getElementById(id).closest('.field-wrap');
  const errEl = document.getElementById(`${id}-err`);
  const iconEl = document.getElementById(`${id}-icon`);
  const ruleEl = document.getElementById(ruleIds[id]);
  const inputWrap = document.getElementById(id).closest('.input-wrap');

  if (errEl) errEl.textContent = errorMsg;

  if (inputWrap) {
    inputWrap.classList.toggle(
      'valid',
      errorMsg === '' && document.getElementById(id).value !== '',
    );
    inputWrap.classList.toggle('invalid', errorMsg !== '');
  }

  if (iconEl) {
    if (errorMsg !== '') {
      iconEl.textContent = '✕';
      iconEl.style.color = 'var(--red)';
    } else if (document.getElementById(id).value !== '') {
      iconEl.textContent = '✓';
      iconEl.style.color = 'var(--green)';
    } else {
      iconEl.textContent = '';
    }
  }

  if (ruleEl) {
    const hasValue =
      id === 'fagree'
        ? document.getElementById(id).checked
        : document.getElementById(id).value !== '';

    ruleEl.classList.remove('valid', 'invalid');
    if (hasValue) {
      ruleEl.classList.add(errorMsg === '' ? 'valid' : 'invalid');
      ruleEl.querySelector('.rule-icon').textContent = errorMsg === '' ? '✓' : '✕';
    } else {
      ruleEl.querySelector('.rule-icon').textContent = '○';
    }
  }
}

['fname', 'femail', 'fphone', 'fsubject', 'fmessage'].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    const err = validators[id](el.value.trim());
    setFieldState(id, err);
  });
  el.addEventListener('blur', () => {
    const err = validators[id](el.value.trim());
    setFieldState(id, err);
  });
});

document.getElementById('fagree').addEventListener('change', () => {
  const err = validators.fagree(document.getElementById('fagree').checked);
  setFieldState('fagree', err);
});

const fmessage = document.getElementById('fmessage');
const charCount = document.getElementById('charCount');
const charWrap = charCount.closest('.char-count');

fmessage.addEventListener('input', () => {
  const len = fmessage.value.length;
  charCount.textContent = len;
  charWrap.classList.toggle('valid', len >= 20);
});

function validateAll() {
  let valid = true;

  ['fname', 'femail', 'fphone', 'fsubject', 'fmessage'].forEach((id) => {
    const el = document.getElementById(id);
    const err = validators[id](el.value.trim());
    setFieldState(id, err);
    if (err) valid = false;
  });

  const agreeErr = validators.fagree(document.getElementById('fagree').checked);
  setFieldState('fagree', agreeErr);
  if (agreeErr) valid = false;

  return valid;
}

function resetForm() {
  document.getElementById('contactForm').reset();

  ['fname', 'femail', 'fphone', 'fsubject', 'fmessage'].forEach((id) => {
    const errEl = document.getElementById(`${id}-err`);
    const iconEl = document.getElementById(`${id}-icon`);
    const wrap = document.getElementById(id).closest('.input-wrap');
    if (errEl) errEl.textContent = '';
    if (iconEl) iconEl.textContent = '';
    if (wrap) {
      wrap.classList.remove('valid', 'invalid');
    }
  });

  document.querySelectorAll('.rule-item').forEach((r) => {
    r.classList.remove('valid', 'invalid');
    r.querySelector('.rule-icon').textContent = '○';
  });

  charCount.textContent = '0';
  charWrap.classList.remove('valid');

  const result = document.getElementById('formResult');
  result.style.display = 'none';
  result.className = 'form-result';
}

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const isValid = validateAll();
  const result = document.getElementById('formResult');
  const label = document.getElementById('submitLabel');

  if (!isValid) {
    result.className = 'form-result error';
    result.style.display = 'block';
    result.textContent = '⚠ Please fix the errors above before submitting.';
    return;
  }

  label.textContent = 'Sending…';
  document.getElementById('submitBtn').disabled = true;

  setTimeout(() => {
    result.className = 'form-result success';
    result.style.display = 'block';
    result.textContent = "✓ Message sent successfully! I'll get back to you soon.";
    label.textContent = 'Send Message';
    document.getElementById('submitBtn').disabled = false;
    openModal('modal-success');
  }, 1000);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  openModal('modal-warning');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
