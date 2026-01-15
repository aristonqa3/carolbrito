// Setup global para testes
import { vi } from 'vitest';

// Mock do ambiente
global.import.meta = {
    env: {
        VITE_SUPABASE_URL: 'http://localhost:54321',
        VITE_SUPABASE_ANON_KEY: 'test-key'
    }
};

// Mock do FileReader para testes
global.FileReader = class FileReader {
    constructor() {
        this.result = null;
        this.onload = null;
    }

    readAsDataURL(file) {
        setTimeout(() => {
            this.result = 'data:image/jpeg;base64,test';
            if (this.onload) {
                this.onload({ target: { result: this.result } });
            }
        }, 0);
    }
};
