import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

const useFetch = (url:string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}${url}`);
        setData(response.data);
        return response
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
              setError(axiosError.response?.data?.message || axiosError.message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
