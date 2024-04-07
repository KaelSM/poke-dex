

// Defines utility functions related to updating UI components and fetching data
let isAttackShown = false;

/**
 * Updates the main display with the name, ID, and other relevant information of the Pokémon.
 * It sets the text content of provided DOM elements with Pokémon's ID and formatted name.
 *
 * @param {Object} pokemonData - Object containing Pokémon details.
 * @param {HTMLElement} nameScreenTextElement - The DOM element where the Pokémon's name and ID are displayed.
 * @param {HTMLInputElement} searchInputElement - The input element where the Pokémon ID is set for searching.
 */
function updateDisplays(pokemonData, nameScreenTextElement, searchInputElement) {
    if (pokemonData && nameScreenTextElement && searchInputElement) {
      const pokemonId = pokemonData.id;
      const uppercaseName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
      nameScreenTextElement.textContent = `${pokemonId} - ${uppercaseName}`;
      searchInputElement.value = pokemonId;
    } else {
      // Handle the case where elements or data might be undefined
      console.error('One of the parameters for updateDisplays is undefined.');
    }
}
  
/**
 * Updates the sprite image displayed on the screen.
 * Depending on the Pokémon's gender, a different sprite URL is selected and applied to the image element.
 *
 * @param {Object} pokemonData - Object containing Pokémon details including sprites.
 * @param {HTMLImageElement} placeholderPokemonImgElement - The image element where the Pokémon sprite is displayed.
 * @param {HTMLElement} staticImgElement - An element used for displaying static or alternative content.
 * @param {string} gender - The gender of the Pokémon to determine which sprite to display.
 */
function updateSprite(pokemonData, placeholderPokemonImgElement, staticImgElement, gender) {
    const spriteUrl = gender === 'male' ? 
      pokemonData.sprites.front_default : 
      pokemonData.sprites.front_female || 
      pokemonData.sprites.front_default;
    staticImgElement.style.display = 'none';
    placeholderPokemonImgElement.src = spriteUrl;
    placeholderPokemonImgElement.style.display = 'block';
}
  
/**
 * Selects the Pokémon name in a dropdown list.
 * It finds the option that matches the given Pokémon name and sets it as the selected value.
 *
 * @param {HTMLSelectElement} selectElement - The select element containing the list of Pokémon names.
 * @param {string} name - The name of the Pokémon to be selected in the dropdown.
 */
function selectPokemonByName(selectElement, name) {
    const optionToSelect = [...selectElement.options].find(option => option.value === name);
    if (optionToSelect) {
      selectElement.value = optionToSelect.value;
    }
}

/**
 * Updates the styling of the gender icons based on the current gender selection.
 * Selected gender icon gets a 'selected' class and changes color to indicate the current choice.
 *
 * @param {HTMLElement} maleIcon - The icon representing the male gender.
 * @param {HTMLElement} femaleIcon - The icon representing the female gender.
 * @param {string} gender - The currently selected gender.
 */
function updateGenderIcons(maleIcon, femaleIcon, gender) {
    maleIcon.classList.toggle('selected', gender === 'male');
    femaleIcon.classList.toggle('selected', gender === 'female');
    maleIcon.style.color = gender === 'male' ? 'black' : 'grey';
    femaleIcon.style.color = gender === 'female' ? 'black' : 'grey';
}

/**
 * Displays an error message on the screen by creating or updating an existing error element.
 *
 * @param {string} errorElementId - The ID of the element where the error message will be displayed.
 * @param {string} message - The error message to be displayed.
 */
function displayError(errorElementId, message) {
    let errorElement = document.getElementById(errorElementId);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorElementId;
      document.body.appendChild(errorElement); // Or append to a specific element as needed.
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Ensure the element is visible.
}

/**
 * Clears any displayed error message from the screen.
 *
 * @param {string} errorElementId - The ID of the element where the error message is displayed.
 */
function clearErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.style.display = 'none'; // Hide the element.
    }
}
  
