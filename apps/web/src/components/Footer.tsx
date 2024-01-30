// 'use client';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { FormEvent, useState } from 'react';

// const apiSignOutUser = 'http://localhost:8000/api/auth/signout';

// const signOut = () => {
//   const router = useRouter();
//   const signOutUser = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios
//         .post(apiSignOutUser, data, {})
//         .then((res) => res.data)
//         .catch((error) => console.log(error));
//       if (response.success === true) {
//         router.push('/');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <button
//       className="bg-white justify-center hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
//       onSubmit={signOutUser}
//       type="submit"
//     >
//       Sign Out
//     </button>
//   );
// };

// export default signOut;

import React from 'react';

const Footer = () => {
  return <div>Footer</div>;
};

export default Footer;
