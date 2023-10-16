"use client";

import { useFilmsSearch } from "@/api/query-hooks/films";
import { useSearchParams } from "next/navigation";
import SearchFilm from "../search-film";
import FilmCard from "../film-card";

function FilmContainer() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title')
  const { data, isLoading, error } = useFilmsSearch(title, {
    enabled: !!title
  });

  return (
    <div>
      <SearchFilm />
      {isLoading ? "Loading..." :
        error ? <h1 className="text-center mt-4 text-white">No Film Found</h1> :
          data ?
            <div className="flex w-full flex-wrap justify-center gap-[40px]">
              {data.map((film) => (
                <FilmCard key={film.imdbID} {...film} />
              ))}
            </div>
            : null
      }
    </div>
  )
}

export default FilmContainer;