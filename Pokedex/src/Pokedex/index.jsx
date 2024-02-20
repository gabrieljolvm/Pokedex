import styles from './Pokedex.module.css';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CircleIcon from '@mui/icons-material/Circle';
import Pokelist from './Pokelist';
import Pokemon from './Pokemon';
import { useContext, useEffect, useRef, useState } from 'react';
import dataContext from '../Context/dataContext';

export function Pokedex() {

    const arrowStyle = { fontSize: "40px", color: "#B0B0B0", cursor: 'pointer' };
    const screen = useRef(0);
    const up = useRef(null);
    const down = useRef(null);
    const left = useRef(null);
    const right = useRef(null);
    const pokeRef = useRef(null);
    const lBtn = useRef(null);
    const rBtn = useRef(null);
    const [sortedPokedex, setSortedPokedex] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [viewPokeInfo, setViewPokeInfo] = useState(false);
    const { pokedex, setPokemon, pokemon, sortedBy, setSortedBy } = useContext(dataContext);
    const [scrollHeight, setScrollHeight] = useState(null);

    const onWheelScreen = (event) => { //Função para poder usar o scroll na tela da pokedex.
        if (event.deltaY > 0) {
            down.current.click()
        } else {
            up.current.click();
        }
    }

    const onPressButton = (event) => { // Pode usar as setas da pokedex para navegar.

        if (up.current === event.currentTarget && !viewPokeInfo) {
            const position = pokeRef.current.offsetTop;

            if (position - 125 < screen.current.scrollTop) {
                screen.current.scrollTop -= 100;
                setScrollHeight(screen.current.scrollTop);
            }

            setSelectedPokemon(i => i > 0 ? i - 1 : 0);

        } else if (down.current === event.currentTarget && !viewPokeInfo) {
            const position = pokeRef.current.offsetTop;

            if (position - 127 > screen.current.scrollTop) {
                screen.current.scrollTop += 100;
                setScrollHeight(screen.current.scrollTop);
            }

            setSelectedPokemon(i => i < 19 ? i + 1 : 19);

        } else if (left.current === event.currentTarget) {
            setViewPokeInfo(false);

        } else if (right.current === event.currentTarget) {
            setViewPokeInfo(true);
        }
    }

    const onPressKeys = (event) => { // Pode usar as setas do teclado para navegar na pokedex.
        if (event.key === "ArrowDown") {
            down.current.click();
        }
        if (event.key === "ArrowUp") {
            up.current.click();
        }
        if (event.key === "ArrowLeft") {
            left.current.click();
        }
        if (event.key === "ArrowRight") {
            right.current.click();
        }
    }

    useEffect(() => { // Organiza por nome ou por experiência. Basta continuar clicando no botão.
        if (sortedBy === 1) {
            setSortedPokedex(pokedex.sort((a, b) => { if (a.name < b.name) return -1 }))

        } else if (sortedBy === 2) {
            setSortedPokedex(pokedex.sort((a, b) => { if (a.base_experience < b.base_experience) return -1 }))

        } else if (sortedBy === 0) {
            setSortedPokedex(null);

        }
    }, [sortedBy])

    useEffect(() => { // Usado para a execução dos comandos via teclado.
        window.addEventListener("keyup", onPressKeys);

        return () => {
            window.removeEventListener("keyup", onPressKeys);
        }
    }, []);

    useEffect(() => { // Busca o pokemon que terá a div destacada.
        sortedPokedex ?
            setPokemon(sortedPokedex.find((_, id) => id === selectedPokemon))
            :
            setPokemon(pokedex.find(({ id }) => id === selectedPokemon + 1))

    }, [pokedex, selectedPokemon])

    useEffect(() => { // Mantém a posição do scroll ao voltar das informações do pokemon. e ao alterar a ordem da lista.
        !viewPokeInfo && screen.current.scrollTo(0, scrollHeight)
    }, [viewPokeInfo, sortedPokedex])


    return (
        <main>
            <div className={styles['h-square']}>
                <div className={styles['left-h']}>
                    <div className={styles['green-btn']}></div>
                    <button className={styles["blue-btn"]} />
                </div>
                <div className={styles.board}>
                    <div className={styles.screen} ref={screen} onWheel={onWheelScreen}>
                        {!viewPokeInfo ? <Pokelist sortedPokedex={sortedPokedex}
                            selectedPokemon={selectedPokemon} ref={pokeRef} />
                            :
                            <Pokemon pokemon={pokemon} />}
                    </div>
                    <div className={styles['btn-box']}>
                        <button className={styles.btn} ref={lBtn} onClick={() => setSortedBy(i => i >= 2 ? i = 0 : i + 1)}></button>
                        <button className={styles.btn} ref={rBtn}></button>
                    </div>
                </div>
                <div className={styles.keys}>
                    <button ref={up} onClick={onPressButton}><ArrowDropUpIcon sx={arrowStyle} /></button>
                    <button ref={down} onClick={onPressButton}><ArrowDropDownIcon sx={arrowStyle} /></button>
                    <button ref={left} onClick={onPressButton}><ArrowLeftIcon sx={arrowStyle} /></button>
                    <button ref={right} onClick={onPressButton}><ArrowRightIcon sx={arrowStyle} /></button>
                    <span><CircleIcon sx={{ fontSize: "30px", color: "#B0B0B0" }} /></span>
                </div>
            </div>
            <div className={styles.haste}>
                <div className={styles.hinge}></div>
            </div>
            <div className={styles['v-square']}>
                <div className={styles['poke-symbol']}></div>
            </div>
        </main>
    )
}