document.addEventListener('DOMContentLoaded', () => {
  loadInitialAttacks();

  // Adicionar listener ao botão "Carregar mais"
  const loadMoreButton = document.getElementById('load-more-attack-button');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadMoreAttacks);
  }
});

async function loadInitialAttacks() {
  const container = document.getElementById('attack-result');
  
  try {
    for (let i = 1; i <= 20; i++) {
      const data = await fetchAttackById(i);
      container.innerHTML += renderAttackCard(data);
    }
  } catch (e) {
    console.error('Erro ao carregar ataques iniciais:', e);
    container.innerHTML = '<p style="color: red;">Erro ao carregar ataques iniciais.</p>';
  }
}

async function loadMoreAttacks() {
  const container = document.getElementById('attack-result');
  const currentCount = container.querySelectorAll('.pokemon-card').length;

  try {
    for (let i = currentCount + 1; i <= currentCount + 20; i++) {
      const data = await fetchAttackById(i);
      container.innerHTML += renderAttackCard(data);
    }
  } catch (e) {
    console.error('Erro ao carregar mais ataques:', e);
  }
}

async function searchAttack() {
  const input = document.getElementById('search-attack').value.trim().toLowerCase();
  const container = document.getElementById('attack-result');
  container.innerHTML = '';
  try {
    const data = await fetchAttackByName(input);
    container.innerHTML = renderAttackCard(data);
  } catch (e) {
    console.error('Erro ao buscar ataque:', e);
    container.innerHTML = '<p style="color: red;">Ataque não encontrado.</p>';
  }
}

async function fetchAttackById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
  if (!response.ok) throw new Error(`Erro ao buscar ataque com ID ${id}`);
  return response.json();
}

async function fetchAttackByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${name}`);
  if (!response.ok) throw new Error(`Erro ao buscar ataque com nome ${name}`);
  return response.json();
}

function renderAttackCard(attack) {
  return `
    <div class="pokemon-card">
      <h3>${attack.name.toUpperCase()}</h3>
      <p>Tipo: ${attack.type.name}</p>
      <p>Poder: ${attack.power || 'N/A'}</p>
      <p>Precisão: ${attack.accuracy || 'N/A'}</p>
      <p>PP: ${attack.pp}</p>
      <p>Classe: ${attack.damage_class.name}</p>
    </div>
  `;
}
