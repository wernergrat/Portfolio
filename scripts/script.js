const buttonNext = document.querySelector('[data-carousel-button-next]');
const buttonPrevious = document.querySelector('[data-carousel-button-previous]');
const carousel = document.querySelector('[data-carousel]');
const slidesContainer = document.querySelector('[data-carousel-slides-container]');
let currentSlide = 0;  // Start with the first slide
let slidesData = [];

fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        slidesData = data;

        // Dynamically create slides based on the number of items in the JSON
        slidesContainer.innerHTML = ''; // Clear existing slides
        slidesData.forEach((_, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.innerHTML = '<div class="content"></div>';
            slidesContainer.appendChild(slide);
            loadSlideContent(index, slide);
        });

        // Update the number of slides and set the initial slide
        currentSlide = 0;
        carousel.style.setProperty('--current-slide', currentSlide);
    });

function loadSlideContent(slideIndex, slideElement) {
    const data = slidesData[slideIndex];
    slideElement.querySelector('.content').innerHTML = `
        <img src="assets/images/${data.image_path}" alt="${data.title}">
        <h1>${data.title}</h1>
        <p>${data.description}</p>
    `;
    applyRandomRotation(slideElement.querySelector('.content img'));
}

function applyRandomRotation(imageElement) {
    const rotationDegrees = Math.random() * (1 - (-1)) + (-1); // Random number between -5 and 5
    imageElement.style.transform = `rotate(${rotationDegrees}deg)`;
}

function handleNext() {
    currentSlide = modulo(currentSlide + 1, slidesData.length);
    carousel.style.setProperty('--current-slide', currentSlide);
    const nextSlideIndex = modulo(currentSlide + 1, slidesData.length);
    loadSlideContent(nextSlideIndex, slidesContainer.children[nextSlideIndex]);
}

function handlePrevious() {
    currentSlide = modulo(currentSlide - 1, slidesData.length);
    carousel.style.setProperty('--current-slide', currentSlide);
    const prevSlideIndex = modulo(currentSlide - 1, slidesData.length);
    loadSlideContent(prevSlideIndex, slidesContainer.children[prevSlideIndex]);
}

function modulo(number, mod) {
    let result = number % mod;
    if (result < 0) {
        result += mod;
    }
    return result;
}

buttonNext.addEventListener('click', handleNext);
buttonPrevious.addEventListener('click', handlePrevious);