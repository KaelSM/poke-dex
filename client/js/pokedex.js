document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const selectElement = document.getElementById('pokemon-select');
    const searchInput = document.getElementById('search-input');
    const maleIcon = document.querySelector('.fa-mars-stroke');
    const femaleIcon = document.querySelector('.fa-venus');
    const type1Element = document.getElementById("type-screen-text"); 
    const type2Element = document.getElementById("typ-placeholder-screen-text");    const placeholderPokemonImg = document.getElementById('placeholder-pokemon-img');
    const staticImg = document.getElementById('static-img');
    const nameScreenText = document.getElementById('name-screen-text');
    const errorElementId = 'error-message'; // ID for the error message element
    let gender = 'male'; // Default gender
    let shiny = false; // Assuming 'shiny' and 'frontView' are defined here for demonstration
    let frontView = true;
    let numPokemon = 1; // Example default value
    let lastPokemon = 1025;
    let currentMoveIndex = 0; // Added this to keep track of the current move index
    let pokemonMoves = [];
    
    // Fetch and populate the dropdown with Pokémon names
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then(response => response.json())
      .then(data => {
        data.results.forEach(pokemon => {
          const option = document.createElement('option');
          option.value = pokemon.name;
          option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
          selectElement.appendChild(option);
        });
        // Trigger the display update for the first Pokémon
        fetchAndDisplayPokemon(selectElement.options[0].value);
      })
      .catch(error => {
        console.error('Error fetching Pokémon list:', error);
        displayError(errorElementId, 'Failed to load Pokémon list.');
      });
  
    // Search by ID or name when typing into the search input
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      if (query) {
        fetchAndDisplayPokemon(query, true);
      }
    });
  
    // Update display when a Pokémon is selected from the dropdown
    selectElement.addEventListener('change', function() {
      fetchAndDisplayPokemon(this.value, true);
    });
  
    // Gender icon click events
    maleIcon.addEventListener('click', function() {
      if (gender !== 'male') {
        gender = 'male';
        updateGenderIcons(maleIcon, femaleIcon, gender);
        if (selectElement.value) {
          fetchAndDisplayPokemon(selectElement.value);
        }
      }
    });
  
    femaleIcon.addEventListener('click', function() {
      if (gender !== 'female') {
        gender = 'female';
        updateGenderIcons(maleIcon, femaleIcon, gender);
        if (selectElement.value) {
          fetchAndDisplayPokemon(selectElement.value);
        }
      }
    });

    window.clickNextMove = function() {
      if (pokemonMoves.length > 0) {
        currentMoveIndex = (currentMoveIndex + 1) % pokemonMoves.length; // Cycle through moves
        const moveUrl = pokemonMoves[currentMoveIndex].move.url;
    
        // Fetch the next move's details and update the UI
        fetch(moveUrl)
          .then(response => response.json())
          .then(moveData => {
            document.getElementById('move-name').textContent = ` ${moveData.name}`;
            document.getElementById('move-type').textContent = `Type: ${moveData.type.name}`;
            document.getElementById('move-learn-method').textContent = `Learn by: ${pokemonMoves[currentMoveIndex].version_group_details[0].move_learn_method.name}`;
            document.getElementById('move-level-learn').textContent = `Learned lvl: ${pokemonMoves[currentMoveIndex].version_group_details[0].level_learned_at}`;
            document.getElementById('move-category').textContent = `Category: ${moveData.damage_class.name}`;
            document.getElementById('move-accuracy').textContent = `Accuracy: ${moveData.accuracy}`;
            document.getElementById('move-power').textContent = `Power: ${moveData.power}`;
            document.getElementById('move-pp').textContent = `PP: ${moveData.pp}`;
        
          })
          .catch(error => {
            console.error("Error fetching next move details:", error);
          });
      }
    }

    // Function to activate stats and light up the green button
    function activateStats() {
      // Toggle stats active state and D-pad visibility
      document.getElementById('light-button-green-form').classList.add('on');
      document.getElementById('light-button-red-form').classList.remove('on');
      
      // Enable D-pad usage
      let dpad = document.querySelector('.dpad');
      dpad.classList.remove('disabled');
      
      // Additional logic for enabling stats...
    }
    function handleDpadClick(direction) {
      if (document.getElementById('light-button-green-form').classList.contains('on')) {
        // Perform action based on direction e.g., 'up', 'down', 'left', 'right'
        console.log('D-pad direction clicked:', direction);
        // ... Your code for handling D-pad actions ...
      } else {
        alert('Please activate stats to use the D-pad.');
      }
    }
    
    // Function to activate alternative forms and enable "Previous/Next" buttons
    function activateAlternativeForms() {
      // Toggle alternative forms active state
      document.getElementById('light-button-red-form').classList.add('on');
      document.getElementById('light-button-green-form').classList.remove('on');
      
      // Enable "Previous/Next" buttons
      let prevButton = document.getElementById('button-prev');
      let nextButton = document.getElementById('button-next');
      prevButton.classList.remove('disabled');
      nextButton.classList.remove('disabled');
      
      // Additional logic for enabling alternative forms...
    }
    
    // Functions for handling "Previous/Next" button clicks
    function clickPrev() {
      if (document.getElementById('light-button-red-form').classList.contains('on')) {
        // Logic to go to previous alternative form
        console.log('Previous form');
        // ... Your code for handling previous form ...
      } else {
        alert('Please activate alternative forms to use the Previous button.');
      }
    }
    
    function clickNext() {
      if (document.getElementById('light-button-red-form').classList.contains('on')) {
        // Logic to go to next alternative form
        console.log('Next form');
        // ... Your code for handling next form ...
      } else {
        alert('Please activate alternative forms to use the Next button.');
      }
    }
    
