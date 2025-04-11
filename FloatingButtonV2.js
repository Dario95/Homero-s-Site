const fabElement = document.getElementById("floating-snap-btn-wrapper");
let oldPositionX, oldPositionY;
let isDragging = false;
let customClickHandler = null;
let offsetX = 0;
let offsetY = 0;

// Movimiento del botón
const move = (e) => {
  if (!fabElement.classList.contains("fab-active")) {
    isDragging = true;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    fabElement.style.top = (clientY - offsetY) + "px";
    fabElement.style.left = (clientX - offsetX) + "px";
    fabElement.style.right = "";
    fabElement.classList.remove("left", "right");
  }
};

// Al presionar para mover
const mouseDown = (e) => {
  oldPositionY = fabElement.style.top;
  oldPositionX = fabElement.style.left;
  isDragging = false;

  const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
  const rect = fabElement.getBoundingClientRect();

  // Calculamos el offset entre el cursor y la esquina superior izquierda del botón
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
  window.addEventListener(moveEvent, move);

  fabElement.style.transition = "none";
};

// Al soltar después de mover
const mouseUp = (e) => {
  const moveEvent = e.type === "mouseup" ? "mousemove" : "touchmove";
  window.removeEventListener(moveEvent, move);

  fabElement.style.transition = "0.3s ease-in-out";
  snapToSide(e);
};

// Lógica de anclaje al borde
const snapToSide = (e) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const rect = fabElement.getBoundingClientRect();

  const currX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
  const currY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;

  const edgePadding = 0;

  let newTop = Math.min(Math.max(currY - offsetY, edgePadding), windowHeight - rect.height - edgePadding);
  fabElement.style.top = newTop + "px";

  if (currX < windowWidth / 2) {
    fabElement.style.left = "0";
    fabElement.style.right = "";
    fabElement.classList.remove("right");
    fabElement.classList.add("left");
  } else {
    fabElement.style.left = "";
    fabElement.style.right = "0";
    fabElement.classList.remove("left");
    fabElement.classList.add("right");
  }
};

// Click personalizado
fabElement.addEventListener("click", function() {
  if (!isDragging && typeof customClickHandler === "function") {
    customClickHandler();
  }
});

// Listeners para mover
fabElement.addEventListener("mousedown", mouseDown);
fabElement.addEventListener("mouseup", mouseUp);
fabElement.addEventListener("touchstart", mouseDown);
fabElement.addEventListener("touchend", mouseUp);

// API pública para click personalizado
function setCustomClickListener(callback) {
  customClickHandler = callback;
}
