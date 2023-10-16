import { QueryKey, UseQueryOptions, useQuery } from "react-query"
import { getRequest } from ".."
import { IFilm } from "@/types/film";

type QueryOptions<T = unknown> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey"> | undefined;

export const useFilmsSearch = (searchInput: string | null, options: QueryOptions<IFilm[]>) => {
  return useQuery<IFilm[]>(["search-film", searchInput], {
    queryFn: async () => {
      if (!searchInput) return Promise.reject("Title should not be empty");
      const data = await getRequest({
        config: {
          params: {
            s: searchInput
          }
        }
      });

      if(data.Error) {
        return Promise.reject(data.Error);
      }

      return data.Search;
    },
    ...options
  })
}