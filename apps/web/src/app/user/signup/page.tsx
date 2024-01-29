'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiSignUpRoute = 'http://localhost:8000/api/auth/signup';

// ... (previous imports)

const SignupPage = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const signUpUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(apiSignUpRoute, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (response?.data.success) {
        console.log('Redirecting to /signin...');
        router.push('/user/signin');
      } else {
        setError('Sign-up failed. Please check your information.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={signUpUser}
        className="flex flex-col text-2x gap-5 rounded-md p-10 bg-[#000000]"
      >
        <h1 className="text-center">Sign up</h1>

        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          aria-label="Username"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <input
          type="text"
          id="referralCode"
          name="referralCode"
          placeholder="Referral Number"
          aria-label="Referral Number"
          className="text-white font-bold bg-[#FFFFFF] border-b-2"
          value={data.referralCode}
          onChange={(e) => setData({ ...data, referralCode: e.target.value })}
        />

        <button
          className="bg-white text-black font-bold rounded-md py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Submit'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
