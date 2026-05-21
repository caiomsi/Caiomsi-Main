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
// SCROLL PROGRESS BAR + HERO PARALLAX
// ================================================
const progressBar = document.getElementById('progress-bar');
const heroBg = document.querySelector('.hero-bg-img');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
        progressBar.style.width = `${(scrollY / total) * 100}%`;
    }

    if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
}, { passive: true });


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
// SECTION TEXT REVEAL (clip-path wipe)
// ================================================
document.querySelectorAll('.section-header h2, .section-intro, .about-text h3, .connect-text')
    .forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ================================================
// STAT BLUR REVEAL
// ================================================
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('revealed');
            statObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(s => statObserver.observe(s));


// ================================================
// 3D CARD TILT (desktop only)
// ================================================
if (!('ontouchstart' in window)) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}


// ================================================
// GOLD PARTICLE CANVAS
// ================================================
const heroSection = document.querySelector('#hero');
if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-particles';
    heroSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width  = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 40 }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        size:    Math.random() * 1.5 + 0.5,
        speed:   Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        drift:   (Math.random() - 0.5) * 0.3,
    }));

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
            ctx.fill();
            p.y -= p.speed;
            p.x += p.drift;
            if (p.y < -5) {
                p.y = canvas.height + 5;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    };
    draw();
}


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
