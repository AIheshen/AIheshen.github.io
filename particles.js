// --- 可调参数 ---
const PARTICLE_COUNT = 150;     // 粒子总数
const REPULSION_RADIUS = 80;   // 鼠标排斥力场的半径
const REPULSION_STRENGTH = 50; // 排斥力的强度
const CONNECTION_DISTANCE = 120; // 粒子之间连线的最大距离
const PARTICLE_COLORS = ['#00ffff', '#ff00ff', '#ffff00', '#ffffff']; // 多彩粒子
const PULSE_EFFECT = true; // 添加脉动效果
// --- 参数结束 ---

let particles = [];
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-bg');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    // 根据主题设置背景色
    const isLightTheme = document.body.getAttribute('data-theme') === 'light';
    background(isLightTheme ? 245 : 10, isLightTheme ? 247 : 10, isLightTheme ? 250 : 26);
    
    let mouse = createVector(mouseX, mouseY);

    for (let p of particles) {
        p.repel(mouse);
        p.update();
        p.edges();
        p.display();
    }

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dist = p5.Vector.dist(particles[i].pos, particles[j].pos);
            if (dist < CONNECTION_DISTANCE) {
                let alpha = map(dist, 0, CONNECTION_DISTANCE, 150, 0);
                stroke(isLightTheme ? 0 : 255, alpha);
                strokeWeight(0.5);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.2, 0.8));
        this.acc = createVector(0, 0);
        this.maxSpeed = 1;
        this.color = color(random(PARTICLE_COLORS));
        this.size = random(1.5, 3);
        this.pulseOffset = random(0, TWO_PI);
    }

    repel(target) {
        let force = p5.Vector.sub(this.pos, target);
        let distance = force.mag();
        if (distance < REPULSION_RADIUS) {
            let strength = REPULSION_STRENGTH * (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
            force.setMag(strength);
            this.applyForce(force);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display() {
        if (PULSE_EFFECT) {
            let pulse = sin(this.pulseOffset + frameCount * 0.05) * 0.5 + 0.5;
            stroke(red(this.color), green(this.color), blue(this.color), 100 + 155 * pulse);
            strokeWeight(this.size * (0.8 + 0.4 * pulse));
        } else {
            stroke(this.color);
            strokeWeight(this.size);
        }
        point(this.pos.x, this.pos.y);
    }

    edges() {
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }
}

// 将常量暴露给全局作用域，以便main.js可以访问
window.PARTICLE_COUNT = PARTICLE_COUNT;
