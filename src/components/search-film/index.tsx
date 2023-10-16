"use client";

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

function SearchFilm() {
  const [filmTitle, setfilmTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const searchParams = useSearchParams()
  const title = searchParams.get('title')
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!filmTitle) {
      setTitleError("Please input film title!");
      return;
    }
    router.push(`/?title=${filmTitle}`);
  };

  const handleChangeTitle = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setfilmTitle(value);
      if (titleError && value) {
        setTitleError("");
      }
    }, [titleError]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <label className="text-white mb-1" htmlFor="title">Film&apos;s title</label>
      <input name="title" className="h-14 w-80 rounded p-4" placeholder="Search film..." onChange={handleChangeTitle} defaultValue={title || ""} />
      {titleError && <span className="text-red-900 text-xs mt-1 font-bold">{titleError}</span>}
      <button className="w-80 rounded bg-orange-400 mt-3 py-4 text-white font-bold" type="submit">Search</button>
    </form>
  )
}
export default SearchFilm