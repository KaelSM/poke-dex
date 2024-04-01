document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('pokemon-select');

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
          const pokemonName = data.name.toUpperCase();
          const spriteUrl = data.sprites.front_default;

          document.getElementById('name-screen-text').textContent = `${pokemonId} - ${pokemonName}`;
          document.getElementById('placeholder-pokemon-img').src = spriteUrl;
          document.getElementById('placeholder-pokemon-img').style.display = 'block';
          //hide the static image
          document.getElementById('static-img').style.display = 'none';
        })
        .catch(error => {
          console.error('Error fetching Pokémon details:', error);
        });
    });
  });