/**
 * E2E SHOP - Sistema de Carrinho Moderno
 * Sistema tecnológico inspirado no Shopify
 */

function ModernCartSystem() {
    this.cart = this.loadCart();
    this.isOpen = false;
    this.init();
}

ModernCartSystem.prototype.init = function() {
    console.log('🛒 Inicializando sistema de carrinho moderno...');
    this.createCartUI();
    this.bindEvents();
    this.updateCartDisplay();
    console.log('✅ Sistema de carrinho moderno inicializado');
};

ModernCartSystem.prototype.loadCart = function() {
    try {
        // Tentar carregar da chave principal primeiro
        let cartData = localStorage.getItem('modern_cart');
        
        // Se não existir, tentar migrar de outras chaves
        if (!cartData) {
            const oldCart = localStorage.getItem('e2e_cart_items');
            const legacyCart = localStorage.getItem('cart');
            
            if (oldCart) {
                console.log('🔄 Migrando carrinho de e2e_cart_items para modern_cart');
                cartData = oldCart;
                localStorage.setItem('modern_cart', cartData);
                localStorage.removeItem('e2e_cart_items');
            } else if (legacyCart) {
                console.log('🔄 Migrando carrinho de cart para modern_cart');
                cartData = legacyCart;
                localStorage.setItem('modern_cart', cartData);
                localStorage.removeItem('cart');
            }
        }
        
        return JSON.parse(cartData || '[]');
    } catch (e) {
        console.error('❌ Erro ao carregar carrinho:', e);
        return [];
    }
};

ModernCartSystem.prototype.saveCart = function() {
    localStorage.setItem('modern_cart', JSON.stringify(this.cart));
};

ModernCartSystem.prototype.createCartUI = function() {
    // Criar overlay do carrinho
    var cartOverlay = document.createElement('div');
    cartOverlay.id = 'modern-cart-overlay';
    cartOverlay.className = 'modern-cart-overlay';
    cartOverlay.innerHTML = 
        '<div class="modern-cart-container">' +
            '<div class="modern-cart-header">' +
                '<h3>Carrinho de Compras</h3>' +
                '<button class="modern-cart-close" id="close-cart">' +
                    '<i class="fas fa-times"></i>' +
                '</button>' +
            '</div>' +
            '<div class="modern-cart-body" id="cart-items-container">' +
                '<!-- Itens do carrinho serão inseridos aqui -->' +
            '</div>' +
            '<div class="modern-cart-footer">' +
                '<div class="modern-cart-summary">' +
                    '<div class="summary-row">' +
                        '<span>Subtotal:</span>' +
                        '<span id="cart-subtotal">R$ 0,00</span>' +
                    '</div>' +
                    '<div class="summary-row">' +
                        '<span>Frete:</span>' +
                        '<span id="cart-shipping">R$ 0,00</span>' +
                    '</div>' +
                    '<div class="summary-row total">' +
                        '<span>Total:</span>' +
                        '<span id="cart-total">R$ 0,00</span>' +
                    '</div>' +
                '</div>' +
                '<div class="modern-cart-actions">' +
                    '<button class="modern-btn-secondary" id="continue-shopping">' +
                        '<i class="fas fa-arrow-left"></i>' +
                        'Continuar Comprando' +
                    '</button>' +
                    '<button class="modern-btn-primary" id="proceed-checkout">' +
                        '<i class="fas fa-credit-card"></i>' +
                        'Finalizar Compra' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.body.appendChild(cartOverlay);

    // Adicionar CSS moderno
    this.addModernCSS();
};

