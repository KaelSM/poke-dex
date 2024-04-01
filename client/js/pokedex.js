document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const selectElement = document.getElementById('pokemon-select');
    const searchInput = document.getElementById('search-input');
    const maleIcon = document.querySelector('.fa-mars-stroke');
    const femaleIcon = document.querySelector('.fa-venus');
    const placeholderPokemonImg = document.getElementById('placeholder-pokemon-img');
    const staticImg = document.getElementById('static-img');
    const nameScreenText = document.getElementById('name-screen-text');
    const errorElementId = 'error-message'; // ID for the error message element
    let gender = 'male'; // Default gender
  
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
  
    // Helper function to fetch and display Pokémon
    function fetchAndDisplayPokemon(query, isUserInitiated) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
          .then(response => {
            if (!response.ok) throw new Error('Pokémon not found');
            return response.json();
          })
          .then(data => {
            updateDisplays(data, nameScreenText, searchInput);
            updateSprite(data, placeholderPokemonImg, staticImg, gender);
            selectPokemonByName(selectElement, data.name);
            clearErrorMessage(errorElementId); // Clears any existing error message.
          })
          .catch(error => {
            console.error('Error fetching Pokémon details:', error);
            if (isUserInitiated) {
              displayError(errorElementId, 'Pokémon not found!');
            }
        });
    }
});
  