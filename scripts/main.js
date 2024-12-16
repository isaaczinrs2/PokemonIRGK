function showSection(section) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    console.log(section);

    const batalha = document.querySelector('#simulador')

    
  if (section == 'simulador') {
      batalha.style.display = 'block'

      console.log(batalha);
      
      const containerBattle = batalha.querySelector('.container-battle')
      containerBattle.style.alignSelf = 'center'
      console.log(containerBattle);
            
  }else{
    batalha.style.display = 'none'
  }
    
  }
  
  