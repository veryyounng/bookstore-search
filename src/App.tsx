import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import BookstoreSearch from '../src/componets/BookstoreSearch';

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <BookstoreSearch />
    </div>
  );
}

export default App;
