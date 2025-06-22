// hooks/usePost.js
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";


type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
  };
};

const usePost = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string|null|any>(null);

  const postData = async (url: string, payload: FormData| Record<string,any>) => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("auth_token")
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}${url}`,
        payload,
        {
          headers:{
            Authorization : `Bearer ${token}`,
            ...(payload instanceof FormData ? {} : {'Content-Type': 'application/json'})
          }
        }
      );
      setResponse(res.data);
      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return { postData, response, loading, error };
};

export default usePost;
