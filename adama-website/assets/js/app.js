document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const countObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current + suffix;
        }, 20);
        countObserver.unobserve(el);
      }
    }, { threshold: 0.5 });
    countObserver.observe(el);
  });
});
