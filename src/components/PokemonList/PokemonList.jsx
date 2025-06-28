import { useEffect, useState } from 'react'
import axios from 'axios'
import './PokemonList.css'
import Pokemon from '../Pokemon/Pokemon'

function PokemonList () {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon'

    useEffect( () => {
        async function downloadPokemons () {
            const response = await axios.get(POKEDEX_URL) // this downloads list of 20 pokemons
            // console.log(response.data);
            const pokemonResults = response.data.results; // we get the array of pokemons from result
            console.log(response.data);
            
            // iterating over the array of pokemons, and using teir url to create an array of promises
            // that will download those 20 pokemons
            const pokemonRsultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url)) 

            // passing that promise array to axios.all
            const pokeonData = await axios.all(pokemonRsultPromise) // array of 20 pokemon detailed data
            
            console.log(pokeonData);

            // now iterate on the data of each pokemon, and extract id, name, image, types
           const pokeListResult =  pokeonData.map((pokeData) => {
                const pokemon = pokeData.data;
                return {
                    id: pokemon.id,
                    name: pokemon.name, 
                    image: pokemon.sprites.other.dream_world.front_default, 
                    types: pokemon.types
                    }
            })
            console.log(pokeListResult);
            setPokemonList(pokeListResult);
            setIsLoading(false);
            
    
        }
        downloadPokemons () 
        
    },[])

    
    return (
       <div className='pokemon-list-wrapper'>
            <div className='pokemon-wrapper'>
           {(isLoading) ? 'Loading...' :
            pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id}/>)
           }
           </div>
           <div className='controls'>
            <button>Previous</button>
            <button>Next</button>
           </div>
       </div>
    )
}

export default PokemonList;