'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiSignUpRoute = 'http://localhost:8000/api/auth/signup';

const SignupPage = () => {
    const [data, setData] = useState ({
        username:'',
        email:'',
        password:'',
        referralCode:'',
    });
    const router = useRouter();
    const signUpUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios
            .post(apiSignUpRoute, data, {
                withCredentials: true,  
                headers: { 'Content-Type' : 'application/json',"Access-Control-Allow-Origin": "*"},
            })
            .then((res) => res.data)
            .catch ((error) => console.log(error));
        if (response.success === true){
            router.push('/user/signin');
        }
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className='flex flex-wrap bg-[#2A0134] items-center justify-center py-10'>
            <form onSubmit={signUpUser} className={"flex flex-col text-2x gap-5 rounded-md p-10 bg-[#000]"}>
                <h1 className='justify-center'>Sign up</h1>
                <input type='text' id='username' name='username' placeholder='username' className='text-white font-bold bg-[#000] border-b-2' value={data.username}  onChange={(e) => setData({...data, username: e.target.value})}/>

                <input type='email' id='email' name='email' placeholder='email' className='text-white font-bold bg-[#000] border-b-2' value={data.email}  onChange={(e) => setData({...data, email: e.target.value})}/>

                <input type='password' id='password' name='password' placeholder='password' className='text-white font-bold bg-[#000] border-b-2' value={data.password}  onChange={(e) => setData({...data, password: e.target.value})}/>
                
                <input type='text' id='referralCode' name='referralCode' placeholder='referral number' className='text-white font-bold bg-[#000] border-b-2' value={data.referralCode}  onChange={(e) => setData({...data, referralCode: e.target.value})}/>

                <button className='bg-white text-black font-bold rounded-md py-2' type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default SignupPage;