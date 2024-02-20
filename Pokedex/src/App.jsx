import { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import './App.css'
import { Pokedex } from './Pokedex';
import dataContext from './Context/dataContext';


function App() {
  const [pokedex, setPokedex] = useState([]);
  const [pokemon, setPokemon] = useState({});
  const [sortedBy, setSortedBy] = useState(0);

  useEffect(() => { //faz a chamada da PokeApi
    const getPoke = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
        const data = await axios.all(response.data.results.map(async ({ url }) => {
          const pokeRes = await axios.get(url);

          return pokeRes.data;
        }));

        setPokedex(data);

      } catch (err) {
        console.log(err);
      }

    }
    getPoke();
  }, [sortedBy])



  const pokeContext = useMemo(() => ({
    pokedex, setPokedex,
    pokemon, setPokemon,
    sortedBy, setSortedBy
  }), [pokedex, pokemon, sortedBy]);

  return (
    <dataContext.Provider value={pokeContext}>
      <div className='wrapper'>
        <Pokedex pokedex={pokedex} />
      </div>
    </dataContext.Provider>
  )
}
export default App


