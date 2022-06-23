import React from 'react';
import { PolywrapProvider } from '@polywrap/react';
import { HelloWorld } from './HelloWorld';
import { Header } from './Header';
import Logo from './logo.png';
import './App.css';

export const App: React.FC = () => {
  return (
    <PolywrapProvider>
      <Header />
      <div className='main'>
        <img src={Logo} className='main__logo' />
        <HelloWorld />
      </div>
    </PolywrapProvider>
  );
};
