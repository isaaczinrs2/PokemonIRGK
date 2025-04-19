// Dados dos líderes de ginásio
console.log('Arquivo gymLeaders.js carregado.');

const gymLeaders = [
    { id: '1', name: 'Brock', city: 'Cidade de Pewter', type: 'Pedra', badge: 'Insígnia da Rocha', image: './imagens/lideres/brock.png' },
    { id: '2', name: 'Misty', city: 'Cidade de Cerulean', type: 'Água', badge: 'Insígnia da Água', image: './imagens/lideres/misty.png' },
    { id: '3', name: 'St. Surge', city: 'Cidade de Vermilion', type: 'Elétrico', badge: 'Insígnia do Trovão', image: './imagens/lideres/stsurge.png' },
    { id: '4', name: 'Erika', city: 'Cidade de Celadon', type: 'Planta', badge: 'Insígnia do Arco-Íris', image: './imagens/lideres/erika.png' },
    { id: '5', name: 'Koga', city: 'Cidade de Fuchsia', type: 'Venenoso', badge: 'Insígnia da Alma', image: './imagens/lideres/koga.png' },
    { id: '6', name: 'Sabrina', city: 'Cidade de Saffron', type: 'Psíquico', badge: 'Insígnia do Pântano', image: './imagens/lideres/sabrina.png' },
    { id: '7', name: 'Blaine', city: 'Ilha Cinnabar', type: 'Fogo', badge: 'Insígnia do Vulcão', image: './imagens/lideres/blaine.png' },
    { id: '8', name: 'Giovanni', city: 'Cidade de Viridian', type: 'Terra', badge: 'Insígnia da Terra', image: './imagens/lideres/giovanni.png' },
    { id: '9', name: 'Morty', city: 'Cidade de Ecruteak', type: 'Fantasma', badge: 'Insígnia da Névoa', image: './imagens/lideres/morty.png' },
    { id: '10', name: 'Chuck', city: 'Cidade de Olivine', type: 'Lutador', badge: 'Insígnia da Força', image: './imagens/lideres/chuck.png' },
    { id: '11', name: 'Jasmine', city: 'Cidade de Olivine', type: 'Metal', badge: 'Insígnia Mineral', image: './imagens/lideres/jasmine.png' },
    { id: '12', name: 'Pryce', city: 'Cidade de Mahogany', type: 'Gelo', badge: 'Insígnia da Geada', image: './imagens/lideres/pryce.png' },
    { id: '13', name: 'Clair', city: 'Cidade de Blackthorn', type: 'Dragão', badge: 'Insígnia do Dragão', image: './imagens/lideres/clair.png' },
    { id: '14', name: 'Roxanne', city: 'Cidade de Rustboro', type: 'Pedra', badge: 'Insígnia da Rocha', image: './imagens/lideres/roxanne.png' },
    { id: '15', name: 'Brawly', city: 'Cidade de Dewford', type: 'Lutador', badge: 'Insígnia do Punho', image: './imagens/lideres/brawly.png' },
    { id: '16', name: 'Wattson', city: 'Cidade de Mauville', type: 'Elétrico', badge: 'Insígnia Dínamo', image: './imagens/lideres/wattson.png' },
    { id: '17', name: 'Flannery', city: 'Cidade de Lavaridge', type: 'Fogo', badge: 'Insígnia Calor', image: './imagens/lideres/flannery.png' },
    { id: '18', name: 'Norman', city: 'Cidade de Petalburg', type: 'Normal', badge: 'Insígnia Balanço', image: './imagens/lideres/norman.png' },
    { id: '19', name: 'Winona', city: 'Cidade de Fortree', type: 'Voador', badge: 'Insígnia Pena', image: './imagens/lideres/winona.png' },
    { id: '20', name: 'Tate & Liza', city: 'Cidade de Mossdeep', type: 'Psíquico', badge: 'Insígnia Mente', image: './imagens/lideres/tate_liza.png' },
    { id: '21', name: 'Falkner', city: 'Cidade de Violet', type: 'Voador', badge: 'Insígnia de Zephyr', image: './imagens/lideres/falkner.png' },
    { id: '22', name: 'Bugsy', city: 'Cidade de Azaléia', type: 'Inseto', badge: 'Insígnia Colmeia', image: './imagens/lideres/bugsy.png' },
    { id: '23', name: 'Whitney', city: 'Cidade de Goldenrod', type: 'Normal', badge: 'Insígnia Planície', image: './imagens/lideres/whitney.png' },
  ];
  

  
  function renderGymLeaders(type = 'Todos') {
    console.log(`Renderizando líderes do tipo: ${type}`);
    const container = document.getElementById('gym-leaders-display');
  
    if (!container) {
      console.error('Container "gym-leaders" não encontrado!');
      return;
    }
  
    container.innerHTML = ''; // Limpa o conteúdo anterior
  
    const filteredLeaders = type === 'Todos'
      ? gymLeaders
      : gymLeaders.filter(leader => leader.type === type);
  
    console.log(`Líderes filtrados (${filteredLeaders.length}):`, filteredLeaders);
  
    if (filteredLeaders.length === 0) {
      container.innerHTML = '<p>Nenhum líder encontrado para este tipo.</p>';
      return;
    }
  
    filteredLeaders.forEach(leader => {
      const leaderCard = document.createElement('div');
      leaderCard.className = 'gym-leader-card';
      leaderCard.innerHTML = `
        <img src="${leader.image}" alt="${leader.name}" class="gym-leader-image">
        <h3>${leader.name}</h3>
        <p>Cidade: ${leader.city}</p>
        <p>Tipo: ${leader.type}</p>
        <p>Insígnia: ${leader.badge}</p>
      `;
      container.appendChild(leaderCard);
    });
  }
  
  document.getElementById('type-filter-gym').addEventListener('change', (event) => {
    console.log(`Tipo selecionado no filtro: ${event.target.value}`);
    renderGymLeaders(event.target.value);
  });
  
  // Inicializa com todos os líderes
  renderGymLeaders();