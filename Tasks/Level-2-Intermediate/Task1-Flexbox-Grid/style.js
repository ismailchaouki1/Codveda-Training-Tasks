const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navList.classList.toggle('open');
});

navList.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
  });
});

document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

document.querySelectorAll('.topic-tag').forEach((tag) => {
  tag.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.topic-tag').forEach((t) => t.classList.remove('active'));
    tag.classList.add('active');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll('.article-card, .gallery-item, .sidebar-widget, .trending-item')
  .forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

document.querySelector('.load-more-btn').addEventListener('click', function () {
  this.textContent = 'Loading…';
  this.disabled = true;
  setTimeout(() => {
    this.textContent = 'No More Articles';
    this.style.opacity = '.4';
  }, 1200);
});

document.querySelector('.newsletter-form button').addEventListener('click', () => {
  const input = document.querySelector('.newsletter-form input');
  const val = input.value.trim();
  const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val || !rx.test(val)) {
    input.style.borderColor = '#ff6b6b';
    input.placeholder = 'Enter a valid email!';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'your@email.com';
    }, 2000);
    return;
  }
  input.value = '';
  input.placeholder = '✓ Subscribed!';
  setTimeout(() => {
    input.placeholder = 'your@email.com';
  }, 3000);
});