ModernCartSystem.prototype.addModernCSS = function() {
    var style = document.createElement('style');
    style.textContent = 
        '.modern-cart-overlay {' +
            'position: fixed;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: rgba(0, 0, 0, 0.5);' +
            'z-index: 10000;' +
            'display: none;' +
            'opacity: 0;' +
            'transition: all 0.3s ease;' +
        '}' +

        '.modern-cart-overlay.show {' +
            'display: flex;' +
            'opacity: 1;' +
        '}' +

        '.modern-cart-container {' +
            'background: white;' +
            'width: 100%;' +
            'max-width: 500px;' +
            'height: 100%;' +
            'margin-left: auto;' +
            'display: flex;' +
            'flex-direction: column;' +
            'box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);' +
            'transform: translateX(100%);' +
            'transition: transform 0.3s ease;' +
        '}' +

        '.modern-cart-overlay.show .modern-cart-container {' +
            'transform: translateX(0);' +
        '}' +

        '.modern-cart-header {' +
            'padding: 20px;' +
            'border-bottom: 1px solid #e5e7eb;' +
            'display: flex;' +
            'justify-content: space-between;' +
            'align-items: center;' +
            'background: #f9fafb;' +
        '}' +

        '.modern-cart-header h3 {' +
            'margin: 0;' +
            'font-size: 1.5rem;' +
            'font-weight: 600;' +
            'color: #111827;' +
        '}' +

        '.modern-cart-close {' +
            'background: none;' +
            'border: none;' +
            'font-size: 1.5rem;' +
            'color: #6b7280;' +
            'cursor: pointer;' +
            'padding: 8px;' +
            'border-radius: 50%;' +
            'transition: all 0.2s ease;' +
        '}' +

        '.modern-cart-close:hover {' +
            'background: #f3f4f6;' +
            'color: #374151;' +
        '}' +

        '.modern-cart-body {' +
            'flex: 1;' +
            'overflow-y: auto;' +
            'padding: 20px;' +
        '}' +

        '.modern-cart-item {' +
            'display: flex;' +
            'gap: 15px;' +
            'padding: 15px 0;' +
            'border-bottom: 1px solid #f3f4f6;' +
        '}' +

        '.modern-cart-item:last-child {' +
            'border-bottom: none;' +
        '}' +

        '.modern-cart-item-image {' +
            'width: 80px;' +
            'height: 80px;' +
            'border-radius: 8px;' +
            'overflow: hidden;' +
            'flex-shrink: 0;' +
        '}' +

        '.modern-cart-item-image img {' +
            'width: 100%;' +
            'height: 100%;' +
            'object-fit: cover;' +
        '}' +

        '.modern-cart-item-details {' +
            'flex: 1;' +
            'display: flex;' +
            'flex-direction: column;' +
            'gap: 8px;' +
        '}' +

        '.modern-cart-item-name {' +
            'font-weight: 600;' +
            'color: #111827;' +
            'font-size: 0.95rem;' +
            'line-height: 1.4;' +
        '}' +

        '.modern-cart-item-price {' +
            'font-weight: 600;' +
            'color: #ea580c;' +
            'font-size: 1.1rem;' +
        '}' +

        '.modern-cart-item-controls {' +
            'display: flex;' +
            'align-items: center;' +
            'gap: 10px;' +
            'margin-top: 8px;' +
        '}' +

        '.modern-quantity-control {' +
            'display: flex;' +
            'align-items: center;' +
            'border: 1px solid #d1d5db;' +
            'border-radius: 6px;' +
            'overflow: hidden;' +
        '}' +

        '.modern-quantity-btn {' +
            'background: #f9fafb;' +
            'border: none;' +
            'width: 32px;' +
            'height: 32px;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'cursor: pointer;' +
            'color: #374151;' +
            'transition: all 0.2s ease;' +
        '}' +

        '.modern-quantity-btn:hover {' +
            'background: #e5e7eb;' +
        '}' +

        '.modern-quantity-input {' +
            'width: 50px;' +
            'height: 32px;' +
            'border: none;' +
            'text-align: center;' +
            'font-weight: 600;' +
            'color: #111827;' +
        '}' +

        '.modern-remove-btn {' +
            'background: #fee2e2;' +
            'border: none;' +
            'color: #dc2626;' +
            'padding: 6px 8px;' +
            'border-radius: 4px;' +
            'cursor: pointer;' +
            'font-size: 0.8rem;' +
            'transition: all 0.2s ease;' +
        '}' +

        '.modern-remove-btn:hover {' +
            'background: #fecaca;' +
        '}' +

        '.modern-cart-footer {' +
            'border-top: 1px solid #e5e7eb;' +
            'padding: 20px;' +
            'background: #f9fafb;' +
        '}' +

        '.modern-cart-summary {' +
            'margin-bottom: 20px;' +
        '}' +

        '.summary-row {' +
            'display: flex;' +
            'justify-content: space-between;' +
            'margin-bottom: 8px;' +
            'font-size: 0.95rem;' +
        '}' +

        '.summary-row.total {' +
            'font-weight: 600;' +
            'font-size: 1.1rem;' +
            'color: #111827;' +
            'border-top: 1px solid #d1d5db;' +
            'padding-top: 8px;' +
            'margin-top: 8px;' +
        '}' +

        '.modern-cart-actions {' +
            'display: flex;' +
            'gap: 12px;' +
        '}' +

        '.modern-btn-primary, .modern-btn-secondary {' +
            'flex: 1;' +
            'padding: 12px 20px;' +
            'border-radius: 8px;' +
            'font-weight: 600;' +
            'font-size: 0.95rem;' +
            'cursor: pointer;' +
            'transition: all 0.2s ease;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'gap: 8px;' +
        '}' +

        '.modern-btn-primary {' +
            'background: #ea580c;' +
            'color: white;' +
            'border: none;' +
        '}' +

        '.modern-btn-primary:hover {' +
            'background: #dc2626;' +
            'transform: translateY(-1px);' +
        '}' +

        '.modern-btn-secondary {' +
            'background: white;' +
            'color: #374151;' +
            'border: 1px solid #d1d5db;' +
        '}' +

        '.modern-btn-secondary:hover {' +
            'background: #f9fafb;' +
            'border-color: #9ca3af;' +
        '}' +

        '.modern-cart-empty {' +
            'text-align: center;' +
            'padding: 40px 20px;' +
            'color: #6b7280;' +
        '}' +

        '.modern-cart-empty i {' +
            'font-size: 3rem;' +
            'margin-bottom: 16px;' +
            'color: #d1d5db;' +
        '}' +

        '.modern-cart-empty h4 {' +
            'margin: 0 0 8px 0;' +
            'color: #374151;' +
        '}' +

        '.modern-cart-empty p {' +
            'margin: 0;' +
            'font-size: 0.9rem;' +
        '}' +

        '@media (max-width: 768px) {' +
            '.modern-cart-container {' +
                'max-width: 100%;' +
            '}' +
            
            '.modern-cart-actions {' +
                'flex-direction: column;' +
            '}' +
        '}';
    document.head.appendChild(style);
};

