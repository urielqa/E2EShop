/**
 * E2E SHOP - Componentes Globais
 * Sistema de componentes reutilizáveis
 */

// Componente de loading
function showLoading(element) {
    if (element) {
        element.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Carregando...</span>
            </div>
        `;
    }
}

// Componente de erro
function showError(element, message) {
    if (element) {
        element.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

// Componente de sucesso
function showSuccess(element, message) {
    if (element) {
        element.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

// Componente de notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar componentes
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Componentes globais carregados');
});


