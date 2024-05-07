import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import calculateAverageExchangeRate from '../utils/calculateAverageExchangeRate';

const Home = () => {
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [averageExchangeRates, setAverageExchangeRates] = useState([]);

  useEffect(() => {
    // Obtener el tipo de cambio actual
    const fetchCurrentExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.banxico.org/v1/SIEAPIRest/service.svc/V2/PWS073/getData/SF43718/d30332/d30245/2022-05-01/2022-05-01');
        setCurrentExchangeRate(response.data.bmx.series[0].datos[0].dato);
      } catch (error) {
        console.error('Error fetching current exchange rate:', error);
      }
    };

    // Obtener los tipos de cambio del mes
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.banxico.org/v1/SIEAPIRest/service.svc/V2/PWS073/getData/SF43718/d30332/d30245/2022-05-01/2022-05-31');
        const exchangeRates = response.data.bmx.series[0].datos;
        const averages = calculateAverageExchangeRate(exchangeRates);
        setAverageExchangeRates(averages);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchCurrentExchangeRate();
    fetchExchangeRates();
  }, []);

  // Calcular la media móvil de 7 días (puedes ajustar el período según tus necesidades)
  const movingAveragePeriod = 7;
  const movingAverages = averageExchangeRates.map((rate, index) => {
    if (index < movingAveragePeriod - 1) {
      return null; // No hay suficientes datos para calcular la media móvil al principio
    }
    const sum = averageExchangeRates
      .slice(index - movingAveragePeriod + 1, index + 1)
      .reduce((acc, curr) => acc + curr.average, 0);
    return sum / movingAveragePeriod;
  });

  const data = {
    labels: averageExchangeRates.map(rate => rate.date),
    datasets: [
      {
        label: 'Promedio de Tipo de Cambio',
        data: averageExchangeRates.map(rate => rate.average),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: `Media Móvil (${movingAveragePeriod} días)`,
        data: movingAverages,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tipo de Cambio',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h1>Aplicación de Finanzas</h1>
      <h2>Tipo de Cambio Actual</h2>
      {currentExchangeRate && (
        <p>1 USD = {currentExchangeRate} MXN</p>
      )}

      <h2>Tipos de Cambio del Mes</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Home;