ModernCartSystem.prototype.bindEvents = function() {
    var self = this;
    
    // Fechar carrinho
    document.addEventListener('click', function(e) {
        if (e.target.id === 'close-cart' || e.target.closest('#close-cart')) {
            self.closeCart();
        }
        if (e.target.id === 'continue-shopping') {
            self.closeCart();
        }
    });

    // Continuar comprando
    document.addEventListener('click', function(e) {
        if (e.target.id === 'continue-shopping') {
            self.closeCart();
        }
    });

    // Finalizar compra
    document.addEventListener('click', function(e) {
        if (e.target.id === 'proceed-checkout') {
            self.proceedToCheckout();
        }
    });

    // Controles de quantidade
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modern-quantity-btn')) {
            var itemId = e.target.closest('.modern-cart-item').dataset.itemId;
            var isIncrease = e.target.classList.contains('increase');
            self.updateQuantity(itemId, isIncrease);
        }
    });

    // Remover item
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modern-remove-btn')) {
            var itemId = e.target.closest('.modern-cart-item').dataset.itemId;
            self.removeItem(itemId);
        }
    });

    // Fechar ao clicar no overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modern-cart-overlay')) {
            self.closeCart();
        }
    });
};

ModernCartSystem.prototype.addItem = function(product) {
    console.log('🛒 ===== ADICIONANDO PRODUTO AO CARRINHO MODERNO =====');
    console.log('🛒 Produto recebido:', product);
    console.log('🛒 Carrinho atual:', this.cart);
    
    var existingItem = this.cart.find(function(item) { return String(item.id) === String(product.id); });
    
    // Validar estoque
    var requestedQty = product.quantity || 1;
    var maxStock = typeof product.stock === 'number' ? product.stock : Infinity;

    if (existingItem) {
        var newQty = existingItem.quantity + requestedQty;
        if (newQty > maxStock) {
            existingItem.quantity = Math.max(existingItem.quantity, Math.min(maxStock, existingItem.quantity));
            if (typeof window.showErrorFeedback === 'function') {
                window.showErrorFeedback(`Temos apenas ${maxStock} unidade(s) em estoque.`);
            } else {
                console.warn('Estoque insuficiente:', maxStock);
            }
        } else {
            existingItem.quantity = newQty;
        }
        console.log('🛒 Item existente encontrado, nova quantidade:', existingItem);
    } else {
        var initialQty = Math.min(requestedQty, maxStock);
        var newItem = {
            id: product.id,
            name: product.name || product.title,
            price: product.price,
            image: product.image,
            quantity: initialQty,
            currency: product.currency || 'BRL',
            stock: typeof product.stock === 'number' ? product.stock : undefined
        };
        this.cart.push(newItem);
        console.log('🛒 Novo item adicionado:', newItem);
    }
    
    console.log('🛒 Carrinho após adição:', this.cart);
    
    this.saveCart();
    this.updateCartDisplay();
    this.showSuccessMessage();
    
    // Disparar evento de carrinho atualizado
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { productId: product.id, action: 'added', quantity: product.quantity || 1 }
    }));
    
    console.log('🛒 ===== FIM DA ADIÇÃO AO CARRINHO MODERNO =====');
};

