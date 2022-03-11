import React from 'react';
import { Web3ApiProvider } from '@web3api/react';
import { HelloWorld } from './HelloWorld';
import { Header } from './Header';
import Logo from './logo.png';
import './App.css';

export const App: React.FC = () => {
  return (
    <Web3ApiProvider>
      <Header />
      <div className='main'>
        <img src={Logo} className='main__logo' />
        <HelloWorld />
      </div>
    </Web3ApiProvider>
  );
};
