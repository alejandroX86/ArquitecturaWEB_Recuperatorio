const typewriter = document.getElementById('typewriter');
const speedSlider = document.getElementById('speedSlider');
const resetTypewriterButton = document.getElementById('resetTypewriter');

const text = "Universidad UNPAZ\nArquitectura WEB\nRecuperatorio primer parcial\nProfesor: Fernando Corinaldesi\nAlumno: Omar Alejandro Bazar\n\nEste código tiene como propósito aplicar todos los conceptos aprendidos en la Cátedra de Arquitectura WEB sobre HTML, CSS y Javascript.\n\nEste código utiliza métodos funcionales y funciones de orden superior para manipular y transformar datos de manera eficiente. La combinación de map y reduce permite crear y agregar elementos de imagen a la galería de manera declarativa, mientras que el operador ternario y los eventos de escucha de eventos facilitan la gestión de la lógica de la aplicación. Este enfoque funcional y declarativo es una práctica moderna en el desarrollo web que promueve la claridad y la mantenibilidad del código.La información del código de la Galería de Imágenes se obtiene a través de una API pública utilizando await fetch para realizar la solicitud asíncrona, ejemplificando la integración efectiva de operaciones asíncronas en un paradigma funcional.";

let currentIndex = 0;
let typingSpeed = 100; // Velocidad inicial en milisegundos

// Configuración del audio para el tipeo a máquina
let audioContext;
const playTypewriterSound = () => {
    audioContext = audioContext ? audioContext : new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // Tipo de onda más grave
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Frecuencia (Hz) más grave
    gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Volumen al máximo

    // Conectar los nodos
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar y detener el sonido
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05); // Duración de 0.05 segundos
};

// Configuración del audio para el sonido futurista
const playFuturisticSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sawtooth'; // Tipo de onda más futurista
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Frecuencia (Hz)
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // Volumen

    // Conectar los nodos
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar y detener el sonido
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1); // Duración de 1 segundo

    // Modulación de frecuencia para un efecto más dinámico
    const modulator = audioContext.createOscillator();
    const modGain = audioContext.createGain();
    modulator.frequency.setValueAtTime(10, audioContext.currentTime);
    modGain.gain.setValueAtTime(100, audioContext.currentTime);
    modulator.connect(modGain);
    modGain.connect(oscillator.frequency);
    modulator.start();
    modulator.stop(audioContext.currentTime + 1);
};

// Función para ajustar la velocidad de escritura
const adjustSpeed = () => {
    const speed = speedSlider.value;
    typingSpeed = 200 - (speed - 1) * 20; // Ajustar la velocidad en función del valor del slider
};

// Evento para ajustar la velocidad cuando se mueve el slider
speedSlider.addEventListener('input', adjustSpeed);

// Función para simular la escritura
const typeText = () => {
    if (currentIndex < text.length) {
        const char = text.charAt(currentIndex);
        typewriter.textContent += char;
        currentIndex++;

        // Reproduce el sonido solo si no es un espacio
        if (char !== ' ') {
            playTypewriterSound();
        }

        setTimeout(typeText, typingSpeed);
    }
};

// Función para reiniciar la simulación de escritura
const resetTypewriter = () => {
    typewriter.textContent = ''; // Borrar el texto actual
    currentIndex = 0; // Reiniciar el índice
    typeText(); // Reiniciar la simulación de escritura
};

// Evento para reiniciar la simulación de escritura
resetTypewriterButton.addEventListener('click', resetTypewriter);

// Iniciar la simulación de escritura
typeText();

const imageGallery = document.getElementById('imageGallery');
const loadImagesButton = document.getElementById('loadImages');
const clearImagesButton = document.getElementById('clearImages');
const loader = document.getElementById('loader');

const API_URL = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';

// Función para crear un elemento de imagen
const createImageItem = (hero) => {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.innerHTML = `
        <div class="hero-name">${hero.name}</div>
        <img src="${hero.images.lg}" alt="${hero.name}">
        <div class="buttons">
            <button class="delete-image">Eliminar</button>
            <button class="edit-button">Editar</button>
        </div>
    `;

    const imgElement = imageItem.querySelector('img');
    imgElement.addEventListener('mouseenter', playFuturisticSound);
    imgElement.addEventListener('click', () => alert(`Nombre: ${hero.name}\nPublicado por: ${hero.biography.publisher}`));

    return imageItem;
};

// Función para cargar imágenes desde la API
const loadImages = async () => {
    loader.style.display = 'block';
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        imageGallery.innerHTML = ''; // Limpiar la galería antes de agregar nuevas imágenes

        // Función recursiva para cargar las imágenes de manera secuencial
        const loadImageRecursively = (index) => {
            if (index >= data.length) return;

            const imageItem = createImageItem(data[index]);
            imageGallery.appendChild(imageItem);

            setTimeout(() => loadImageRecursively(index + 1), 100); // Cargar la siguiente imagen después de 100ms
        };

        loadImageRecursively(0); // Iniciar la carga recursiva desde el índice 0
    } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        alert('Hubo un error al cargar las imágenes. Por favor, inténtalo de nuevo.');
    } finally {
        loader.style.display = 'none';
    }
};

// Función para borrar imágenes
const clearImages = () => {
    imageGallery.innerHTML = '';
};

// Evento para cargar imágenes
loadImagesButton.addEventListener('click', loadImages);

// Evento para borrar imágenes
clearImagesButton.addEventListener('click', clearImages);

// Evento para borrar una imagen individual
imageGallery.addEventListener('click', (e) => {
    e.target.closest('.delete-image') && imageGallery.removeChild(e.target.closest('.image-item'));
});

// Evento para editar una imagen individual
imageGallery.addEventListener('click', (e) => {
    e.target.closest('.edit-button') && (() => {
        const imageItem = e.target.closest('.image-item');
        const imgElement = imageItem.querySelector('img');
        const newSrc = prompt('Editar URL de la imagen', imgElement.src);
        newSrc && newSrc.trim() && (imgElement.src = newSrc.trim());
    })();
});