document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    window.addEventListener('load', () => {
        document.getElementById('preloader').classList.add('loaded');
    });

    // --- INITIALIZE LIBRARIES ---
    AOS.init({ duration: 800, once: true, offset: 50 });

    new Typed('#typing-effect', {
        strings: [ '我是艾合', '一位编程爱好者','期待与您合作','致力于将一切自动化', '专注于AI协作编程', '探索技术的无限可能'],
        typeSpeed: 80,
        backSpeed: 40,
        loop: true
    });


    // --- INTERACTIVE EFFECTS ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    
    // 1. Text Decode Hover for Nav Links
    const applyNavDecodeEffect = (element) => {
        let interval = null;
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
    document.querySelectorAll('a.nav-link[data-value]').forEach(applyNavDecodeEffect);

    // 2. Section Title Decode on Scroll
    const decodeOnScroll = (element) => {
        let interval = null;
        let iteration = 0;
        const originalText = element.dataset.value;
        
        clearInterval(interval);
        interval = setInterval(() => {
            element.innerText = originalText.split("")
                .map((letter, index) => {
                    if(letter === ' ') return ' ';
                    if (index < iteration) return originalText[index];
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
            }
            iteration += 1 / 2;
        }, 50);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('decoded')) {
                decodeOnScroll(entry.target);
                entry.target.classList.add('decoded');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.decode-text').forEach(el => {
        observer.observe(el);
    });

    // 3. 3D Tilt Effect
    const initTiltEffect = () => {
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            const tiltElements = document.querySelectorAll('.tilt-panel');
            tiltElements.forEach(el => {
                const content = el.querySelector('.about-content, .hero-text-wrapper');
                el.addEventListener('mousemove', e => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6; // Reduced intensity
                    const rotateY = ((x - centerX) / centerX) * 6;  // Reduced intensity
                    
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
    };
    initTiltEffect();

    // 4. Scroll-Driven Avatar Animation
    const avatar = document.getElementById('hero-avatar');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (avatar && scrollY < window.innerHeight) {
            const scale = Math.max(0.5, 1 - scrollY / 800);
            const rotation = scrollY / 10;
            const opacity = Math.max(0, 1 - scrollY / 500);
            requestAnimationFrame(() => {
                avatar.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                avatar.style.opacity = opacity;
            });
        }
    });

    // 5. Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card, .placeholder-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectItems.forEach(item => {
                const shouldBeVisible = filter === 'all' || item.dataset.category === filter;
                if (shouldBeVisible) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    projectItems.forEach(item => item.classList.remove('hidden'));

    // 6. Project Card Tap-to-Flip for Mobile
    projectItems.forEach(card => {
        if (card.classList.contains('project-card')) {
            card.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() !== 'a') {
                    card.querySelector('.project-flipper').classList.toggle('is-flipped');
                }
            });
        }
    });

    // 7. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
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

    // --- NAVIGATION & SCROLLING ---
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

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

    // --- COPY TO CLIPBOARD ---
    const copyNotification = document.getElementById('copy-notification');
    document.querySelectorAll('[data-copy]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(item.dataset.copy).then(() => {
                copyNotification.classList.add('show');
                setTimeout(() => { copyNotification.classList.remove('show'); }, 2000);
            });
        });
    });
});

// --- P5.JS PARTICLE BACKGROUND ---
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
                const alpha = map(d, 0, particleConfig.lineDist, 150, 0); // Increased opacity
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
