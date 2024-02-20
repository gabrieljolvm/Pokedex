import { useContext, useEffect, useState } from "react"
import styles from "./Pokemon.module.css"
import PokeChart from "../../Components/PokeChart"
import axios from "axios";
import dataContext from "../../Context/dataContext";



export default function Pokemon() {

    const [pokeMoves, setPokeMoves] = useState([]);
    const [checkDesc, setCheckDesc] = useState(-1);
    const [moveDesc, setMoveDesc] = useState('');
    const { pokemon } = useContext(dataContext);

    useEffect(() => { //faz a chamada na PokeApi para ter acesso aos movimentos do Pokemon.
        const abilities = pokemon.abilities.map(async ({ ability }) => {
            const response = await axios.get(ability.url);
            return response.data
        })

        const getMoves = async () => {
            try {
                const moves = await axios.all(abilities);
                setPokeMoves(moves);
            } catch (err) {
                console.log(err);
            }
        }
        getMoves();

    }, [])



    useEffect(() => { //Busca a descrição dos efeitos do movimento na lingua inglesa (possui outras linguas).

        const data = pokeMoves.map(({ effect_entries }) => {
            return effect_entries;
        })

        setMoveDesc(data.map(el =>
            el.filter(({ language, short_effect }) =>
                language.name === "en" && short_effect)).flatMap(item =>
                    item.map(({ short_effect }) => short_effect))
        )

    }, [checkDesc])

    return (
        <>
            <div className={styles["poke-info"]}>
                <div className={styles.wrapper}>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <span>{pokemon.name}</span>
                </div>
                <div className={styles.wrapper}>
                    <span className={styles.type}>Type:</span>
                    {pokemon.types.map(({ type }, ind) => (
                        <span key={`type_${ind}`}
                            className={styles["poke-type"]}>{type.name.toUpperCase()}</span>
                    ))}
                </div>
            </div>
            <div className={styles["poke-chart"]}>
                <PokeChart />
            </div>
            <div className={styles["moves-wrapper"]}>
                {pokeMoves.map(({ name }, ind) => (checkDesc === -1 ?
                    <span key={ind} onClick={() => setCheckDesc(ind)}>{name}</span>
                    :
                    <span key={`md${ind}`} onClick={() => setCheckDesc(-1)} >{checkDesc === ind && moveDesc[ind]}</span>
                ))}
            </div>
        </>
    )

}