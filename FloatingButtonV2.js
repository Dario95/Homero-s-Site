//Version 2.3
// FloatingButtonV2.js
// Archivo FloatingButton.js

class FloatingButton {
    constructor(options) {
      this.icon = options.icon || '<i class="material-icons">chat_bubble</i>';  // Ícono de Material Icons por defecto
      this.text = options.text || 'Feedback';  // Texto por defecto
      this.onClick = options.onClick || function () {};  // Evento onClick
  
      // Propiedades para el movimiento del botón
      this.isDragging = false;
      this.offsetX = 0;
      this.offsetY = 0;
  
      // Crear el contenedor del botón
      this.createButton();
    }
  
    createButton() {
      // Crear contenedor del botón flotante
      const fabWrapper = document.createElement('div');
      fabWrapper.id = 'floating-snap-btn-wrapper';
      fabWrapper.style.position = 'fixed';
      fabWrapper.style.bottom = '20px';
      fabWrapper.style.right = '20px';
      fabWrapper.style.zIndex = '9999';
      fabWrapper.style.cursor = 'pointer';
  
      // Crear el ícono y el texto dentro del botón
      const fabBtn = document.createElement('div');
      fabBtn.className = 'fab-btn';
      fabBtn.innerHTML = `<span class="fab-icon">${this.icon}</span><span class="fab-text">${this.text}</span>`;
  
      // Agregar el evento de clic
      fabBtn.addEventListener('click', this.onClick);
  
      // Agregar el evento de inicio de movimiento (mousedown/touchstart)
      fabWrapper.addEventListener('mousedown', (e) => this.mouseDown(e, fabWrapper));
      fabWrapper.addEventListener('touchstart', (e) => this.mouseDown(e, fabWrapper));
  
      // Agregar al DOM
      fabWrapper.appendChild(fabBtn);
      document.body.appendChild(fabWrapper);
  
      // Agregar estilos para el botón flotante (puedes ajustarlo como desees)
      const style = document.createElement('style');
      style.innerHTML = `
        #floating-snap-btn-wrapper .fab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        #floating-snap-btn-wrapper .fab-icon {
          margin-right: 10px;
        }
      `;
      document.head.appendChild(style);
    }
  
    mouseDown(e, fabElement) {
      this.isDragging = true;
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const rect = fabElement.getBoundingClientRect();
  
      this.offsetX = clientX - rect.left;
      this.offsetY = clientY - rect.top;
  
      // Remover transición para permitir movimiento inmediato
      fabElement.style.transition = 'none';
  
      // Escuchar movimiento (mousemove/touchmove)
      const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
      window.addEventListener(moveEvent, (ev) => this.move(ev, fabElement));
  
      // Escuchar el evento cuando se suelta el mouse o el toque (mouseup/touchend)
      window.addEventListener("mouseup", (ev) => this.mouseUp(ev, fabElement));
      window.addEventListener("touchend", (ev) => this.mouseUp(ev, fabElement));
    }
  
    move(e, fabElement) {
      if (this.isDragging) {
        const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
  
        fabElement.style.left = clientX - this.offsetX + "px";
        fabElement.style.top = clientY - this.offsetY + "px";
      }
    }
  
    mouseUp(e, fabElement) {
      this.isDragging = false;
      fabElement.style.transition = '0.3s ease-in-out';  // Agregar transición al soltar
  
      // El botón se ajusta al borde de la pantalla (izquierda o derecha)
      this.snapToEdge(fabElement);
    }
  
    snapToEdge(fabElement) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
  
      const edgePadding = 0;
      let newTop = Math.min(Math.max(fabElement.offsetTop, edgePadding), windowHeight - rect.height - edgePadding);
      fabElement.style.top = newTop + "px";
  
      if (fabElement.offsetLeft < windowWidth / 2) {
        fabElement.style.left = "0";
        fabElement.style.right = "";
      } else {
        fabElement.style.left = "";
        fabElement.style.right = "0";
      }
    }
  }
  
  // Exponer la clase FloatingButton globalmente
  window.FloatingButton = FloatingButton;
  