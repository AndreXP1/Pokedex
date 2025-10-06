import express from 'express';
import path from 'path';
import Pokedex from 'pokedex-promise-v2';
import { fileURLToPath } from 'url';


const app = express();
const P = new Pokedex();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/pokemon/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier.toLowerCase();
        let pokemon;

        if (!isNaN(parseInt(identifier))) {
            pokemon = await P.getPokemonByName(parseInt(identifier));
        } else {
            pokemon = await P.getPokemonByName(identifier);
        }

        const pokeData = {
            name: pokemon.name,
            id: pokemon.id,
            sprite: pokemon.sprites.front_default,
            stats: pokemon.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            }))
        };

        res.json(pokeData);
    } catch (error) {
        res.status(404).json({ error: 'Pokémon não encontrado!' });
    }
});

app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
})

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})