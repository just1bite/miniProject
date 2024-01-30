"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  cookie: string | undefined;
}

export const Header = (props: HeaderProps) => {
  const { cookie } = props;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const clientCookie = Cookies.get('api-token');
    setIsAuthenticated(!!clientCookie);
  }, [cookie]);

  const handleSignOut = async () => {
    try {
      // Simulate the sign-out API call
      // Replace this with your actual sign-out logic on the server side

      const apiSignOutRoute = 'http://localhost:8000/api/auth/signout';
      const response = await fetch(apiSignOutRoute, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the cookie on the client side
        Cookies.remove('api-token');
        setIsAuthenticated(false);

        // Redirect to the sign-in page
        router.push('/user/signin');
      } else {
        // Handle sign-out failure, log error, etc.
        console.error('Sign-out failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            {isAuthenticated ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <a href="/user/signin">Sign In</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
