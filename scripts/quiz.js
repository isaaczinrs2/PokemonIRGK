// quiz.js
let pokemon = null;
let guess = '';
let feedback = '';
let feedbackErro = '';

const fetchRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 1415) + 1;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemon = {
      name: data.name,
      image: data.sprites.front_default,
    };
    // Atualizar o DOM
    updateUI();
  } catch (error) {
    console.error('Erro ao buscar Pokémon', error);
  }
};

const updateUI = () => {
  // Atualizar a imagem e limpar campos de feedback
  document.getElementById('pokemon-image').src = pokemon.image;
  document.getElementById('guess-input').value = '';
  document.getElementById('feedback').textContent = feedback;
  document.getElementById('feedback-error').textContent = feedbackErro;
};

const handleGuess = () => {
  const inputGuess = document.getElementById('guess-input').value.trim().toLowerCase();
  if (inputGuess === pokemon.name.toLowerCase()) {
    feedback = 'Parabéns! Você acertou!';
    feedbackErro = '';
    setTimeout(() => {
      fetchRandomPokemon();
    }, 1500);
  } else {
    feedbackErro = 'Tente novamente!';
    feedback = '';
    setTimeout(() => {
      feedbackErro = '';
      updateUI();
    }, 3000);
  }
  updateUI();
};

// Inicializa o quiz ao carregar a página
window.onload = fetchRandomPokemon;
