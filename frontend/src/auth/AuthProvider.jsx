import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch user profile từ backend
   * Backend verify JWT từ HttpOnly cookie
   */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFetch('/api/auth/me', { 
        method: 'GET' 
      });
      
      setUser(response.user || response);
    } catch (err) {
      // 401/403 means not authenticated - this is expected
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setUser(null);
      } else {
        // Actual error (network, server down, etc.)
        setError(err.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial auth check khi app mount
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Login function
   * Backend sẽ set HttpOnly cookie trong response
   */
  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      });

      // Backend đã set cookie, fetch user để update state
      await fetchUser();
      
      return { success: true, data: response };
    } catch (err) {
      setError(err.message);
      return { 
        success: false, 
        error: err.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  /**
   * Logout function
   * Backend sẽ xóa HttpOnly cookie
   */
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { 
        method: 'POST' 
      });
    } catch (err) {
      // Logout có thể fail nhưng vẫn clear local state
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    refetch: fetchUser, // Manual refetch if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook để access auth context
 * Throw error nếu dùng ngoài AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
