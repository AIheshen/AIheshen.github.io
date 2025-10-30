const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 粒子类
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 3 + 1;
    }
    update(mouse) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        let force = 0;
        const influence = 100;
        const maxForce = 3;
        if(dist < influence){
            force = (influence - dist)/influence * maxForce;
            this.vx += (dx/dist) * force;
            this.vy += (dy/dist) * force;
        }
        this.vx *= 0.9; // 阻尼
        this.vy *= 0.9;
        this.x += this.vx;
        this.y += this.vy;
    }
    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 150;
for(let i=0;i<particleCount;i++){
    particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
}

const mouse = {x: -1000, y: -1000};
window.addEventListener('mousemove', e=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', e=>{
    mouse.x = -1000;
    mouse.y = -1000;
});

function animate(){
    ctx.fillStyle = 'rgba(10,10,10,0.3)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
        p.update(mouse);
        p.draw();
    });
    requestAnimationFrame(animate);
}

animate();
