/*
 * @file index.html
 * @description This file contains the HTML structure of the Pokedex application.
 * Author: Kael Moreira
 * Date: April 2024
 * API: https://pokeapi.co/docs/v2
 */

/**
 * Initiates a light sequence by modifying the styles of light indicator elements.
 * Each light element is targeted by its ID and set to "light up" with an RGB color and box shadow effect.
 */
function startSequence() {
  const lights = [
    { element: document.getElementById('small-circle-red'), rgb: '255, 0, 0', boxShadow: '0 0 9px #f00' },
    { element: document.getElementById('small-circle-yellow'), rgb: '255, 255, 0', boxShadow: '0 0 9px rgb(253, 255, 145)' },
    { element: document.getElementById('small-circle-green'), rgb: '0, 128, 0', boxShadow: '0 0 9px rgb(0, 255, 0)' },
  ];

/**
 * Updates the display of a set of light elements to create a sequence effect. The function cycles through
 * each light in the `lights` array and dims them. It then highlights the currently active light to create
 * a visual indication of progression.
 */ 
  let activeIndex = 0; 
  function updateLights() {    
    lights.forEach((light, index) => {
      light.element.style.backgroundColor = `rgb(${light.rgb})`;
      light.element.style.boxShadow = 'none';
      light.element.style.opacity = '0.3'; 
    });

/**
 * Highlights the currently active light in the sequence. It sets the background color to a brighter intensity,
 * applies a glowing box-shadow effect to simulate the light being "on," and fully opaque to draw attention to it.
 * The function then increments the activeIndex to point to the next light in the sequence, with wrapping to
 * create a continuous loop.
 */
    const activeLight = lights[activeIndex];
    activeLight.element.style.backgroundColor = `rgb(${activeLight.rgb})`;
    activeLight.element.style.boxShadow = activeLight.boxShadow;
    activeLight.element.style.opacity = '1'; 
    activeIndex = (activeIndex + 1) % lights.length;
  }
  setInterval(updateLights, 2000); 
}
document.addEventListener('DOMContentLoaded', startSequence);
