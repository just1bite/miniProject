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

  const checkUserRole = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auth/userRole/${id}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Response Data:', response.data);

      const userRole = response.data.data?.role;
      if (userRole === null) {
        console.log('Redirecting to /user/account');
        router.push('/user/account');
      } else {
        console.log('Redirecting to /festive/dashboard');
        router.push('/festive/dashboard');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const [loading, setLoading] = useState(false);
  const signInUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(apiSignInRoute, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success === true) {
        // Assuming the API response includes the user ID
        const userId = response.data.data.id.toString();

        // Check the user role after successful sign-in
        await checkUserRole(userId); // await to ensure the checkUserRole completes before redirection

        console.log('Before Redirect');
        // Note: Redirecting after the role check
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
