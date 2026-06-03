/* ============================================
   HAMACAS ROQUETAS — JAVASCRIPT
   Beach Sunbed Rental · Roquetas de Mar
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ───── NAVBAR ─────
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    // Scroll – add .scrolled class
    const onScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check

    // Mobile menu toggle
    const toggleMenu = (open) => {
        const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('open');
        navLinks.classList.toggle('open', isOpen);
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        navOverlay.classList.toggle('visible', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());
    navOverlay.addEventListener('click', () => toggleMenu(false));

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });


    // ───── REVEAL ON SCROLL ─────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ───── COUNTER ANIMATION ─────
    const statNumbers = document.querySelectorAll('.about__stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }


    // ───── PARALLAX EFFECT ─────
    const parallaxImg = document.querySelector('.gallery__parallax-img');

    if (parallaxImg) {
        const parallaxSection = document.querySelector('.gallery__parallax');

        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', updateParallax, { passive: true });
                } else {
                    window.removeEventListener('scroll', updateParallax);
                }
            });
        }, { threshold: 0 });

        parallaxObserver.observe(parallaxSection);

        function updateParallax() {
            const rect = parallaxSection.getBoundingClientRect();
            const windowH = window.innerHeight;
            const sectionH = parallaxSection.offsetHeight;

            // Normalise scroll position: 0 = section enters viewport, 1 = section leaves
            const progress = (windowH - rect.top) / (windowH + sectionH);
            const yOffset = (progress - 0.5) * 60; // max 30px shift in each direction
            parallaxImg.style.transform = `translateY(${yOffset}px)`;
        }
    }


    // ───── HERO FLOATING PARTICLES ─────
    const particleContainer = document.getElementById('heroParticles');

    if (particleContainer) {
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = 40 + Math.random() * 60 + '%';
            particle.style.width = 2 + Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = 4 + Math.random() * 6 + 's';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.opacity = 0;

            // Vary color slightly
            const hue = 40 + Math.random() * 20; // gold range
            particle.style.background = `hsl(${hue}, 90%, 70%)`;

            particleContainer.appendChild(particle);
        }
    }


    // ───── SMOOTH ACTIVE NAV LINK HIGHLIGHTING ─────
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.navbar__link:not(.navbar__link--cta)');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72}px 0px -40% 0px`
    });

    sections.forEach(section => sectionObserver.observe(section));
});
