import { createContext, ReactNode, useEffect, useState } from "react";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from "../services/apiClient";
type User = {
    email: string;
    permissions: string[];
    roles: string[];
}
type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    user: User | undefined;
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    signOut: () => void;
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');

    Router.push('/');
}
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();
        if (token) {
            api.get('/me').then(response => {

                const { email, permissions, roles } = response.data;
                setUser({
                    email,
                    permissions,
                    roles
                });

            }).catch(() => {
                signOut();
            });
        }

    }, []);



    async function signIn({ email, password }: SignInCredentials) {
        const response = await api.post('sessions', {
            email,
            password
        })
        const { token, refreshToken, permissions, roles } = response.data;

        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        });
        setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        });
        console.log(response);
        setUser({
            email,
            permissions,
            roles
        });
        api.defaults.headers['Authorization'] = `Bearer ${token}`
        Router.push('/dashboard');
    }
    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}