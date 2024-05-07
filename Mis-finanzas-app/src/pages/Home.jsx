import { useState, useEffect } from 'react';
import ExchangeRateChart from '../components/ExchangeRateChart';
import axios from 'axios';

const Home = () => {
  const [exchangeRates, setExchangeRates] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.banxico.org/v1/SIEAPIRest/service.svc/V2/PWS073/getData/SF43718/d30332/d30245/2022-05-01/2022-05-31');
        setExchangeRates(response.data.bmx.series[0].datos);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <div>
      <h1>Tipo de Cambio</h1>
      <ExchangeRateChart exchangeRates={exchangeRates} />
    </div>
  );
};

export default Home;