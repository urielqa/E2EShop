/**
 * E2E SHOP - Funções do Carrinho
 * Funções globais para integração com o sistema de carrinho
 */

console.log('🛒 Carregando funções do carrinho...');

// Função para buscar dados do produto
async function getProductData(productId) {
    console.log('🔍 Buscando dados do produto:', productId);
    
    try {
        const pid = String(productId);

        // 0) Preferir base local/estado atual para manter IDs, preços e estoque corretos
        try {
            // a) window.localProducts
            if (Array.isArray(window.localProducts) && window.localProducts.length) {
                const local = window.localProducts.find(p => String(p.id) === pid);
                if (local) {
                    return {
                        id: local.id,
                        name: local.name || local.title || 'Produto sem nome',
                        price: parseFloat(local.price || 0),
                        image: local.image || generateProductImage(local),
                        stock: typeof local.stock === 'number' ? local.stock : 10,
                        category: local.category || 'Geral'
                    };
                }
            }
            // b) ecommerceSystem.products (quando renderizados na home)
            if (window.ecommerceSystem && Array.isArray(window.ecommerceSystem.products) && window.ecommerceSystem.products.length) {
                const eProd = window.ecommerceSystem.products.find(p => String(p.id) === pid);
                if (eProd) {
                    return {
                        id: eProd.id,
                        name: eProd.name || eProd.title || 'Produto sem nome',
                        price: parseFloat(eProd.price || 0),
                        image: eProd.image || generateProductImage(eProd),
                        stock: typeof eProd.stock === 'number' ? eProd.stock : 10,
                        category: eProd.category || 'Geral'
                    };
                }
            }
        } catch {}

        // Tentar buscar da API primeiro
        if (window.productsAPI) {
            console.log('🔍 Buscando produto na API...');
            const products = await window.productsAPI.getProducts({ page: 1, pageSize: 30 });
            const product = products.products?.find(p => p.id === productId);
            
            if (product) {
                console.log('✅ Produto encontrado na API:', product);
                const normalized = window.productsAPI.normalizeProduct(product);
                
                // Usar preço final se disponível
                const finalPrice = product.price?.final || product.price?.price || normalized.price || 0;
                
                const productData = {
                    id: normalized.id || productId,
                    name: normalized.title || product.title || product.name || 'Produto sem nome',
                    price: Number(finalPrice),
                    image: normalized.image || product.image || generateProductImage(normalized),
                    stock: normalized.stock || product.stock?.quantity || 10,
                    category: normalized.category || product.category || 'Geral'
                };
                
                console.log('📦 Dados do produto preparados:', productData);
                return productData;
            }
        }
        
        // Fallback: tentar cache da integração
        if (window.productsAPIIntegration && Array.isArray(window.productsAPIIntegration.products)) {
            console.log('🔍 Buscando produto no cache da productsAPIIntegration...');
            const product = window.productsAPIIntegration.products.find(p => p.id === productId);
            if (product) {
                const normalized = product; // assume já normalizado
                const finalPrice = product.price?.final || product.price?.price || product.price || 0;
                return {
                    id: product.id,
                    name: product.title || product.name || 'Produto sem nome',
                    price: Number(finalPrice),
                    image: product.image || generateProductImage(product),
                    stock: product.stock?.quantity || product.stock || 10,
                    category: product.category || 'Geral'
                };
            }
        }
        
        // Fallback: criar dados básicos com preço realista
        console.log('⚠️ Produto não encontrado na API, criando dados básicos');
        return {
            id: productId,
            name: 'Produto ' + productId,
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&auto=format',
            stock: 10,
            category: 'Geral'
        };
        
    } catch (error) {
        console.error('❌ Erro ao buscar dados do produto:', error);
        return null;
    }
}

// Função para gerar imagem do produto
function generateProductImage(product) {
    // Usar imagem do produto se disponível
    if (product.image) {
        // Se a imagem já é uma URL completa, usar diretamente
        if (product.image.startsWith('http')) {
            return product.image;
        }
        // Se é um caminho relativo, construir URL completa
        if (product.image.startsWith('assets/')) {
            return product.image;
        }
        // Se é apenas o nome do arquivo, construir caminho completo
        return 'assets/images/products/' + product.image;
    }
    
    // Fallback para imagem aleatória baseada no ID
    const imageId = product.id ? parseInt(product.id) : Math.floor(Math.random() * 1000);
    return 'https://picsum.photos/200/200?random=' + imageId;
}

