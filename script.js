document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    window.addEventListener('load', () => {
        document.getElementById('preloader').classList.add('loaded');
    });

    // --- INITIALIZE LIBRARIES ---
    AOS.init({ duration: 1000, once: true, offset: 50 });

    new Typed('#typing-effect', {
        strings: ['你好，我是艾合', '一位编程爱好者', '探索技术的无限可能'],
        typeSpeed: 70,
        backSpeed: 40,
        loop: true
    });


    // --- INTERACTIVE EFFECTS ---
    // 1. Text Decode Hover for Nav Links
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    document.querySelectorAll('a[data-value]').forEach(link => {
        let interval = null;
        link.onmouseover = event => {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                const target = event.currentTarget;
                target.innerText = target.dataset.value.split("")
                    .map((letter, index) => {
                        if (index < iteration) return target.dataset.value[index];
                        return letters[Math.floor(Math.random() * 52)];
                    })
                    .join("");
                if (iteration >= target.dataset.value.length) clearInterval(interval);
                iteration += 1 / 2;
            }, 30);
        };
    });

    // 2. 3D Tilt Effect
    const initTiltEffect = () => {
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            const tiltElements = document.querySelectorAll('.tilt-panel');
            tiltElements.forEach(el => {
                const content = el.querySelector('.card-content, .about-content, .hero-text-wrapper');
                el.addEventListener('mousemove', e => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -8;
                    const rotateY = ((x - centerX) / centerX) * 8;
                    
                    requestAnimationFrame(() => {
                        if(content) content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });
                });
                el.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        if(content) content.style.transform = 'rotateX(0deg) rotateY(0deg)';
                    });
                });
            });
        }
    };
    initTiltEffect();

    // 3. Scroll-Driven Avatar Animation
    const avatar = document.getElementById('hero-avatar');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (avatar && scrollY < window.innerHeight) {
            const scale = Math.max(0.5, 1 - scrollY / 800);
            const rotation = scrollY / 10;
            const opacity = Math.max(0, 1 - scrollY / 500);
            avatar.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            avatar.style.opacity = opacity;
        }
    });

    // 4. Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card, .placeholder-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.add('visible');
                } else {
                    item.classList.remove('visible');
                }
            });
        });
    });
    document.querySelector('.filter-btn[data-filter="all"]').click();

    // 5. Theme Toggle
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

// --- P5.JS PARTICLE BACKGROUND with Lines, Repulsion, Attraction, Shooting Stars & Theming ---
let particles = [];
let shootingStars = [];
const particleConfig = window.innerWidth > 768 ? 
    { count: 100, repelRadius: 100, speed: 1.2, lineDist: 120 } : 
    { count: 40, repelRadius: 60, speed: 0.8, lineDist: 100 };

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent('particle-canvas');
    for (let i = 0; i < particleConfig.count; i++) {
        particles.push(new Particle());
    }
    // Create shooting stars at random intervals
    setInterval(() => {
        if (shootingStars.length < 3) {
            shootingStars.push(new ShootingStar());
        }
    }, Math.random() * 5000 + 3000);
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
                const alpha = map(d, 0, particleConfig.lineDist, 60, 0);
                const accent1 = isLightTheme ? color(0, 122, 204) : color(0, 246, 255);
                accent1.setAlpha(alpha);
                stroke(accent1);
                strokeWeight(1);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].display(isLightTheme);
        if (shootingStars[i].isOffscreen()) {
            shootingStars.splice(i, 1);
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

class Particle {
    constructor() { this.pos = createVector(random(width), random(height)); this.vel = p5.Vector.random2D().mult(random(0.2, particleConfig.speed)); this.acc = createVector(0, 0); this.size = random(1, 3); this.maxSpeed = particleConfig.speed; }
    applyForce(force) { this.acc.add(force); }
    update(mouseVec) { if (mouseIsPressed) this.attract(mouseVec); else this.repel(mouseVec); this.vel.add(this.acc); this.vel.limit(this.maxSpeed); this.pos.add(this.vel); this.acc.mult(0); this.edges(); }
    display(isLight) { const accent1 = isLight ? color(0, 122, 204) : color(0, 246, 255); noStroke(); fill(accent1); ellipse(this.pos.x, this.pos.y, this.size); }
    repel(target) { const force = p5.Vector.sub(this.pos, target); const d = force.mag(); if (d < particleConfig.repelRadius) { force.setMag(map(d, 0, particleConfig.repelRadius, 1, 0) * 5); this.applyForce(force); } }
    attract(target) { const force = p5.Vector.sub(target, this.pos); let d = force.mag(); d = constrain(d, 5, 50); force.setMag(0.8 / (d * d)); this.applyForce(force); }
    edges() { if (this.pos.x < -10) this.pos.x = width + 10; if (this.pos.x > width + 10) this.pos.x = -10; if (this.pos.y < -10) this.pos.y = height + 10; if (this.pos.y > height + 10) this.pos.y = -10; }
}

class ShootingStar {
    constructor() {
        this.reset();
        this.len = random(40, 60); // Denser tail
        this.history = [];
    }
    reset() {
        this.x = random(width * 1.5);
        this.y = random(-height * 0.5, 0);
        this.speed = random(15, 25);
    }
    isOffscreen() {
        return this.x < -200 || this.y > height + 200;
    }
    update() {
        this.x -= this.speed;
        this.y += this.speed / 2;
        this.history.push(createVector(this.x, this.y));
        if (this.history.length > this.len) {
            this.history.splice(0, 1);
        }
    }
    display(isLight) {
        // Draw the glow for the head
        if (this.history.length > 0) {
            const head = this.history[this.history.length - 1];
            const glowColor = isLight ? color(0, 122, 204) : color(0, 246, 255);
            glowColor.setAlpha(200); // Brighter glow
            noStroke();
            fill(glowColor);
            ellipse(head.x, head.y, this.len * 0.75, this.len * 0.75); // Half size glow
        }

        // Draw the trail
        for (let i = 0; i < this.history.length; i++) {
            let pos = this.history[i];
            let alpha = map(i, 0, this.history.length, 0, 255); // Full brightness trail
            const starColor = isLight ? color(80, 80, 80) : color(255, 255, 255);
            starColor.setAlpha(alpha);
            noStroke();
            fill(starColor);
            ellipse(pos.x, pos.y, i * 0.75, i * 0.75); // Half size trail
        }
    }
}
