import Chart from "react-apexcharts"
import typeColors from "../Utils/typeColors";
import { useState, useContext, useEffect } from "react";
import dataContext from "../Context/dataContext";

export default function PokeChart() {

  const [pokeStats, setPokeStats] = useState([]);
  const { pokemon } = useContext(dataContext);
  const [color, setColor] = useState();

  useEffect(() => {
    setPokeStats(pokemon.stats.map(({ base_stat }) => { return base_stat }))

    const pokeTypes = pokemon.types.map(({ type }) => {
      return type.name
    })

    const cores = []

    typeColors.map(colors => {
      for (let type of pokeTypes) {
        if (colors.type.toLowerCase() === type) {
          cores.push(colors.hex)
        }
      }
    })

    setColor(cores)
  }, [])

  const data = {

    series: [{
      name: 'Pokemon Status',
      data: pokeStats,
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      fill:{
        opacity: 0.7,
        colors: ["#181818"]
      },
      markers: {
        size: 0,
      },
      yaxis: {
        show: false,

      },
      xaxis: {
        categories: ['HP', 'ATK', 'DEF', 'S.ATK', 'S.DEF', 'SPD'],
        labels: {
          style: {
            colors: ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff"],
            fontSize: "14px",
            fontFamily: 'Arial'
          }
        }
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColor: '#181818',
            fill: {
              colors: color
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius: 10,
        },
        style: {
          fontSize: "12px"
        }
      }
      
    }



  };


  return (
    <>
      <Chart options={data.options} series={data.series} type="radar" height={275} />
    </>
  )

}