// Lista de imágenes en la carpeta 'lofi-backgrounds'
const images = [
  'lofi-backgrounds/1000_F_555953348_h2WODHOuUyTzt7a0Z5VnB3LI8BulBabn.jpg',
  'lofi-backgrounds/360_F_617026806_eDjiZfoGwCYio65loryv9TkJZCjRtxbT.jpg',
  'lofi-backgrounds/HD-wallpaper-lo-fi-sunset-chill-nature-relax.jpg',
  'lofi-backgrounds/ai-generated-8274619_640.webp',
  'lofi-backgrounds/ai-generated-an-animated-scene-featuring-a-girl-with-a-glass-of-wine-against-a-nighttime-cityscape-backdrop-lofi-style-loop-free-video.jpg',
  'lofi-backgrounds/background.jpg',
  'lofi-backgrounds/dfr878n-6096a1e4-f93a-4dd2-97fc-3f10dd8b3512.png',
  'lofi-backgrounds/images.jpeg',
  'lofi-backgrounds/lo-fi-mvqzjym6ie17firw.jpg',
  'lofi-backgrounds/lofi-8306352_640.webp',
  'lofi-backgrounds/lofi-background-t4qak9hshjgyhzs5.jpg',
  'lofi-backgrounds/lofi-room-illustration_950633-1461.avif',
  'lofi-backgrounds/lofi_wallpaper_3_by_nethervision_dgn3tgw-fullview.jpg'
];

let currentIndex = Math.floor(Math.random() * images.length); // Selección aleatoria inicial
const backgroundElement = document.querySelector('.background');

// Función para cambiar la imagen de fondo
function setBackgroundImage(index) {
  backgroundElement.style.backgroundImage = `url(${images[index]})`;
}

// Cambiar automáticamente el fondo cada hora
function autoChangeBackground() {
  currentIndex = (currentIndex + 1) % images.length;  // Cambiar al siguiente fondo
  setBackgroundImage(currentIndex);
}
setInterval(autoChangeBackground, 3600000);  // Cambiar cada hora (3600000 ms)

// Asignar la primera imagen aleatoria al fondo
setBackgroundImage(currentIndex);

// Cambiar el fondo con las flechas izquierda/derecha
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % images.length;  // Siguiente fondo
    setBackgroundImage(currentIndex);
  } else if (event.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + images.length) % images.length;  // Fondo anterior
    setBackgroundImage(currentIndex);
  }
});

// Configuración del contador
const countdownDate = new Date("Oct 18, 2024 00:00:00").getTime();
const countdown = document.getElementById('countdown');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').innerText = days;
  document.getElementById('hours').innerText = hours;
  document.getElementById('minutes').innerText = minutes;
  document.getElementById('seconds').innerText = seconds;

  if (distance < 0) {
    countdown.innerHTML = "<p>La página ya está disponible!</p>";
  }
}

setInterval(updateCountdown, 1000);

// Función para crear estrellas fugaces
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  document.body.appendChild(star);

  const size = Math.random() * 3 + 1 + 'px';
  const left = Math.random() * window.innerWidth + 'px';
  const top = Math.random() * window.innerHeight + 'px';
  
  star.style.width = size;
  star.style.height = size;
  star.style.left = left;
  star.style.top = top;

  setTimeout(() => {
    star.remove();
  }, 1500);
}

setInterval(createStar, 60000);  // Cada minuto
