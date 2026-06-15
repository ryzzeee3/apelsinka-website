// Мобильное меню (бургер)
const burger = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
if (burger) {
    burger.addEventListener('click', () => navMenu.classList.toggle('active'));
}
document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));

// Переключение тёмной/светлой темы с сохранением
const themeCheckbox = document.getElementById('themeCheckbox');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeCheckbox) themeCheckbox.checked = true;
} else if (savedTheme === 'light') {
    document.body.classList.remove('dark');
    if (themeCheckbox) themeCheckbox.checked = false;
} else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
        if (themeCheckbox) themeCheckbox.checked = true;
        localStorage.setItem('theme', 'dark');
    }
}
if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Календарь для выбора даты и времени
const datetimeInput = document.getElementById('datetime');
if (datetimeInput) {
    flatpickr(datetimeInput, {
        locale: "ru",
        enableTime: true,
        dateFormat: "d.m.Y H:i",
        minDate: "today",
        time_24hr: true,
        minuteIncrement: 15,
        disable: [function(date) { return date.getDay() === 0; }]
    });
}

// Автоматическое расширение поля "Услуга / Пожелание"
function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
}
const serviceTextarea = document.getElementById('service');
if (serviceTextarea) {
    serviceTextarea.addEventListener('input', function() {
        autoResizeTextarea(this);
    });
    autoResizeTextarea(serviceTextarea);
}

// НОВЫЕ ФОТОГРАФИИ (ImageBan.ru, с lazy loading)

// Фото интерьера ("О нас") — 5 штук
const aboutImages = [
    "https://i3.imageban.ru/out/2026/06/15/ccc786c18ddc99c42304c3b01e1c9c82.jpg",
    "https://i1.imageban.ru/out/2026/06/15/58817621beb1a1f60e41879468c6e796.jpg",
    "https://i7.imageban.ru/out/2026/06/15/77cfd250c929e1ca8c88c579feec3288.jpg",
    "https://i4.imageban.ru/out/2026/06/15/a94caf4b0dbd72bfc438d2b45609dcaa.jpg",
    "https://i7.imageban.ru/out/2026/06/15/1380d11aeeff90d223a483e5e5b8fe54.jpg"
];

// Фото работ мастера ("Наши работы") — 8 штук
const galleryImages = [
    "https://i2.imageban.ru/out/2026/06/15/74407f5d856d61d4cf71e56a20f65904.jpg",
    "https://i8.imageban.ru/out/2026/06/15/5365ce50992b87c92b08676d3b629cf9.jpg",
    "https://i3.imageban.ru/out/2026/06/15/383558c1a75b94da24a4fdeb5c8ca2f4.jpg",
    "https://i7.imageban.ru/out/2026/06/15/226c5cfc718b2709c3f3c4bdef5d9c90.jpg",
    "https://i8.imageban.ru/out/2026/06/15/7d8baa80c94c13c85f2e587de97359f5.jpg",
    "https://i6.imageban.ru/out/2026/06/15/7a4704d1ebbe7b7030cc23acc0bd8f30.jpg",
    "https://i3.imageban.ru/out/2026/06/15/e903fd04802256b2fb46aa05b351f13f.jpg",
    "https://i1.imageban.ru/out/2026/06/15/b88bc297448ec5d83bcdcfdb05dda931.jpg"
];

// СЛАЙДЕР ИНТЕРЬЕРА 
let aboutCurrentIndex = 0;
let aboutAutoInterval = null;
let aboutAutoDelay = 5000;
let aboutPauseTimeout = null;

const aboutSliderTrack = document.getElementById('aboutSliderTrack');
const aboutPrevBtn = document.getElementById('aboutPrevBtn');
const aboutNextBtn = document.getElementById('aboutNextBtn');
const aboutSliderDots = document.getElementById('aboutSliderDots');

function renderAboutSlider() {
    if (!aboutSliderTrack) return;
    
    aboutSliderTrack.innerHTML = aboutImages.map((img, idx) => `
        <div class="about-slide" data-about-img="${img}" data-about-index="${idx}">
            <img src="${img}" alt="Интерьер салона" loading="lazy">
        </div>
    `).join('');
    
    aboutSliderDots.innerHTML = '';
    for (let i = 0; i < aboutImages.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('about-dot');
        if (i === aboutCurrentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopAboutAutoScroll();
            goToAboutSlide(i);
            startAboutAutoScrollWithDelay();
        });
        aboutSliderDots.appendChild(dot);
    }
    
    document.querySelectorAll('.about-slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const index = parseInt(slide.dataset.aboutIndex);
            openAboutModal(index);
        });
    });
    
    updateAboutSliderPosition();
}

