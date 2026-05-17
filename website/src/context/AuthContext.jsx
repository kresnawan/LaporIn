import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from '../axios/checkAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const verifySession = async () => {
        // const token = localStorage.getItem('accessToken');
        // if (!token) {
        //     setLoading(false);
        //     return;
        // }

        try {
            const res = await checkAuth();
            localStorage.setItem('accessToken', res.token);
            setUser({userId: res.user_id, userRole: res.user_role});
            setIsAuthenticated(true);
        } catch (error) {
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifySession();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('accessToken', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            loading, 
            login, 
            logout,
            revalidate: verifySession
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);