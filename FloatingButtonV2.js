// Version 2.6 - FloatingButton.js

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
      Object.assign(fabWrapper.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        cursor: 'pointer'
      });
  
      const fabBtn = document.createElement('div');
      fabBtn.className = 'fab-btn';
      fabBtn.style.display = 'flex';
      fabBtn.style.alignItems = 'center';
      fabBtn.style.gap = '8px';
      fabBtn.style.transformOrigin = 'center';
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
  
      fabElement.style.left = clientX - this.offsetX + "px";
      fabElement.style.top = clientY - this.offsetY + "px";
  
      this.hasMoved = true;
    }
  
    mouseUp(e, fabElement, fabBtn) {
      this.isDragging = false;
      fabElement.style.transition = '0.3s ease-in-out';
      this.snapToEdge(fabElement, fabBtn);
    }
  
    snapToEdge(fabElement, fabBtn) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
      const edgePadding = 0;
  
      let newTop = Math.min(Math.max(fabElement.offsetTop, edgePadding), windowHeight - rect.height - edgePadding);
      fabElement.style.top = newTop + "px";
  
      const isLeft = fabElement.offsetLeft < windowWidth / 2;
  
      if (isLeft) {
        fabElement.style.left = "0";
        fabElement.style.right = "";
        fabBtn.style.transform = 'rotate(180deg)';
      } else {
        fabElement.style.left = "";
        fabElement.style.right = "0";
        fabBtn.style.transform = 'rotate(0deg)';
      }
    }
  }
  
  window.FloatingButton = FloatingButton;
  