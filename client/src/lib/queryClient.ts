import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Enhanced error handling with structured response
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to parse as JSON first for structured error
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || 
          errorData.error || 
          `${res.status}: ${res.statusText}`
        );
      } else {
        // Fallback to text if not JSON
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
    } catch (parseError) {
      // If JSON parsing fails, use status text
      if (parseError instanceof SyntaxError) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      throw parseError; // Re-throw if it's our structured error
    }
  }
}

// Enhanced API request with performance optimizations
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: RequestInit
): Promise<Response> {
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
  
  // Add Content-Type only when sending data
  if (data) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  
  const res = await fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {})
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Performance optimization - avoid CORS preflight for GET/HEAD
    mode: method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD' 
      ? 'cors' 
      : 'same-origin',
    // Add priority for important requests
    ...(method.toUpperCase() === 'GET' && { priority: 'high' }),
    ...options
  });

  await throwIfResNotOk(res);
  return res;
}

// Types for better type safety
type UnauthorizedBehavior = "returnNull" | "throw";
type QueryFnOptions = {
  on401: UnauthorizedBehavior;
  cacheControl?: string;
};

// Optimized query function that supports caching directives
export const getQueryFn: <T>(options: QueryFnOptions) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, cacheControl }) =>
  async ({ queryKey, signal }) => {
    const headers: Record<string, string> = {};
    
    // Apply cache control headers when specified
    if (cacheControl) {
      headers['Cache-Control'] = cacheControl;
    }
    
    // Performance optimization - determine if this is an image request
    const url = queryKey[0] as string;
    const isImageRequest = /\.(jpg|jpeg|png|gif|svg|webp)$/.test(url);
    
    const res = await fetch(url, {
      credentials: "include",
      headers,
      // Pass through the AbortSignal for proper cancellation
      signal,
      // Image-specific optimizations
      ...(isImageRequest && { 
        priority: 'high', 
        cache: 'force-cache'
      })
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    // For image requests, return blob URL
    if (isImageRequest) {
      const blob = await res.blob();
      return URL.createObjectURL(blob) as unknown as T;
    }
    
    // For other requests, parse as JSON
    return await res.json();
  };

// Optimized Query Client with performance and caching enhancements
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ 
        on401: "throw",
        cacheControl: 'public, max-age=300' // 5 minute cache by default
      }),
      refetchInterval: false,
      refetchOnWindowFocus: import.meta.env.DEV ? false : 'always', // Only refetch in production
      staleTime: 5 * 60 * 1000, // 5 minutes cache 
      gcTime: 10 * 60 * 1000, // Garbage collection after 10 minutes
      retry: (failureCount, error) => {
        // Don't retry for 4xx errors (client errors)
        if (error instanceof Error && error.message.startsWith('4')) {
          return false;
        }
        return failureCount < 2; // Retry twice for other errors
      }, 
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      // Keep previous data to avoid UI flicker
      placeholderData: (previousData: unknown) => previousData,
      // Structural sharing to reduce re-renders
      structuralSharing: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry for 4xx errors
        if (error instanceof Error && error.message.startsWith('4')) {
          return false;
        }
        return failureCount < 1; // Only retry once for mutations
      },
      retryDelay: 1000, // Wait 1 second before retrying
    },
  },
});
