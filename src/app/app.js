'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Circles } from 'react-loader-spinner';

const App = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/faculty/login'); 
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-8 gap-4">
      <h1 className="text-center text-2xl font-bold mb-4">Welcome to Faculty App</h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <Circles height="40" width="40" color="#4fa94d" ariaLabel="loading" />
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-96 h-10 rounded-lg bg-purple-800 flex items-center justify-center"
        >
          <h1 className="text-gray-300 font-bold">Get Started</h1>
        </button>
      )}
    </div>
  );
}

export default App;
