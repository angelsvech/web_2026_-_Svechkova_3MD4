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


const pages = {
    home: document.getElementById('homePage'),
    reviews: document.getElementById('reviewsPage'),
    download: document.getElementById('downloadPage'),
    contacts: document.getElementById('contactsPage')
};

const menuItems = document.querySelectorAll('.menu li[data-page]');

function showPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove('active-page'));
    if (pages[pageId]) pages[pageId].classList.add('active-page');
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        if (pageId && pages[pageId]) showPage(pageId);
    });
});

const resetArea = document.getElementById('clickToResetArea');
let dynamicBlock = document.getElementById('dynamicBlock');

function resetToOriginal() {
    if (dynamicBlock && dynamicBlock.classList.contains('quote-block')) {
        const newDiv = document.createElement('div');
        newDiv.id = 'dynamicBlock';
        newDiv.className = 'platform-description';
        newDiv.innerHTML =
            `Культурная платформа нового поколения,<br>где собраны медиатека, интерактивные карточки,<br>викторины, чат-обсуждения и афиша мероприятий<br>с онлайн-покупкой билетов.`;
        dynamicBlock.replaceWith(newDiv);
        dynamicBlock = document.getElementById('dynamicBlock');
    }
}

function createQuoteBlock(quoteText, authorName) {
    const div = document.createElement('div');
    div.className = 'quote-block';

    let formattedQuote = quoteText;
    if (quoteText.includes("Уважение к минувшему")) {
        formattedQuote = "Уважение к минувшему — вот черта,<br>отличающая образованность от дикости";
    } else if (quoteText.includes("Культура — это не результат")) {
        formattedQuote = "Культура — это не результат обучения<br>в школе, а результат стремления<br>к знаниям на протяжении всей жизни";
    } else if (quoteText.includes("Культура - это мера")) {
        formattedQuote = "Культура - это мера человечности в человеке";
    }

    div.innerHTML = `
        <div class="quote-inner">
            <div class="quote-text">${formattedQuote}</div>
            <div class="quote-stripe"></div>
            <div class="quote-author">${authorName}</div>
        </div>
    `;
    return div;
}

const cards = document.querySelectorAll('.culture-card');

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();

        const quote = card.getAttribute('data-quote');
        const author = card.getAttribute('data-author');

        if (quote && author) {
            const quoteElement = createQuoteBlock(quote, author);
            const currentBlock = document.getElementById('dynamicBlock');

            if (currentBlock) {
                currentBlock.replaceWith(quoteElement);
                dynamicBlock = document.getElementById('dynamicBlock');
                if (!dynamicBlock) {
                    quoteElement.id = 'dynamicBlock';
                    dynamicBlock = quoteElement;
                }
            }
        }
    });
});

resetArea.addEventListener('click', (e) => {
    if (e.target.closest('.culture-card')) return;
    if (e.target.closest('.btn-next')) return;
    if (e.target.closest('.pagination-dots')) return;
    resetToOriginal();
});

// ===== ПАГИНАЦИЯ =====
const dots = document.querySelectorAll('.dot');
let activeIndex = 0;

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        activeIndex = idx;
    });
});


document.querySelector('.left-aligned-container')?.classList.add('fade-up');