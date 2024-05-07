import { format, parseISO } from 'date-fns';

const calculateAverageExchangeRate = (exchangeRates) => {
  const groupedByDay = exchangeRates.reduce((acc, rate) => {
    const date = format(parseISO(rate.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(rate.value);
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