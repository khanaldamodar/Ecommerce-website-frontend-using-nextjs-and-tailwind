import { useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

type LaravelErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);

  const postData = async (url: string, payload: FormData | Record<string, any>) => {
    setLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      const token = Cookies.get("auth_token");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}${url}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
          },
        }
      );

      setResponse(res.data);
      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;

      const message = axiosError.response?.data?.message || axiosError.message || "Something went wrong";

      setError(message);
      setValidationErrors(axiosError.response?.data?.errors || null);

      return {
        success: false,
        message,
        errors: axiosError.response?.data?.errors || null,
      };
    } finally {
      setLoading(false);
    }
  };

  return { postData, response, loading, error, validationErrors };
};

export default usePost;
