import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

interface IRequest {
  url?: string;
  config?: AxiosRequestConfig<any>
}

export const getRequest = async({ url, config }: IRequest) => {
  try {
    const response = await axios.get(BASE_URL + (url || ""), config);

    return response.data;
  } catch (e) {
    const error = e as { message: string }
    alert(`error: ${error.message}`)
  }
}