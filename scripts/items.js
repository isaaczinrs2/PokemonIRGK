document.addEventListener('DOMContentLoaded', loadInitialItems);

let itemList = []; // Armazena a lista de itens
const ITEMS_PER_LOAD = 20;

// Função para carregar os itens iniciais
async function loadInitialItems() {
  const container = document.getElementById('item-result');
  container.innerHTML = ''; 
  itemList = await fetchItems(); 
  renderItems(itemList); 
}

// Função para buscar lista de todos os itens
async function fetchItems(offset = 0, limit = ITEMS_PER_LOAD) {
  const response = await fetch(`https://pokeapi.co/api/v2/item?offset=${offset}&limit=${limit}`);
  if (!response.ok) throw new Error('Erro ao buscar itens');
  
  const data = await response.json();
  return data.results;
}


// Função para buscar detalhes de um item
async function fetchItemDetails(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar detalhes do item');
  
  return await response.json();
}

// Função para renderizar itens
async function renderItems(filteredItems) {
  const container = document.getElementById('item-result');
  container.innerHTML = ''; // Limpa a área

  if (filteredItems.length === 0) {
    container.innerHTML = `<p style="color: gray;">Nenhum item encontrado.</p>`;
    return;
  }

  for (const item of filteredItems) {
    const details = await fetchItemDetails(item.url);
    container.innerHTML += renderItemCard(details);
  }
}

// Função para renderizar um card de item
function renderItemCard(item) {
  const sprite = item.sprites.default || '';
  const description = item.effect_entries.length > 0
    ? item.effect_entries[0].short_effect
    : 'Descrição não disponível';

  return `
    <div class="item-card">
      <h3>${capitalizeFirstLetter(item.name)}</h3>
      <img src="${sprite}" alt="${item.name}">
      <p>Descrição: ${description}</p>
    </div>
  `;
}

// Função para filtrar itens
function filterItems() {
  const searchTerm = document.getElementById('search-item').value.trim().toLowerCase();
  
  if (!searchTerm) {
    renderItems(itemList); // Exibe todos os itens se o campo estiver vazio
    return;
  }

  const filteredItems = itemList.filter(item =>
    item.name.toLowerCase().includes(searchTerm)
  );
  renderItems(filteredItems);
}

// Adiciona evento ao campo de busca
document.getElementById('search-item').addEventListener('input', filterItems);

// Função auxiliar para capitalizar a primeira letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadMoreItems() {
  const container = document.getElementById('item-result');
  const currentCount = container.querySelectorAll('.item-card').length;

  try {
    const newItems = await fetchItems(currentCount, ITEMS_PER_LOAD);
    itemList.push(...newItems); // Adiciona os novos itens à lista completa
    for (const item of newItems) {
      const details = await fetchItemDetails(item.url);
      container.innerHTML += renderItemCard(details);
    }
  } catch (e) {
    console.error('Erro ao carregar mais itens:', e);
  }
}


document.getElementById('load-more-item-button').addEventListener('click', loadMoreItems);