// Event listeners for D-pad
document.querySelector('.up').addEventListener('click', () => handleDpadClick('up'));
document.querySelector('.right').addEventListener('click', () => handleDpadClick('right'));
document.querySelector('.down').addEventListener('click', () => handleDpadClick('down'));
document.querySelector('.left').addEventListener('click', () => handleDpadClick('left'));

// Initialize buttons to disabled state
function initializeButtons() {
  document.querySelector('.dpad').classList.add('disabled');
  document.getElementById('button-prev').classList.add('disabled');
  document.getElementById('button-next').classList.add('disabled');
}

// Call this function when the DOM is fully loaded
initializeButtons();

// Assign these functions to the respective buttons
document.getElementById('button-stats').onclick = activateStats;
document.getElementById('button-form').onclick = activateAlternativeForms;

    // This function is called when the "Stats" button is pressed to activate the red light
window.toggleStats = function() {
  var statsActive = document.getElementById("light-button-red").classList.contains("on");

  // If stats are active, turn them off, else turn them on
  if(statsActive) {
      document.getElementById("light-button-red").classList.remove("on");
      document.getElementById("light-button-red").classList.add("off");
      document.getElementById("button-previous").disabled = true;
      document.getElementById("button-next").disabled = true;
  } else {
      document.getElementById("light-button-red").classList.add("on");
      document.getElementById("light-button-red").classList.remove("off");
      document.getElementById("button-previous").disabled = false;
      document.getElementById("button-next").disabled = false;
  }
};

function clickFormr() {
  var redLight = document.getElementById("light-button-red-form");
  var greenLight = document.getElementById("light-button-green-form");

  // Toggle the red light on and off
  redLight.classList.toggle("on");
  redLight.classList.toggle("off");

  // If the red light is now on, enable the Previous and Next buttons
  if (redLight.classList.contains("on")) {
      document.getElementById("button-prev").classList.add("active");
      document.getElementById("button-next").classList.add("active");

      // Optionally, turn off the green light and any associated functionality
      greenLight.classList.remove("on");
      greenLight.classList.add("off");
  } else { // If the red light is now off, disable the Previous and Next buttons
      document.getElementById("button-prev").classList.remove("active");
      document.getElementById("button-next").classList.remove("active");
  }
}

