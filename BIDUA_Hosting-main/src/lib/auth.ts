import api from './api';

export interface User {
    id: string;
    username: string;
    email: string;
    full_name: string;
    role: string;
}

export async function signUp(email: string, password: string, username: string, fullName: string, referralCode?: string) {
    try {
        const data = await api.signUp(email, password, username, fullName, referralCode);
        return { data, error: null };
    } catch (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
    }
}

export async function signIn(email: string, password: string) {
    try {
        const data = await api.signIn(email, password);
        return { data, error: null };
    } catch (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
    }
}

export async function signOut() {
    try {
        const data = await api.signOut();
        return { error: null };
    } catch (error) {
        console.error('Sign out error:', error);
        return { error };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const user = await api.getCurrentUser();
        return user as User;
    } catch (error) {
        // Silently return null if not authenticated (expected behavior)
        return null;
    }
}

export async function getSession() {
    try {
        const token = api.getToken();
        if (!token) return null;
        
        const user = await getCurrentUser();
        return user ? { user, access_token: token } : null;
    } catch (error) {
        // Silently return null if session check fails
        return null;
    }
}

export async function getUserProfile(userId: string) {
    try {
        const data = await api.getUserProfile(userId);
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}