import { format, parseISO } from 'date-fns';

const calculateAverageExchangeRate = (exchangeRates) => {
  const groupedByDay = exchangeRates.reduce((acc, rate) => {
    // Verificar si rate.date existe antes de aplicar parseISO
    const date = rate.date ? format(parseISO(rate.date), 'yyyy-MM-dd') : null;

    if (!acc[date]) {
      acc[date] = [];
    }

    // Verificar si rate.value existe antes de agregarlo al arreglo
    if (rate.value) {
      acc[date].push(rate.value);
    }

    return acc;
  }, {});

  const averages = Object.keys(groupedByDay).map(date => {
    const values = groupedByDay[date];
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return { date, average };
  });

  return averages;
};

export default calculateAverageExchangeRate;