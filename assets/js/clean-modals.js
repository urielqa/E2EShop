// E2E SHOP - Sistema de Modais Limpos e Modernos
// Design limpo, rápido e sem efeitos estranhos

console.log('🛒 E2E SHOP - Carregando sistema de modais limpos...');

class CleanModalSystem {
    constructor() {
        this.activeModals = new Set();
        this.init();
    }

    init() {
        this.injectStyles();
        console.log('✅ Sistema de modais limpos inicializado');
    }

    injectStyles() {
        const styleId = 'clean-modal-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            <style id="${styleId}">
                /* MODAIS LIMPOS E MODERNOS */
                .clean-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                }

                .clean-modal.show {
                    opacity: 1;
                    visibility: visible;
                }

                .clean-modal-content {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 0;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    transform: scale(0.95);
                    transition: transform 0.2s ease;
                }

                .clean-modal.show .clean-modal-content {
                    transform: scale(1);
                }

                .clean-modal-header {
                    background: #ffffff;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e5e5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .clean-modal-title {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin: 0;
                }

                .clean-modal-close {
                    background: #f5f5f5;
                    border: none;
                    color: #666666;
                    font-size: 1.1rem;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: background 0.2s ease;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .clean-modal-close:hover {
                    background: #e5e5e5;
                }

                .clean-modal-body {
                    padding: 24px;
                    color: #333333;
                    line-height: 1.6;
                }

                .clean-modal-footer {
                    background: #fafafa;
                    padding: 16px 24px;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                /* BOTÕES LIMPOS */
                .clean-modal-btn {
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .clean-modal-btn-primary {
                    background: #f97316;
                    color: #ffffff;
                }

                .clean-modal-btn-primary:hover {
                    background: #ea580c;
                }

                .clean-modal-btn-secondary {
                    background: #ffffff;
                    color: #666666;
                    border: 1px solid #d0d0d0;
                }

                .clean-modal-btn-secondary:hover {
                    background: #f5f5f5;
                }

                /* MODAL DE PRODUTO LIMPO */
                .clean-product-modal {
                    max-width: 600px;
                }

                .clean-product-content {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                }

                .clean-product-image {
                    flex: 1;
                    max-width: 250px;
                }

                .clean-product-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .clean-product-info {
                    flex: 1;
                }

                .clean-product-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                }

                .clean-product-price {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #f97316;
                    margin-bottom: 12px;
                }

                .clean-product-description {
                    color: #666666;
                    margin-bottom: 16px;
                    line-height: 1.5;
                }

                .clean-product-stock {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    border-left: 3px solid #f97316;
                }

                .clean-product-stock-label {
                    font-weight: 500;
                    color: #333333;
                    margin-bottom: 4px;
                }

                .clean-product-stock-value {
                    color: #666666;
                    font-size: 0.9rem;
                }

                /* MODAL DE CONFIRMAÇÃO LIMPO */
                .clean-confirmation-modal {
                    text-align: center;
                }

                .clean-confirmation-icon {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 16px;
                    background: #f97316;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: #ffffff;
                }

                .clean-confirmation-message {
                    font-size: 1.1rem;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .clean-confirmation-submessage {
                    font-size: 0.9rem;
                    color: #666666;
                    margin-bottom: 6px;
                }

                /* RESPONSIVIDADE */
                @media (max-width: 768px) {
                    .clean-modal-content {
                        width: 95%;
                        margin: 20px;
                    }
                    
                    .clean-product-content {
                        flex-direction: column;
                    }
                    
                    .clean-product-image {
                        max-width: 100%;
                    }
                    
                    .clean-modal-header,
                    .clean-modal-body,
                    .clean-modal-footer {
                        padding: 16px;
                    }
                }

                /* OTIMIZAÇÕES DE PERFORMANCE */
                .clean-modal * {
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                }

                /* Reduzir animações em dispositivos com preferência por movimento reduzido */
                @media (prefers-reduced-motion: reduce) {
                    .clean-modal,
                    .clean-modal-content {
                        transition: none !important;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    show(id, title, content, options = {}) {
        // Remove modal existente se houver
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const type = options.type || 'default';
        const showClose = options.showClose !== false;
        const showFooter = options.showFooter !== false;
        const footerContent = options.footerContent || '';

        const modalHtml = `
            <div class="clean-modal ${type === 'confirmation' ? 'clean-confirmation-modal' : ''}" id="${id}">
                <div class="clean-modal-content ${type === 'product' ? 'clean-product-modal' : ''}">
                    <div class="clean-modal-header">
                        <h3 class="clean-modal-title">${title}</h3>
                        ${showClose ? `
                            <button class="clean-modal-close">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="clean-modal-body">
                        ${content}
                    </div>
                    ${showFooter ? `
                        <div class="clean-modal-footer">
                            ${footerContent}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById(id);
        this.activeModals.add(id);

        // Eventos do modal
        const closeBtn = modal.querySelector('.clean-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close(id));
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close(id);
        });

        // Mostra modal
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        return modal;
    }

    close(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('show');
            this.activeModals.delete(id);
            
            // Remove modal após animação
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 200);
        }
    }

    closeAll() {
        this.activeModals.forEach(id => this.close(id));
    }
}

// Inicializar sistema
window.cleanModals = new CleanModalSystem();

// Função global para compatibilidade
window.showCleanModal = (id, title, content, options) => {
    return window.cleanModals.show(id, title, content, options);
};

window.closeCleanModal = (id) => {
    return window.cleanModals.close(id);
};

console.log('✅ E2E SHOP - Sistema de modais limpos carregado com sucesso!');


