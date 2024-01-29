'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiSignInRoute = 'http://localhost:8000/api/auth/signin';

const SigninUser = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const router = useRouter();

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiSignInRoute, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        router.replace('/home');
      } else {
        setError('Sign-in failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={signInUser}>
        <h1>Sign in</h1>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          className="bg-white text-black font-bold rounded-md py-2"
          type="submit"
        >
          Submit
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SigninUser;
