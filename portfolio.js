// ===========================================================
// Helpers
// ===========================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===========================================================
// Footer year
// ===========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ===========================================================
// Mobile nav toggle
// ===========================================================
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-menu-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

// ===========================================================
// Smooth scrolling for nav links + editor tabs
// ===========================================================
document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = el.dataset.section;
        const target = sectionId ? document.getElementById(sectionId) : document.getElementById('top');
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after navigating
        siteNav.classList.remove('is-menu-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ===========================================================
// Active state: nav links + editor tabs highlight on scroll
// ===========================================================
const sections = ['about', 'skills', 'contact'].map(id => document.getElementById(id));
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const editorTabs = document.querySelectorAll('.editor-tab[data-section]');

const setActive = (sectionId) => {
    navLinks.forEach(link => link.classList.toggle('is-active', link.dataset.section === sectionId));
    editorTabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.section === sectionId));
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
    });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => section && sectionObserver.observe(section));

// ===========================================================
// Scroll-reveal animation
// ===========================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
    if (prefersReducedMotion) {
        el.classList.add('is-visible');
    } else {
        revealObserver.observe(el);
    }
});

// ===========================================================
// Hero typewriter effect
// ===========================================================
const typewriterTarget = document.getElementById('typewriter-target');
const typewriterCursor = document.getElementById('typewriter-cursor');
const fullLine = '// → "Let\'s build something."';

function typeWriter() {
    if (prefersReducedMotion) {
        typewriterTarget.textContent = fullLine;
        return;
    }
    let i = 0;
    const interval = setInterval(() => {
        typewriterTarget.textContent = fullLine.slice(0, i + 1);
        i++;
        if (i >= fullLine.length) {
            clearInterval(interval);
        }
    }, 35);
}
window.addEventListener('load', () => setTimeout(typeWriter, 500));

// ===========================================================
// Copy email to clipboard + toast
// ===========================================================
const emailText = document.getElementById('email-text').textContent.trim();
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2200);
}

async function copyEmail(button) {
    try {
        await navigator.clipboard.writeText(emailText);
        showToast('Email copied to clipboard');
        if (button) {
            const original = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('is-copied');
            setTimeout(() => {
                button.textContent = original;
                button.classList.remove('is-copied');
            }, 1800);
        }
    } catch (err) {
        showToast('Could not copy — please copy manually');
    }
}

document.getElementById('copy-email-btn').addEventListener('click', (e) => copyEmail(e.currentTarget));
document.getElementById('copy-email-nav').addEventListener('click', (e) => copyEmail(e.currentTarget));
