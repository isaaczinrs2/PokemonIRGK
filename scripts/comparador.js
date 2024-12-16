function generateStatsComparisonBars(pokemon1, pokemon2) {
    const stats = ['HP', 'Attack', 'Defense', 'Speed'];
    const statIndexes = [0, 1, 2, 5];
  
    return stats.map((stat, index) => {
      const stat1 = pokemon1.stats[statIndexes[index]].base_stat;
      const stat2 = pokemon2.stats[statIndexes[index]].base_stat;
      const total = stat1 + stat2;
  
      const percentageLeft = (stat1 / total) * 100;
      const percentageRight = (stat2 / total) * 100;
  
 return `
  <div class="stats-comparison-bar">
    <div class="stats-labels">
      <span class="stat-left">${stat1}</span>
      <span class="stat-center">${stat}</span>
      <span class="stat-right">${stat2}</span>
    </div>
    <div class="stats-bar">
      <div class="stats-bar-left" style="width: ${percentageLeft}%"></div>
      <div class="stats-bar-right" style="width: ${percentageRight}%"></div>
    </div>
  </div>
`;
}).join('');
}
  
  async function comparePokemon() {
    const pokemon1 = document.getElementById('pokemon1').value.toLowerCase();
    const pokemon2 = document.getElementById('pokemon2').value.toLowerCase();
    const container = document.getElementById('compare-result');
    container.innerHTML = '';
  
    try {
      const [data1, data2] = await Promise.all([
        fetchPokemonByIdOrName(pokemon1),
        fetchPokemonByIdOrName(pokemon2),
      ]);
  
      const statsComparison = generateStatsComparisonBars(data1, data2);
  
      container.innerHTML = `
        <div class="compare-cards-container">
          <div>${renderPokemonCard(data1)}</div>
          <div class="stats-comparison-container">
            ${statsComparison}
          </div>
          <div>${renderPokemonCard(data2)}</div>
        </div>
      `;
    } catch (e) {
      alert('Erro ao comparar Pokémon');
    }
  }
  
  