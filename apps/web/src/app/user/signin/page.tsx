'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiSignInRoute = 'https://localhost:8000/api/auth/signin';

const signin = () => {
    const [data, setData] = useState ({
        username:'',
        password:'',
    });
    const router = useRouter();
    const signInUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios
            .post(apiSignInRoute, data, {
                withCredentials: true,  
                headers: { 'Content-Type' : 'application/json' },
            })
            .then((res) => res.data)
            .catch ((error) => console.log(error));
        if (response.success === true){
            router.push('/account');
            router.refresh();
        }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form onSubmit={signInUser}>
                <h1>Sign in</h1>
                <input/>
                <input/>
                <button></button>
            </form>
        </div>
    )
}

export default signin;