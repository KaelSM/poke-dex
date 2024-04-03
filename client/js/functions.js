// Defines utility functions related to updating UI components and fetching data
let isAttackShown = false;
let pokemonMoves = []; // Stores the detailed move data
let currentMoveIndex = 0; 


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
  
  function updateSprite(pokemonData, placeholderPokemonImgElement, staticImgElement, gender) {
    const spriteUrl = gender === 'male' ? 
      pokemonData.sprites.front_default : 
      pokemonData.sprites.front_female || 
      pokemonData.sprites.front_default;
  
    staticImgElement.style.display = 'none';
    placeholderPokemonImgElement.src = spriteUrl;
    placeholderPokemonImgElement.style.display = 'block';
  }
  
  function selectPokemonByName(selectElement, name) {
    const optionToSelect = [...selectElement.options].find(option => option.value === name);
    if (optionToSelect) {
      selectElement.value = optionToSelect.value;
    }
  }
  
  function updateGenderIcons(maleIcon, femaleIcon, gender) {
    maleIcon.classList.toggle('selected', gender === 'male');
    femaleIcon.classList.toggle('selected', gender === 'female');
    maleIcon.style.color = gender === 'male' ? 'black' : 'grey';
    femaleIcon.style.color = gender === 'female' ? 'black' : 'grey';
  }
  
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
  
  function clearErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.style.display = 'none'; // Hide the element.
    }
  }
  
  // Helper function to fetch and display Pokémon
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
        clearErrorMessage('error-message'); // Make sure error-message ID matches your HTML
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
        if (isUserInitiated) {
          displayError('error-message', 'Pokémon not found!'); // Make sure error-message ID matches your HTML
        }
      });
}

function clickAtk() {
  if (pokemonAttacks && pokemonAttacks.length > 0) {
    currentAttackIndex = 0; // Reset to the first attack
    displayAttack(pokemonAttacks[currentAttackIndex].move);
  }
}

function clickPrev() {
  if (currentMoveIndex > 0) {
    currentMoveIndex--; // Decrease index to show previous move
  } else {
    currentMoveIndex = pokemonMoves.length - 1; // Wrap around to the last move
  }
  fetchMoveDetails(pokemonMoves[currentMoveIndex].move.url);
}

function clickNext() {
  if (currentMoveIndex < pokemonMoves.length - 1) {
    currentMoveIndex++; // Increase index to show next move
  } else {
    currentMoveIndex = 0; // Wrap around to the first move
  }
  fetchMoveDetails(pokemonMoves[currentMoveIndex].move.url);
}
function toggleAttackDisplay() {
  const lightElement = document.getElementById('light-button-blue-atk');
  lightElement.classList.toggle('on'); // Toggle the class 'on' to show the light is active

  // Check the state of the light to decide what to do
  if (lightElement.classList.contains('on')) {
    // The light is now on, fetch the first move's data
    fetchFirstMoveData();
  } else {
    // The light is now off, clear the attack information
    clearAttackDisplay();
  }
}

function fetchFirstMoveData() {
  if (pokemonMoves.length > 0) {
    fetchMoveDetails(pokemonMoves[0].move.url); // Assumes pokemonMoves is populated when the Pokémon is fetched
  }
}

function fetchMoveDetails(url) {
  fetch(url)
    .then(response => response.json())
    .then(moveDetails => {
      displayMove(moveDetails); // Display the move details
      pokemonMoves[currentMoveIndex] = moveDetails; // Update the current move's data
    })
    .catch(error => {
      console.error('Failed to fetch move details:', error);
    });
}

function displayMove(move) {
  // Clear current move details
  const descriptionElement = document.getElementById('pokemon-description');
  const statsListElement = document.getElementById('pokemon-stats');
  descriptionElement.textContent = '';
  statsListElement.innerHTML = '';

  // Display new move details
  statsListElement.innerHTML = `
    <li>Type: ${move.type.name}</li>
    <li>Power: ${move.power || '—'}</li>
    <li>PP: ${move.pp}</li>
    <li>Accuracy: ${move.accuracy || '—'}</li>
    <li>Effect: ${move.effect_entries.find(e => e.language.name === 'en').effect}</li>
  `;

  descriptionElement.textContent = move.flavor_text_entries.find(f => f.language.name === 'en').flavor_text;
}

function clearAttackDisplay() {
  // Clear the attack details
  const descriptionElement = document.getElementById('pokemon-description');
  const statsListElement = document.getElementById('pokemon-stats');
  descriptionElement.textContent = 'Description and stats cleared.';
  statsListElement.innerHTML = '';
}

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
  