ModernCartSystem.prototype.updateQuantity = function(itemId, isIncrease) {
    var item = this.cart.find(function(item) { return item.id === itemId; });
    if (item) {
        if (isIncrease) {
            // Se houver informação de estoque salva, respeitar
            if (typeof item.stock === 'number' && item.quantity + 1 > item.stock) {
                if (typeof window.showErrorFeedback === 'function') {
                    window.showErrorFeedback(`Temos apenas ${item.stock} unidade(s) em estoque.`);
                } else {
                    console.warn('Estoque insuficiente:', item.stock);
                }
            } else {
                item.quantity += 1;
            }
        } else {
            item.quantity = Math.max(1, item.quantity - 1);
        }
        this.saveCart();
        this.updateCartDisplay();
    }
};

ModernCartSystem.prototype.removeItem = function(itemId) {
    this.cart = this.cart.filter(function(item) { return item.id !== itemId; });
    this.saveCart();
    this.updateCartDisplay();
};

ModernCartSystem.prototype.updateCartDisplay = function() {
    console.log('🔄 Atualizando exibição do carrinho...');
    console.log('🔄 Carrinho atual:', this.cart);
    
    var container = document.getElementById('cart-items-container');
    var subtotalEl = document.getElementById('cart-subtotal');
    var shippingEl = document.getElementById('cart-shipping');
    var totalEl = document.getElementById('cart-total');

    console.log('🔄 Container encontrado:', !!container);
    console.log('🔄 Subtotal element encontrado:', !!subtotalEl);
    console.log('🔄 Shipping element encontrado:', !!shippingEl);
    console.log('🔄 Total element encontrado:', !!totalEl);

    if (this.cart.length === 0) {
        console.log('🔄 Carrinho vazio, mostrando mensagem');
        if (container) {
            container.innerHTML = 
                '<div class="modern-cart-empty">' +
                    '<i class="fas fa-shopping-cart"></i>' +
                    '<h4>Seu carrinho está vazio</h4>' +
                    '<p>Adicione alguns produtos para começar suas compras</p>' +
                '</div>';
        }
    } else {
        console.log('🔄 Renderizando itens do carrinho:', this.cart.length);
        if (container) {
            var self = this;
            container.innerHTML = this.cart.map(function(item) {
                return '<div class="modern-cart-item" data-item-id="' + item.id + '">' +
                    '<div class="modern-cart-item-image">' +
                        '<img src="' + item.image + '" alt="' + item.name + '">' +
                    '</div>' +
                    '<div class="modern-cart-item-details">' +
                        '<div class="modern-cart-item-name">' + item.name + '</div>' +
                        '<div class="modern-cart-item-price">R$ ' + item.price.toFixed(2).replace('.', ',') + '</div>' +
                        '<div class="modern-cart-item-controls">' +
                            '<div class="modern-quantity-control">' +
                                '<button class="modern-quantity-btn decrease">-</button>' +
                                '<input type="number" value="' + item.quantity + '" class="modern-quantity-input" readonly>' +
                                '<button class="modern-quantity-btn increase">+</button>' +
                            '</div>' +
                            '<button class="modern-remove-btn">' +
                                '<i class="fas fa-trash"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
    }

    // Atualizar totais
    var subtotal = this.cart.reduce(function(total, item) { return total + (item.price * item.quantity); }, 0);
    var shipping = subtotal > 100 ? 0 : 15;
    var total = subtotal + shipping;

    console.log('🔄 Totais calculados:', { subtotal: subtotal, shipping: shipping, total: total });

    if (subtotalEl) subtotalEl.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Grátis' : 'R$ ' + shipping.toFixed(2).replace('.', ',');
    if (totalEl) totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

    // Atualizar contador no header
    this.updateHeaderCounter();
    
    console.log('✅ Exibição do carrinho atualizada');
};

ModernCartSystem.prototype.updateHeaderCounter = function() {
    var totalItems = this.cart.reduce(function(count, item) { return count + item.quantity; }, 0);
    var cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

ModernCartSystem.prototype.showCart = function() {
    var overlay = document.getElementById('modern-cart-overlay');
    if (overlay) {
        overlay.classList.add('show');
        this.isOpen = true;
    }
};

ModernCartSystem.prototype.closeCart = function() {
    var overlay = document.getElementById('modern-cart-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        this.isOpen = false;
    }
};

ModernCartSystem.prototype.showSuccessMessage = function() {
    // Criar notificação de sucesso
    var notification = document.createElement('div');
    notification.className = 'modern-success-notification';
    notification.innerHTML = 
        '<div class="notification-content">' +
            '<i class="fas fa-check-circle"></i>' +
            '<span>Produto adicionado ao carrinho!</span>' +
        '</div>';
    
    // Adicionar CSS para notificação
    if (!document.getElementById('modern-notification-css')) {
        var style = document.createElement('style');
        style.id = 'modern-notification-css';
        style.textContent = 
            '.modern-success-notification {' +
                'position: fixed;' +
                'top: 20px;' +
                'right: 20px;' +
                'background: #10b981;' +
                'color: white;' +
                'padding: 12px 20px;' +
                'border-radius: 8px;' +
                'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);' +
                'z-index: 10001;' +
                'transform: translateX(100%);' +
                'transition: transform 0.3s ease;' +
            '}' +
            
            '.modern-success-notification.show {' +
                'transform: translateX(0);' +
            '}' +
            
            '.notification-content {' +
                'display: flex;' +
                'align-items: center;' +
                'gap: 8px;' +
                'font-weight: 600;' +
            '}';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(function() { notification.classList.add('show'); }, 100);
    
    // Remover após 3 segundos
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() { notification.remove(); }, 300);
    }, 3000);
};

ModernCartSystem.prototype.proceedToCheckout = function() {
    if (this.cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    // Verificar login
    try {
        var currentUser = null;
        if (window.authSystem && typeof window.authSystem.getCurrentUser === 'function') {
            currentUser = window.authSystem.getCurrentUser();
        } else {
            currentUser = JSON.parse(localStorage.getItem('e2e_current_user') || 'null');
        }
        if (!currentUser || !currentUser.id) {
            alert('Para finalizar sua compra, você precisa estar logado.');
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        console.warn('auth check failed:', e);
        alert('Para finalizar sua compra, você precisa estar logado.');
        window.location.href = 'login.html';
        return;
    }
    // Salvar dados do carrinho para o checkout
    localStorage.setItem('checkout_cart', JSON.stringify(this.cart));
    // Redirecionar para checkout
    window.location.href = 'checkout.html';
};

// Inicializar sistema moderno
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando sistema de carrinho moderno...');
    try {
        console.log('🛒 Iniciando ModernCartSystem...');
        window.modernCartSystem = new ModernCartSystem();
        console.log('✅ Sistema de carrinho moderno inicializado com sucesso');
        console.log('✅ ModernCartSystem disponível:', !!window.modernCartSystem);
        console.log('✅ Tipo do ModernCartSystem:', typeof window.modernCartSystem);
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema de carrinho moderno:', error);
        console.error('❌ Stack trace:', error.stack);
    }
});

// Inicialização alternativa se DOM já estiver pronto
if (document.readyState === 'loading') {
    console.log('📄 DOM ainda carregando, aguardando...');
} else {
    console.log('📄 DOM já pronto, tentando inicialização alternativa...');
    try {
        if (!window.modernCartSystem) {
            window.modernCartSystem = new ModernCartSystem();
            console.log('✅ Sistema de carrinho moderno inicializado alternativamente');
        }
    } catch (error) {
        console.error('❌ Erro na inicialização alternativa:', error);
    }
}
