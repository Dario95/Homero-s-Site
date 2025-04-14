// Version 2.7.0 - Posicionamiento inicial corregido (pegado al borde derecho)

class FloatingButton {
    constructor(options) {
      this.icon = options.icon || 'chat_bubble';
      this.text = options.text || 'Feedback';
      this.onClick = options.onClick || function () {};
  
      this.isDragging = false;
      this.hasMoved = false;
      this.offsetX = 0;
      this.offsetY = 0;
  
      this.createButton();
    }
  
    createButton() {
      const mainWrapper = document.createElement('div');
      mainWrapper.id = 'main-wrapper';
  
      const fabWrapper = document.createElement('div');
      fabWrapper.id = 'floating-snap-btn-wrapper';
      fabWrapper.classList.add('right');
  
      Object.assign(fabWrapper.style, {
        position: 'fixed',
        top: '50%',
        left: '0px', // temporal
        zIndex: '9999',
        cursor: 'pointer',
        transition: 'left 0.3s ease-in-out, top 0.3s ease-in-out',
        transform: 'translateY(-50%)',
      });
  
      const fabBtn = document.createElement('div');
      fabBtn.className = 'fab-btn';
      fabBtn.style.display = 'flex';
      fabBtn.style.alignItems = 'center';
      fabBtn.style.gap = '8px';
      fabBtn.style.transformOrigin = 'center';
      fabBtn.style.transform = 'rotate(180deg)';
      fabBtn.innerHTML = `
        <i class="material-icons fab-icon">${this.icon}</i>
        <span class="fab-text">${this.text}</span>
      `;
  
      fabBtn.addEventListener('click', (e) => {
        if (!this.hasMoved) this.onClick(e);
      });
  
      fabWrapper.appendChild(fabBtn);
      mainWrapper.appendChild(fabWrapper);
      document.body.appendChild(mainWrapper);
  
      // Asegurar que el botón se haya renderizado y medir su ancho
      requestAnimationFrame(() => {
        const buttonWidth = fabWrapper.offsetWidth;
        fabWrapper.style.left = `${window.innerWidth - buttonWidth}px`;
      });
  
      // Listeners para movimiento
      fabWrapper.addEventListener('mousedown', (e) => this.mouseDown(e, fabWrapper, fabBtn));
      fabWrapper.addEventListener('touchstart', (e) => this.mouseDown(e, fabWrapper, fabBtn));
    }
  
    mouseDown(e, fabElement, fabBtn) {
      this.isDragging = true;
      this.hasMoved = false;
  
      fabElement.style.transition = 'none';
      fabElement.style.transform = '';
  
      const rect = fabElement.getBoundingClientRect();
      this.offsetX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - rect.left;
      this.offsetY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - rect.top;
  
      const moveHandler = (ev) => this.move(ev, fabElement);
      const upHandler = (ev) => {
        this.mouseUp(ev, fabElement, fabBtn);
        window.removeEventListener(moveEvent, moveHandler);
        window.removeEventListener(upEvent, upHandler);
      };
  
      const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
      const upEvent = e.type === "mousedown" ? "mouseup" : "touchend";
  
      window.addEventListener(moveEvent, moveHandler);
      window.addEventListener(upEvent, upHandler);
    }
  
    move(e, fabElement) {
      if (!this.isDragging) return;
  
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
  
      fabElement.style.left = `${clientX - this.offsetX}px`;
      fabElement.style.top = `${clientY - this.offsetY}px`;
  
      this.hasMoved = true;
    }
  
    mouseUp(e, fabElement, fabBtn) {
      this.isDragging = false;
  
      setTimeout(() => {
        fabElement.style.transition = 'left 0.3s ease-in-out, top 0.3s ease-in-out';
        this.snapToEdge(fabElement, fabBtn);
      }, 10);
    }
  
    snapToEdge(fabElement, fabBtn) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
  
      const newTop = Math.min(Math.max(rect.top, 0), windowHeight - rect.height);
      fabElement.style.top = `${newTop}px`;
  
      const centerX = rect.left + rect.width / 2;
      const isCloserToLeft = centerX < windowWidth / 2;
  
      if (isCloserToLeft) {
        fabElement.style.left = '0px';
        fabElement.classList.remove('right');
        fabBtn.style.transform = 'rotate(0deg)';
      } else {
        fabElement.style.left = `${windowWidth - rect.width}px`;
        fabElement.classList.add('right');
        fabBtn.style.transform = 'rotate(180deg)';
      }
    }
  }
  
  window.FloatingButton = FloatingButton;
  