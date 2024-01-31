import axios from 'axios';
import { withCoalescedInvoke } from 'next/dist/lib/coalesced-function';
import React, { useEffect, useState } from 'react';
import { Response } from 'express';
import Link from 'next/link';

interface user {
  id: '';
  username: '';
  points: '';
  voucher: '';
}

export default function userPage(props: HeaderProps) {
  const { cookie } = props;
  const userDetail = 'http://localhost:8000/api/auth/:id';
  const token = 'api-token';
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const userDetail = async () => {
      try {
        if (token) {
          const response = await axios.get(
            'http://localhost:8000/api/auth/:id',
            {
              withCredentials: true,
            },
          );
          setUser(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    userDetail();
  }, [cookie]);
  axios.get(userDetail);

  return (
    <div className="bg-[red]">
      {!cookie && user ? (
        <div>
          <div>
            <h1></h1>
            <h1></h1>
          </div>
        </div>
      ) : (
        <div>
          {cookie ? (
            ' . . . '
          ) : (
            <div>
              Unauthorized{' '}
              <Link className="text-orange-800" href={'/user/signin'}>
                Sign In
              </Link>{' '}
              Required
            </div>
          )}
        </div>
      )}
    </div>
  );
}
