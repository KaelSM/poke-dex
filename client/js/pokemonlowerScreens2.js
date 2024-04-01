document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('pokemon-select');
  const searchInput = document.getElementById('search-input');
  const maleIcon = document.querySelector('.fa-mars-stroke');
  const femaleIcon = document.querySelector('.fa-venus');
  let gender = 'male'; // Default gender

  searchInput.addEventListener('input', function() {
    const searchValue = this.value.trim();

    if (searchValue && !isNaN(searchValue)) {
      const searchId = parseInt(searchValue); // Ensure searchId is an integer
      fetch(`https://pokeapi.co/api/v2/pokemon/${searchId}`)
        .then(response => {
          if (!response.ok) throw new Error('Pokémon not found');
          return response.json();
        })
        .then(data => {
          selectPokemonById(data.id);
          updateDisplays(data);
          updateSprite(data);
        })
        .catch(error => {
          console.error('Error fetching Pokémon details:', error);
          displayError('Pokémon not found!');
        });
    } else {
      // Clear any previous error messages
      clearErrorMessage();
    }
  });

  searchInput.addEventListener('keypress', function(event) {
    // Only allow numbers and backspace key
    const keyCode = event.keyCode;
    if (keyCode !== 8 && (keyCode < 48 || keyCode > 57)) {
      event.preventDefault();
    }
  });

  function updateDisplays(pokemonData) {
    // Assuming 'name-screen-text' is where you want to display the ID and name
    const pokemonId = pokemonData.id;
    const uppercaseName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    document.getElementById('name-screen-text').textContent = `${pokemonId} - ${uppercaseName}`;
    // If you have other places to update, do it here
  }

  fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
    .then(response => response.json())
    .then(data => {
      data.results.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        selectElement.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching Pokémon list:', error);
    });

  selectElement.addEventListener('change', function() {
    const pokemonName = this.value;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => response.json())
      .then(data => {
        const pokemonId = data.id;
        const uppercaseName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        document.getElementById('name-screen-text').textContent = `${pokemonId} - ${uppercaseName}`;
        updateSprite(data);
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
      });
  });

  function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.id = 'error-message';
    errorElement.textContent = message;
    // You'll need to add styling and decide where to insert this in your HTML
    document.body.appendChild(errorElement); 
  }

  // Function to clear error messages
  function clearErrorMessage() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function selectPokemonById(id) {
    // Update the dropdown to show the selected Pokémon
    const optionToSelect = [...selectElement.options].find(option => option.value === id.toString());
    if (optionToSelect) {
      selectElement.value = optionToSelect.value;
    }
  }

  // Function to update the sprite and icons based on gender
  function updateSprite(pokemonData) {
    const spriteUrl = gender === 'male' ? pokemonData.sprites.front_default :
      (pokemonData.sprites.front_female || pokemonData.sprites.front_default);
    document.getElementById('static-img').style.display = 'none';
    const imgElement = document.getElementById('placeholder-pokemon-img');
    imgElement.src = spriteUrl;
    imgElement.style.display = 'block';
    updateGenderIcons();
  }

  // Event listeners for gender icons
  maleIcon.addEventListener('click', () => {
    gender = 'male';
    updateGenderIcons();
    updateSpriteWithSelectedPokemon();
  });

  femaleIcon.addEventListener('click', () => {
    gender = 'female';
    updateGenderIcons();
    updateSpriteWithSelectedPokemon();
  });

  function updateGenderIcons() {
    maleIcon.classList.toggle('selected', gender === 'male');
    femaleIcon.classList.toggle('selected', gender === 'female');
    // Update colors based on selection
    maleIcon.style.color = gender === 'male' ? 'black' : 'grey';
    femaleIcon.style.color = gender === 'female' ? 'black' : 'grey';
  }

  function updateSpriteWithSelectedPokemon() {
    const pokemonName = selectElement.value;
    if (pokemonName) { // Check if a Pokemon has been selected
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        .then(response => response.json())
        .then(updateSprite)
        .catch(error => {
          console.error('Error fetching Pokémon details:', error);
        });
    }
  }s

  // Initial call to set default gender icon states
  updateGenderIcons();
  updateSpriteWithSelectedPokemon();
});