// Pokédex JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Pokédex variables
  let currentPage = 1;
  const pokemonPerPage = 20;
  let totalPokemon = 0;
  let allPokemon = [];
  let filteredPokemon = [];
  
  // DOM elements
  const pokedexGrid = document.getElementById('pokedex-grid');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const pokedexSearch = document.getElementById('pokedex-search');
  const pokedexSearchBtn = document.getElementById('pokedex-search-btn');
  const typeFilter = document.getElementById('type-filter');
  const generationFilter = document.getElementById('generation-filter');
  
  // Initialize Pokédex
  initPokedex();
  
  // Event listeners
  prevPageBtn.addEventListener('click', goToPrevPage);
  nextPageBtn.addEventListener('click', goToNextPage);
  pokedexSearchBtn.addEventListener('click', searchPokedex);
  pokedexSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchPokedex();
      }
  });
  typeFilter.addEventListener('change', filterPokemon);
  generationFilter.addEventListener('change', filterPokemon);
  
  // Initialize Pokédex
  async function initPokedex() {
      try {
          // Show loading state
          pokedexGrid.innerHTML = '<div class="loader">Carregando...</div>';
          
          // Get total number of Pokémon
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
          const data = await response.json();
          totalPokemon = data.count;
          
          // Load all Pokémon names and URLs (we'll load details as needed)
          const allResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`);
          const allData = await allResponse.json();
          allPokemon = allData.results.map((pokemon, index) => ({
              name: pokemon.name,
              url: pokemon.url,
              id: index + 1
          }));
          
          filteredPokemon = [...allPokemon];
          
          // Load first page
          loadPokemonPage(currentPage);
          
      } catch (error) {
          console.error('Error initializing Pokédex:', error);
          pokedexGrid.innerHTML = '<p>Erro ao carregar Pokédex. Tente recarregar a página.</p>';
      }
  }
  
  // Load Pokémon for current page
  async function loadPokemonPage(page) {
      const startIndex = (page - 1) * pokemonPerPage;
      const endIndex = Math.min(startIndex + pokemonPerPage, filteredPokemon.length);
      const pagePokemon = filteredPokemon.slice(startIndex, endIndex);
      
      // Show loading state
      pokedexGrid.innerHTML = '<div class="loader">Carregando...</div>';
      
      try {
          // Fetch details for all Pokémon on this page
          const pokemonPromises = pagePokemon.map(pokemon => 
              fetch(pokemon.url).then(response => response.json())
          );
          
          const pokemonDetails = await Promise.all(pokemonPromises);
          
          // Display Pokémon
          pokedexGrid.innerHTML = '';
          pokemonDetails.forEach(pokemon => {
              pokedexGrid.appendChild(createPokemonCard(pokemon));
          });
          
          // Update pagination controls
          updatePagination();
          
      } catch (error) {
          console.error('Error loading Pokémon page:', error);
          pokedexGrid.innerHTML = '<p>Erro ao carregar Pokémon. Tente novamente.</p>';
      }
  }
  
  // Update pagination controls
  function updatePagination() {
      const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
      
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
      
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  }
  
  // Go to previous page
  function goToPrevPage() {
      if (currentPage > 1) {
          currentPage--;
          loadPokemonPage(currentPage);
          window.scrollTo(0, 0);
      }
  }
  
  // Go to next page
  function goToNextPage() {
      const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          loadPokemonPage(currentPage);
          window.scrollTo(0, 0);
      }
  }
  
  // Search Pokédex
  function searchPokedex() {
      const searchTerm = pokedexSearch.value.trim().toLowerCase();
      
      if (searchTerm) {
          // Direct search by ID or name
          const foundPokemon = allPokemon.find(pokemon => 
              pokemon.name.toLowerCase() === searchTerm || 
              pokemon.id.toString() === searchTerm
          );
          
          if (foundPokemon) {
              showPokemonDetails(foundPokemon.id);
              return;
          }
      }
      
      // If no direct match, filter the list
      filterPokemon();
  }
  
  // Filter Pokémon based on search and filters
  function filterPokemon() {
      const searchTerm = pokedexSearch.value.trim().toLowerCase();
      const typeFilterValue = typeFilter.value;
      const generationFilterValue = generationFilter.value;
      
      filteredPokemon = allPokemon.filter(pokemon => {
          // Filter by search term
          if (searchTerm && 
              !pokemon.name.includes(searchTerm) && 
              !pokemon.id.toString().includes(searchTerm)) {
              return false;
          }
          
          // Filter by generation
          if (generationFilterValue) {
              const genRanges = {
                  '1': { min: 1, max: 151 },
                  '2': { min: 152, max: 251 },
                  '3': { min: 252, max: 386 },
                  '4': { min: 387, max: 493 },
                  '5': { min: 494, max: 649 },
                  '6': { min: 650, max: 721 },
                  '7': { min: 722, max: 809 },
                  '8': { min: 810, max: 905 },
                  '9': { min: 906, max: 1025 }
              };
              
              const range = genRanges[generationFilterValue];
              if (pokemon.id < range.min || pokemon.id > range.max) {
                  return false;
              }
          }
          
          return true;
      });
      
      // Reset to first page
      currentPage = 1;
      loadPokemonPage(currentPage);
      
      // Type filtering is done after loading because we need the Pokémon details
      if (typeFilterValue) {
          filterByType(typeFilterValue);
      }
  }
  
  // Filter Pokémon by type (needs to be done after loading)
  async function filterByType(type) {
      const pokemonCards = pokedexGrid.querySelectorAll('.pokemon-card');
      
      for (const card of pokemonCards) {
          const pokemonId = card.dataset.id;
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
              const pokemon = await response.json();
              
              const hasType = pokemon.types.some(t => t.type.name === type);
              card.style.display = hasType ? 'block' : 'none';
              
          } catch (error) {
              console.error('Error checking Pokémon type:', error);
              card.style.display = 'none';
          }
      }
      
      // Update pagination for type filter
      updatePagination();
  }
});