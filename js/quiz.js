// Pokémon Quiz JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const quizStart = document.getElementById('quiz-start');
  const quizGame = document.getElementById('quiz-game');
  const quizResult = document.getElementById('quiz-result');
  const startQuizBtn = document.getElementById('start-quiz');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const nextQuestionBtn = document.getElementById('next-question');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const progressFill = document.querySelector('.progress-fill');
  const resultScore = document.getElementById('result-score');
  const resultDetails = document.getElementById('result-details');
  const restartQuizBtn = document.getElementById('restart-quiz');
  
  // Quiz variables
  let currentQuestion = 0;
  let score = 0;
  let questions = [];
  let selectedDifficulty = 'easy';
  let selectedCategory = 'general';
  
  // Initialize quiz
  initQuiz();
  
  // Event listeners
  startQuizBtn.addEventListener('click', startQuiz);
  nextQuestionBtn.addEventListener('click', nextQuestion);
  restartQuizBtn.addEventListener('click', restartQuiz);
  
  // Initialize quiz
  function initQuiz() {
      // Set up event listeners for difficulty and category selects
      document.getElementById('quiz-difficulty').addEventListener('change', function() {
          selectedDifficulty = this.value;
      });
      
      document.getElementById('quiz-category').addEventListener('change', function() {
          selectedCategory = this.value;
      });
  }
  
  // Start quiz
  async function startQuiz() {
      // Hide start screen, show game screen
      quizStart.style.display = 'none';
      quizGame.style.display = 'block';
      quizResult.style.display = 'none';
      
      // Reset quiz variables
      currentQuestion = 0;
      score = 0;
      questions = [];
      
      // Generate questions based on difficulty and category
      await generateQuestions();
      
      // Load first question
      loadQuestion();
  }
  
  // Generate quiz questions
  async function generateQuestions() {
      // This is a simplified version - in a real app, you'd have more complex question generation
      try {
          // Get a list of Pokémon for the quiz
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
          const data = await response.json();
          const pokemonList = data.results;
          
          // Generate 10 questions
          for (let i = 0; i < 10; i++) {
              const randomIndex = Math.floor(Math.random() * pokemonList.length);
              const pokemonUrl = pokemonList[randomIndex].url;
              const pokemonResponse = await fetch(pokemonUrl);
              const pokemon = await pokemonResponse.json();
              
              // Create question based on category
              let question;
              let options = [];
              let correctAnswer;
              
              switch (selectedCategory) {
                  case 'general':
                      // Question about Pokémon name or ID
                      if (Math.random() > 0.5) {
                          // "What is the name of Pokémon #X?"
                          question = `Qual é o nome do Pokémon #${pokemon.id}?`;
                          correctAnswer = pokemon.name;
                          
                          // Get 3 other random Pokémon names as wrong options
                          const wrongOptions = [];
                          while (wrongOptions.length < 3) {
                              const wrongIndex = Math.floor(Math.random() * pokemonList.length);
                              const wrongName = pokemonList[wrongIndex].name;
                              if (wrongName !== correctAnswer && !wrongOptions.includes(wrongName)) {
                                  wrongOptions.push(wrongName);
                              }
                          }
                          
                          options = [correctAnswer, ...wrongOptions];
                      } else {
                          // "What is the ID of Pokémon X?"
                          question = `Qual é o número do Pokémon ${pokemon.name}?`;
                          correctAnswer = pokemon.id.toString();
                          
                          // Get 3 other random IDs as wrong options
                          const wrongOptions = [];
                          while (wrongOptions.length < 3) {
                              const wrongId = Math.floor(Math.random() * 898) + 1;
                              if (wrongId !== pokemon.id && !wrongOptions.includes(wrongId.toString())) {
                                  wrongOptions.push(wrongId.toString());
                              }
                          }
                          
                          options = [correctAnswer, ...wrongOptions];
                      }
                      break;
                      
                  case 'types':
                      // Question about Pokémon types
                      const type = pokemon.types[0].type.name;
                      question = `Qual desses tipos é ${pokemon.name}?`;
                      correctAnswer = type;
                      
                      // Get other types as options
                      const allTypes = [
                          'normal', 'fire', 'water', 'electric', 'grass', 'ice',
                          'fighting', 'poison', 'ground', 'flying', 'psychic',
                          'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
                      ];
                      
                      // Remove correct type and shuffle
                      const otherTypes = allTypes.filter(t => t !== type);
                      const shuffledTypes = otherTypes.sort(() => 0.5 - Math.random());
                      options = [type, ...shuffledTypes.slice(0, 3)];
                      break;
                      
                  case 'stats':
                      // Question about Pokémon stats
                      const stat = pokemon.stats[Math.floor(Math.random() * pokemon.stats.length)];
                      question = `Qual é o valor de ${stat.stat.name} base do ${pokemon.name}?`;
                      correctAnswer = stat.base_stat.toString();
                      
                      // Generate similar but wrong stats
                      const base = stat.base_stat;
                      options = [
                          correctAnswer,
                          (base + Math.floor(Math.random() * 20) - 10).toString(),
                          (base + Math.floor(Math.random() * 20) - 10).toString(),
                          (base + Math.floor(Math.random() * 20) - 10).toString()
                      ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
                      
                      // If we ended up with less than 4 options, add some random values
                      while (options.length < 4) {
                          const randomValue = Math.floor(Math.random() * 255).toString();
                          if (!options.includes(randomValue)) {
                              options.push(randomValue);
                          }
                      }
                      break;
                      
                  case 'moves':
                      // Question about Pokémon moves
                      if (pokemon.moves.length === 0) {
                          i--; // Skip this Pokémon if it has no moves
                          continue;
                      }
                      
                      const move = pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)].move;
                      question = `${pokemon.name} pode aprender ${move.name.replace('-', ' ')}?`;
                      correctAnswer = 'Sim';
                      
                      // 50% chance to make the answer "No" with a random Pokémon
                      if (Math.random() > 0.5) {
                          // Find a Pokémon that doesn't have this move
                          let wrongPokemon;
                          do {
                              const wrongIndex = Math.floor(Math.random() * pokemonList.length);
                              wrongPokemon = pokemonList[wrongIndex];
                          } while (wrongPokemon.name === pokemon.name);
                          
                          const wrongResponse = await fetch(wrongPokemon.url);
                          const wrongPokemonData = await wrongResponse.json();
                          
                          // Check if the wrong Pokémon actually doesn't have the move
                          const hasMove = wrongPokemonData.moves.some(m => m.move.name === move.name);
                          if (!hasMove) {
                              question = `${wrongPokemon.name} pode aprender ${move.name.replace('-', ' ')}?`;
                              correctAnswer = 'Não';
                          }
                      }
                      
                      options = ['Sim', 'Não'];
                      break;
              }
              
              // Shuffle options
              options = options.sort(() => 0.5 - Math.random());
              
              // Add question to list
              questions.push({
                  question,
                  options,
                  correctAnswer,
                  pokemonImage: pokemon.sprites.front_default,
                  pokemonName: pokemon.name
              });
          }
          
      } catch (error) {
          console.error('Error generating quiz questions:', error);
          // Fallback questions if API fails
          questions = [
              {
                  question: 'Qual é o nome do Pokémon #25?',
                  options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'],
                  correctAnswer: 'Pikachu',
                  pokemonImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                  pokemonName: 'pikachu'
              },
              {
                  question: 'Qual é o tipo principal do Charizard?',
                  options: ['Fire', 'Water', 'Grass', 'Electric'],
                  correctAnswer: 'Fire',
                  pokemonImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
                  pokemonName: 'charizard'
              }
          ];
      }
  }
  
  // Load current question
  function loadQuestion() {
      if (currentQuestion >= questions.length) {
          showResults();
          return;
      }
      
      const question = questions[currentQuestion];
      
      // Update progress
      quizProgressText.textContent = `Pergunta ${currentQuestion + 1}/${questions.length}`;
      progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
      
      // Set question text
      quizQuestion.innerHTML = `
          <p>${question.question}</p>
          ${question.pokemonImage ? `<img src="${question.pokemonImage}" alt="${question.pokemonName}" class="quiz-pokemon-img">` : ''}
      `;
      
      // Set options
      quizOptions.innerHTML = '';
      question.options.forEach((option, index) => {
          const optionBtn = document.createElement('button');
          optionBtn.className = 'quiz-option';
          optionBtn.textContent = option;
          optionBtn.addEventListener('click', () => selectAnswer(option, question.correctAnswer));
          quizOptions.appendChild(optionBtn);
      });
      
      // Hide next question button
      nextQuestionBtn.style.display = 'none';
  }
  
  // Handle answer selection
  function selectAnswer(selectedAnswer, correctAnswer) {
      // Disable all options
      const optionButtons = quizOptions.querySelectorAll('.quiz-option');
      optionButtons.forEach(btn => {
          btn.disabled = true;
          if (btn.textContent === correctAnswer) {
              btn.classList.add('correct');
          } else if (btn.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
              btn.classList.add('incorrect');
          }
      });
      
      // Update score if correct
      if (selectedAnswer === correctAnswer) {
          score++;
      }
      
      // Show next question button
      nextQuestionBtn.style.display = 'block';
  }
  
  // Go to next question
  function nextQuestion() {
      currentQuestion++;
      loadQuestion();
  }
  
  // Show quiz results
  function showResults() {
      quizGame.style.display = 'none';
      quizResult.style.display = 'block';
      
      // Set score
      resultScore.innerHTML = `Sua pontuação: <span>${score}</span>/10`;
      
      // Set result details
      resultDetails.innerHTML = '';
      questions.forEach((q, i) => {
          const questionResult = document.createElement('div');
          questionResult.className = 'question-result';
          
          const wasCorrect = q.options.find(opt => opt === q.correctAnswer) === 
                           (quizOptions.querySelectorAll('.quiz-option')[i]?.textContent || '');
          
          questionResult.innerHTML = `
              <p><strong>Pergunta ${i + 1}:</strong> ${q.question}</p>
              <p>Resposta correta: ${q.correctAnswer}</p>
              <p class="${wasCorrect ? 'correct-answer' : 'wrong-answer'}">
                  ${wasCorrect ? '✓ Correto' : '✗ Errado'}
              </p>
          `;
          
          resultDetails.appendChild(questionResult);
      });
  }
  
  // Restart quiz
  function restartQuiz() {
      quizResult.style.display = 'none';
      quizStart.style.display = 'block';
  }
});