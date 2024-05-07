import React from 'react';
import { Line } from 'react-chartjs-2';

const ExchangeRateChart = ({ exchangeRates }) => {
  const data = {
    labels: exchangeRates.map(rate => rate.date),
    datasets: [
      {
        label: 'Tipo de Cambio',
        data: exchangeRates.map(rate => rate.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
        display: true, // Mostrar la leyenda
        position: 'top', // Se puede cambiar la posición (top, bottom, left, right)
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default ExchangeRateChart;