// Função global para adicionar produto ao carrinho
async function addToCart(productId, quantity = 1) {
    
    try {
        // Verificar se o sistema de carrinho está disponível
        if (window.modernCartSystem) {
            console.log('✅ Sistema de carrinho moderno disponível');
            try {
                // Buscar dados completos do produto antes de adicionar
                const productData = await getProductData(productId);
                if (!productData) {
                    console.error('❌ Dados do produto não encontrados');
                    showErrorFeedback('Produto não encontrado');
                    return false;
                }
                window.modernCartSystem.addItem({
                    id: productData.id,
                    name: productData.name,
                    price: productData.price,
                    image: productData.image,
                    stock: productData.stock,
                    category: productData.category,
                    quantity
                });
                showAddToCartFeedback();
                console.log('✅ Produto adicionado via modernCartSystem');
                try { localStorage.setItem('modern_cart', JSON.stringify(window.modernCartSystem.cart)); } catch {}
                updateCartCount();
                return true;
            } catch (error) {
                console.error('❌ Erro no modernCartSystem:', error);
                throw error;
            }
        }
        
        // Fallback para sistema básico
        if (window.cartAPIIntegration) {
            console.log('✅ Sistema de carrinho API disponível');
            try {
                // Buscar dados do produto primeiro
                const productData = await getProductData(productId);
                if (productData) {
                    window.cartAPIIntegration.addItem(productData);
                    showAddToCartFeedback();
                    console.log('✅ Produto adicionado via cartAPIIntegration');
                    updateCartCount();
                    return true;
                } else {
                    console.error('❌ Dados do produto não encontrados');
                    showErrorFeedback('Produto não encontrado');
                    return false;
                }
            } catch (error) {
                console.error('❌ Erro no cartAPIIntegration:', error);
                throw error;
            }
        }
        
        // Sistema local como último recurso
        console.log('⚠️ Usando sistema local como fallback');
        try {
            const productData = await getProductData(productId);
            if (productData) {
                addToCartLocal(productData, quantity);
                showAddToCartFeedback();
                console.log('✅ Produto adicionado via sistema local');
                updateCartCount();
                return true;
            } else {
                console.error('❌ Dados do produto não encontrados');
                showErrorFeedback('Produto não encontrado');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro no sistema local:', error);
            throw error;
        }
        
    } catch (error) {
        console.error('❌ Erro ao adicionar produto ao carrinho:', error);
        console.error('❌ Stack trace:', error.stack);
        console.error('❌ Error details:', {
            name: error.name,
            message: error.message,
            productId: productId,
            quantity: quantity
        });
        
        // Não mostrar erro se for um erro de rede ou API
        if (error.message && error.message.includes('fetch')) {
            console.log('⚠️ Erro de rede, tentando sistema local...');
            try {
                const productData = await getProductData(productId);
                if (productData) {
                    addToCartLocal(productData, quantity);
                    showAddToCartFeedback();
                    updateCartCount();
                    return true;
                }
            } catch (localError) {
                console.error('❌ Erro no sistema local também:', localError);
            }
        }
        
        showErrorFeedback('Erro ao adicionar produto ao carrinho');
        return false;
    }
}

// Função global para comprar agora
async function buyNow(productId, quantity = 1) {
    console.log('⚡ Comprar agora:', productId, 'Quantidade:', quantity);
    
    try {
        // Adicionar ao carrinho primeiro
        const added = await addToCart(productId, quantity);
        
        if (added) {
            // Checar login antes de redirecionar
            let currentUser = null;
            try {
                if (window.authSystem && typeof window.authSystem.getCurrentUser === 'function') {
                    currentUser = window.authSystem.getCurrentUser();
                } else {
                    currentUser = JSON.parse(localStorage.getItem('e2e_current_user') || 'null');
                }
            } catch {}
            if (!currentUser || !currentUser.id) {
                // Mostrar modal moderno solicitando login/cadastro
                try { showLoginRequiredModal(); } catch { showErrorFeedback('Para finalizar sua compra, você precisa estar logado.'); }
                return;
            }
            // Redirecionar para checkout
            setTimeout(() => { window.location.href = 'checkout.html'; }, 500);
        }
        
    } catch (error) {
        console.error('❌ Erro ao comprar agora:', error);
        showErrorFeedback('Erro ao processar compra');
    }
}

// Função local para adicionar ao carrinho (fallback)
function addToCartLocal(productData, quantity = 1) {
    try {
        // Delegar para modernCartSystem se disponível
        if (window.modernCartSystem) {
            window.modernCartSystem.addItem({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                stock: productData.stock,
                quantity: quantity
            });
            return;
        }
        
        // Fallback: usar localStorage diretamente
        let cart = JSON.parse(localStorage.getItem('modern_cart') || '[]');
        const existingItem = cart.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                stock: productData.stock,
                quantity: quantity
            });
        }
        
        localStorage.setItem('modern_cart', JSON.stringify(cart));
        updateCartCount();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { productId: productData.id, action: 'added', quantity }
        }));
        
    } catch (error) {
        console.error('❌ Erro ao adicionar produto localmente:', error);
        throw error;
    }
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
    try {
        if (window.modernCartSystem) {
            window.modernCartSystem.removeItem(productId);
            return;
        }
        let cart = JSON.parse(localStorage.getItem('modern_cart') || '[]');
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('modern_cart', JSON.stringify(cart));
        updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { productId, action: 'removed' }
        }));
    } catch (error) {
        console.error('❌ Erro ao remover produto do carrinho:', error);
    }
}

