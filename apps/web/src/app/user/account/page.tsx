// 'use client'
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { FormEvent, useState } from 'react';

// const apiUserAccount = 'http://localhost:8000/api/auth/signin';

// const userAccount = () => {
//     const [data, setData] = useState ({
//         email:'',
//         password:'',
//     });
//     const router = useRouter();
//     const userAccount = async (e: FormEvent) => {
//         e.preventDefault();
//         try {
//             const response = await axios
//             .post(apiUserAccount, data, {
//                 withCredentials: true,  
//                 headers: { 'Content-Type' : 'application/json' },
//             })
//             .then((res) => res.data)
//             .catch ((error) => console.log(error));
//         if (response.success === true){
//             router.push('/user/account');
//         }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return (
//         <div>
          
//         </div>
        








//  )
// }