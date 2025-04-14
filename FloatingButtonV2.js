(function () {
    let oldPositionX, oldPositionY;
    let isDragging = false;
    let customClickHandler = null;
    let offsetX = 0;
    let offsetY = 0;
    let moveListener = null;
  
    function move(e, fabElement) {
      isDragging = true;
  
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
  
      fabElement.style.top = (clientY - offsetY) + "px";
      fabElement.style.left = (clientX - offsetX) + "px";
      fabElement.style.right = "";
      fabElement.classList.remove("left", "right");
    }
  
    function mouseDown(e, fabElement) {
      oldPositionY = fabElement.style.top;
      oldPositionX = fabElement.style.left;
      isDragging = false;
  
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const rect = fabElement.getBoundingClientRect();
  
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
  
      const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
  
      // Guardamos la función de listener para poder removerla después
      moveListener = function (ev) {
        move(ev, fabElement);
      };
  
      window.addEventListener(moveEvent, moveListener);
      fabElement.style.transition = "none";
    }
  
    function mouseUp(e, fabElement) {
      const moveEvent = e.type === "mouseup" ? "mousemove" : "touchmove";
      if (moveListener) {
        window.removeEventListener(moveEvent, moveListener);
        moveListener = null;
      }
  
      fabElement.style.transition = "0.3s ease-in-out";
      snapToSide(e, fabElement);
  
      // ⚠️ Delay pequeño para evitar que el click se dispare en drag
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }
  
    function snapToSide(e, fabElement) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const rect = fabElement.getBoundingClientRect();
  
      const clientX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;
  
      const edgePadding = 0;
  
      const newTop = Math.min(
        Math.max(clientY - offsetY, edgePadding),
        windowHeight - rect.height - edgePadding
      );
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
  
        // Eventos de movimiento
        fabElement.addEventListener("mousedown", (e) => mouseDown(e, fabElement));
        fabElement.addEventListener("mouseup", (e) => mouseUp(e, fabElement));
        fabElement.addEventListener("touchstart", (e) => mouseDown(e, fabElement));
        fabElement.addEventListener("touchend", (e) => mouseUp(e, fabElement));
  
        // Evento de click
        fabElement.addEventListener("click", () => {
          if (!isDragging && typeof customClickHandler === "function") {
            customClickHandler();
          }
        });
  
        // Click personalizado
        setCustomClickListener(() => {
          console.log("Encuesta");
          if (typeof Userback !== "undefined" && typeof Userback.openSurvey === "function") {
            // Userback.refresh(); ← si existe y es necesario, descoméntalo
            Userback.openSurvey(surveyId);
          } else {
            console.error("Userback no está cargado o openSurvey no está disponible.");
          }
        });
      }
  
      waitForFabAndInit();
    };
  })();
  