import { auth } from '../lib/supabase/auth.js';

export class AuthService {
    async signIn(email, password) {
        try {
            const data = await auth.signIn(email, password);
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Error signing in:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async signOut() {
        try {
            await auth.signOut();
            return {
                success: true
            };
        } catch (error) {
            console.error('Error signing out:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getCurrentUser() {
        try {
            const user = await auth.getCurrentUser();
            return {
                success: true,
                data: user
            };
        } catch (error) {
            console.error('Error getting current user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSession() {
        try {
            const session = await auth.getSession();
            return {
                success: true,
                data: session
            };
        } catch (error) {
            console.error('Error getting session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    onAuthStateChange(callback) {
        return auth.onAuthStateChange(callback);
    }
}

export const authService = new AuthService();
