import { LoginForm } from '../../components/Admin/LoginForm.js';
import { authService } from '../../services/auth.service.js';

const loginForm = new LoginForm(async (email, password) => {
    const result = await authService.signIn(email, password);
    
    if (result.success) {
        // Redirecionar para dashboard
        window.location.href = './dashboard.html';
    } else {
        loginForm.setError('Usuário ou senha incorretos');
        const container = document.getElementById('login-form-container');
        container.innerHTML = loginForm.render();
        loginForm.attachEventListeners(container);
    }
});

// Verificar se já está autenticado
authService.getSession().then(result => {
    if (result.success && result.data) {
        window.location.href = './dashboard.html';
    } else {
        const container = document.getElementById('login-form-container');
        container.innerHTML = loginForm.render();
        loginForm.attachEventListeners(container);
    }
});
