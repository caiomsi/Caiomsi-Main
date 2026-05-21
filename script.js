// ================================================
// NAVBAR — adds a background when user scrolls down
// ================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ================================================
// MOBILE NAV TOGGLE
// ================================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});


// ================================================
// SMOOTH SCROLL
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ================================================
// CAROUSEL
// ================================================
const slides = document.querySelectorAll('.carousel-slide');
const dots   = document.querySelectorAll('.carousel-dot');
let current  = 0;

function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

document.querySelector('.carousel-btn--prev')
    ?.addEventListener('click', () => goTo(current - 1));
document.querySelector('.carousel-btn--next')
    ?.addEventListener('click', () => goTo(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

// Swipe support for mobile
let touchStartX = 0;
const carouselEl = document.querySelector('.carousel');
if (carouselEl) {
    carouselEl.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselEl.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
}


// ================================================
// SCROLL-SPY — highlights active nav link
// rootMargin fires when section is in the middle third
// ================================================
const spySections = document.querySelectorAll('section[id]');
const spyLinks    = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            spyLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-35% 0px -60% 0px' });

spySections.forEach(s => spyObserver.observe(s));


// ================================================
// FADE-IN ON SCROLL
// ================================================
const fadeTargets = document.querySelectorAll(
    '.project-card, .skill-block, .about-text, .about-image-block, .stat, .section-intro'
);

fadeTargets.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

fadeTargets.forEach(el => fadeObserver.observe(el));


// ================================================
// CONTACT FORM — intercepts submit, sends via fetch
// Shows success message inline instead of redirecting
// ================================================
const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.contact-btn');
        btn.textContent = 'Sending…';
        btn.disabled = true;

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (res.ok) {
                contactForm.reset();
                contactSuccess.style.display = 'block';
                btn.textContent = 'Sent ✓';
            } else {
                btn.textContent = 'Try again →';
                btn.disabled = false;
            }
        } catch {
            btn.textContent = 'Try again →';
            btn.disabled = false;
        }
    });
}
