// Version 2.6.6 - FloatingButton.js

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
      fabWrapper.classList.add('right'); // Empieza en la derecha
  
      Object.assign(fabWrapper.style, {
        position: 'fixed',
        top: '50%',
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
  
      fabWrapper.addEventListener('mousedown', (e) => this.mouseDown(e, fabWrapper, fabBtn));
      fabWrapper.addEventListener('touchstart', (e) => this.mouseDown(e, fabWrapper, fabBtn));
  
      fabWrapper.appendChild(fabBtn);
      mainWrapper.appendChild(fabWrapper);
      document.body.appendChild(mainWrapper);
  
      // Esperar a que el botón se renderice completamente
      setTimeout(() => {
        const rect = fabWrapper.getBoundingClientRect();
        const left = window.innerWidth - rect.width;
        fabWrapper.style.left = `${left}px`;
      }, 0);
    }
  
    mouseDown(e, fabElement, fabBtn) {
      this.isDragging = true;
      this.hasMoved = false;
  
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const rect = fabElement.getBoundingClientRect();
  
      this.offsetX = clientX - rect.left;
      this.offsetY = clientY - rect.top;
  
      fabElement.style.transition = 'none';
      fabElement.style.transform = ''; // quitar centrado vertical mientras se mueve
  
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
      fabElement.style.transition = 'left 0.3s ease-in-out, top 0.3s ease-in-out';
      this.snapToEdge(fabElement, fabBtn);
    }
  
    snapToEdge(fabElement, fabBtn) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
      const edgePadding = 0;
  
      const elementWidth = rect.width;
      const elementHeight = rect.height;
  
      let newTop = Math.min(Math.max(rect.top, edgePadding), windowHeight - elementHeight - edgePadding);
      fabElement.style.top = `${newTop}px`;
  
      const centerX = rect.left + elementWidth / 2;
      const isCloserToLeft = centerX < windowWidth / 2;
  
      if (isCloserToLeft) {
        fabElement.style.left = `0px`;
        fabBtn.style.transform = 'rotate(0deg)';
        fabElement.classList.remove('right');
      } else {
        const newLeft = windowWidth - elementWidth;
        fabElement.style.left = `${newLeft}px`;
        fabBtn.style.transform = 'rotate(180deg)';
        fabElement.classList.add('right');
      }
    }
  }
  
  window.FloatingButton = FloatingButton;
  