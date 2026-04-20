const imageSlotsUrl = 'image_positions.json';
const collageImages = Array.from(document.querySelectorAll('.collage-image'));
let dragState = null;
let dragEventsBound = false;
let collageSlots = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randRotation(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getViewportScale() {
    const widthScale = window.innerWidth / 1440;
    const heightScale = window.innerHeight / 900;
    const baseScale = Math.min(widthScale, heightScale, 1);

    if (window.innerWidth <= 768) {
        return Math.max(0.24, baseScale * 1.35);
    }

    return Math.max(0.18, Math.pow(baseScale, 1.55) * 1.2);
}

function parseViewportValue(value, scale) {
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();
    const match = trimmed.match(/^([0-9.]+)(vh|vw|px|%)$/);
    if (!match) return null;

    const amount = Number.parseFloat(match[1]);
    const unit = match[2];

    if (unit === 'px') {
        return amount * scale;
    }

    if (unit === 'vh') {
        return (window.innerHeight * amount / 100) * scale;
    }

    if (unit === 'vw') {
        return (window.innerWidth * amount / 100) * scale;
    }

    if (unit === '%') {
        return (window.innerWidth * amount / 100) * scale;
    }

    return null;
}

function applyCollageSizing() {
    if (!collageSlots.length) return;

    const scale = getViewportScale();

    collageImages.forEach((image, index) => {
        const slot = collageSlots[index];
        if (!slot) return;

        image.style.top = slot.top;
        image.style.left = slot.left;
        const heightValue = parseViewportValue(slot.height || '18vh', scale);
        const maxHeightValue = parseViewportValue(slot.maxHeight, scale);
        const maxWidthValue = parseViewportValue(slot.maxWidth, scale);
        const heightPx = heightValue ?? (window.innerHeight * 0.18 * scale);

        image.style.height = `${Math.round(heightPx)}px`;
        image.style.width = 'auto';
        image.style.maxHeight = maxHeightValue ? `${Math.round(maxHeightValue)}px` : 'none';
        image.style.maxWidth = maxWidthValue ? `${Math.round(maxWidthValue)}px` : 'none';
    });
}

function bindDrag(image) {
    image.style.touchAction = 'none';
    image.style.userSelect = 'none';

    image.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        const origX = image.offsetLeft;
        const origY = image.offsetTop;
        dragState = {
            target: image,
            startX: event.clientX,
            startY: event.clientY,
            origX,
            origY,
        };
        image.style.left = `${origX}px`;
        image.style.top = `${origY}px`;
        image.setPointerCapture(event.pointerId);
        image.classList.add('dragging');
    });

    image.addEventListener('pointermove', (event) => {
        if (!dragState || dragState.target !== image) return;
        const deltaX = event.clientX - dragState.startX;
        const deltaY = event.clientY - dragState.startY;
        image.style.left = `${dragState.origX + deltaX}px`;
        image.style.top = `${dragState.origY + deltaY}px`;
    });

    image.addEventListener('pointerup', () => {
        if (dragState && dragState.target === image) {
            dragState.target.classList.remove('dragging');
        }
        dragState = null;
    });

    image.addEventListener('pointercancel', () => {
        if (dragState && dragState.target === image) {
            dragState.target.classList.remove('dragging');
        }
        dragState = null;
    });
}

fetch(imageSlotsUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Could not load ${imageSlotsUrl}`);
        }
        return response.json();
    })
    .then((slots) => {
        if (!Array.isArray(slots) || slots.length === 0) return;

        collageSlots = slots.slice(0, collageImages.length);
        shuffle(collageSlots);

        collageImages.forEach((image, index) => {
            const slot = collageSlots[index];
            if (!slot) return;
            image.style.zIndex = slot.zIndex || `${10 + index}`;
            image.style.objectFit = 'contain';
            const rotation = slot.rotation !== undefined ? slot.rotation : randRotation(-25, 25);
            image.style.setProperty('--rotation', `${rotation}deg`);
            bindDrag(image);
        });

        applyCollageSizing();
    })
    .catch((error) => {
        console.error(error);
    });

window.addEventListener('resize', applyCollageSizing);
    