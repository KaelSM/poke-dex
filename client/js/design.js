
/* function for lights on top */
function startSequence() {
  const lights = [
    { element: document.getElementById('small-circle-red'), rgb: '255, 0, 0', boxShadow: '0 0 9px #f00' },
    { element: document.getElementById('small-circle-yellow'), rgb: '255, 255, 0', boxShadow: '0 0 9px rgb(253, 255, 145)' },
    { element: document.getElementById('small-circle-green'), rgb: '0, 128, 0', boxShadow: '0 0 9px rgb(0, 255, 0)' },
  ];

  const blinkingLight = document.getElementById('blinking-light');
  let activeIndex = 0; // start with the first light

  function updateBigCircle() {   
    const isLit = blinkingLight.style.opacity === '1'; // Directly access blinkingLight
    blinkingLight.style.opacity = isLit ? '0.5' : '5';  
  }    

  function updateLights() {
    // turn all lights off
    lights.forEach((light, index) => {
      light.element.style.backgroundColor = `rgb(${light.rgb})`;
      light.element.style.boxShadow = 'none';
      light.element.style.opacity = '0.3'; // dimmed
    });

    // turn the current light on
    const activeLight = lights[activeIndex];
    activeLight.element.style.backgroundColor = `rgb(${activeLight.rgb})`;
    activeLight.element.style.boxShadow = activeLight.boxShadow;
    activeLight.element.style.opacity = '1'; // fully lit

    // move to the next light or loop back to the first
    activeIndex = (activeIndex + 1) % lights.length;
  }

  setInterval(updateLights, 2000); // change light every 2 seconds
  setInterval(updateBigCircle, 4000); // blink every 5 seconds   
}

document.addEventListener('DOMContentLoaded', startSequence);
