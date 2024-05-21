document.addEventListener('DOMContentLoaded', () => {
    const formationForm = document.getElementById('formation-form');
    const formationSelect = document.getElementById('formation');
    const savedFormationDiv = document.getElementById('saved-formation');
    const formationDisplay = document.getElementById('formation-display');

    const players = {
        goalkeepers: ["Player 1", "Player 2", "Player 3"],
        defenders: ["Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"],
        midfielders: ["Player 12", "Player 13", "Player 14", "Player 15", "Player 16", "Player 17", "Player 18", "Player 19"],
        forwards: ["Player 20", "Player 21", "Player 22", "Player 23", "Player 24", "Player 25"]
    };

    const startingEleven = {
        goalkeepers: [],
        defenders: [],
        midfielders: [],
        forwards: []
    };

    const bench = {
        goalkeepers: [],
        defenders: [],
        midfielders: [],
        forwards: []
    };

    function renderPlayerList() {
        renderPositionList('goalkeepers', players.goalkeepers, startingEleven.goalkeepers);
        renderPositionList('defenders', players.defenders, startingEleven.defenders);
        renderPositionList('midfielders', players.midfielders, startingEleven.midfielders);
        renderPositionList('forwards', players.forwards, startingEleven.forwards);
        renderBench();
    }

    function renderPositionList(position, playerList, selectedPlayers) {
        const positionDiv = document.getElementById(position);
        positionDiv.innerHTML = '';
        playerList.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.textContent = player;
            playerItem.className = 'player-item';
            playerItem.draggable = true;
            playerItem.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', player);
                e.dataTransfer.setData('text/position', position);
            };
            if (selectedPlayers.includes(player)) {
                playerItem.style.backgroundColor = '#d3d3d3';
            }
            positionDiv.appendChild(playerItem);
        });
    }

    function renderBench() {
        renderBenchPosition('bench-goalkeeper', bench.goalkeepers);
        renderBenchPosition('bench-defenders', bench.defenders);
        renderBenchPosition('bench-midfielders', bench.midfielders);
        renderBenchPosition('bench-forwards', bench.forwards);
    }

    function renderBenchPosition(position, playerList) {
        const positionDiv = document.getElementById(position);
        positionDiv.innerHTML = '';
        playerList.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.textContent = player;
            playerItem.className = 'player-item';
            playerItem.draggable = true;
            playerItem.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', player);
                e.dataTransfer.setData('text/position', position);
            };
            positionDiv.appendChild(playerItem);
        });
    }

    function updateFormation() {
        const formation = formationSelect.value;
        if (!formation) return;

        const [defenders, midfielders, forwards] = formation.split('-').map(Number);

        adjustGrid('#defenders-starter', defenders);
        adjustGrid('#midfielders-starter', midfielders);
        adjustGrid('#forwards-starter', forwards);
    }

    function adjustGrid(selector, count) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
        for (let i = 0; i < count; i++) {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item dropzone';
            playerItem.ondragover = (e) => e.preventDefault();
            playerItem.ondrop = (e) => handleDrop(e, selector);
            container.appendChild(playerItem);
        }
    }

    function handleDrop(e, position) {
        e.preventDefault();
        const player = e.dataTransfer.getData('text/plain');
        const fromPosition = e.dataTransfer.getData('text/position');
        const positionKey = getPositionKey(position);
        if (startingEleven[positionKey].includes(player) || fromPosition === positionKey) return;

        if (canAddPlayer(startingEleven[positionKey], positionKey)) {
            const playerIndex = players[fromPosition].indexOf(player);
            if (playerIndex > -1) {
                players[fromPosition].splice(playerIndex, 1);
                players[positionKey].push(player);
                startingEleven[positionKey].push(player);
                const benchIndex = bench[positionKey].indexOf(player);
                if (benchIndex > -1) {
                    bench[positionKey].splice(benchIndex, 1);
                }
            }
            renderPlayerList();
            renderBench();
        } else {
            alert(`Puoi selezionare solo ${maxPlayersInPosition(positionKey)} giocatori per questa posizione.`);
        }
    }

    function canAddPlayer(selectedPlayers, position) {
        return selectedPlayers.length < maxPlayersInPosition(position);
    }

    function maxPlayersInPosition(position) {
        switch (position) {
            case 'goalkeepers': return 1;
            case 'defenders': return 5;
            case 'midfielders': return 5;
            case 'forwards': return 3;
            default: return 0;
        }
    }

    function getPositionKey(position) {
        if (position.includes('goalkeeper')) return 'goalkeepers';
        if (position.includes('defender')) return 'defenders';
        if (position.includes('midfielder')) return 'midfielders';
        if (position.includes('forward')) return 'forwards';
        return '';
    }

    formationSelect.addEventListener('change', updateFormation);

    formationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formation = formationSelect.value;
        if (!formation) {
            alert('Seleziona un modulo prima di salvare la formazione.');
            return;
        }
        if (!isValidFormation(formation)) {
            alert('La formazione selezionata non è valida. Assicurati di avere il numero corretto di giocatori per ogni ruolo.');
            return;
        }
        displaySavedFormation(formation);
    });

    function isValidFormation(formation) {
        const [defenders, midfielders, forwards] = formation.split('-').map(Number);
        return startingEleven.goalkeepers.length === 1 &&
            startingEleven.defenders.length === defenders &&
            startingEleven.midfielders.length === midfielders &&
            startingEleven.forwards.length === forwards;
    }

    function displaySavedFormation(formation) {
        formationDisplay.innerHTML = `
            <h3>Modulo: ${formation}</h3>
            <p>Portieri: ${startingEleven.goalkeepers.join(', ')}</p>
            <p>Difensori: ${startingEleven.defenders.join(', ')}</p>
            <p>Centrocampisti: ${startingEleven.midfielders.join(', ')}</p>
            <p>Attaccanti: ${startingEleven.forwards.join(', ')}</p>
            <p>Panchina Portiere: ${bench.goalkeepers.join(', ')}</p>
            <p>Panchina Difensori: ${bench.defenders.join(', ')}</p>
            <p>Panchina Centrocampisti: ${bench.midfielders.join(', ')}</p>
            <p>Panchina Attaccanti: ${bench.forwards.join(', ')}</p>
        `;
        savedFormationDiv.style.display = 'block';
    }

    document.getElementById('reset').addEventListener('click', () => {
        formationSelect.value = '';
        savedFormationDiv.style.display = 'none';
        startingEleven.goalkeepers = [];
        startingEleven.defenders = [];
        startingEleven.midfielders = [];
        startingEleven.forwards = [];
        bench.goalkeepers = [];
        bench.defenders = [];
        bench.midfielders = [];
        bench.forwards = [];
        updateFormation();
        renderPlayerList();
        renderBench();
    });

    renderPlayerList();
});
