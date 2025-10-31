
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    // 导航切换
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            
            // 移动端菜单关闭
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
            }
        });
    });
    
    // 滚动指示器点击
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const sectionIds = ['hero', 'about', 'projects', 'contact'];
            navLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            
            document.getElementById(sectionIds[index]).classList.add('active');
            document.querySelector(`a[href="#${sectionIds[index]}"]`).classList.add('active');
        });
    });
    
    // 滚动监听
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        scrollDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === 
                document.querySelector(`a[href="#${current}"]`).textContent) {
                dot.classList.add('active');
            }
        });
    });
    
    // 主题切换
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        
        // 更新图标
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // 保存主题偏好
        localStorage.setItem('theme', newTheme);
    });
    
    // 移动端菜单
    mobileMenuBtn.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });
    
    // 初始化进度条动画
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width;
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillProgressBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // 检查保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // 自适应调整函数
    function handleResize() {
        // 根据屏幕尺寸调整粒子数量
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenArea = screenWidth * screenHeight;
        
        // 根据屏幕面积调整粒子数量
        const baseParticleCount = 150;
        const baseScreenArea = 1920 * 1080;
        const adjustedParticleCount = Math.floor(baseParticleCount * (screenArea / baseScreenArea));
        
        // 如果粒子数量变化超过20%，重新初始化粒子系统
        if (Math.abs(adjustedParticleCount - window.PARTICLE_COUNT) > window.PARTICLE_COUNT * 0.2) {
            console.log(`建议粒子数量调整为: ${adjustedParticleCount}`);
        }
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 初始调整
    handleResize();
});
