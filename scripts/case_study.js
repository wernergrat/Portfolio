const imageSlotsUrl = 'image_positions.json';
const collageImages = Array.from(document.querySelectorAll('.collage-image'));
let dragState = null;
let dragEventsBound = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randRotation(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    });

    image.addEventListener('pointermove', (event) => {
        if (!dragState || dragState.target !== image) return;
        const deltaX = event.clientX - dragState.startX;
        const deltaY = event.clientY - dragState.startY;
        image.style.left = `${dragState.origX + deltaX}px`;
        image.style.top = `${dragState.origY + deltaY}px`;
    });

    image.addEventListener('pointerup', () => {
        dragState = null;
    });

    image.addEventListener('pointercancel', () => {
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

        const availableSlots = slots.slice(0, collageImages.length);
        shuffle(availableSlots);

        collageImages.forEach((image, index) => {
            const slot = availableSlots[index];
            image.style.top = slot.top;
            image.style.left = slot.left;
            image.style.width = slot.width || 'clamp(120px, 18vw, 280px)';
            image.style.height = 'auto';
            if (slot.maxHeight) {
                image.style.maxHeight = slot.maxHeight;
            }
            image.style.zIndex = slot.zIndex || `${10 + index}`;
            image.style.objectFit = 'contain';
            const rotation = slot.rotation !== undefined ? slot.rotation : randRotation(-25, 25);
            image.style.transform = `rotate(${rotation}deg)`;
            bindDrag(image);
        });
    })
    .catch((error) => {
        console.error(error);
    });
    