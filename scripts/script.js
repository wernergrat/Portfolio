const buttonNext = document.querySelector('[data-carousel-button-next]');
const buttonPrevious = document.querySelector('[data-carousel-button-previous]');
const carousel = document.querySelector('[data-carousel]');
const slidesContainer = document.querySelector('[data-carousel-slides-container]');
let currentSlide = 0;  // Start with the first slide
const numSlides = slidesContainer.children.length;
let slidesData = [];

fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        slidesData = data;
        // Initial load
        for (let i = 0; i < numSlides; i++) {
            loadSlideContent(i, slidesContainer.children[i]);
        }
        // Set initial slide to the first one
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
    const rotationDegrees = Math.random() * (5 - (-5)) + (-5); // Random number between -5 and 5
    imageElement.style.transform = `rotate(${rotationDegrees}deg)`;
}

function handleNext() {
    currentSlide = modulo(currentSlide + 1, numSlides);
    carousel.style.setProperty('--current-slide', currentSlide);
    const nextSlideIndex = modulo(currentSlide + 1, numSlides);
    loadSlideContent(nextSlideIndex, slidesContainer.children[nextSlideIndex]);
}

function handlePrevious() {
    currentSlide = modulo(currentSlide - 1, numSlides);
    carousel.style.setProperty('--current-slide', currentSlide);
    const prevSlideIndex = modulo(currentSlide - 1, numSlides);
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