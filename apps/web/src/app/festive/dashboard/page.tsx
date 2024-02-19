// 'use client';
// import { useState, FormEvent } from 'react';
// import axios from 'axios';

// const apiEventCreate = 'http://localhost:8000/api/event/';

// interface Post {
//   title: string;
//   desc: string;
//   img: string;
//   date: string;
//   href: string;
// }
// const Home: React.FC = () => {
//   const [email, setEmail] = useState('');

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(apiEventCreate, { email });
//       console.log('Subscription successful:', response.data);
//     } catch (error) {
//       console.error('Subscription failed:', error);
//     }
//   };

//   const posts: Post[] = [
//     // ... (your posts data)
//   ];

//   return (
//     <section className="py-32">
//       {/* ... (rest of your code) */}
//       <form
//         onSubmit={handleSubmit}
//         className="items-center justify-center gap-3 sm:flex"
//       >
//         <div className="relative">
//           <svg
//             className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//           >
//             {/* ... (search icon path) */}
//           </svg>
//           <input
//             type="text"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg sm:max-w-xs"
//           />
//         </div>
//         <button className="block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow sm:mt-0 sm:w-auto">
//           Search
//         </button>
//       </form>
//     </section>
//   );
// };

// export default Home;
