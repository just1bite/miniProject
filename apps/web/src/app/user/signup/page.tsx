'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiSignUpRoute = 'https://localhost:8000/api/auth/signup';

const signup = () => {
    const [data, setData] = useState ({
        username:'',
        email:'',
        password:'',
    });
    const router = useRouter();
    const signUpUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios
            .post(apiSignUpRoute, data, {
                withCredentials: true,  
                headers: { 'Content-Type' : 'application/json' },
            })
            .then((res) => res.data)
            .catch ((error) => console.log(error));
        if (response.success === true){
            router.push('/register');
            router.refresh();
        }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form onSubmit={signUpUser}>
                <h1>Sign in</h1>
                <input/>
                <input/>
                <input/>
                <button></button>
            </form>
        </div>
    )
}

export default signup;