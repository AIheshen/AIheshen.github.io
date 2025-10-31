// 粒子背景系统
let particles = [];
let canvas;

// p5.js 设置函数
function setup() {
    // 创建画布并添加到背景容器
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-bg');
    
    // 创建粒子
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

// p5.js 绘制函数
function draw() {
    // 根据主题设置背景色
    const isLightTheme = document.body.getAttribute('data-theme') === 'light';
    background(isLightTheme ? 245 : 10, isLightTheme ? 247 : 10, isLightTheme ? 250 : 26);
    
    let mouse = createVector(mouseX, mouseY);

    // 更新和显示所有粒子
    for (let p of particles) {
        p.repel(mouse);
        p.update();
        p.edges();
        p.display();
    }

    // 绘制粒子之间的连线
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dist = p5.Vector.dist(particles[i].pos, particles[j].pos);
            if (dist < 120) {
                let alpha = map(dist, 0, 120, 150, 0);
                stroke(isLightTheme ? 0 : 255, alpha);
                strokeWeight(0.5);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }
}

// 窗口大小改变时调整画布
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// 粒子类
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.2, 0.8));
        this.acc = createVector(0, 0);
        this.maxSpeed = 1;
        this.color = color(random(['#00ffff', '#ff00ff', '#ffff00', '#ffffff']));
        this.size = random(1.5, 3);
        this.pulseOffset = random(0, TWO_PI);
    }

    // 鼠标排斥效果
    repel(target) {
        let force = p5.Vector.sub(this.pos, target);
        let distance = force.mag();
        if (distance < 80) {
            let strength = 50 * (80 - distance) / 80;
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
        // 脉动效果
        let pulse = sin(this.pulseOffset + frameCount * 0.05) * 0.5 + 0.5;
        stroke(red(this.color), green(this.color), blue(this.color), 100 + 155 * pulse);
        strokeWeight(this.size * (0.8 + 0.4 * pulse));
        point(this.pos.x, this.pos.y);
    }

    edges() {
        // 边界处理 - 从一边穿到另一边
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }
}
