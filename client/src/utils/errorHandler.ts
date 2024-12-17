// utils/errorHandler.ts
import { AxiosError } from 'axios';

export interface ParsedError {
  message: string;
  extra?: Record<string, any>;
}

export const parseError = (error: unknown): ParsedError => {
  if (error instanceof AxiosError) {
    // Check if the error response has the expected structure
    if (error.response && error.response.data) {
      const { message, extra } = error.response.data as { message: string; extra?: Record<string, any> };
      return { message, extra };
    }
    return { message: 'An API error occurred.', extra: { details: error.message } };
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return { message: error.message, extra: undefined };
  }

  // Generic fallback for unknown errors
  return { message: 'An unexpected error occurred.', extra: undefined };
};