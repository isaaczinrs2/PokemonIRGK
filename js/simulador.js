let playerPokemon, enemyPokemon;
let selectedMove = null;
let playerHp, enemyHp;
let playerMaxHp, enemyMaxHp;

async function fetchPokemonByIdOrName(identifier) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!response.ok) throw new Error('Pokémon não encontrado');
    return response.json();
}

async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1415) + 1; // Geração 1
    return await fetchPokemonByIdOrName(randomId);
}

function calculateDamage(attacker, defender, move) {
    const attackStat = attacker.stats.find(stat => stat.stat.name === "attack").base_stat;
    const defenseStat = defender.stats.find(stat => stat.stat.name === "defense").base_stat;
    const basePower = move.power || 40; // Poder do ataque, usa 40 como padrão se não definido
    const randomFactor = Math.random() * (1.2 - 0.85) + 0.85; // Fator aleatório entre 0.85 e 1.2

    // Fórmula de dano simplificada
    const damage = ((2 * 50 / 5 + 2) * basePower * (attackStat / defenseStat)) / 50 + 2;
    return Math.floor(damage * randomFactor);
}

function updateHpBar(barElement, currentHp, maxHp) {
    const percentage = (currentHp / maxHp) * 100;
    barElement.style.width = `${percentage}%`;
    if (percentage <= 20) {
        barElement.style.backgroundColor = '#ff0000'; // Vermelho quando HP é crítico
    } else if (percentage <= 50) {
        barElement.style.backgroundColor = '#ff9800'; // Laranja para HP baixo
    }
}

function setupBattleLayout(player, enemy) {
    const battleArea = document.getElementById('battle-area');
    battleArea.innerHTML = `
        <div class="enemy-pokemon">
            <img src="${enemy.sprites.front_default}" alt="${enemy.name}">
            <div class="hp-bar"><div id="enemy-hp" class="hp-fill"></div></div>
        </div>
        <div class="player-pokemon">
            <img src="${player.sprites.back_default}" alt="${player.name}">
            <div class="hp-bar"><div id="player-hp" class="hp-fill"></div></div>
        </div>
    `;

    // Inicializar os valores de HP
    playerHp = player.stats[0].base_stat;
    enemyHp = enemy.stats[0].base_stat;
    playerMaxHp = playerHp;
    enemyMaxHp = enemyHp;

    updateHpBar(document.getElementById('player-hp'), playerHp, playerMaxHp);
    updateHpBar(document.getElementById('enemy-hp'), enemyHp, enemyMaxHp);
}

function setupAttackMenu(player) {
    const attackMenu = document.getElementById('attack-menu');
    const attackOptions = document.getElementById('attack-options');

    attackOptions.innerHTML = '';
    player.moves.slice(0, 4).forEach((move) => {
        const moveButton = document.createElement('button');
        moveButton.textContent = `${move.move.name}`;
        moveButton.onclick = () => {
            selectedMove = move.move.url;
            document.getElementById('attack-button').disabled = false;
        };
        attackOptions.appendChild(moveButton);
    });

    attackMenu.style.display = 'block';
}

async function startBattle() {
    const playerPokemonName = document.getElementById('battle-pokemon1').value.toLowerCase();
    const logContainer = document.getElementById('battle-log');
    logContainer.innerHTML = '';

    try {
        playerPokemon = await fetchPokemonByIdOrName(playerPokemonName);
        enemyPokemon = await getRandomPokemon();

        setupBattleLayout(playerPokemon, enemyPokemon);
        setupAttackMenu(playerPokemon);
    } catch (error) {
        logContainer.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
    }
}

async function performAttack() {
    if (!selectedMove) return;

    const moveResponse = await fetch(selectedMove);
    const moveData = await moveResponse.json();

    const damage = calculateDamage(playerPokemon, enemyPokemon, moveData);
    enemyHp = Math.max(0, enemyHp - damage);

    updateHpBar(
        document.getElementById('enemy-hp'),
        enemyHp,
        enemyMaxHp
    );

    const logContainer = document.getElementById('battle-log');
    logContainer.innerHTML += `<p>${playerPokemon.name} usou ${moveData.name} e causou ${damage} de dano!</p>`;

    selectedMove = null;
    document.getElementById('attack-button').disabled = true;

    if (enemyHp <= 0) {
        logContainer.innerHTML += `<p><b>${playerPokemon.name}</b> venceu a batalha!</p>`;
        document.getElementById('attack-menu').style.display = 'none';
        return;
    }

    enemyAttack();
}

async function enemyAttack() {
    const randomMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
    const moveResponse = await fetch(enemyPokemon.moves[randomMoveIndex].move.url);
    const moveData = await moveResponse.json();

    const damage = calculateDamage(enemyPokemon, playerPokemon, moveData);
    playerHp = Math.max(0, playerHp - damage);

    updateHpBar(
        document.getElementById('player-hp'),
        playerHp,
        playerMaxHp
    );

    const logContainer = document.getElementById('battle-log');
    logContainer.innerHTML += `<p>${enemyPokemon.name} usou ${moveData.name} e causou ${damage} de dano!</p>`;

    if (playerHp <= 0) {
        logContainer.innerHTML += `<p><b>${enemyPokemon.name}</b>  venceu a batalha!</p>`;
        document.getElementById('attack-menu').style.display = 'none';
    }
}

