class FloatingButton {
  constructor(o = {}) {
    this.icon = o.icon || "?";
    this.text = o.text || null;
    this.onClick = typeof o.onClick == "function" ? o.onClick : () => console.warn("FloatingButton: No onClick handler provided.");
    this.targetElement = o.targetElement || document.body;
    this.snapOffset = typeof o.snapOffset == "number" ? o.snapOffset : 10;
    this.initialPosition = o.initialPosition || {
      bottom: `${this.snapOffset}px`,
      right: `${this.snapOffset}px`
    };
    this.element = null;
    this.isDragging = false;
    this.didDrag = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.injectStyles();
    this.createElement();
    this.attachListeners();
    this.appendToTarget();
    window.setTimeout(() => this.snapToEdge(true), 0);
  }
  createElement() {
    this.element = document.createElement("button");
    this.element.classList.add("floating-drag-button");
    const o = document.createElement("span");
    o.classList.add("fdb-icon");
    if (this.icon.startsWith("<") && this.icon.endsWith(">")) {
      o.innerHTML = this.icon;
    } else if (this.icon.includes(" ") || this.icon.startsWith("fa-") || this.icon.startsWith("bi-")) {
      this.icon.split(" ").forEach(t => {
        if (t) o.classList.add(t);
      });
    } else {
      o.textContent = this.icon;
    }
    this.element.appendChild(o);
    if (this.text) {
      this.element.classList.add("floating-drag-button--pill");
      const t = document.createElement("span");
      t.classList.add("fdb-text");
      t.textContent = this.text;
      this.element.appendChild(t);
    } else {
      this.element.classList.add("floating-drag-button--round");
    }
    Object.keys(this.initialPosition).forEach(o => {
      this.element.style[o] = this.initialPosition[o];
    });
    this.element.style.position = "fixed";
    this.element.setAttribute("aria-label", this.text || "Floating Action Button");
    this.element.setAttribute("type", "button");
  }
  appendToTarget() {
    if (this.targetElement) {
      this.targetElement.appendChild(this.element);
    } else {
      console.error("FloatingButton: Target element not found.");
      return;
    }
  }
  attachListeners() {
    this.element.addEventListener("pointerdown", this.dragStart.bind(this));
    this.element.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("resize", this.debounce(this.snapToEdge.bind(this, false), 100));
  }
  handleClick(o) {
    if (!this.didDrag) {
      this.onClick(o);
    }
    this.didDrag = false;
  }
  dragStart(o) {
    if (o.button !== 0 && o.pointerType === "mouse") return;
    this.isDragging = true;
    this.didDrag = false;
    this.element.style.cursor = "grabbing";
    this.element.style.transition = "background-color 0.2s ease";
    this.element.setPointerCapture(o.pointerId);
    const t = this.element.getBoundingClientRect();
    this.offsetX = o.clientX - t.left;
    this.offsetY = o.clientY - t.top;
    document.addEventListener("pointermove", this.dragMove.bind(this));
    document.addEventListener("pointerup", this.dragEnd.bind(this));
    o.preventDefault();
  }
  dragMove(o) {
    if (!this.isDragging) return;
    this.didDrag = true;
    let t = o.clientX - this.offsetX,
      e = o.clientY - this.offsetY;
    const n = this.element.getBoundingClientRect(),
      i = window.innerWidth,
      s = window.innerHeight;
    t < 0 && (t = 0);
    e < 0 && (e = 0);
    t + n.width > i && (t = i - n.width);
    e + n.height > s && (e = s - n.height);
    this.element.style.left = `${t}px`;
    this.element.style.top = `${e}px`;
    this.element.style.right = "auto";
    this.element.style.bottom = "auto";
    o.preventDefault();
  }
  dragEnd(o) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.element.style.cursor = "grab";
    this.element.releasePointerCapture(o.pointerId);
    this.element.style.transition = "left 0.3s ease-out, top 0.3s ease-out, background-color 0.2s ease";
    document.removeEventListener("pointermove", this.dragMove.bind(this));
    document.removeEventListener("pointerup", this.dragEnd.bind(this));
    this.snapToEdge(false);
  }
  snapToEdge(o = false) {
    if (!this.element) return;
    const t = this.element.getBoundingClientRect();
    if (t.width === 0 || t.height === 0) {
      if (o) {
        console.warn("FloatingButton: Could not get initial dimensions, retrying...");
        window.setTimeout(() => this.snapToEdge(true), 50);
      }
      return;
    }
    const e = window.innerWidth,
      n = window.innerHeight,
      i = t.left,
      s = t.top,
      a = i + t.width / 2,
      r = s + t.height / 2,
      l = r,
      c = n - r,
      d = a,
      u = e - a,
      h = Math.min(l, c, d, u);
    let p = i,
      m = s;
    if (h === l) {
      m = this.snapOffset;
    } else if (h === c) {
      m = n - t.height - this.snapOffset;
    } else if (h === d) {
      p = this.snapOffset;
    } else if (h === u) {
      p = e - t.width - this.snapOffset;
    }
    p < this.snapOffset && (p = this.snapOffset);
    m < this.snapOffset && (m = this.snapOffset);
    p + t.width > e - this.snapOffset && (p = e - t.width - this.snapOffset);
    m + t.height > n - this.snapOffset && (m = n - t.height - this.snapOffset);
    this.element.style.left = `${p}px`;
    this.element.style.top = `${m}px`;
    this.element.style.right = "auto";
    this.element.style.bottom = "auto";
  }
  injectStyles() {
    if (document.getElementById("floating-drag-button-styles")) return;
    const o = document.createElement("style");
    o.id = "floating-drag-button-styles";
    o.textContent = ".floating-drag-button{position:fixed;cursor:grab;z-index:9999;border:none;padding:0;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 15px rgba(0,0,0,.2);background-color:#007bff;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:1rem;user-select:none;touch-action:none;transition:left .3s ease-out,top .3s ease-out,background-color .2s ease;-webkit-tap-highlight-color:transparent}.floating-drag-button:hover{background-color:#0056b3}.floating-drag-button:active{cursor:grabbing;box-shadow:0 3px 10px rgba(0,0,0,.3)}.floating-drag-button--round{width:50px;height:50px;border-radius:50%}.floating-drag-button--round .fdb-icon{font-size:1.5em;line-height:1}.floating-drag-button--pill{height:50px;border-radius:25px;padding:0 20px 0 15px}.floating-drag-button--pill .fdb-icon{margin-right:8px;font-size:1.2em;line-height:1}.floating-drag-button--pill .fdb-text{white-space:nowrap;font-weight:500}.fdb-icon{display:inline-flex;align-items:center}.fdb-icon svg{width:1.2em;height:1.2em;fill:currentColor}";
    document.head.appendChild(o);
  }
  debounce(o, t) {
    let e;
    return function n(...i) {
      const s = () => {
        clearTimeout(e);
        o.apply(this, i);
      };
      clearTimeout(e);
      e = setTimeout(s, t);
    };
  }
  destroy() {
    this.element.removeEventListener("pointerdown", this.dragStart.bind(this));
    this.element.removeEventListener("click", this.handleClick.bind(this));
    window.removeEventListener("resize", this.debounce(this.snapToEdge.bind(this, false), 100));
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