// You might also want to define the clickPrev and clickNext functions if not already defined
function clickPrev() {
  // Define what happens when Previous is clicked
}

function clickNext() {
  // Define what happens when Next is clicked
}
  
    // Helper function to fetch and display Pokémon
    function fetchAndDisplayPokemon(query, isUserInitiated) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
          .then(response => {
              if (!response.ok) throw new Error('Pokémon not found');
              return response.json();
          })
          .then(data => {
               //Update Basic Displays (Replace with your specific updates)
               updateDisplays(data, nameScreenText, searchInput);
               updateSprite(data, placeholderPokemonImg, staticImg, gender);
               selectPokemonByName(selectElement, data.name);
               clearErrorMessage(errorElementId); 
              numPokemon = data.id;
               playPokemonCry(data.id);
              type1Element.src = '';
              type2Element.src = '';
              pokemonMoves = data.moves;
              currentMoveIndex = 0; 
  
              // Update Stats 
              document.getElementById('stat-hp').textContent = `HP.................................................... ${data.stats.find(stat => stat.stat.name === 'hp').base_stat}`;
              document.getElementById('stat-attack').textContent = `Attack....................................... ${data.stats.find(stat => stat.stat.name === 'attack').base_stat}`;
              document.getElementById('stat-defense').textContent = `Defense.................................... ${data.stats.find(stat => stat.stat.name === 'defense').base_stat}`;
              document.getElementById('stat-special-attack').textContent = `Special Attack.................. ${data.stats.find(stat => stat.stat.name === 'special-attack').base_stat}`;
              document.getElementById('stat-special-defense').textContent = `Special Defense............... ${data.stats.find(stat => stat.stat.name === 'special-defense').base_stat}`;
              document.getElementById('stat-speed').textContent = `Speed............................................ ${data.stats.find(stat => stat.stat.name === 'speed').base_stat}`;
              document.getElementById('weight-screen-text').textContent = `Weight: ${data.weight}`;
              document.getElementById('height-screen-text').textContent = `Height: ${data.height}`;
  
              // Update Types
              if (data.types.length > 0) {
                  type1Element.src = getAssetType(data.types[0].type.name);
                  type1Element.style.display = 'block';
              } else {
                  type1Element.style.display = 'none';
              }
  
              if (data.types.length > 1) {
                  type2Element.src = getAssetType(data.types[1].type.name);
                  type2Element.style.display = 'block';
              } else {
                  type2Element.style.display = 'none';
              }
  
            if (data.moves.length > 0) {
              
              const moveUrl = data.moves[currentMoveIndex].move.url
              fetch(moveUrl) 
                .then(moveResponse => moveResponse.json())
                .then(moveData => {
                  document.getElementById('move-name').textContent = `${moveData.name}`;
                  // Type of the move
                  document.getElementById('move-type').textContent =  `Type: ${moveData.type.name}`; 
                  // Learn method (assuming the first listed method)
                  document.getElementById('move-learn-method').textContent = `Learn by: ${moveData.version_group_details[0].move_learn_method.name}`;
                  // Level learned at (assuming the first listed method)
                  document.getElementById('move-level-learn').textContent = `Learned lvl: ${moveData.version_group_details[0].level_learned_at}`;
                  // Category of the move
                  document.getElementById('move-category').textContent = `Category: ${moveData.damage_class.name}`;
                  // Accuracy of the move
                  document.getElementById('move-accuracy').textContent = `Accuracy: ${moveData.accuracy}`;
                  // Power of the move
                  document.getElementById('move-power').textContent = `Power: ${moveData.power}`;
                  // PP of the move
                  document.getElementById('move-pp').textContent = `PP: ${moveData.pp}`;
      
                  // Continue chaining with the species data fetch
                  return fetch(data.species.url)
                })
                .catch(error => {
                  console.error('Error fetching move data:', error);
                  // Consider adding error display here, specific to move data
                });
            } else {
              document.getElementById('move-name').textContent = 'No moves';
              document.getElementById('move-type').textContent = '';
              document.getElementById('move-learn-method').textContent = '';
              document.getElementById('move-level-learn').textContent = '';
              document.getElementById('move-category').textContent = '';
              document.getElementById('move-accuracy').textContent = '';
              document.getElementById('move-power').textContent = '';
              document.getElementById('move-pp').textContent = '';
              
          } 

        // Nested fetch for species data (Correct Promise Chaining)
      fetch(data.species.url) 
        .then(speciesResponse => speciesResponse.json())
        .then(speciesData => {
          const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
          document.getElementById('pokemon-description').textContent = `Description: ${flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')}`;
        })
        .catch(error => {
          console.error('Error fetching species data:', error);
          // Consider adding error display here, specific to species data
        });

    })
    .catch(error => {
      console.error('Error fetching Pokémon data:', error); // Main error logging
      if (isUserInitiated) { 
        displayError(errorElementId, 'Failed to fetch Pokémon details!');
      }
    });
}
  
  
    async function setURLimage() {
      var url = '';
      if (gender === 'male') {
          url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
          if (!frontView) {
              url += "/back";
          }
          if (shiny) {
              url += "/shiny";
          }
          url += "/" + numPokemon + ".png";
      } else {
          await fetch("https://pokeapi.co/api/v2/pokemon/" + numPokemon)
              .then((response) => response.json())
              .then((data) => {
                  if (data.sprites.front_female !== null && gender === 'female') {
                      if (frontView) {
                          url = shiny ? data.sprites.front_shiny_female : data.sprites.front_female;
                      } else {
                          url = shiny ? data.sprites.back_shiny_female : data.sprites.back_female;
                      }
                  } else {
                      if (frontView) {
                          url = shiny ? data.sprites.front_shiny : data.sprites.front_default;
                      } else {
                          url = shiny ? data.sprites.back_shiny : data.sprites.back_default;
                      }
                  }
              });
              document.getElementById('placeholder-pokemon-img').src = url;
      }
      // Update the image source
      document.getElementById('placeholder-pokemon-img').src = url;
    }

    function playPokemonCry(pokemonId) {
      const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
      const audio = new Audio(cryUrl);
      audio.play();
  }
  
  // Implementation of the clickShinyColor function
  // Making clickShinyColor globally accessible
  window.clickShinyColor = function() {
    shiny = !shiny; // Toggle the shiny state
    setURLimage(); // Update the image to reflect the shiny state
    // Toggle the light buttons to reflect the shiny state
    document.getElementById("light-button-red").classList.toggle("on", !shiny);
    document.getElementById("light-button-red").classList.toggle("off", shiny);
    document.getElementById("light-button-blue").classList.toggle("on", shiny);
    document.getElementById("light-button-blue").classList.toggle("off", !shiny);
};

window.clickNormalColor = function() {
  shiny = false; // Set shiny to false to get the normal sprite
  setURLimage(); // Update the image to reflect the normal state

  // Update UI elements to reflect the normal state
  document.getElementById("light-button-red").classList.add("on");
  document.getElementById("light-button-red").classList.remove("off");
  document.getElementById("light-button-blue").classList.remove("on");
  document.getElementById("light-button-blue").classList.add("off");
};

window.clickLeftRight = function() {
  frontView = !frontView;
  setURLimage();
};

window.clickUp = function() {
  if (numPokemon > 1) {
      numPokemon -= 1;
  } else {
      numPokemon = lastPokemon; // If at the first pokemon, wrap to the last
  }
  fetchAndDisplayPokemon(numPokemon.toString(), true);
};

window.clickBottom = function() {
  console.log("clickBottom function called");
  if (numPokemon < lastPokemon) {
      numPokemon += 1;
  } else {
      numPokemon = 1; // If at the last pokemon, wrap to the first
  }
  fetchAndDisplayPokemon(numPokemon.toString(), true);
};

});
  