(function () {
    let oldPositionX, oldPositionY;
    let isDragging = false;
    let customClickHandler = null;
    let offsetX = 0;
    let offsetY = 0;
  
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
      oldPositionY = fabElement.style.top;
      oldPositionX = fabElement.style.left;
      isDragging = false;
  
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const rect = fabElement.getBoundingClientRect();
  
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
  
      const moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
      window.addEventListener(moveEvent, function listener(ev) {
        move(ev, fabElement);
      });
  
      fabElement.style.transition = "none";
    }
  
    function mouseUp(e, fabElement) {
      const moveEvent = e.type === "mouseup" ? "mousemove" : "touchmove";
      window.removeEventListener(moveEvent, move);
      fabElement.style.transition = "0.3s ease-in-out";
      snapToSide(e, fabElement);
    }
  
    function snapToSide(e, fabElement) {
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
    }
  
    function setCustomClickListener(callback) {
      customClickHandler = callback;
    }
  
    // ⬇️ Esto es lo que GTM debe llamar
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
  
        fabElement.addEventListener("mousedown", function (e) { mouseDown(e, fabElement); });
        fabElement.addEventListener("mouseup", function (e) { mouseUp(e, fabElement); });
        fabElement.addEventListener("touchstart", function (e) { mouseDown(e, fabElement); });
        fabElement.addEventListener("touchend", function (e) { mouseUp(e, fabElement); });
  
        fabElement.addEventListener("click", function () {
          if (!isDragging && typeof customClickHandler === "function") {
            customClickHandler();
          }
        });
  
        setCustomClickListener(function () {
          console.log('Encuesta');
          if (typeof Userback !== 'undefined') {
            Userback.refresh();
            Userback.openSurvey(surveyId);
          } else {
            console.error("Userback no está cargado.");
          }
        });
      }
  
      waitForFabAndInit();
    };
  })();
  