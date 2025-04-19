// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading screen after content is loaded
  setTimeout(() => {
      document.querySelector('.loading-screen').style.opacity = '0';
      setTimeout(() => {
          document.querySelector('.loading-screen').style.display = 'none';
      }, 500);
  }, 1000);

  // Navigation functionality
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Handle navigation clicks
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all links and sections
          navLinks.forEach(l => l.classList.remove('active'));
          sections.forEach(s => s.classList.remove('active'));
          
          // Add active class to clicked link and corresponding section
          this.classList.add('active');
          const sectionId = this.getAttribute('href');
          document.querySelector(sectionId).classList.add('active');
          
          // Close mobile menu if open
          navMenu.classList.remove('active');
          
          // Scroll to top of the section
          window.scrollTo(0, 0);
      });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
  });

  // Load featured Pokémon on home page
  if (document.querySelector('#home.active')) {
      loadFeaturedPokemon();
  }

  // Home search functionality
  // Home search functionality
const homeSearchBtn = document.getElementById('search-btn-home');
const homeSearchInput = document.getElementById('search-home');

homeSearchBtn.addEventListener('click', () => searchPokemon(homeSearchInput.value));
homeSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPokemon(this.value);
    }
});

// Função searchPokemon atualizada
async function searchPokemon(searchTerm = '') {
    searchTerm = String(searchTerm || '').trim();
    if (!searchTerm) return;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
        const pokemon = await response.json();
        showPokemonDetails(pokemon.id);
    } catch (error) {
        console.error('Error searching Pokémon:', error);
        // Vai para a Pokédex se não encontrar
        document.querySelector('.nav-link.active').classList.remove('active');
        document.querySelector('.section.active').classList.remove('active');
        
        document.querySelector('a[href="#pokedex"]').classList.add('active');
        document.querySelector('#pokedex').classList.add('active');
        
        const pokedexSearch = document.getElementById('pokedex-search');
        pokedexSearch.value = searchTerm;
        searchPokedex(searchTerm);
    }
}

  // Load Pokémon types for filters
  loadPokemonTypes();
  
  // Load generations for filters
  loadGenerations();
});

// Load featured Pokémon for home page
async function loadFeaturedPokemon() {
  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = '<div class="loader">Carregando...</div>';
  
  try {
      // Get random Pokémon (6 from first gen, 6 from recent gens)
      const featuredIds = [
          // Classic favorites
          1, 4, 7, 25, 39, 133,
          // Recent popular
          722, 808, 810, 813, 835, 848
      ];
      
      const pokemonPromises = featuredIds.map(id => 
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
              .then(response => response.json())
      );
      
      const pokemonList = await Promise.all(pokemonPromises);
      
      featuredGrid.innerHTML = '';
      pokemonList.forEach(pokemon => {
          featuredGrid.appendChild(createPokemonCard(pokemon));
      });
  } catch (error) {
      console.error('Error loading featured Pokémon:', error);
      featuredGrid.innerHTML = '<p>Erro ao carregar Pokémon. Tente recarregar a página.</p>';
  }
}

