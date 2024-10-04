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
