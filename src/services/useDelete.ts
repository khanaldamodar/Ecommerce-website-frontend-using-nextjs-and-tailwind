// hooks/useDelete.js
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState(null);

  const deleteData = async (url:string) => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("auth_token")
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}${url}`,{
        headers:{
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setResponse(res.data);
      return res.data
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || axiosError.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, response, loading, error };
};

export default useDelete;
