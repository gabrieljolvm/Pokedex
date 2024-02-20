import { forwardRef, useContext, useEffect } from "react";
import dataContext from "../../Context/dataContext";
import styles from "./Pokelist.module.css"

const Pokelist = forwardRef(({ sortedPokedex, selectedPokemon }, ref) => {

    const { pokedex } = useContext(dataContext);

    const list = ({ base_experience, name, sprites }, id) => (
        <div key={name} ref={selectedPokemon === id ? ref : null} className={styles.wrapper} 
        style={selectedPokemon === id ? {background: "green"} : null}>
            <img className={styles.img} src={sprites.front_default} alt={name} />
            <span className={styles.name}>{name}</span>
            <span className={styles.exp}>Exp: {base_experience}</span>
        </div>
    )

    return (
        <>
            {!sortedPokedex ? pokedex.map(list) : sortedPokedex.map(list)}
        </>
    )
})

export default Pokelist