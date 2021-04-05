import React from 'react';
import { Navbar } from './components';
import { Footer } from './components'

import Routes from './routes';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
