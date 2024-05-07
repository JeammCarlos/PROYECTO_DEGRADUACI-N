import { useState, useEffect } from 'react';
import axios from 'axios';

const ExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.banxico.org/v1/SIEAPIRest/service.svc/V2/PWS073/getData/SF43718/d30332/d30245/2022-05-01/2022-05-01');
        setExchangeRate(response.data.bmx.series[0].datos[0].dato);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  return (
    <div>
      {exchangeRate && (
        <p>Tipo de cambio al día: {exchangeRate}</p>
      )}
    </div>
  );
};

export default ExchangeRate;