// Helper function to fetch and display Pokémon
/**
 * Fetches and displays information about a Pokémon by its name or ID.
 * This function handles the full update cycle: fetching data, updating displays, updating sprite,
 * and handling any errors that may occur during the process.
 *
 * @param {string|number} query - The name or ID of the Pokémon to fetch.
 * @param {HTMLElement} nameScreenTextElement - The element to display the Pokémon's name and ID.
 * @param {HTMLInputElement} searchInputElement - The input field for the Pokémon search.
 * @param {HTMLSelectElement} selectElement - The select dropdown to update the selected Pokémon.
 * @param {HTMLImageElement} placeholderPokemonImgElement - The image element to update with the Pokémon's sprite.
 * @param {HTMLElement} staticImgElement - The static image element, if used for fallback or alternative content.
 * @param {string} gender - The gender used to determine the sprite to fetch.
 * @param {boolean} isUserInitiated - Flag to indicate if the fetch was initiated by the user.
 */
function fetchAndDisplayPokemon(query, nameScreenTextElement, searchInputElement, selectElement, placeholderPokemonImgElement, staticImgElement, gender, isUserInitiated = false) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      .then(response => {
        if (!response.ok) throw new Error('Pokémon not found');
        return response.json();
      })
      .then(data => {
        updateDisplays(data, nameScreenTextElement, searchInputElement);
        updateSprite(data, placeholderPokemonImgElement, staticImgElement, gender);
        selectPokemonByName(selectElement, data.name);
        clearErrorMessage('error-message'); 
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
        if (isUserInitiated) {
          displayError('error-message', 'Pokémon not found!'); 
        }
      });
}

/**
 * Retrieves the image asset URL based on the type of Pokémon.
 * Returns the URL for the image representing the given Pokémon type.
 *
 * @param {string} type - The type of the Pokémon.
 * @returns {string} - The URL of the asset image corresponding to the Pokémon's type.
 */
function getAssetType(type){
  switch(type){
    case 'normal':
      return 'https://cdn2.bulbagarden.net/upload/3/39/NormalIC_Big.png';
    case 'fighting':
      return 'https://cdn2.bulbagarden.net/upload/6/67/FightingIC_Big.png';
    case 'flying':
      return 'https://cdn2.bulbagarden.net/upload/c/cb/FlyingIC_Big.png';
    case 'poison':
      return 'https://cdn2.bulbagarden.net/upload/3/3d/PoisonIC_Big.png';
    case 'ground':
      return 'https://cdn2.bulbagarden.net/upload/8/8f/GroundIC_Big.png';
    case 'rock':
      return 'https://cdn2.bulbagarden.net/upload/c/ce/RockIC_Big.png';
    case 'bug':
      return 'https://cdn2.bulbagarden.net/upload/c/c8/BugIC_Big.png';
    case 'ghost':
      return 'https://cdn2.bulbagarden.net/upload/7/73/GhostIC_Big.png';
    case 'steel':
      return 'https://cdn2.bulbagarden.net/upload/d/d4/SteelIC_Big.png';
    case 'fire':
      return 'https://cdn2.bulbagarden.net/upload/2/26/FireIC_Big.png';
    case 'water':
      return 'https://cdn2.bulbagarden.net/upload/5/56/WaterIC_Big.png';
    case 'grass':
      return 'https://cdn2.bulbagarden.net/upload/7/74/GrassIC_Big.png';
    case 'electric':
      return 'https://cdn2.bulbagarden.net/upload/4/4a/ElectricIC_Big.png';
    case 'psychic':
      return 'https://cdn2.bulbagarden.net/upload/6/60/PsychicIC_Big.png';
    case 'ice':
      return 'https://cdn2.bulbagarden.net/upload/6/6f/IceIC_Big.png';
    case 'dragon':
      return 'https://cdn2.bulbagarden.net/upload/4/48/DragonIC_Big.png';
    case 'dark':
      return 'https://cdn2.bulbagarden.net/upload/5/56/DarkIC_Big.png';
    case 'fairy':
      return 'https://cdn2.bulbagarden.net/upload/d/df/Picross_FairyIC.png';
    default:
      return 'https://cdn2.bulbagarden.net/upload/3/3c/UnknownIC_Big.png';
  }
}
  