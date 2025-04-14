//Version 2.0
// FloatingButtonV2.js
(function () {
    var fabElement = null;
    var isDragging = false;
    var customClickHandler = null;
    var offsetX = 0;
    var offsetY = 0;
    var currentMoveListener = null;
  
    function move(e) {
      if (!fabElement || fabElement.classList.contains("fab-active")) return;
      isDragging = true;
  
      var clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      var clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
  
      fabElement.style.top = (clientY - offsetY) + "px";
      fabElement.style.left = (clientX - offsetX) + "px";
      fabElement.style.right = "";
      fabElement.classList.remove("left", "right");
    }
  
    function mouseDown(e) {
      if (!fabElement) return;
      isDragging = false;
  
      var clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      var clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      var rect = fabElement.getBoundingClientRect();
  
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
  
      currentMoveListener = function(ev) { move(ev); };
  
      var moveEvent = e.type === "mousedown" ? "mousemove" : "touchmove";
      window.addEventListener(moveEvent, currentMoveListener);
      fabElement.style.transition = "none";
    }
  
    function mouseUp(e) {
      if (!fabElement) return;
  
      var moveEvent = e.type === "mouseup" ? "mousemove" : "touchmove";
      if (currentMoveListener) {
        window.removeEventListener(moveEvent, currentMoveListener);
        currentMoveListener = null;
      }
  
      fabElement.style.transition = "0.3s ease-in-out";
      snapToSide(e);
    }
  
    function snapToSide(e) {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var rect = fabElement.getBoundingClientRect();
  
      var currX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
      var currY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;
  
      var edgePadding = 0;
      var newTop = Math.min(Math.max(currY - offsetY, edgePadding), windowHeight - rect.height - edgePadding);
  
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
  
    window.initFloatingButton = function (surveyId) {
      function waitForFabAndInit() {
        fabElement = document.getElementById("floating-snap-btn-wrapper");
        if (!fabElement) {
          setTimeout(waitForFabAndInit, 100);
          return;
        }
  
        fabElement.classList.add("right");
        var windowHeight = window.innerHeight;
        var elementHeight = fabElement.offsetHeight;
        var centeredTop = (windowHeight - elementHeight) / 2;
  
        fabElement.style.top = centeredTop + "px";
        fabElement.style.left = "";
        fabElement.style.right = "0";
  
        fabElement.addEventListener("mousedown", mouseDown);
        fabElement.addEventListener("mouseup", mouseUp);
        fabElement.addEventListener("touchstart", mouseDown);
        fabElement.addEventListener("touchend", mouseUp);
  
        fabElement.addEventListener("click", function () {
          if (!isDragging && typeof customClickHandler === "function") {
            customClickHandler();
          }
          isDragging = false; // reset
        });
  
        // Esperar a que Userback esté listo antes de asignar
        function waitForUserback() {
          if (typeof Userback !== "undefined" && typeof Userback.openSurvey === "function") {
            setCustomClickListener(function () {
              console.log('🔎 Ejecutando encuesta Userback');
              Userback.openSurvey(surveyId);
            });
          } else {
            console.warn("⌛ Esperando Userback...");
            setTimeout(waitForUserback, 200);
          }
        }
  
        waitForUserback();
      }
  
      waitForFabAndInit();
    };
  })();
  