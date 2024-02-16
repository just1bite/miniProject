'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const apiSelectionRole = 'http://localhost:8000/api/auth/selectionRole';

const Account = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();

  const handleRoleSelection = async () => {
    try {
      const response = await axios.post(
        apiSelectionRole,
        { selectedRole },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success === true) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedRole('user')}
            className={`border p-4 rounded-md ${
              selectedRole === 'user'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setSelectedRole('eventOrganizer')}
            className={`border p-4 rounded-md ${
              selectedRole === 'eventOrganizer'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            Event Organizer
          </button>
        </div>
        <button
          onClick={handleRoleSelection}
          className="mt-8 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Account;
