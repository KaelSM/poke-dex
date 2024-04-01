document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('pokemon-select');
  const maleIcon = document.querySelector('.fa-mars-stroke');
  const femaleIcon = document.querySelector('.fa-venus');
  let gender = 'male'; // Default gender

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