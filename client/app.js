import React from 'react';

import { Navbar, Video } from './components';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Video />
    </div>
  );
};

export default App;
