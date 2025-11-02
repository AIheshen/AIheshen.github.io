document.addEventListener('DOMContentLoaded', () => {
    // --- CACHE DOM ELEMENTS ---
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    const magicLine = document.querySelector('.magic-line');
    const navLinks = document.querySelectorAll('a.nav-link[data-value]');
    const decodeTextElements = document.querySelectorAll('.decode-text');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const avatar = document.getElementById('hero-avatar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card, .placeholder-card');
    const copyNotification = document.getElementById('copy-notification');
    const copyItems = document.querySelectorAll('[data-copy]');

    // --- INITIALIZATION ---
    const init = () => {
        initPreloader();
        initExternalLibraries();
        initTheme();
        initNavigation();
        initInteractiveEffects();
        initScrollBasedAnimations();
        initProjectFiltering();
        initCopyToClipboard();
    };

    // --- FUNCTIONS ---

    const initPreloader = () => {
        window.addEventListener('load', () => {
            document.getElementById('preloader').classList.add('loaded');
        });
    };

    const initExternalLibraries = () => {
        AOS.init({ duration: 800, once: true, offset: 50 });
        new Typed('#typing-effect', {
            strings: ['我是艾合', '一位编程爱好者', '期待与您合作', '致力于将一切自动化', '专注于AI协作编程', '探索技术的无限可能'],
            typeSpeed: 80,
            backSpeed: 40,
            loop: true
        });
    };

    const initTheme = () => {
        const applyTheme = (theme) => {
            document.body.dataset.theme = theme;
            themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', theme);
        };
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
    };

    const initNavigation = () => {
        // Mobile Menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            navUl.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navUl.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('open');
                    navUl.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        // Magic Line
        const updateMagicLine = (target) => {
            if (target && magicLine) {
                magicLine.style.left = `${target.offsetLeft}px`;
                magicLine.style.width = `${target.offsetWidth}px`;
            }
        };
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => updateMagicLine(e.target));
        });
        navUl.addEventListener('mouseleave', () => {
             const activeLink = document.querySelector('.nav-link.active');
             updateMagicLine(activeLink);
        });
        // Set initial position
        setTimeout(() => updateMagicLine(document.querySelector('.nav-link.active')), 100);
    };
    
    const initInteractiveEffects = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let interval = null;

        const applyDecodeEffect = (element) => {
            element.onmouseover = event => {
                let iteration = 0;
                clearInterval(interval);
                const originalText = element.dataset.value;
                interval = setInterval(() => {
                    event.currentTarget.innerText = originalText.split("")
                        .map((letter, index) => {
                            if (index < iteration) return originalText[index];
                            return letters[Math.floor(Math.random() * letters.length)];
                        })
                        .join("");
                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                        event.currentTarget.innerText = originalText;
                    }
                    iteration += 1 / 2;
                }, 30);
            };
             element.onmouseleave = () => {
                clearInterval(interval);
                element.innerText = element.dataset.value;
            }
        };

        navLinks.forEach(applyDecodeEffect);
        decodeTextElements.forEach(applyDecodeEffect);

        // 3D Tilt Effect
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            document.querySelectorAll('.tilt-panel').forEach(el => {
                el.addEventListener('mousemove', e => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    // Optimization: Doubled the intensity of the tilt effect
                    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
                    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
                    requestAnimationFrame(() => {
                         el.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });
                });
                el.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        el.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg)';
                    });
                });
            });
        }
        
        // Project Card Tap-to-Flip for Mobile
        projectItems.forEach(card => {
            if (card.classList.contains('project-card')) {
                card.addEventListener('click', (e) => {
                    if (e.target.tagName.toLowerCase() !== 'a') {
                        card.querySelector('.project-flipper').classList.toggle('is-flipped');
                    }
                });
            }
        });
    };

    const initScrollBasedAnimations = () => {
        // Sticky Nav & Scroll-to-Top button
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            nav.classList.toggle('scrolled', scrollY > 50);
            scrollToTopBtn.classList.toggle('visible', scrollY > 300);
        });

        // Avatar Animation
        window.addEventListener('scroll', () => {
            if (avatar && window.scrollY < window.innerHeight) {
                const scrollY = window.scrollY;
                const scale = Math.max(0.5, 1 - scrollY / 800);
                const rotation = scrollY / 10;
                const opacity = Math.max(0, 1 - scrollY / 500);
                requestAnimationFrame(() => {
                    avatar.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                    avatar.style.opacity = opacity;
                });
            }
        });

        // Section-based NavLink Activation
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                    document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
                    if(activeLink) {
                        activeLink.classList.add('active');
                        // Update magic line on scroll
                        if (window.innerWidth > 768) {
                             const magicLine = document.querySelector('.magic-line');
                             magicLine.style.left = `${activeLink.offsetLeft}px`;
                             magicLine.style.width = `${activeLink.offsetWidth}px`;
                        }
                    }
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        document.querySelectorAll('section').forEach(sec => sectionObserver.observe(sec));
    };

    const initProjectFiltering = () => {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                projectItems.forEach(item => {
                    const shouldBeVisible = filter === 'all' || item.dataset.category === filter;
                    item.classList.toggle('hidden', !shouldBeVisible);
                });
            });
        });
    };

    const initCopyToClipboard = () => {
        copyItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(item.dataset.copy).then(() => {
                    copyNotification.classList.add('show');
                    setTimeout(() => { copyNotification.classList.remove('show'); }, 2000);
                });
            });
        });
    };

    // --- RUN INITIALIZATION ---
    init();
});

