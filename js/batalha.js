// Battle Simulator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const pokemon1Input = document.querySelector('.selector1 .pokemon-select-input');
    const pokemon2Input = document.querySelector('.selector2 .pokemon-select-input');
    const suggestions1 = document.querySelector('.selector1 .pokemon-suggestions');
    const suggestions2 = document.querySelector('.selector2 .pokemon-suggestions');
    const startBattleBtn = document.getElementById('start-battle');
    const battleLog = document.getElementById('battle-log');
    const pokemon1Sprite = document.querySelector('.pokemon1 .pokemon-sprite');
    const pokemon2Sprite = document.querySelector('.pokemon2 .pokemon-sprite');
    const pokemon1Name = document.querySelector('.pokemon1 .pokemon-name');
    const pokemon2Name = document.querySelector('.pokemon2 .pokemon-name');
    const pokemon1Health = document.querySelector('.pokemon1 .health-fill');
    const pokemon2Health = document.querySelector('.pokemon2 .health-fill');
    const pokemon1HealthText = document.querySelector('.pokemon1 .health-text');
    const pokemon2HealthText = document.querySelector('.pokemon2 .health-text');
    
    // Battle variables
    let pokemon1 = null;
    let pokemon2 = null;
    let battleInProgress = false;
    
    // Initialize battle simulator
    initBattleSimulator();
    
    // Event listeners
    pokemon1Input.addEventListener('input', () => handlePokemonInput(pokemon1Input, suggestions1));
    pokemon2Input.addEventListener('input', () => handlePokemonInput(pokemon2Input, suggestions2));
    startBattleBtn.addEventListener('click', startBattle);
    
    // Handle Pokémon input for suggestions
    async function handlePokemonInput(inputElement, suggestionsElement) {
        const searchTerm = inputElement.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            suggestionsElement.style.display = 'none';
            return;
        }
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
            const data = await response.json();
            
            const matches = data.results.filter(pokemon => 
                pokemon.name.includes(searchTerm)
            ).slice(0, 5);
            
            if (matches.length > 0) {
                suggestionsElement.innerHTML = '';
                matches.forEach(pokemon => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = pokemon.name;
                    suggestionItem.addEventListener('click', () => {
                        inputElement.value = pokemon.name;
                        suggestionsElement.style.display = 'none';
                        selectPokemon(pokemon.url, inputElement === pokemon1Input ? 1 : 2);
                    });
                    suggestionsElement.appendChild(suggestionItem);
                });
                suggestionsElement.style.display = 'block';
            } else {
                suggestionsElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching Pokémon suggestions:', error);
        }
    }
    
    // Select Pokémon for battle
    async function selectPokemon(pokemonUrl, position) {
        try {
            const response = await fetch(pokemonUrl);
            const pokemon = await response.json();
            
            if (position === 1) {
                pokemon1 = pokemon;
                updatePokemonDisplay(pokemon, 1);
            } else {
                pokemon2 = pokemon;
                updatePokemonDisplay(pokemon, 2);
            }
            
            // Enable battle button if both Pokémon are selected
            if (pokemon1 && pokemon2) {
                startBattleBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error selecting Pokémon:', error);
            addBattleMessage(`Erro ao carregar Pokémon. Tente novamente.`);
        }
    }
    
    // Update Pokémon display in battle arena
    function updatePokemonDisplay(pokemon, position) {
        const spriteElement = position === 1 ? pokemon1Sprite : pokemon2Sprite;
        const nameElement = position === 1 ? pokemon1Name : pokemon2Name;
        const healthElement = position === 1 ? pokemon1Health : pokemon2Health;
        const healthTextElement = position === 1 ? pokemon1HealthText : pokemon2HealthText;
        
        spriteElement.style.backgroundImage = `url(${pokemon.sprites.front_default})`;
        nameElement.textContent = pokemon.name;
        healthElement.style.width = '100%';
        healthTextElement.textContent = 'HP: 100%';
        
        // Add animation
        spriteElement.classList.add('fade-in');
        setTimeout(() => {
            spriteElement.classList.remove('fade-in');
        }, 500);
    }
    
    // Start battle
    function startBattle() {
        if (battleInProgress || !pokemon1 || !pokemon2) return;
        
        battleInProgress = true;
        startBattleBtn.disabled = true;
        battleLog.innerHTML = '';
        
        // Reset health displays
        pokemon1Health.style.width = '100%';
        pokemon2Health.style.width = '100%';
        pokemon1HealthText.textContent = 'HP: 100%';
        pokemon2HealthText.textContent = 'HP: 100%';
        
        addBattleMessage(`A batalha começa entre ${pokemon1.name} e ${pokemon2.name}!`);
        
        // Determine who attacks first (based on speed)
        const pokemon1Speed = pokemon1.stats.find(stat => stat.stat.name === 'speed').base_stat;
        const pokemon2Speed = pokemon2.stats.find(stat => stat.stat.name === 'speed').base_stat;
        
        let firstAttacker, secondAttacker;
        if (pokemon1Speed >= pokemon2Speed) {
            firstAttacker = { pokemon: pokemon1, position: 1 };
            secondAttacker = { pokemon: pokemon2, position: 2 };
        } else {
            firstAttacker = { pokemon: pokemon2, position: 2 };
            secondAttacker = { pokemon: pokemon1, position: 1 };
        }
        
        addBattleMessage(`${firstAttacker.pokemon.name} é mais rápido e ataca primeiro!`);
        
        // Start battle rounds
        battleRound(firstAttacker, secondAttacker);
    }
    
    // Battle round
    function battleRound(attacker, defender) {
        if (!battleInProgress) return;
        
        // Attacker selects a random move
        const moves = attacker.pokemon.moves.filter(move => move.version_group_details[0].level_learned_at > 0);
        if (moves.length === 0) {
            addBattleMessage(`${attacker.pokemon.name} não tem movimentos para usar!`);
            setTimeout(() => battleRound(defender, attacker), 1500);
            return;
        }
        
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const moveName = randomMove.move.name.replace('-', ' ');
        
        addBattleMessage(`${attacker.pokemon.name} usou ${moveName}!`);
        
        // Animate attack
        const attackerSprite = attacker.position === 1 ? pokemon1Sprite : pokemon2Sprite;
        attackerSprite.classList.add('attack-animation');
        
        setTimeout(() => {
            attackerSprite.classList.remove('attack-animation');
            
            // Calculate damage (simplified)
            const attackStat = attacker.pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
            const defenseStat = defender.pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;
            
            // Simple damage calculation (this could be much more complex with types, etc.)
            let damage = Math.max(1, Math.floor((attackStat / defenseStat) * 20));
            
            // Random variation
            damage = Math.floor(damage * (0.8 + Math.random() * 0.4));
            
            // Apply damage
            applyDamage(defender.position, damage);
            
            // Check if battle is over
            setTimeout(() => {
                const defenderHealth = defender.position === 1 ? 
                    parseInt(pokemon1Health.style.width) : 
                    parseInt(pokemon2Health.style.width);
                
                if (defenderHealth <= 0) {
                    battleInProgress = false;
                    addBattleMessage(`${defender.pokemon.name} foi derrotado!`);
                    addBattleMessage(`${attacker.pokemon.name} venceu a batalha!`, 'victory');
                    startBattleBtn.disabled = false;
                    return;
                }
                
                // Next round
                setTimeout(() => battleRound(defender, attacker), 1500);
            }, 500);
        }, 300);
    }
    
    // Apply damage to Pokémon
    function applyDamage(position, damage) {
        const healthElement = position === 1 ? pokemon1Health : pokemon2Health;
        const healthTextElement = position === 1 ? pokemon1HealthText : pokemon2HealthText;
        const spriteElement = position === 1 ? pokemon1Sprite : pokemon2Sprite;
        
        let currentHealth = parseInt(healthElement.style.width);
        currentHealth = Math.max(0, currentHealth - damage);
        healthElement.style.width = `${currentHealth}%`;
        healthTextElement.textContent = `HP: ${currentHealth}%`;
        
        // Damage animation
        spriteElement.classList.add('damage-animation');
        setTimeout(() => {
            spriteElement.classList.remove('damage-animation');
        }, 300);
        
        // Color health bar based on remaining health
        if (currentHealth < 20) {
            healthElement.style.backgroundColor = '#f44336'; // Red
        } else if (currentHealth < 50) {
            healthElement.style.backgroundColor = '#ff9800'; // Orange
        } else {
            healthElement.style.backgroundColor = '#4CAF50'; // Green
        }
    }
    
    // Add message to battle log
    function addBattleMessage(message, className = '') {
        const messageElement = document.createElement('div');
        messageElement.className = `battle-message ${className}`;
        messageElement.textContent = message;
        battleLog.appendChild(messageElement);
        battleLog.scrollTop = battleLog.scrollHeight;
    }
    
    // Initialize battle simulator
    function initBattleSimulator() {
        // Set random Pokémon as suggestions
        const randomIds = [
            Math.floor(Math.random() * 151) + 1,    // Gen 1
            Math.floor(Math.random() * 100) + 152,  // Gen 2
            Math.floor(Math.random() * 135) + 252,  // Gen 3
            Math.floor(Math.random() * 107) + 387,  // Gen 4
            Math.floor(Math.random() * 156) + 494,  // Gen 5
            Math.floor(Math.random() * 72) + 650,   // Gen 6
            Math.floor(Math.random() * 88) + 722,   // Gen 7
            Math.floor(Math.random() * 96) + 810,   // Gen 8
            Math.floor(Math.random() * 120) + 906   // Gen 9
        ];
        
        // Set placeholder text with random Pokémon
        pokemon1Input.placeholder = `Ex: bulbasaur`;
        pokemon2Input.placeholder = `Ex: charmander`;
        
        // Disable battle button initially
        startBattleBtn.disabled = true;
    }
});