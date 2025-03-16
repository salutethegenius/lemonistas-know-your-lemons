import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface AuthContextType {
  user: { username: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface AuthResponse {
  authenticated: boolean;
  user?: { username: string };
}

interface LoginResponse {
  success: boolean;
  user?: { username: string };
  message?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to make API requests
  const fetchApi = async <T,>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {}),
      }
    });
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    return response.json();
  };

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetchApi<AuthResponse>('/api/auth/status');
        
        if (response.authenticated && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetchApi<LoginResponse>('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.success && response.user) {
        setUser(response.user);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          variant: 'default',
        });
        
        // Invalidate any cached data that may depend on authentication status
        await queryClient.invalidateQueries();
        
        return true;
      } else {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid username or password',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await fetchApi<void>('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      
      // Invalidate queries after logout
      await queryClient.invalidateQueries();
      
      toast({
        title: 'Logout Successful',
        description: 'You have been logged out.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};