// Função para atualizar quantidade no carrinho
function updateCartQuantity(productId, quantity) {
    try {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        if (window.modernCartSystem) {
            // Encontrar item e validar estoque
            const item = window.modernCartSystem.cart.find(i => i.id === productId);
            if (item && typeof item.stock === 'number' && quantity > item.stock) {
                if (typeof window.showErrorFeedback === 'function') {
                    window.showErrorFeedback(`Temos apenas ${item.stock} unidade(s) em estoque.`);
                }
                return;
            }
            // Atualizar diretamente
            if (item) item.quantity = quantity;
            window.modernCartSystem.saveCart();
            window.modernCartSystem.updateCartDisplay();
            updateCartCount();
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { productId, quantity } }));
            return;
        }
        // Fallback localStorage
        let cart = JSON.parse(localStorage.getItem('modern_cart') || '[]');
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (typeof item.stock === 'number' && quantity > item.stock) {
                if (typeof window.showErrorFeedback === 'function') {
                    window.showErrorFeedback(`Temos apenas ${item.stock} unidade(s) em estoque.`);
                }
                return;
            }
            item.quantity = quantity;
            localStorage.setItem('modern_cart', JSON.stringify(cart));
            updateCartCount();
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { productId, quantity } }));
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar quantidade:', error);
    }
}

// Expor funções globalmente
window.addToCart = addToCart;
window.buyNow = buyNow;
window.removeFromCart = removeFromCart;
window.getProductData = getProductData;
window.showAddToCartFeedback = showAddToCartFeedback;
window.showErrorFeedback = showErrorFeedback;

// Modal moderno de login/cadastro reutilizável
function showLoginRequiredModal() {
    try {
        // Remover se existir
        var existing = document.getElementById('global-login-required-modal');
        if (existing) existing.remove();
        
        var overlay = document.createElement('div');
        overlay.id = 'global-login-required-modal';
        overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';
        overlay.innerHTML = '\
          <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">\
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">\
              <h3 class="text-xl font-bold text-gray-900">Faça login para continuar</h3>\
              <button class="p-2 rounded-lg hover:bg-gray-100" id="glrm-close"><i class="fas fa-times text-gray-500"></i></button>\
            </div>\
            <div class="p-6">\
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center text-2xl mx-auto mb-4"><i class="fas fa-lock"></i></div>\
              <p class="text-gray-700 text-center">Para finalizar sua compra, você precisa estar logado.</p>\
            </div>\
            <div class="p-4 border-t border-gray-100 flex gap-2 justify-end">\
              <a href="register.html" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cadastrar</a>\
              <a href="login.html" class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Fazer Login</a>\
            </div>\
          </div>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
        overlay.querySelector('#glrm-close').onclick = function(){ overlay.remove(); };
    } catch (e) { console.warn('login modal failed', e); }
}
window.showLoginRequiredModal = showLoginRequiredModal;

console.log('✅ Funções do carrinho expostas globalmente');

// Função para limpar carrinho
function clearCart() {
    try {
        if (window.modernCartSystem) {
            window.modernCartSystem.cart = [];
            window.modernCartSystem.saveCart();
            window.modernCartSystem.updateCartDisplay();
        } else {
            localStorage.removeItem('modern_cart');
        }
        updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'cleared' } }));
    } catch (error) {
        console.error('❌ Erro ao limpar carrinho:', error);
    }
}

// Função para obter itens do carrinho
function getCartItems() {
    try {
        // Usar apenas modern_cart como fonte única
        const cart = JSON.parse(localStorage.getItem('modern_cart') || '[]');
        return cart.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price || 0),
            image: item.image,
            category: item.category || 'Geral',
            quantity: parseInt(item.quantity || 1),
            stock: item.stock
        }));
    } catch {
        return [];
    }
}

