document.addEventListener('DOMContentLoaded', async () => {
  let pokemonList = await loadInitialPokemons(); // Carrega os Pokémon iniciais e armazena na variável global.

  // Adiciona o evento de busca por ID ou nome
  document.getElementById('search-pokemon').addEventListener('change', async () => {
    const searchTerm = document.getElementById('search-pokemon').value.trim().toLowerCase();
    if (searchTerm) {
      try {
        const result = await fetchPokemonByIdOrName(searchTerm);
        if (result) {
          displayPokemon([result]); // Mostra apenas o resultado encontrado
        } else {
          document.getElementById('pokemon-result').innerHTML = '<p style="color: gray;">Pokémon não encontrado.</p>';
        }
      } catch (e) {
        console.error('Erro ao buscar Pokémon:', e);
      }
    } else {
      displayPokemon(pokemonList); // Exibe todos os Pokémon se o campo estiver vazio
    }
  });

  // Adiciona o evento ao botão "Carregar Mais"
  document.getElementById('load-more-button').addEventListener('click', async () => {
    const morePokemons = await loadMorePokemons(pokemonList.length);
    pokemonList = [...pokemonList, ...morePokemons];
    displayPokemon(pokemonList); // Atualiza a exibição
  });

  // Salva a lista de Pokémon global para filtros
  window.pokemonList = pokemonList;
});

// Filtra os Pokémon por tipo
async function filterByType(type) {
  const container = document.getElementById('pokemon-result');
  container.innerHTML = '<p style="color: gray;">Carregando...</p>'; // Feedback enquanto busca os Pokémon

  // Atualiza o botão ativo
  updateActiveButton(type);

  if (type === 'all') {
    displayPokemon(window.pokemonList); // Exibe todos os Pokémon carregados
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error('Erro ao buscar Pokémon por tipo.');
    const data = await response.json();

    // Extrai as informações básicas dos Pokémon do tipo
    const pokemonsOfType = data.pokemon.map(p => p.pokemon);
    const detailedPokemons = [];

    // Busca detalhes de cada Pokémon
    for (let i = 0; i < Math.min(pokemonsOfType.length, 20); i++) { // Limita a 20 Pokémon para evitar sobrecarga
      const pokemonDetails = await fetchPokemonByIdOrName(pokemonsOfType[i].name);
      if (pokemonDetails) detailedPokemons.push(pokemonDetails);
    }

    if (detailedPokemons.length === 0) {
      container.innerHTML = '<p style="color: gray;">Nenhum Pokémon encontrado desse tipo.</p>';
    } else {
      displayPokemon(detailedPokemons); // Exibe os Pokémon filtrados
    }
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p style="color: red;">Erro ao buscar Pokémon por tipo.</p>';
  }
}

// Atualiza o botão ativo
function updateActiveButton(selectedType) {
  const buttons = document.querySelectorAll('#type-filter button'); // Seleciona todos os botões
  buttons.forEach(button => {
    if (button.getAttribute('onclick').includes(`filterByType('${selectedType}')`)) {
      button.classList.add('active'); // Adiciona a classe ao botão selecionado
    } else {
      button.classList.remove('active'); // Remove a classe dos outros botões
    }
  });
}



// Carrega os Pokémon iniciais
async function loadInitialPokemons() {
  const container = document.getElementById('pokemon-result');
  container.innerHTML = '';
  const pokemonList = [];
  for (let i = 1; i <= 20; i++) {
    const pokemon = await fetchPokemonByIdOrName(i);
    if (pokemon) pokemonList.push(pokemon);
  }
  displayPokemon(pokemonList);
  return pokemonList;
}

// Carrega mais Pokémon
async function loadMorePokemons(startIndex) {
  const newPokemons = [];
  for (let i = startIndex + 1; i <= startIndex + 20; i++) {
    const pokemon = await fetchPokemonByIdOrName(i);
    if (pokemon) newPokemons.push(pokemon);
  }
  return newPokemons;
}

// Exibe os Pokémon na tela
function displayPokemon(pokemonList) {
  const container = document.getElementById('pokemon-result');
  container.innerHTML = pokemonList
    .map(pokemon => renderPokemonCard(pokemon))
    .join('');
}

// Busca Pokémon por ID ou Nome
async function fetchPokemonByIdOrName(identifier) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!response.ok) throw new Error('Pokémon não encontrado');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Renderiza o card de um Pokémon
function renderPokemonCard(pokemon) {
  const type = pokemon.types[0].type.name;
  const bgColor = typeColors[type] || '#f4f4f4';
  const weight = (pokemon.weight / 10).toFixed(1); // Peso em kg (a API fornece em hectogramas)
  const height = (pokemon.height / 10).toFixed(1); // Altura em metros (a API fornece em decímetros)

  return `
    <div class="pokemon-card" style="background-color: ${bgColor}; padding: 10px; border-radius: 8px; margin: 10px; text-align: center;">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <p>#${pokemon.id.toString().padStart(3, '0')}</p>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="max-width: 12vw; margin: 1rem 0;">
      <p>Tipo: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p>Peso: ${weight} kg</p>
      <p>Altura: ${height} m</p>
    </div>
  `;
}

// Cores dos tipos
const typeColors = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dark: '#705848',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878'
};
