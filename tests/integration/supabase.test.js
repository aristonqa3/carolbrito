import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '../../src/lib/supabase/client.js';

describe('Supabase Integration', () => {
    beforeAll(() => {
        // Configurar variáveis de ambiente de teste se necessário
    });

    describe('Database Connection', () => {
        it('deve conectar ao Supabase', async () => {
            // Teste básico de conexão
            const { data, error } = await supabase.from('projects').select('count').limit(1);
            
            // Não deve ter erro de conexão
            expect(error).toBeNull();
        });
    });

    describe('Projects Table', () => {
        it('deve poder ler projetos (RLS permitido)', async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .limit(1);

            // Não deve ter erro de permissão
            expect(error).toBeNull();
        });
    });
});