// Create Pokémon card element
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.dataset.id = pokemon.id;
  
  const types = pokemon.types.map(type => type.type.name).join(' ');
  
  card.innerHTML = `
      <div class="pokemon-img-container">
          <span class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</span>
          <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
               alt="${pokemon.name}" class="pokemon-img">
      </div>
      <div class="pokemon-info">
          <h3 class="pokemon-name">${pokemon.name}</h3>
          <div class="pokemon-types">
              ${pokemon.types.map(type => 
                  `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
              ).join('')}
          </div>
      </div>
  `;
  
  card.addEventListener('click', () => showPokemonDetails(pokemon.id));
  
  return card;
}

// Show Pokémon details modal
async function showPokemonDetails(pokemonId) {
  const modal = document.getElementById('pokemon-modal');
  const modalBody = document.getElementById('modal-body');
  
  modal.style.display = 'block';
  modalBody.innerHTML = '<div class="loader">Carregando...</div>';
  
  try {
      // Get Pokémon data
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemon = await pokemonResponse.json();
      
      // Get species data for evolution chain and flavor text
      const speciesResponse = await fetch(pokemon.species.url);
      const species = await speciesResponse.json();
      
      // Get evolution chain data
      const evolutionResponse = await fetch(species.evolution_chain.url);
      const evolutionChain = await evolutionResponse.json();
      
      // Process evolution chain
      const evolutionData = processEvolutionChain(evolutionChain.chain);
      
      // Get English flavor text
      const flavorTextEntries = species.flavor_text_entries.filter(entry => entry.language.name === 'en');
      const flavorText = flavorTextEntries.length > 0 
          ? flavorTextEntries[0].flavor_text 
          : 'No description available.';
      
      // Create modal content
      modalBody.innerHTML = `
          <div class="pokemon-detail-header">
              <div class="pokemon-detail-img">
                  <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                       alt="${pokemon.name}">
              </div>
              <div class="pokemon-detail-info">
                  <h1 class="pokemon-detail-name">${pokemon.name}</h1>
                  <p class="pokemon-detail-id">#${pokemon.id.toString().padStart(3, '0')}</p>
                  <div class="pokemon-detail-types">
                      ${pokemon.types.map(type => 
                          `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
                      ).join('')}
                  </div>
                  
                  <div class="pokemon-detail-stats">
                      <h3>Base Stats</h3>
                      ${pokemon.stats.map(stat => `
                          <div class="stat-item">
                              <span class="stat-name">${stat.stat.name}</span>
                              <div class="stat-bar-container">
                                  <div class="stat-bar" style="width: ${Math.min(100, stat.base_stat)}%;"></div>
                              </div>
                              <span class="stat-value">${stat.base_stat}</span>
                          </div>
                      `).join('')}
                  </div>
                  
                  <div class="pokemon-detail-abilities">
                      <h3>Abilities</h3>
                      ${pokemon.abilities.map(ability => 
                          `<span class="ability-item">${ability.ability.name.replace('-', ' ')}</span>`
                      ).join('')}
                  </div>
              </div>
          </div>
          
          <div class="pokemon-detail-description">
              <h3>Description</h3>
              <p>${flavorText}</p>
          </div>
          
          ${evolutionData.length > 1 ? `
          <div class="pokemon-detail-evolution">
              <h3>Evolution Chain</h3>
              <div class="evolution-chain">
                  ${evolutionData.map(pkm => `
                      <div class="evolution-item">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pkm.id}.png" 
                               alt="${pkm.name}" width="80">
                          <p>${pkm.name}</p>
                          ${pkm.trigger ? `<small>${pkm.trigger}</small>` : ''}
                      </div>
                  `).join('')}
              </div>
          </div>
          ` : ''}
          
          <div class="pokemon-detail-moves">
              <h3>Moves</h3>
              <div class="moves-list">
                  ${pokemon.moves.slice(0, 20).map(move => 
                      `<span class="move-item">${move.move.name.replace('-', ' ')}</span>`
                  ).join('')}
                  ${pokemon.moves.length > 20 ? '<span class="move-item">...</span>' : ''}
              </div>
          </div>
      `;
      
      // Add animation to modal content
      modalBody.classList.add('fade-in');
      
  } catch (error) {
      console.error('Error loading Pokémon details:', error);
      modalBody.innerHTML = '<p>Erro ao carregar detalhes do Pokémon. Tente novamente.</p>';
  }
  
  // Close modal when clicking X
  document.querySelector('.close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });
}

// Process evolution chain data
function processEvolutionChain(chain) {
  const result = [];
  
  function processChain(link, trigger = null) {
      const id = link.species.url.split('/').slice(-2, -1)[0];
      result.push({
          id: parseInt(id),
          name: link.species.name,
          trigger: trigger
      });
      
      if (link.evolves_to.length > 0) {
          const nextTrigger = link.evolves_to[0].evolution_details[0].trigger.name;
          processChain(link.evolves_to[0], nextTrigger);
      }
  }
  
  processChain(chain);
  return result;
}

// Load Pokémon types for filters
async function loadPokemonTypes() {
  try {
      const response = await fetch('https://pokeapi.co/api/v2/type/');
      const data = await response.json();
      
      const typeFilter = document.getElementById('type-filter');
      data.results.forEach(type => {
          if (!['unknown', 'shadow'].includes(type.name)) {
              const option = document.createElement('option');
              option.value = type.name;
              option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
              typeFilter.appendChild(option);
          }
      });
  } catch (error) {
      console.error('Error loading Pokémon types:', error);
  }
}

// Load generations for filters
async function loadGenerations() {
  try {
      const response = await fetch('https://pokeapi.co/api/v2/generation/');
      const data = await response.json();
      
      const genFilter = document.getElementById('generation-filter');
      data.results.forEach(gen => {
          const genNumber = gen.url.split('/').slice(-2, -1)[0];
          const option = document.createElement('option');
          option.value = genNumber;
          option.textContent = `Geração ${genNumber}`;
          genFilter.appendChild(option);
      });
  } catch (error) {
      console.error('Error loading generations:', error);
  }
}


window.addEventListener('resize', function() {
    // Redimensiona gráficos se existirem
    if (typeof baseStatsChart !== 'undefined' && baseStatsChart) {
        baseStatsChart.resize();
    }
    if (typeof typeEffectivenessChart !== 'undefined' && typeEffectivenessChart) {
        typeEffectivenessChart.resize();
    }
    if (typeof statsChart !== 'undefined' && statsChart) { 
        statsChart.resize();
    }
});