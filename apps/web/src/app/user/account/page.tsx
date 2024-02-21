// src\app\user\account\page.tsx
'use client';
import { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
// Define the API endpoint
const apiSelectionRole = 'http://localhost:8000/api/auth/selectionRole';

// Define the functional component
const AccountPage = () => {
  // Initialize the router
  const router = useRouter();
  // Initialize state variables
  const [selectedRole, setSelectedRole] = useState('');
  const [userButtonSelected, setUserButtonSelected] = useState(false);
  const [eventOrganizerButtonSelected, setEventOrganizerButtonSelected] =
    useState(false);

  // Handle the role selection logic
  const handleRoleSelection = async () => {
    try {
      // Make an API call to update the user's role based on selectedRole
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

      // Check the success response and navigate to /festive/dashboard
      if (response.data.success === true) {
        router.push('/festive/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setSelectedRole('user');
              setUserButtonSelected(true);
              setEventOrganizerButtonSelected(false);
            }}
            className={`border p-4 rounded-md ${
              userButtonSelected ? 'border-blue-500' : 'hover:bg-gray-200'
            }`}
          >
            User
          </button>
          <button
            onClick={() => {
              setSelectedRole('eventOrganizer');
              setEventOrganizerButtonSelected(true);
              setUserButtonSelected(false);
            }}
            className={`border p-4 rounded-md ${
              eventOrganizerButtonSelected
                ? 'border-blue-500'
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

export default AccountPage;
