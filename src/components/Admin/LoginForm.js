export class LoginForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.errorMessage = '';
    }

    render() {
        const errorHtml = this.errorMessage ? `<div class="form-error">${this.errorMessage}</div>` : '';
        
        return `
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="form-label">Usuário</label>
                    <input type="text" 
                           id="username" 
                           required 
                           class="form-input"
                           autocomplete="username">
                </div>
                <div>
                    <label class="form-label">Senha</label>
                    <input type="password" 
                           id="password" 
                           required 
                           class="form-input"
                           autocomplete="current-password">
                </div>
                ${errorHtml}
                <div class="login-buttons-container">
                    <button type="submit" class="btn btn-primary login-btn-submit">
                        Entrar
                    </button>
                    <a href="/" class="btn btn-home-login" aria-label="Ir para a página inicial">
                        🏠 Home Page
                    </a>
                </div>
            </form>
        `;
    }

    attachEventListeners(element) {
        const form = element.querySelector('#login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = form.querySelector('#username').value;
                const password = form.querySelector('#password').value;

                if (this.onSubmit) {
                    await this.onSubmit(username, password);
                }
            });
        }
    }

    setError(message) {
        this.errorMessage = message;
    }

    clearError() {
        this.errorMessage = '';
    }
}
