// Pokémon Items JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const itemsGrid = document.getElementById('items-grid');
  const itemsSearch = document.getElementById('items-search');
  const itemsSearchBtn = document.getElementById('items-search-btn');
  const categoryFilter = document.getElementById('item-category-filter');
  const prevPageBtn = document.getElementById('items-prev');
  const nextPageBtn = document.getElementById('items-next');
  const pageInfo = document.getElementById('items-page-info');
  
  // Items variables
  let currentPage = 1;
  const itemsPerPage = 20;
  let totalItems = 0;
  let allItems = [];
  let filteredItems = [];
  let categories = [];
  
  // Initialize items section
  initItems();
  
  // Event listeners
  itemsSearchBtn.addEventListener('click', searchItems);
  itemsSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchItems();
      }
  });
  categoryFilter.addEventListener('change', filterItems);
  prevPageBtn.addEventListener('click', goToPrevPage);
  nextPageBtn.addEventListener('click', goToNextPage);
  
  // Initialize items section
  async function initItems() {
      try {
          // Show loading state
          itemsGrid.innerHTML = '<div class="loader">Carregando...</div>';
          
          // Get total number of items
          const response = await fetch('https://pokeapi.co/api/v2/item?limit=1');
          const data = await response.json();
          totalItems = data.count;
          
          // Load all items (we'll load details as needed)
          const allResponse = await fetch(`https://pokeapi.co/api/v2/item?limit=${totalItems}`);
          const allData = await allResponse.json();
          allItems = allData.results.map((item, index) => ({
              name: item.name,
              url: item.url,
              id: index + 1
          }));
          
          filteredItems = [...allItems];
          
          // Load categories
          await loadItemCategories();
          
          // Load first page
          loadItemsPage(currentPage);
          
      } catch (error) {
          console.error('Error initializing items:', error);
          itemsGrid.innerHTML = '<p>Erro ao carregar itens. Tente recarregar a página.</p>';
      }
  }
  
  // Load item categories
  async function loadItemCategories() {
      try {
          const response = await fetch('https://pokeapi.co/api/v2/item-category/');
          const data = await response.json();
          
          categories = data.results;
          
          // Add categories to filter
          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.name;
              option.textContent = category.name.replace('-', ' ');
              categoryFilter.appendChild(option);
          });
          
      } catch (error) {
          console.error('Error loading item categories:', error);
      }
  }
  
  // Load items for current page
  async function loadItemsPage(page) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
      const pageItems = filteredItems.slice(startIndex, endIndex);
      
      // Show loading state
      itemsGrid.innerHTML = '<div class="loader">Carregando...</div>';
      
      try {
          // Fetch details for all items on this page
          const itemPromises = pageItems.map(item => 
              fetch(item.url).then(response => response.json())
          );
          
          const itemDetails = await Promise.all(itemPromises);
          
          // Display items
          itemsGrid.innerHTML = '';
          itemDetails.forEach(item => {
              itemsGrid.appendChild(createItemCard(item));
          });
          
          // Update pagination controls
          updatePagination();
          
      } catch (error) {
          console.error('Error loading items page:', error);
          itemsGrid.innerHTML = '<p>Erro ao carregar itens. Tente novamente.</p>';
      }
  }
  
  // Create item card element
  function createItemCard(item) {
      const card = document.createElement('div');
      card.className = 'item-card';
      
      // Get English description
      const flavorTextEntries = item.flavor_text_entries?.filter(entry => entry.language.name === 'en');
      const description = flavorTextEntries?.length > 0 
          ? flavorTextEntries[0].text 
          : 'No description available.';
      
      card.innerHTML = `
          <div class="item-img-container">
              <img src="${item.sprites.default}" alt="${item.name}" class="item-img">
          </div>
          <div class="item-info">
              <h3 class="item-name">${item.name.replace('-', ' ')}</h3>
              <p class="item-category">${item.category.name.replace('-', ' ')}</p>
              <p class="item-effect">${description}</p>
          </div>
      `;
      
      return card;
  }
  
  // Update pagination controls
  function updatePagination() {
      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
      
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  }
  
  // Go to previous page
  function goToPrevPage() {
      if (currentPage > 1) {
          currentPage--;
          loadItemsPage(currentPage);
          window.scrollTo(0, 0);
      }
  }
  
  // Go to next page
  function goToNextPage() {
      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          loadItemsPage(currentPage);
          window.scrollTo(0, 0);
      }
  }
  
  // Search items
  function searchItems() {
      const searchTerm = itemsSearch.value.trim().toLowerCase();
      
      if (searchTerm) {
          // Direct search by name
          const foundItem = allItems.find(item => 
              item.name.toLowerCase() === searchTerm.replace(' ', '-') || 
              item.id.toString() === searchTerm
          );
          
          if (foundItem) {
              // In a real app, you might show details for this item
              itemsSearch.value = foundItem.name.replace('-', ' ');
              filterItems();
              return;
          }
      }
      
      // If no direct match, filter the list
      filterItems();
  }
  
  // Filter items based on search and category
  function filterItems() {
      const searchTerm = itemsSearch.value.trim().toLowerCase();
      const categoryFilterValue = categoryFilter.value;
      
      filteredItems = allItems.filter(item => {
          // Filter by search term
          if (searchTerm && 
              !item.name.includes(searchTerm.replace(' ', '-')) && 
              !item.id.toString().includes(searchTerm)) {
              return false;
          }
          
          // Category filter will be applied after loading items
          return true;
      });
      
      // Reset to first page
      currentPage = 1;
      loadItemsPage(currentPage);
      
      // Category filtering is done after loading because we need the item details
      if (categoryFilterValue) {
          filterByCategory(categoryFilterValue);
      }
  }
  
  // Filter items by category (needs to be done after loading)
  async function filterByCategory(category) {
      const itemCards = itemsGrid.querySelectorAll('.item-card');
      
      for (const card of itemCards) {
          const itemName = card.querySelector('.item-name').textContent.replace(' ', '-').toLowerCase();
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName}`);
              const item = await response.json();
              
              const matchesCategory = item.category.name === category;
              card.style.display = matchesCategory ? 'block' : 'none';
              
          } catch (error) {
              console.error('Error checking item category:', error);
              card.style.display = 'none';
          }
      }
      
      // Update pagination for category filter
      updatePagination();
  }
});