'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const apiEventCreate = 'https://localhost:8000/api/auth/signin';

const eventCreate = () => {
    const [data, setData] = useState ({
        title:'',
        description:'',
        price:'',
        date: '',
        location:'',
        availableTicket: '',
        promo:'',
        
    });
    const router = useRouter();
    const createdEvent = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios
            .post(apiEventCreate, data, {
                withCredentials: true,  
                headers: { 'Content-Type' : 'application/json' },
            })
            .then((res) => res.data)
            .catch ((error) => console.log(error));
        if (response.success === true){
            router.push('/create');
            router.refresh();
        }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form onSubmit={createdEvent}>
                <h1>Sign in</h1>
                <input/>
                <input/>
                <input/>
                <input/>
                <input/>
                <input/>
                <input/>
                <button></button>
            </form>
        </div>
    )
}

export default eventCreate;