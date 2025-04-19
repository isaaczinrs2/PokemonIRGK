// Pokémon Statistics JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const statsSearch = document.getElementById('stats-search');
  const statsSearchBtn = document.getElementById('stats-search-btn');
  const statsResults = document.getElementById('stats-results');
  const baseStatsChartCanvas = document.getElementById('base-stats-chart');
  const typeEffectivenessChartCanvas = document.getElementById('type-effectiveness-chart');
  
  // Variáveis globais
  let baseStatsChart = null;
  let typeEffectivenessChart = null;

  // Initialize stats section
  function initStats() {
    // Configura placeholder com exemplo
    const randomId = Math.floor(Math.random() * 898) + 1;
    statsSearch.placeholder = `Ex: pikachu, ${randomId}`;
  }
  
  // Search Pokémon stats
  async function searchPokemonStats() {
    const searchTerm = statsSearch.value.trim().toLowerCase();
    if (!searchTerm) return;

    try {
      // Primeiro tenta buscar pelo nome ou ID
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      if (!response.ok) throw new Error('Pokémon not found');
      
      const pokemon = await response.json();
      
      // Obter dados da espécie para eficácia de tipos
      const speciesResponse = await fetch(pokemon.species.url);
      const species = await speciesResponse.json();
      
      // Exibir estatísticas do Pokémon
      displayPokemonStats(pokemon, species);
      
    } catch (error) {
      console.error('Error searching Pokémon:', error);
      statsResults.innerHTML = `
        <div class="error-message">
          <p>Pokémon não encontrado. Tente outro nome ou número.</p>
          <p>Exemplos válidos: "pikachu", "25", "charizard"</p>
        </div>
      `;
      
      // Limpar gráficos
      if (baseStatsChart) {
        baseStatsChart.destroy();
        baseStatsChart = null;
      }
      if (typeEffectivenessChart) {
        typeEffectivenessChart.destroy();
        typeEffectivenessChart = null;
      }
    }
  }
  
  // Display Pokémon stats
  function displayPokemonStats(pokemon, species) {
    // Display basic info
    statsResults.innerHTML = `
      <div class="stats-header">
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
            alt="${pokemon.name}" class="stats-pokemon-img">
        <div class="stats-basic-info">
          <h2 class="stats-pokemon-name">${pokemon.name}</h2>
          <p class="stats-pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
          <div class="stats-pokemon-types">
            ${pokemon.types.map(type => 
              `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
            ).join('')}
          </div>
          <div class="stats-pokemon-details">
            <p><strong>Height:</strong> ${pokemon.height / 10}m</p>
            <p><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
            <p><strong>Abilities:</strong> 
              ${pokemon.abilities.map(ability => ability.ability.name.replace('-', ' ')).join(', ')}
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Create base stats chart
    createBaseStatsChart(pokemon.stats);
    
    // Create type effectiveness chart
    createTypeEffectivenessChart(pokemon.types);
  }
  
  // Create base stats chart
  function createBaseStatsChart(stats) {
    // Destruir gráfico anterior se existir
    if (baseStatsChart) {
      baseStatsChart.destroy();
    }

    const ctx = baseStatsChartCanvas.getContext('2d');
    const statsLabels = stats.map(stat => stat.stat.name);
    const statsData = stats.map(stat => stat.base_stat);

    baseStatsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: statsLabels,
        datasets: [{
          label: 'Base Stats',
          data: statsData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 12
              }
            }
          }
        },
        layout: {
          padding: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5
          }
        }
      }
    });
  }
  
  // Create type effectiveness chart
  function createTypeEffectivenessChart(types) {
    // This is a simplified version - in a real app, you'd calculate actual effectiveness
    const typeNames = types.map(type => type.type.name);
    
    const allTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic',
      'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
    
    // Simplified effectiveness (in a real app, you'd calculate based on type matchups)
    const effectiveness = allTypes.map(type => {
      // Random effectiveness for demo purposes
      return Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    });
    
    const chartData = {
      labels: allTypes,
      datasets: [{
        label: 'Type Effectiveness',
        data: effectiveness,
        backgroundColor: allTypes.map(type => 
          effectiveness[allTypes.indexOf(type)] > 0 ? 'rgba(255, 99, 132, 0.5)' :
          effectiveness[allTypes.indexOf(type)] < 0 ? 'rgba(54, 162, 235, 0.5)' :
          'rgba(201, 203, 207, 0.5)'
        ),
        borderColor: allTypes.map(type => 
          effectiveness[allTypes.indexOf(type)] > 0 ? 'rgba(255, 99, 132, 1)' :
          effectiveness[allTypes.indexOf(type)] < 0 ? 'rgba(54, 162, 235, 1)' :
          'rgba(201, 203, 207, 1)'
        ),
        borderWidth: 1
      }]
    };
    
    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              if (value > 0) return 'Super Effective';
              if (value < 0) return 'Not Very Effective';
              return 'Normal';
            }
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Type Effectiveness',
          font: {
            size: 16
          }
        }
      }
    };
    
    // Destroy previous chart if it exists
    if (typeEffectivenessChart) {
      typeEffectivenessChart.destroy();
    }
    
    // Create new chart
    typeEffectivenessChart = new Chart(typeEffectivenessChartCanvas, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }

  // Initialize
  initStats();
  
  // Event listeners
  statsSearchBtn.addEventListener('click', searchPokemonStats);
  statsSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchPokemonStats();
    }
  });
});