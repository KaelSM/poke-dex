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
            document.getElementById('move-name').textContent = moveData.name;
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
  
               // Fetch and Display Move (Only the first move)
            // Fetch and Display First Move
            if (data.moves.length > 0) {
              // const firstMoveData = data.moves[0];
              // const firstMoveUrl = firstMoveData.move.url;
              const moveUrl = data.moves[currentMoveIndex].move.url
              return fetch(moveUrl) // Fetch the move details
                .then(moveResponse => moveResponse.json())
                .then(moveData => {
                  document.getElementById('move-name').textContent = `${moveData.name}`;
                  // Type of the move
                  document.getElementById('move-type').textContent =  `Type: ${moveData.type.name}`; 
                  // Learn method (assuming the first listed method)
                  document.getElementById('move-learn-method').textContent = `Learn by: ${firstMoveData.version_group_details[0].move_learn_method.name}`;
                  // Level learned at (assuming the first listed method)
                  document.getElementById('move-level-learn').textContent = `Learned lvl: ${firstMoveData.version_group_details[0].level_learned_at}`;
                  // Category of the move
                  document.getElementById('move-category').textContent = `Category: ${moveData.damage_class.name}`;
                  // Accuracy of the move
                  document.getElementById('move-accuracy').textContent = `Accuracy: ${moveData.accuracy}`;
                  // Power of the move
                  document.getElementById('move-power').textContent = `Power: ${moveData.power}`;
                  // PP of the move
                  document.getElementById('move-pp').textContent = `PP: ${moveData.pp}`;
      
                  // Continue chaining with the species data fetch
                  return fetch(data.species.url);
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
    })
        .then(response => {
            if (!response.ok) throw new Error('Species not found');
            return response.json();
        })
        .then(speciesData => {
            const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            document.getElementById('pokemon-description').textContent = `Description: ${flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')}`;
        })
        .catch(error => {
            console.error('Error:', error);
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
  