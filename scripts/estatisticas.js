document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button'); 
    const searchInput = document.getElementById('pokemon-search'); 
    
    // Verifica se o botão e o campo de pesquisa existem antes de adicionar o listener
    if (searchButton && searchInput) {
      searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          fetchPokemonData(searchTerm); // Chama a função para buscar os dados do Pokémon
        }
      });
    } else {
      console.error('Botão de busca ou campo de pesquisa não encontrados.');
    }
});

// Função principal para buscar e exibir os dados do Pokémon
async function fetchPokemonData(nameOrId) {
    const container = document.getElementById('pokemon-stats');
    container.innerHTML = ''; 
  
    try {
      // Remover espaços extras e converter para minúsculas se for nome
      nameOrId = nameOrId.trim().toLowerCase();
  
      // Tentar buscar por nome ou ID
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
      
      if (!response.ok) throw new Error('Pokémon não encontrado');
      const data = await response.json();
  
      // Renderiza o card principal do Pokémon
      container.innerHTML = renderPokemonCard(data);
  
      // Renderiza a barra de estatísticas do Pokémon
      container.innerHTML += renderStatsBar(data);
      
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      container.innerHTML = '<p style="color: red;">Erro: Pokémon não encontrado.</p>';
    }
}

// Função para criar o card principal do Pokémon
function renderPokemonCard(pokemon) {
  const type = pokemon.types[0].type.name;
  const bgColor = typeColors[type] || '#f4f4f4';
  const weight = (pokemon.weight / 10).toFixed(1); 
  const height = (pokemon.height / 10).toFixed(1); 

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

// Função para criar a barra de estatísticas
function renderStatsBar(pokemon) {
    return `
      <div class="stats-bar-container">
        ${pokemon.stats
          .map(stat => {
            const statName = stat.stat.name.toUpperCase();
            const statValue = stat.base_stat;
            return `
              <div class="stats-bar">
                <div class="stats-name-value">
                  <span>${statName}: </span>
                  <span>${statValue}</span>
                </div>
                <div class="stats-bar-inner" style="width: ${Math.min(statValue, 100)}%; background-color: ${getStatColor(statName)};"></div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }
  

// Função auxiliar para obter cores baseadas nas estatísticas
function getStatColor(statName) {
  switch (statName) {
    case 'HP': return '#FF5959';
    case 'ATTACK': return '#F5AC78';
    case 'DEFENSE': return '#FAE078';
    case 'SPECIAL-ATTACK': return '#9DB7F5';
    case 'SPECIAL-DEFENSE': return '#A7DB8D';
    case 'SPEED': return '#FA92B2';
    default: return '#A8A878';
  }
}