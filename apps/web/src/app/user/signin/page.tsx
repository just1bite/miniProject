'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';

const apiSignInRoute = 'http://localhost:8000/api/auth/signin';

const SigninPage = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/auth/user-role',
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          },
        );

        const userRole = response.data.role;

        if (userRole === null) {
          router.push('/user/account');
        } else {
          router.push('/festive/dashboard');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, []);

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiSignInRoute, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      console.log('Response Data:', response.data);
      if (response.data.success === true) {
        console.log('Before Redirect');
        router.push('/festive/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          <img
            src="https://floatui.com/logo.svg"
            width={150}
            className="mx-auto"
          />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p className="">
              Don't have an account?{' '}
              <a
                href="/user/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
        <form onSubmit={signInUser} className="mt-8 space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              id="email"
              placeholder="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              id="password"
              placeholder="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button
            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
            type="submit"
          >
            Sign in
          </button>
          <div className="text-center">
            <a href="/user/signup" className="hover:text-indigo-600">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SigninPage;
