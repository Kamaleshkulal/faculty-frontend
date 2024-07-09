'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/adminapp/faculty/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyEmail: email, facultyPassword: password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem('facultyId', data.facultyId);
         // Store facultyId in localStorage
        toast.success('Login successful!', {
          onClose: () => router.push('/faculty/dashboard'),
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Error logging in. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen h-8">
      <div className="max-w-md relative flex flex-col p-4 rounded-md text-black bg-white border shadow-lg">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          Welcome back to <span className="text-[#7747ff]">App</span>
        </div>
        <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">Log in to your account</div>
        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
          <div className="block relative">
            <label htmlFor="email" className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Email</label>
            <input
              type="text"
              id="email"
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="block relative">
            <label htmlFor="password" className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="bg-[#7747ff] w-max m-auto mt-6 px-6 py-2 rounded text-white text-sm font-normal">Submit</button>
        </form>
        <div className="text-sm text-center mt-[1.6rem]">
          If you forgot your admin password, contact data centers.
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
}
