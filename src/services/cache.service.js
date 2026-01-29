/**
 * Serviço de cache em memória para otimização de performance
 * Implementa TTL (Time To Live) para invalidação automática
 */
export class CacheService {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutos por padrão
        this.cache = new Map();
        this.ttl = ttl;
    }

    /**
     * Obtém um item do cache
     * @param {string} key - Chave do cache
     * @returns {any|null} - Dados em cache ou null se expirado/não encontrado
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    /**
     * Armazena um item no cache
     * @param {string} key - Chave do cache
     * @param {any} data - Dados a serem armazenados
     * @param {number} customTtl - TTL customizado em ms (opcional)
     */
    set(key, data, customTtl = null) {
        const expiry = Date.now() + (customTtl || this.ttl);
        this.cache.set(key, {
            data,
            expiry
        });
    }

    /**
     * Remove um item específico do cache
     * @param {string} key - Chave a ser removida
     */
    invalidate(key) {
        this.cache.delete(key);
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Remove itens expirados do cache
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Retorna o tamanho atual do cache
     * @returns {number}
     */
    size() {
        return this.cache.size;
    }
}

// Cache específico para projetos (TTL de 10 minutos)
export const projectCache = new CacheService(10 * 60 * 1000);

// Limpeza automática a cada 5 minutos
if (typeof window !== 'undefined') {
    setInterval(() => {
        projectCache.cleanup();
    }, 5 * 60 * 1000);
}
