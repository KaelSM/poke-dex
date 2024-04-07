/*
 * @file index.html
 * @description This file contains the HTML structure of the Pokedex application.
 * Author: Kael Moreira
 * Date: April 2024
 * API: https://pokeapi.co/docs/v2
 */

/*Description:
  This project is a web-based Pokedex application designed to allow users
  to browse through Pokémon, view detailed information about each one,
  and listen to their unique cries. Developed using HTML, CSS,
  and JavaScript, it leverages the PokéAPI for fetching Pokémon data.
  The user interface mimics the classic Pokedex device, featuring
  search functionality by Pokémon ID or name, display for Pokémon
  images (including shiny and gender variations), and detailed
  information such as stats, types, abilities, and moves.
*/

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

// DOM element references
    const selectElement = document.getElementById('pokemon-select');
    const searchInput = document.getElementById('search-input');
    const maleIcon = document.querySelector('.fa-mars-stroke');
    const femaleIcon = document.querySelector('.fa-venus');
    const type1Element = document.getElementById("type-screen-text"); 
    const type2Element = document.getElementById("typ-placeholder-screen-text");    
    const placeholderPokemonImg = document.getElementById('placeholder-pokemon-img');
    const staticImg = document.getElementById('static-img');
    const nameScreenText = document.getElementById('name-screen-text'); 
    const errorElementId = 'error-message'; 
    let gender = 'male'; // Current gender state for the Pokémon image
    let shiny = false; // Current shiny state for the Pokémon image
    let frontView = true; // Current view state for the Pokémon image
    let numPokemon = 1; // ID of the current Pokémon
    let lastPokemon = 1025; // ID of the last Pokémon in the database
    let currentMoveIndex = 0; // Index of the current move in the Pokémon's move list
    let pokemonMoves = []; // List of the Pokémon's moves
    let currentAbilityIndex = 0; // Index of the current ability in the Pokémon's ability list
    let pokemonAbilities = []; // List of the Pokémon's abilities

    // Event listeners for the D-pad controls
    document.querySelector('.up').addEventListener('click', function() {
      // Call a function when the up arrow is clicked
      clickUp();
    });  
    document.querySelector('.right').addEventListener('click', function() {
      // Call a function when the right arrow is clicked
      clickLeftRight();
    });  
    document.querySelector('.down').addEventListener('click', function() {
      // Call a function when the down arrow is clicked
      clickDown();
    });  
    document.querySelector('.left').addEventListener('click', function() {
      // Call a function when the left arrow is clicked
      clickLeftRight(); 
    });
    
    /**
     * Fetches and populates the dropdown with Pokémon names from the PokéAPI.
     * The function fetches the list of Pokémon from the API and creates an option element for each Pokémon.
     * It then appends the option to the select element to create a dropdown list of Pokémon names.
     * The function also triggers the display update for the first Pokémon in the list.
     * @param {HTMLSelectElement} selectElement - The select element to populate with Pokémon names.
     */
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then(response => response.json())
      .then(data => {
        // Loop through fetched Pokémon list and create dropdown options.
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
        // Handle error in fetching Pokémon list.
        console.error('Error fetching Pokémon list:', error);
        displayError(errorElementId, 'Failed to load Pokémon list.');
    });
  
    /**
     * Adds event listener to search input for live search functionality.
     * Fetches and displays the Pokémon details for the searched Pokémon.
     * @param {Event} event - The input event object.
     */
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      if (query) {
        fetchAndDisplayPokemon(query, true);
      }
    });
  
    /**
     * Adds event listener to the Pokémon select dropdown.
     * Fetches and displays the Pokémon details for the selected Pokémon.
     * @param {Event} event - The change event object.
     */
    selectElement.addEventListener('change', function() {
      fetchAndDisplayPokemon(this.value, true);
    });
  
    /**
     * Adds event listeners for gender icon clicks to toggle between male and female sprites.
     * Updates the Pokémon sprite and fetches the Pokémon details for the selected Pokémon.
     * @param {MouseEvent} event - The click event object.
    */
   // Event listener for male icon click
    maleIcon.addEventListener('click', function() {
      if (gender !== 'male') {
        gender = 'male';
        updateGenderIcons(maleIcon, femaleIcon, gender);
        if (selectElement.value) {
          fetchAndDisplayPokemon(selectElement.value);
        }
      }
    });
  
    // Event listener for female icon click
    femaleIcon.addEventListener('click', function() {
      if (gender !== 'female') {
        gender = 'female';
        updateGenderIcons(maleIcon, femaleIcon, gender);
        if (selectElement.value) {
          fetchAndDisplayPokemon(selectElement.value);
        }
      }
    });

    /**
     * Function to navigate to the next Pokémon move.
     * This function cycles through the Pokémon's moves and fetches the details for the next move.
     * It updates the move details displayed on the screen with the new move information.
     * The function is triggered by a button click event.
     * @param {MouseEvent} event - The click event object.
     * @returns {void} Updates the move details on the screen.
     */
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

    /**
     * Function to toggle the background sound on or off.
     * This function plays or pauses the background sound when called.
     * It also updates the visual indicator to show the current state of the sound.
     * The function is triggered by a button click event.
     * @param {MouseEvent} event - The click event object.
     * @returns {void} Toggles the background sound and updates the visual indicator.
     */
    window.toggleBackgroundSound = function() {
      var audio = document.getElementById("background-sound");
      if (audio.paused) {
          audio.play();
          // Visual indicator (light) that shows when music is playing: (yellow light)
          document.getElementById("light-button-green-form").classList.replace("off", "on");
      } else {
          audio.pause();
          // Visual indicator (light) that shows when music is paused: (no light)
          document.getElementById("light-button-green-form").classList.replace("on", "off");
      }
    };
 
    /**
     * Fetches and displays Pokémon data based on a provided query.
     * This function fetches the Pokémon data from the PokéAPI based on the query provided.
     * It then updates the various displays on the screen with the fetched data.
     * The function also handles any errors that may occur during the fetch process.
     * 
     * @param {string} query The Pokémon name or ID to search for.
     * @param {boolean} isUserInitiated Indicates if the fetch operation was triggered by user action.
    */
    function fetchAndDisplayPokemon(query, isUserInitiated) {
      // Function to fetch Pokémon data and update the UI accordingly.
      fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
          .then(response => {
              if (!response.ok) throw new Error('Pokémon not found');
              return response.json();
          })
          .then(data => {
              //Update Basic Displays (Replace with your specific updates)
              updateDisplays(data, nameScreenText, searchInput); // Update the name and ID displays
              updateSprite(data, placeholderPokemonImg, staticImg, gender); // Update the sprite display
              selectPokemonByName(selectElement, data.name); // Update the selected Pokémon in the dropdown
              clearErrorMessage(errorElementId);  // Clear any displayed error messages
              numPokemon = data.id; // Update the current Pokémon ID
              playPokemonCry(data.id); // Play the Pokémon's cry
              type1Element.src = ''; // Clear the type 1 image
              type2Element.src = ''; // Clear the type 2 image
              pokemonMoves = data.moves; // Store the moves
              currentMoveIndex = 0; // Reset the move index
              pokemonAbilities = data.abilities; // Store the abilities
              currentAbilityIndex = 0; // Reset the ability index
              /* Update the UI with the Pokémon's ability and mapping to the effect details
              */
              pokemonAbilities = data.abilities.map(ability => ({
                name: ability.ability.name,
                url: ability.ability.url,
                effect: null // Placeholder for storing the effect once fetched
              }));
              // Update Stats and the detailed information
              document.getElementById('stat-hp').textContent = `HP.................................................... ${data.stats.find(stat => stat.stat.name === 'hp').base_stat}`;
              document.getElementById('stat-attack').textContent = `Attack....................................... ${data.stats.find(stat => stat.stat.name === 'attack').base_stat}`;
              document.getElementById('stat-defense').textContent = `Defense.................................... ${data.stats.find(stat => stat.stat.name === 'defense').base_stat}`;
              document.getElementById('stat-special-attack').textContent = `Special Attack.................. ${data.stats.find(stat => stat.stat.name === 'special-attack').base_stat}`;
              document.getElementById('stat-special-defense').textContent = `Special Defense............... ${data.stats.find(stat => stat.stat.name === 'special-defense').base_stat}`;
              document.getElementById('stat-speed').textContent = `Speed............................................ ${data.stats.find(stat => stat.stat.name === 'speed').base_stat}`;
              document.getElementById('weight-screen-text').textContent = `Weight: ${data.weight}`;
              document.getElementById('height-screen-text').textContent = `Height: ${data.height}`;  
              // Update Types of the Pokémon
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
            // Update the move details (with a nested fetch for move data and using promise chaining)
            if (data.moves.length > 0) {              
              const moveUrl = data.moves[currentMoveIndex].move.url
              fetch(moveUrl) 
                .then(moveResponse => moveResponse.json())
                .then(moveData => {
                  document.getElementById('move-name').textContent = `${moveData.name}`;
                  // Type of the move
                  document.getElementById('move-type').textContent =  `Type: ${moveData.type.name}`; 
                  // Learn method 
                  document.getElementById('move-learn-method').textContent = `Learn by: ${moveData.version_group_details[0].move_learn_method.name}`;
                  // Level learned at 
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
                });
            } else {
              // No moves found, clear the move details
              document.getElementById('move-name').textContent = 'No moves';
              document.getElementById('move-type').textContent = '';
              document.getElementById('move-learn-method').textContent = '';
              document.getElementById('move-level-learn').textContent = '';
              document.getElementById('move-category').textContent = '';
              document.getElementById('move-accuracy').textContent = '';
              document.getElementById('move-power').textContent = '';
              document.getElementById('move-pp').textContent = '';              
          } 
        // Nested fetch for species data and updating the description
      fetch(data.species.url) 
        .then(speciesResponse => speciesResponse.json())
        .then(speciesData => {
          const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
          document.getElementById('pokemon-description').textContent = `Description: ${flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')}`;
        })
        .catch(error => {
          console.error('Error fetching species data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching Pokémon data:', error); // Main error logging
      if (isUserInitiated) { 
        displayError(errorElementId, 'Failed to fetch Pokémon details!');
      }
    });
    setURLimage();
    }

    /** function is used for the left and right buttons to toggle the sprite view
     * This function toggles the sprite view between front and back.
     * It updates the image source based on the new view.
     * The function is triggered by a button click event.
     * @param {MouseEvent} event - The click event object.
     * @returns {void} Updates the image source to reflect the new view.
     * */
    window.clickLeftRight = function() {
      frontView = !frontView; // Toggle between front and back
      setURLimage(); // Update the image source based on the new view
    };
  
  /**
   * Asynchronously sets the image URL for the displayed Pokémon sprite based on current state parameters.
   * Adjusts the URL to fetch the correct sprite based on gender, shiny state, and whether the front or back sprite is displayed.
   * The function fetches the sprite URL from the PokéAPI and updates the image source accordingly.
   * @returns {void} Updates the image source for the Pokémon sprite.
  */
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
                // Determine URL based on gender, shiny state, and view.
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
    // Update the image source of the placeholder image.
    document.getElementById('placeholder-pokemon-img').src = url;
    }

  /**
   * Plays the Pokémon cry sound associated with the given Pokémon ID.
   * @param {number} pokemonId - The ID of the Pokémon whose cry sound is to be played.
   */
    function playPokemonCry(pokemonId) {
      const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
      const audio = new Audio(cryUrl);
      audio.play();
    }

  /**
 * Sets styles for the abilities display box to make it scrollable.
 */
  var abilityBox = document.getElementById('abilities-screen'); // Replace 'ability-box' with your actual element ID
  abilityBox.style.maxHeight = '150px';
  abilityBox.style.overflowY = 'auto';
  abilityBox.style.overflowX = 'hidden';
  

  /**
   * Toggles the shiny state of the Pokémon sprite and updates the display.
   * This function toggles the shiny state of the Pokémon sprite and updates the displayed image.
   * It also toggles the light buttons to reflect the current shiny state.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the Pokémon sprite and light buttons to reflect the shiny state.
   */  
  window.clickShinyColor = function() {
    shiny = !shiny; // Toggle the shiny state
    setURLimage(); // Update the image to reflect the shiny state
    // Toggle the light buttons to reflect the shiny state
    document.getElementById("light-button-red").classList.toggle("on", !shiny);
    document.getElementById("light-button-red").classList.toggle("off", shiny);
    document.getElementById("light-button-blue").classList.toggle("on", shiny);
    document.getElementById("light-button-blue").classList.toggle("off", !shiny);
  };

  /**
 * Sets the Pokémon sprite to its normal color and updates the display.
 * This function sets the Pokémon sprite to its normal color and updates the displayed image.
 * It also updates the light buttons to reflect the normal state.
 * The function is triggered by a button click event.
 * @param {MouseEvent} event - The click event object.
 * @returns {void} Updates the Pokémon sprite and light buttons to reflect the normal state.
 */
  window.clickNormalColor = function() {
    shiny = false; // Set shiny to false to get the normal sprite
    setURLimage(); // Update the image to reflect the normal state

    // Update UI elements to reflect the normal state
    document.getElementById("light-button-red").classList.add("on");
    document.getElementById("light-button-red").classList.remove("off");
    document.getElementById("light-button-blue").classList.remove("on");
    document.getElementById("light-button-blue").classList.add("off");
  };

  /**
   * Toggles between the front and back view of the Pokémon sprite.
   * This function toggles the sprite view between front and back and updates the displayed image.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the Pokémon sprite to reflect the new view.
  */ 
  window.clickLeftRight = function() {
    frontView = !frontView;
    setURLimage();
  };

  /**
   * Decrements the Pokémon ID to fetch and display the previous Pokémon in the list.
   * This function decrements the Pokémon ID to fetch and display the previous Pokémon in the list.
   * It wraps around to the last Pokémon if the current Pokémon is the first in the list.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the displayed Pokémon information.
   */
  window.clickUp = function() {
    if (numPokemon > 1) {
        numPokemon -= 1;
    } else {
        numPokemon = lastPokemon; // If at the first pokemon, wrap to the last
    }
    fetchAndDisplayPokemon(numPokemon.toString(), true);
  };

  /**
   * Increments the Pokémon ID to fetch and display the next Pokémon in the list.
   * This function increments the Pokémon ID to fetch and display the next Pokémon in the list.
   * It wraps around to the first Pokémon if the current Pokémon is the last in the list.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the displayed Pokémon information.
   */
  window.clickBottom = function() {
    console.log("clickBottom function called");
    if (numPokemon < lastPokemon) {
        numPokemon += 1;
    } else {
        numPokemon = 1; // If at the last pokemon, wrap to the first
    }
    fetchAndDisplayPokemon(numPokemon.toString(), true);
  };

  /**
   * Displays the current ability of the Pokémon, including its description.
   * If the ability's effect is not yet fetched, it fetches the data before displaying.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the displayed ability information.
   */
  function displayCurrentAbility() {
    if (pokemonAbilities.length > 0) {
      const ability = pokemonAbilities[currentAbilityIndex];
      
      if (ability.effect) {
        // if the effect already fetched, just display it
        document.getElementById('abilities-text').textContent = `${ability.name}: ${ability.effect}`;
      } else {
        // Fetch the detailed information about the ability
        fetch(ability.url)
          .then(response => response.json())
          .then(abilityDetails => {
            const effectEntry = abilityDetails.effect_entries.find(entry => entry.language.name === 'en');
            ability.effect = effectEntry.effect; // Store for future use without refetching
            document.getElementById('abilities-text').textContent = `${ability.name}: ${ability.effect}`;
          })
          .catch(error => console.error("Failed to fetch ability details:", error));
      }
    } else {
      document.getElementById('abilities-text').textContent = 'No abilities';
    }
  }

  /**
   * Cycles through the Pokémon's abilities to display the next one.
   * This function cycles through the Pokémon's abilities to display the next one.
   * It updates the displayed ability information on the screen.
   * The function is triggered by a button click event.
   * @param {MouseEvent} event - The click event object.
   * @returns {void} Updates the displayed ability information.
   */
  window.clickNextAbility = function() {
    if (pokemonAbilities.length > 0) {
      currentAbilityIndex = (currentAbilityIndex + 1) % pokemonAbilities.length; // Cycle through abilities
      displayCurrentAbility(); // Update the displayed ability
    }
  }

  /**
 * Fetches and displays the Pokémon corresponding to the given ID, updating to the previous Pokémon in the list.
 * @param {number} newNum - The new Pokémon ID to fetch and display.
 */
  function clickUp(){
    // Calculate the new number for the previous Pokemon
    const newNum = numPokemon > 1 ? numPokemon - 1 : lastPokemon;
    // Fetch and display the Pokemon
    fetchAndDisplayPokemon(newNum.toString(), true);
  }

  /**
 * Fetches and displays the Pokémon corresponding to the given ID, updating to the next Pokémon in the list.
 * @param {number} newNum - The new Pokémon ID to fetch and display.
 */
  function clickDown(){
    // Calculate the new number for the next Pokemon
    const newNum = numPokemon < lastPokemon ? numPokemon + 1 : 1;
    // Fetch and display the Pokemon
    fetchAndDisplayPokemon(newNum.toString(), true);
  }

});
  