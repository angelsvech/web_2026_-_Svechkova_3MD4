(function() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 200;
    let width, height;

    function initStars(w, h) {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 2 + 0.8,
                alpha: Math.random() * 0.5 + 0.2,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.2 + 0.15,
                twinkle: Math.random() * 0.05 + 0.01,
            });
        }
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars(width, height);
        drawStars();
    }

    function drawStars() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#150B0A';
        ctx.fillRect(0, 0, width, height);

        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 * s.twinkle * 10);
            const opacity = Math.min(s.alpha * twinkle, 0.9);
            ctx.fillStyle = `rgba(255, 235, 190, ${opacity})`;
            ctx.fill();
        }
        requestAnimationFrame(drawStars);
    }

    function updateStars() {
        for (const s of stars) {
            s.x += s.speedX;
            s.y += s.speedY;

            if (s.x < -20) s.x = width + 20;
            if (s.x > width + 20) s.x = -20;
            if (s.y < -20) s.y = height + 20;
            if (s.y > height + 20) s.y = -20;

            s.radius = Math.max(0.7, Math.min(2.4, s.radius + (Math.random() - 0.5) * 0.03));
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    setInterval(updateStars, 50);
})();

const dots = document.querySelectorAll('.dot');
if (dots.length) {
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
}


const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.querySelector('.close-modal');
const modalForm = document.getElementById('modalForm');
const downloadBtn = document.getElementById('downloadBtn');
const registerBtn = document.getElementById('registerBtn');

function openModal(title) {
    modalTitle.textContent = title;
    modalOverlay.classList.add('active');
    modalForm.reset();
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

downloadBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('Скачать приложение');
});

registerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('Регистрация');
});

closeModalBtn?.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName || !lastName || !email) {
        alert('Пожалуйста, заполните обязательные поля: Имя, Фамилия, Email');
        return;
    }

    alert(`Спасибо, ${firstName} ${lastName}!\nВаша заявка принята.\nМы свяжемся с вами по email: ${email}`);
    closeModal();
});

console.log('📥 Страница загрузки готова');