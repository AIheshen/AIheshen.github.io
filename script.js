const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.pointerEvents = 'none'; // 确保鼠标事件不被阻挡

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random()*3 + 1;
    }
    update(mouse) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        const influence = 200; // 鼠标作用半径
        const maxForce = 6;    // 推动力
        if(dist < influence){
            let force = (influence - dist)/influence * maxForce;
            this.vx += (dx/dist) * force;
            this.vy += (dy/dist) * force;
        }
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if(this.x < 0) { this.x=0; this.vx*=-1; }
        if(this.x > canvas.width) { this.x=canvas.width; this.vx*=-1; }
        if(this.y < 0) { this.y=0; this.vy*=-1; }
        if(this.y > canvas.height) { this.y=canvas.height; this.vy*=-1; }
    }
    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

const particles = [];
for(let i=0;i<200;i++){
    particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
}

const mouse = {x:-1000, y:-1000};
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', e => { mouse.x = -1000; mouse.y = -1000; });

function animate(){
    ctx.fillStyle='rgba(10,10,10,0.3)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // 更新粒子
    for(let p of particles){ p.update(mouse); p.draw(); }

    // 粒子连线
    for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist<100){
                ctx.strokeStyle = `rgba(0,255,255,${1-dist/100})`;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();
