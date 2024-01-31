'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  cookie?: string | undefined;
}

export const Header = (props: HeaderProps) => {
  const { cookie } = props;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientCookie = Cookies.get('api-token');

  useEffect(() => {
    if (cookie) {
      setIsAuthenticated(true);
    }
  }, [cookie]);

  const handleSignOut = async () => {
    try {
      const apiSignOutRoute = 'http://localhost:8000/api/auth/signout';
      const response = await fetch(apiSignOutRoute, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Cookies.remove('api-token');
        setIsAuthenticated(false);

        router.push('/user/signin');
        router.refresh();
      } else {
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
            {cookie ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <a href="/user/signin">Sign In</a>
            )}
          </li>
          {/* <li>
            <button >Sign Out</button>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};
