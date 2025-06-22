// hooks/useUpdate.ts
import { useState } from 'react';
import axios, { AxiosError, Method } from 'axios';
import Cookies from 'js-cookie';
type UpdateMethod = 'put' | 'patch';
interface UseUpdateReturn<T> {
  updateData: (url: string, updatedData: T, method?: UpdateMethod) => Promise<void>;
  response: T | null; // Assuming the response shape matches the generic type T
  loading: boolean;
  error: string | null;
}
function useUpdate<T = Record<string, unknown>>(): UseUpdateReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<T|null>(null);

  const updateData = async (url: string, updatedData: T, method: UpdateMethod = 'put'): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("auth_token")
      const fullUrl = `${process.env.NEXT_PUBLIC_URL}${url}`;
      const res = await axios.request({
        url: fullUrl,
        method: method as Method,
        data: updatedData,
        headers: {
          Authorization : `Bearer ${token}`,
          ...(updatedData instanceof FormData ? {} : { "Content-Type": "application/json" }),
        } 
      }
    );
      setResponse(res.data);
      return res.data
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || axiosError.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };
  return { updateData, response, loading, error };
}
export default useUpdate;
