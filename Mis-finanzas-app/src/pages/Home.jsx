import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Importar el adaptador
import { Chart, registerables } from 'chart.js'; 
import calculateAverageExchangeRate from '../utils/calculateAverageExchangeRate';

Chart.register(...registerables); // Registrar la escala de tiempo
const Home = () => {
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [averageExchangeRates, setAverageExchangeRates] = useState([]);
  const today = new Date(); // Obtenemos la fecha actual

  // Inicializamos las fechas con los valores actuales
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF63528/datos/${startDate}/${endDate}?token=c59249170c61b227b21972054e8e164cccbfc498be704476f1bf3783a7cb5479`
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
  
// Calcular la media móvil de 7 días
const movingAveragePeriod = 7;
const movingAverages = averageExchangeRates.map((rate, index) => {
  if (index < movingAveragePeriod - 1) {
    return null;
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
        label: `Media Móvil (7 días)`,
        data: movingAverages,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const [showError, setShowError] = useState(false); // Estado para el mensaje de error

  const handleDateChange = (e) => {
    const { id, value } = e.target;

    if (id === "startDate") {
      setStartDate(value);
      if (value > endDate) {
        setEndDate(value);
        setShowError(true); // Mostrar error
      } else {
        setShowError(false); // Ocultar error
      }
    } else if (id === "endDate") {
      setEndDate(value);
      if (value < startDate) {
        setStartDate(value);
        setShowError(true); // Mostrar error
      } else {
        setShowError(false); // Ocultar error
      }
    }
  };
  
  const options = {
    scales: {
      x: {
        type: 'time', // Escala de tiempo ahora registrada
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

 {/* Entrada para las fechas */}
 <div>
        <label htmlFor="startDate">Fecha de inicio:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleDateChange}
        />
      </div>
      <div>
        <label htmlFor="endDate">Fecha de fin:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleDateChange}
        />
        {showError && <p style={{ color: 'red' }}>Error: La fecha de inicio debe ser menor o igual a la fecha de fin.</p>}
      </div> 
      
      <h2>Tipos de Cambio del Mes</h2>
      <div className="contenedor-grafico">
        <Line data={data} options={options} />
      </div>

    </div>
  );
};

export default Home;