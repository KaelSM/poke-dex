// Defines utility functions related to updating UI components and fetching data

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
      document.body.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }
  
  function clearErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  // Helper function to fetch and display Pokémon
  function fetchAndDisplayPokemon(query, nameScreenTextElement, searchInputElement, selectElement, placeholderPokemonImgElement, staticImgElement, gender) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      .then(response => {
        if (!response.ok) throw new Error('Pokémon not found');
        return response.json();
      })
      .then(data => {
        // Make sure you pass in the correct elements when calling updateDisplays
        updateDisplays(data, nameScreenTextElement, searchInputElement);
        updateSprite(data, placeholderPokemonImg, staticImg, gender);
        selectPokemonByName(selectElement, data.name);
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
        // Make sure you have a function to display errors to the user
        displayError('error-message', 'Pokémon not found!');
      });
  }
  