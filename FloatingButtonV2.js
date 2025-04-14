(function () {
    let isDragging = false;
    let customClickHandler = null;
    let offsetX = 0;
    let offsetY = 0;
    let currentMoveEvent = null;
  
    function move(e, fabElement) {
      if (!fabElement.classList.contains("fab-active")) {
        isDragging = true;
        const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
  
        fabElement.style.top = (clientY - offsetY) + "px";
        fabElement.style.left = (clientX - offsetX) + "px";
        fabElement.style.right = "";
        fabElement.classList.remove("left", "right");
      }
    }
  
    function mouseDown(e, fabElement) {
      isDragging = false;
  
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const rect = fabElement.getBoundingClientRect();
  
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
  
      fabElement.style.transition = "none";
  
      const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
      const upEvent = e.type === "mousedown" ? "mouseup" : "touchend";
  
      currentMoveEvent = (ev) => move(ev, fabElement);
      window.addEventListener(moveEvent, currentMoveEvent);
  
      const upListener = (ev) => {
        window.removeEventListener(moveEvent, currentMoveEvent);
        currentMoveEvent = null;
  
        fabElement.style.transition = "0.3s ease-in-out";
        snapToSide(ev, fabElement);
        setTimeout(() => { isDragging = false; }, 50);
      };
  
      window.addEventListener(upEvent, upListener, { once: true });
    }
  
    function snapToSide(e, fabElement) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
  
      const clientX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;
  
      const edgePadding = 0;
      const newTop = Math.min(Math.max(clientY - offsetY, edgePadding), windowHeight - rect.height - edgePadding);
      fabElement.style.top = newTop + "px";
  
      if (clientX < windowWidth / 2) {
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
    }
  
    function setCustomClickListener(callback) {
      customClickHandler = callback;
    }
  
    window.initFloatingButton = function (surveyId) {
      function waitForFabAndInit() {
        const fabElement = document.getElementById("floating-snap-btn-wrapper");
  
        if (!fabElement) {
          setTimeout(waitForFabAndInit, 100);
          return;
        }
  
        fabElement.classList.add("right");
  
        const windowHeight = window.innerHeight;
        const elementHeight = fabElement.offsetHeight;
        const centeredTop = (windowHeight - elementHeight) / 2;
  
        fabElement.style.top = centeredTop + "px";
        fabElement.style.left = "";
        fabElement.style.right = "0";
  
        // Listeners
        fabElement.addEventListener("mousedown", (e) => mouseDown(e, fabElement));
        fabElement.addEventListener("touchstart", (e) => mouseDown(e, fabElement));
  
        fabElement.addEventListener("click", () => {
          if (!isDragging && typeof customClickHandler === "function") {
            customClickHandler();
          }
        });
  
        setCustomClickListener(() => {
          console.log("📩 Encuesta activada");
          if (typeof Userback !== "undefined" && typeof Userback.openSurvey === "function") {
            Userback.openSurvey(surveyId);
          } else {
            console.error("❌ Userback no disponible o no tiene openSurvey.");
          }
        });
      }
  
      waitForFabAndInit();
    };
  })();
  