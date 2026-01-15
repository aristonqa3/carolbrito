import { supabase } from './client.js';

export class AuthService {
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
}

export const auth = new AuthService();
