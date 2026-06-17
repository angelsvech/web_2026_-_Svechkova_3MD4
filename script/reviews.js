const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const starCount = 200;

function initStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.8,
            alpha: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.2 + 0.15,
            twinkle: Math.random() * 0.05 + 0.01,
        });
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#150B0A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 * s.twinkle * 10);
        const opacity = Math.min(s.alpha * twinkle, 0.9);
        ctx.fillStyle = `rgba(255, 235, 190, ${opacity})`;
        ctx.fill();
    }
}

function updateStars() {
    for (const s of stars) {
        s.x += s.speedX;
        s.y += s.speedY;

        if (s.x < -20) s.x = canvas.width + 20;
        if (s.x > canvas.width + 20) s.x = -20;
        if (s.y < -20) s.y = canvas.height + 20;
        if (s.y > canvas.height + 20) s.y = -20;

        s.radius = Math.max(0.7, Math.min(2.4, s.radius + (Math.random() - 0.5) * 0.03));
    }
}

function animateStars() {
    updateStars();
    drawStars();
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();


const dots = document.querySelectorAll('.dot');

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
});

console.log('📝 Страница отзывов загружена');