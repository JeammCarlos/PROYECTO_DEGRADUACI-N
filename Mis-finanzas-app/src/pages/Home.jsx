import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import calculateAverageExchangeRate from '../utils/calculateAverageExchangeRate';

const Home = () => {
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [averageExchangeRates, setAverageExchangeRates] = useState([]);
  const [startDate, setStartDate] = useState('2024-05-01'); // Fecha de inicio por defecto
  const [endDate, setEndDate] = useState('2024-05-07'); // Fecha de fin por defecto

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/${startDate}/${endDate}?token=c59249170c61b227b21972054e8e164cccbfc498be704476f1bf3783a7cb5479`
        );

        const exchangeRates = response.data.bmx.series[0].datos;
        const averages = calculateAverageExchangeRate(exchangeRates);

        setCurrentExchangeRate(exchangeRates[exchangeRates.length - 1].dato);
        setAverageExchangeRates(averages);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

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
      // Resto del código de la gráfica...
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
      {currentExchangeRate && <p>1 USD = {currentExchangeRate} MXN</p>}

      <h2>Tipos de Cambio del Mes</h2>
      <Line data={data} options={options} />

      {/* Agregamos los campos de entrada para las fechas */}
      <div>
        <label htmlFor="startDate">Fecha de inicio:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endDate">Fecha de fin:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Home;