function updateAboutSliderPosition() {
    if (aboutSliderTrack) {
        aboutSliderTrack.style.transform = `translateX(-${aboutCurrentIndex * 100}%)`;
    }
    document.querySelectorAll('.about-dot').forEach((dot, i) => {
        if (i === aboutCurrentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToAboutSlide(index) {
    if (index < 0) index = 0;
    if (index >= aboutImages.length) index = aboutImages.length - 1;
    aboutCurrentIndex = index;
    updateAboutSliderPosition();
}

function nextAboutSlide() {
    aboutCurrentIndex = (aboutCurrentIndex + 1) % aboutImages.length;
    updateAboutSliderPosition();
}

function prevAboutSlide() {
    aboutCurrentIndex = (aboutCurrentIndex - 1 + aboutImages.length) % aboutImages.length;
    updateAboutSliderPosition();
}

function startAboutAutoScroll() {
    if (aboutAutoInterval) clearInterval(aboutAutoInterval);
    aboutAutoInterval = setInterval(() => {
        nextAboutSlide();
    }, aboutAutoDelay);
}

function stopAboutAutoScroll() {
    if (aboutAutoInterval) {
        clearInterval(aboutAutoInterval);
        aboutAutoInterval = null;
    }
}

function startAboutAutoScrollWithDelay() {
    if (aboutPauseTimeout) clearTimeout(aboutPauseTimeout);
    aboutPauseTimeout = setTimeout(() => {
        startAboutAutoScroll();
    }, 7000);
}

if (aboutPrevBtn && aboutNextBtn) {
    aboutPrevBtn.addEventListener('click', () => {
        stopAboutAutoScroll();
        prevAboutSlide();
        startAboutAutoScrollWithDelay();
    });
    aboutNextBtn.addEventListener('click', () => {
        stopAboutAutoScroll();
        nextAboutSlide();
        startAboutAutoScrollWithDelay();
    });
}

startAboutAutoScroll();

// КАРУСЕЛЬ ГАЛЕРЕИ РАБОТ 
let currentPosition = 0;
let galleryAutoInterval = null;
let galleryAutoDelay = 6000;
let galleryPauseTimeout = null;
let itemsToShow = 4;

const galleryTrack = document.getElementById('galleryTrack');
const galleryDots = document.getElementById('galleryDots');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');

function updateItemsToShow() {
    if (window.innerWidth <= 992 && window.innerWidth > 768) {
        itemsToShow = 2;
    } else if (window.innerWidth <= 768) {
        itemsToShow = 2;
    } else {
        itemsToShow = 4;
    }
    renderGalleryCarousel();
}

function renderGalleryCarousel() {
    if (!galleryTrack) return;
    
    galleryTrack.innerHTML = '';
    for (let i = 0; i < itemsToShow; i++) {
        const imgIndex = (currentPosition + i) % galleryImages.length;
        const img = galleryImages[imgIndex];
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-full-img', img);
        item.setAttribute('data-img-index', imgIndex);
        item.innerHTML = `<img src="${img}" alt="Работа мастера" loading="lazy">`;
        item.addEventListener('click', () => {
            openGalleryModal(imgIndex);
        });
        galleryTrack.appendChild(item);
    }
    
    updateGalleryDots();
}

function updateGalleryDots() {
    if (!galleryDots) return;
    galleryDots.innerHTML = '';
    for (let i = 0; i < galleryImages.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === (currentPosition % galleryImages.length)) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopGalleryAutoScroll();
            currentPosition = i;
            renderGalleryCarousel();
            startGalleryAutoScrollWithDelay();
        });
        galleryDots.appendChild(dot);
    }
}

function nextGallerySlide() {
    currentPosition = (currentPosition + 1) % galleryImages.length;
    renderGalleryCarousel();
}

function prevGallerySlide() {
    currentPosition = (currentPosition - 1 + galleryImages.length) % galleryImages.length;
    renderGalleryCarousel();
}

function startGalleryAutoScroll() {
    if (galleryAutoInterval) clearInterval(galleryAutoInterval);
    galleryAutoInterval = setInterval(() => {
        nextGallerySlide();
    }, galleryAutoDelay);
}

function stopGalleryAutoScroll() {
    if (galleryAutoInterval) {
        clearInterval(galleryAutoInterval);
        galleryAutoInterval = null;
    }
}

function startGalleryAutoScrollWithDelay() {
    if (galleryPauseTimeout) clearTimeout(galleryPauseTimeout);
    galleryPauseTimeout = setTimeout(() => {
        startGalleryAutoScroll();
    }, 20000);
}

if (galleryPrevBtn && galleryNextBtn) {
    galleryPrevBtn.addEventListener('click', () => {
        stopGalleryAutoScroll();
        prevGallerySlide();
        startGalleryAutoScrollWithDelay();
    });
    galleryNextBtn.addEventListener('click', () => {
        stopGalleryAutoScroll();
        nextGallerySlide();
        startGalleryAutoScrollWithDelay();
    });
}

window.addEventListener('resize', () => {
    updateItemsToShow();
});

updateItemsToShow();
startGalleryAutoScroll();

// МОДАЛЬНЫЕ ОКНА 
let currentAboutModalIndex = 0;
let currentGalleryModalIndex = 0;
let isAboutModal = false;
let isGalleryModal = false;

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCounter = document.getElementById('modalCounter');
const prevModalBtn = document.getElementById('prevModalBtn');
const nextModalBtn = document.getElementById('nextModalBtn');
const modalClose = document.querySelector('.modal-close');
const heroImage = document.getElementById('heroImage');

function openAboutModal(index) {
    currentAboutModalIndex = index;
    isAboutModal = true;
    isGalleryModal = false;
    modalImage.src = aboutImages[currentAboutModalIndex];
    modalCounter.textContent = `${currentAboutModalIndex + 1} / ${aboutImages.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopAboutAutoScroll();
}

function openGalleryModal(index) {
    currentGalleryModalIndex = index;
    isGalleryModal = true;
    isAboutModal = false;
    modalImage.src = galleryImages[currentGalleryModalIndex];
    modalCounter.textContent = `${currentGalleryModalIndex + 1} / ${galleryImages.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopGalleryAutoScroll();
}

function openHeroModal() {
    isAboutModal = false;
    isGalleryModal = false;
    modalImage.src = heroImage.src;
    modalCounter.textContent = `Главное фото`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (isAboutModal) {
        startAboutAutoScroll();
    }
    if (isGalleryModal) {
        startGalleryAutoScroll();
    }
    isAboutModal = false;
    isGalleryModal = false;
}

function prevModalImage() {
    if (isAboutModal) {
        if (currentAboutModalIndex > 0) {
            currentAboutModalIndex--;
            modalImage.src = aboutImages[currentAboutModalIndex];
            modalCounter.textContent = `${currentAboutModalIndex + 1} / ${aboutImages.length}`;
        }
    } else if (isGalleryModal) {
        if (currentGalleryModalIndex > 0) {
            currentGalleryModalIndex--;
            modalImage.src = galleryImages[currentGalleryModalIndex];
            modalCounter.textContent = `${currentGalleryModalIndex + 1} / ${galleryImages.length}`;
        }
    }
}

function nextModalImage() {
    if (isAboutModal) {
        if (currentAboutModalIndex < aboutImages.length - 1) {
            currentAboutModalIndex++;
            modalImage.src = aboutImages[currentAboutModalIndex];
            modalCounter.textContent = `${currentAboutModalIndex + 1} / ${aboutImages.length}`;
        }
    } else if (isGalleryModal) {
        if (currentGalleryModalIndex < galleryImages.length - 1) {
            currentGalleryModalIndex++;
            modalImage.src = galleryImages[currentGalleryModalIndex];
            modalCounter.textContent = `${currentGalleryModalIndex + 1} / ${galleryImages.length}`;
        }
    }
}

if (heroImage) heroImage.addEventListener('click', openHeroModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (prevModalBtn) prevModalBtn.addEventListener('click', prevModalImage);
if (nextModalBtn) nextModalBtn.addEventListener('click', nextModalImage);
if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}
document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevModalImage();
        if (e.key === 'ArrowRight') nextModalImage();
        if (e.key === 'Escape') closeModal();
    }
});

