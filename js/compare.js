// Pokémon Comparator JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const compareInput1 = document.querySelector('.compare1 .compare-input');
  const compareInput2 = document.querySelector('.compare2 .compare-input');
  const suggestions1 = document.querySelector('.compare1 .compare-suggestions');
  const suggestions2 = document.querySelector('.compare2 .compare-suggestions');
  const compareDetails1 = document.querySelector('.compare1 .compare-details');
  const compareDetails2 = document.querySelector('.compare2 .compare-details');
  const statsChartCanvas = document.getElementById('stats-chart');
  
  // Chart variables
  let statsChart = null;
  let pokemon1 = null;
  let pokemon2 = null;
  
  // Initialize comparator
  initComparator();
  
  // Event listeners
  compareInput1.addEventListener('input', () => handleCompareInput(compareInput1, suggestions1, 1));
  compareInput2.addEventListener('input', () => handleCompareInput(compareInput2, suggestions2, 2));
  
  // Handle Pokémon input for suggestions
  async function handleCompareInput(inputElement, suggestionsElement, position) {
      const searchTerm = inputElement.value.trim().toLowerCase();
      
      if (searchTerm.length < 2) {
          suggestionsElement.style.display = 'none';
          return;
      }
      
      try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
          const data = await response.json();
          
          const matches = data.results.filter(pokemon => 
              pokemon.name.includes(searchTerm)
          ).slice(0, 5);
          
          if (matches.length > 0) {
              suggestionsElement.innerHTML = '';
              matches.forEach(pokemon => {
                  const suggestionItem = document.createElement('div');
                  suggestionItem.className = 'suggestion-item';
                  suggestionItem.textContent = pokemon.name;
                  suggestionItem.addEventListener('click', () => {
                      inputElement.value = pokemon.name;
                      suggestionsElement.style.display = 'none';
                      selectPokemonForCompare(pokemon.url, position);
                  });
                  suggestionsElement.appendChild(suggestionItem);
              });
              suggestionsElement.style.display = 'block';
          } else {
              suggestionsElement.style.display = 'none';
          }
      } catch (error) {
          console.error('Error fetching Pokémon suggestions:', error);
      }
  }
  
  // Select Pokémon for comparison
  async function selectPokemonForCompare(pokemonUrl, position) {
      try {
          const response = await fetch(pokemonUrl);
          const pokemon = await response.json();
          
          if (position === 1) {
              pokemon1 = pokemon;
              updateCompareDisplay(pokemon, compareDetails1);
          } else {
              pokemon2 = pokemon;
              updateCompareDisplay(pokemon, compareDetails2);
          }
          
          // Update chart if both Pokémon are selected
          if (pokemon1 && pokemon2) {
              updateStatsChart();
          }
      } catch (error) {
          console.error('Error selecting Pokémon for comparison:', error);
      }
  }
  
  // Update Pokémon display in compare section
  function updateCompareDisplay(pokemon, detailsElement) {
      detailsElement.innerHTML = `
          <div class="compare-pokemon-header">
              <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="compare-pokemon-img">
              <h3 class="compare-pokemon-name">${pokemon.name}</h3>
              <p class="compare-pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
              <div class="compare-pokemon-types">
                  ${pokemon.types.map(type => 
                      `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
                  ).join('')}
              </div>
          </div>
          <div class="compare-pokemon-stats">
              ${pokemon.stats.map(stat => `
                  <div class="compare-stat-item">
                      <span class="compare-stat-name">${stat.stat.name}:</span>
                      <span class="compare-stat-value">${stat.base_stat}</span>
                  </div>
              `).join('')}
          </div>
          <div class="compare-pokemon-abilities">
              <h4>Abilities</h4>
              ${pokemon.abilities.map(ability => 
                  `<span class="ability-item">${ability.ability.name.replace('-', ' ')}</span>`
              ).join('')}
          </div>
      `;
  }
  
  // Update stats comparison chart
  function updateStatsChart() {
      const statsLabels = pokemon1.stats.map(stat => stat.stat.name);
      const stats1 = pokemon1.stats.map(stat => stat.base_stat);
      const stats2 = pokemon2.stats.map(stat => stat.base_stat);
      
      const chartData = {
          labels: statsLabels,
          datasets: [
              {
                  label: pokemon1.name,
                  data: stats1,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              },
              {
                  label: pokemon2.name,
                  data: stats2,
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              }
          ]
      };
      
      const chartOptions = {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          plugins: {
              title: {
                  display: true,
                  text: 'Comparação de Estatísticas',
                  font: {
                      size: 16
                  }
              },
              legend: {
                  position: 'top'
              }
          }
      };
      
      // Destroy previous chart if it exists
      if (statsChart) {
          statsChart.destroy();
      }
      
      // Create new chart
      statsChart = new Chart(statsChartCanvas, {
          type: 'bar',
          data: chartData,
          options: chartOptions
      });
  }
  
  // Initialize comparator
  function initComparator() {
      // Set random Pokémon as suggestions
      const randomIds = [
          Math.floor(Math.random() * 151) + 1,    // Gen 1
          Math.floor(Math.random() * 100) + 152,  // Gen 2
          Math.floor(Math.random() * 135) + 252,  // Gen 3
          Math.floor(Math.random() * 107) + 387,  // Gen 4
          Math.floor(Math.random() * 156) + 494,  // Gen 5
          Math.floor(Math.random() * 72) + 650,   // Gen 6
          Math.floor(Math.random() * 88) + 722,   // Gen 7
          Math.floor(Math.random() * 96) + 810,   // Gen 8
          Math.floor(Math.random() * 120) + 906   // Gen 9
      ];
      
      // Set placeholder text with random Pokémon
      compareInput1.placeholder = `Ex: bulbasaur, ${randomIds[0]}`;
      compareInput2.placeholder = `Ex: charmander, ${randomIds[1]}`;
  }
});