// --- P5.JS PARTICLE BACKGROUND (Unchanged) ---
let particles = [];
const particleConfig = window.innerWidth > 768 ? 
    { count: 100, repelRadius: 100, speed: 1.2, lineDist: 120 } : 
    { count: 45, repelRadius: 60, speed: 0.8, lineDist: 100 };

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('particle-canvas');
    for (let i = 0; i < particleConfig.count; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();
    const isLightTheme = document.body.dataset.theme === 'light';
    const mouseVec = createVector(mouseX, mouseY);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseVec);
        particles[i].display(isLightTheme);
        for (let j = i + 1; j < particles.length; j++) {
            const d = dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            if (d < particleConfig.lineDist) {
                const alpha = map(d, 0, particleConfig.lineDist, 150, 0); 
                const accent1 = isLightTheme ? color(0, 122, 204) : color(0, 246, 255);
                accent1.setAlpha(alpha);
                stroke(accent1);
                strokeWeight(1);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

class Particle {
    constructor() { this.pos = createVector(random(width), random(height)); this.vel = p5.Vector.random2D().mult(random(0.2, particleConfig.speed)); this.acc = createVector(0, 0); this.size = random(1.5, 4); this.maxSpeed = particleConfig.speed; }
    applyForce(force) { this.acc.add(force); }
    update(mouseVec) { if (mouseIsPressed) this.attract(mouseVec); else this.repel(mouseVec); this.vel.add(this.acc); this.vel.limit(this.maxSpeed); this.pos.add(this.vel); this.acc.mult(0); this.edges(); }
    display(isLight) { const accent1 = isLight ? color(0, 122, 204) : color(0, 246, 255); noStroke(); fill(accent1); ellipse(this.pos.x, this.pos.y, this.size); }
    repel(target) { const force = p5.Vector.sub(this.pos, target); const d = force.mag(); if (d < particleConfig.repelRadius) { force.setMag(map(d, 0, particleConfig.repelRadius, 1, 0) * 5); this.applyForce(force); } }
    attract(target) { const force = p5.Vector.sub(target, this.pos); let d = force.mag(); d = constrain(d, 5, 50); force.setMag(0.8 / (d * d)); this.applyForce(force); }
    edges() { if (this.pos.x < -10) this.pos.x = width + 10; if (this.pos.x > width + 10) this.pos.x = -10; if (this.pos.y < -10) this.pos.y = height + 10; if (this.pos.y > height + 10) this.pos.y = -10; }
}
