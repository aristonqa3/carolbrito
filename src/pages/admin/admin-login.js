import { LoginForm } from '../../components/Admin/LoginForm.js';
import { authService } from '../../services/auth.service.js';

// Função auxiliar para renderizar o formulário com verificação
function renderLoginForm(container, formInstance) {
    if (!container) {
        console.error('Container do formulário não encontrado');
        return;
    }
    
    container.innerHTML = formInstance.render();
    formInstance.attachEventListeners(container);
    
    // Verificar se o botão Home Page foi renderizado corretamente
    const homeButton = container.querySelector('.btn-home-login');
    if (!homeButton) {
        console.warn('Botão Home Page não encontrado após renderização, tentando novamente...');
        // Tentar re-renderizar uma vez
        setTimeout(() => {
            container.innerHTML = formInstance.render();
            formInstance.attachEventListeners(container);
            
            // Verificar novamente
            const retryButton = container.querySelector('.btn-home-login');
            if (!retryButton) {
                console.error('Botão Home Page ainda não encontrado após segunda tentativa');
            }
        }, 100);
    }
}

const loginForm = new LoginForm(async (email, password) => {
    const result = await authService.signIn(email, password);
    
    if (result.success) {
        // Redirecionar para dashboard
        window.location.href = './dashboard.html';
    } else {
        loginForm.setError('Usuário ou senha incorretos');
        const container = document.getElementById('login-form-container');
        renderLoginForm(container, loginForm);
    }
});

// Verificar se já está autenticado
authService.getSession().then(result => {
    if (result.success && result.data) {
        window.location.href = './dashboard.html';
    } else {
        const container = document.getElementById('login-form-container');
        renderLoginForm(container, loginForm);
    }
}).catch(error => {
    console.error('Erro ao verificar sessão:', error);
    // Renderizar formulário mesmo em caso de erro
    const container = document.getElementById('login-form-container');
    if (container) {
        renderLoginForm(container, loginForm);
    }
});
