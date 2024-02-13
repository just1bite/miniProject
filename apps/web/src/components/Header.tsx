'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
          <div className="flex flex-col">
            <a href="/">Home</a>
            <a href="/user/account">Account</a>
          </div>
          <li>
            <a href="/user/signup">Sign Up</a>
          </li>
          <li>
            {cookie ? (
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