// Запуск слайдера интерьера
renderAboutSlider();

// ОТПРАВКА ЗАЯВОК В TELEGRAM через Cloudflare Worker
const WORKER_URL = 'https://apelsinka-bot.ryzzevpn4.workers.dev';

async function sendToTelegram(fullname, phone, service, datetime) {
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullname, phone, service, datetime })
        });
        
        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error('Ошибка:', error);
        return false;
    }
}

const form = document.getElementById('callbackForm');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const datetime = document.getElementById('datetime').value;
        
        if (fullname.trim() === "") { alert("Пожалуйста, введите ваше ФИО"); return; }
        if (phone.trim() === "") { alert("Пожалуйста, введите ваш номер телефона"); return; }
        if (datetime.trim() === "") { alert("Пожалуйста, выберите дату и время"); return; }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляю...';
        submitBtn.disabled = true;
        
        const sent = await sendToTelegram(fullname, phone, service, datetime);
        
        if (sent) {
            alert(`✨ Спасибо, ${fullname.split(' ')[0]}! ✨\n\n✅ Ваша заявка успешно отправлена!\n\n📌 В ближайшее время наш мастер свяжется с вами для подтверждения точной даты и времени записи.\n\n🍊 Благодарим за доверие! Ждем вас в "Апельсинка beauty".`);
            form.reset();
            document.getElementById('datetime').value = '';
            if (serviceTextarea) {
                serviceTextarea.style.height = 'auto';
            }
        } else {
            alert('❌ Произошла ошибка при отправке.\n\nПожалуйста, попробуйте позже или свяжитесь с нами по телефону.\n\nПриносим извинения за временные неудобства.');
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}