// Obtenemos todas las imágenes de la galería y los botones de navegación
const images = document.querySelectorAll('.gallery .img-item');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentIndex = 0; // Índice de la imagen actual mostrada

// Función para mostrar la imagen en el índice dado
function showImage(index) {
    // Ocultar todas las imágenes
    images.forEach(image => image.classList.remove('active'));
    // Mostrar la imagen en el índice dado
    images[index].classList.add('active');
    // Actualizar el índice actual
    currentIndex = index;
}

// Mostrar la primera imagen al cargar la página
showImage(currentIndex);

// Evento click para el botón previo
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
});

// Evento click para el botón siguiente
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
});
