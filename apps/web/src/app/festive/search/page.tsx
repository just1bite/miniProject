'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const searchEvent = () => {
  const [eventSearch, setEventSearch] = useState('');
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedEventSearch = encodeURI(eventSearch);
    router.push(`/search?q=${encodedEventSearch}`);

    console.log('current search', encodedEventSearch);
  };

  return (
    <form className="flex justify-center w-2/3" onSubmit={onSearch}>
      <input
        value={eventSearch}
        onChange={(event) => setEventSearch(event.target.value)}
        className="bg-[#2A0134]"
        placeholder="what are you looking for?"
      />
    </form>
  );
};

export default searchEvent;
