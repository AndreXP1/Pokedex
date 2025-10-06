async function fetchPoke(id){
    const response = await fetch(`/api/pokemon/${id}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Pokémon data');
    }

    return await response.json();
}


function displayPoke(pokemon, element){
    console.log(pokemon.name)
    element.style.display = "flex";
    element.innerHTML = `
        <div class="pokemon-display">
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
        </div>
        <div class="stats-display">
            <h3>Stats:</h3>
            <ul>
                ${pokemon.stats.map(stat => `
                    <li>
                        <span class="stat-name">${stat.name}</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar" style="width: ${Math.min(stat.value, 100)}%;"></div>
                        </div>
                        <span class="stat-value">${stat.value}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `
}

function displayError(message, element){
    element.innerHTML = `<p style="color: red;">${message}</p>`
}


document.addEventListener('DOMContentLoaded', () => {
    const randButton = document.getElementById('generate-btn');
    const searchInput = document.getElementById('search-input');
    const pokeInfoDiv = document.getElementById('poke-info');

    const getAndShowPokemon = async (identifier) => {
        try {
            const pokemon = await fetchPoke(identifier);
            displayPoke(pokemon, pokeInfoDiv);
        } catch (error) {
            displayError(error.message, pokeInfoDiv);
        }
    };

    randButton.addEventListener('click', () => {
        const randId = Math.floor(Math.random() * 900) + 1;
        getAndShowPokemon(randId);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                getAndShowPokemon(searchTerm);
            }
        }
    });
});