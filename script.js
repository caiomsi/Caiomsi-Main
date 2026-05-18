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

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});


// ================================================
// SMOOTH SCROLL — for all anchor links on the page
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
// FADE-IN ON SCROLL
// Elements listed below fade in as they enter the
// viewport. To add more elements, add their selector
// to the querySelectorAll list.
// ================================================
const fadeTargets = document.querySelectorAll(
    '.project-card, .skill-block, .about-text, .about-image-block, .stat, .section-intro'
);

fadeTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // only animate once
            }
        });
    },
    { threshold: 0.12 }
);

fadeTargets.forEach(el => observer.observe(el));