// Função para obter total de itens no carrinho
function getCartTotalItems() {
    const cart = getCartItems();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Função para obter total do carrinho
function getCartTotal() {
    const cart = getCartItems();
    return cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
}

// Atualiza badge e total do header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    
    if (cartCount) {
        const totalItems = getCartTotalItems();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
        const total = getCartTotal();
        cartTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }
}

// Função para mostrar feedback de adição ao carrinho
function showAddToCartFeedback() {
    console.log('✅ Mostrando feedback de adição ao carrinho');
    
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = 'cart-feedback-notification';
    notification.innerHTML = '<div class="cart-feedback-content">' +
        '<i class="fas fa-check-circle"></i>' +
        '<span>Produto adicionado ao carrinho!</span>' +
        '</div>';
    
    // Adicionar estilos
    notification.style.cssText = 'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'background: #10b981;' +
        'color: white;' +
        'padding: 12px 20px;' +
        'border-radius: 8px;' +
        'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);' +
        'z-index: 10000;' +
        'transform: translateX(100%);' +
        'transition: transform 0.3s ease;' +
        'font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;' +
        'font-size: 14px;' +
        'font-weight: 500;';
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Função para mostrar feedback de erro
function showErrorFeedback(message) {
    console.log('❌ Mostrando feedback de erro:', message);
    
    // Criar notificação de erro simples
    const notification = document.createElement('div');
    notification.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>' + message;
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Função para alternar favorito
function toggleFavorite(productId) {
    console.log('❤️ Alternando favorito:', productId);
    
    try {
        // Suporte a favoritos por usuário e visitante
        let currentUser = null; try { currentUser = JSON.parse(localStorage.getItem('e2e_current_user') || 'null'); } catch {}
        const perUserKey = currentUser && currentUser.id ? 'e2e_favorites_' + currentUser.id : 'e2e_favorites_guest';

        let favorites = JSON.parse(localStorage.getItem('e2e_favorites') || '[]');
        let scoped = JSON.parse(localStorage.getItem(perUserKey) || '[]');
        const index = favorites.indexOf(productId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            console.log('💔 Produto removido dos favoritos');
            showFavoriteFeedback('❤ Removido dos favoritos');
            scoped = scoped.filter(function(x){ return String(x) !== String(productId); });
        } else {
            favorites.push(productId);
            console.log('❤️ Produto adicionado aos favoritos');
            showFavoriteFeedback('❤ Adicionado aos favoritos');
            if (!scoped.includes(productId)) scoped.push(productId);
        }
        
        localStorage.setItem('e2e_favorites', JSON.stringify(favorites));
        localStorage.setItem(perUserKey, JSON.stringify(scoped));
        
        // Atualizar UI se necessário
        const favoriteBtn = document.querySelector(`[data-product-id="${productId}"] .favorite-btn`);
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('favorited', favorites.includes(productId));
        }

        // Disparar evento para páginas interessadas (ex: profile)
        try { window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { productId, favorites } })); } catch {}
        
    } catch (error) {
        console.error('❌ Erro ao alternar favorito:', error);
    }
}

// Expor globalmente (com alias para evitar conflito de nome em páginas que redeclaram)
window.toggleFavorite = toggleFavorite;
window.__cart_toggleFavorite = toggleFavorite;

// Feedback visual para favoritos
function showFavoriteFeedback(message) {
    try {
        const n = document.createElement('div');
        n.className = 'fixed top-5 right-5 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
        n.textContent = message || 'Ação realizada';
        document.body.appendChild(n);
        setTimeout(() => { if (n && n.parentNode) n.remove(); }, 2500);
    } catch {}
}

// Função para compartilhar produto
function shareProduct(productId) {
    console.log('📤 Compartilhando produto:', productId);
    
    const url = `${window.location.origin}/product-detail.html?id=${productId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Confira este produto no E2E SHOP',
            url: url
        });
    } else {
        // Fallback para copiar URL
        navigator.clipboard.writeText(url).then(() => {
            showAddToCartFeedback(); // Reutilizar função de feedback
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Funções do carrinho carregadas!');
    
    // Atualizar contador do carrinho
    updateCartCount();
    
    // Escutar mudanças no carrinho
    window.addEventListener('storage', function(e) {
        if (e.key === 'e2e_cart_items' || e.key === 'modern_cart') {
            updateCartCount();
        }
    });
    
    // Escutar evento customizado de carrinho atualizado
    window.addEventListener('cartUpdated', function(e) {
        updateCartCount();
    });
});

console.log('✅ Funções do carrinho carregadas com sucesso!');
