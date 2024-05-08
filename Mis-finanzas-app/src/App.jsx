import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesIndex from './Routes/RoutesIndex';

const App = () => {

  return (

    <>
     <BrowserRouter>
       <RoutesIndex /> {/* Utiliza el componente RoutesIndex */}
     </BrowserRouter>
    </>
    

  );
};


export default App;