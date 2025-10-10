/**
 * Sistema de Detalhes do Produto
 * Integra com ecommerce-system.js para carregar dados corretos
 */
class ProductDetailSystem {
    constructor() {
        this.currentProduct = null;
        this.similarProducts = [];
        this.isLoaded = false;
        
        console.log('🔄 ProductDetailSystem inicializado');
        this.init();
    }

    async init() {
        try {
            console.log('🔄 Iniciando ProductDetailSystem...');
            
            // Carregar produto atual imediatamente
            await this.loadCurrentProduct();
            
            // Carregar produtos similares
            await this.loadSimilarProducts();
            
            this.isLoaded = true;
            console.log('✅ ProductDetailSystem carregado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar ProductDetailSystem:', error);
            this.loadFallbackProduct();
        }
    }

    async waitForEcommerceSystem() {
        let attempts = 0;
        while (!window.ecommerceSystem && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
            console.log(`⏳ Aguardando ecommerce-system... tentativa ${attempts}`);
        }

        if (!window.ecommerceSystem) {
            console.error('❌ ecommerce-system não disponível após 10 segundos');
            throw new Error('ecommerce-system não disponível');
        }
        
        console.log('✅ ecommerce-system encontrado');
    }

    loadFallbackProduct() {
        console.log('🔄 Carregando produto fallback...');
        
        // Tentar usar o ID da URL para o fallback
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // Produtos fallback baseados no ID
        const fallbackProducts = {
            1: {
                id: 1,
                title: "Smart TV Lenovo 55\" 4K UHD",
                price: 1204.84,
                originalPrice: 1417.46,
                discount: 15,
                rating: 4.4,
                stock: 25,
                category: "Eletrônicos",
                brand: "Lenovo",
                image: "01_smart_tv_lenovo_55_4k_uhd.jpg",
                description: "Smart TV Lenovo 55 polegadas com resolução 4K UHD, perfeita para sua sala de estar."
            },
            2: {
                id: 2,
                title: "Fone Bluetooth JBL com Cancelamento de Ruído",
                price: 493.25,
                originalPrice: 548.06,
                discount: 10,
                rating: 3.8,
                stock: 55,
                category: "Eletrônicos",
                brand: "JBL",
                image: "02_fone_bluetooth_jbl_cancelamento_ruido.jpg",
                description: "Fone de ouvido Bluetooth JBL com cancelamento de ruído ativo."
            },
            3: {
                id: 3,
                title: "Aspirador Robô Britânia Wi-Fi",
                price: 768.28,
                originalPrice: 853.65,
                discount: 10,
                rating: 4.2,
                stock: 23,
                category: "Eletrodomésticos",
                brand: "Britânia",
                image: "03_aspirador_robo_britania_wifi.jpg",
                description: "Aspirador robô inteligente com Wi-Fi e controle por app."
            },
            4: {
                id: 4,
                title: "Fone Bluetooth Dell com Cancelamento de Ruído",
                price: 163.30,
                originalPrice: 204.12,
                discount: 20,
                rating: 3.4,
                stock: 35,
                category: "Eletrônicos",
                brand: "Dell",
                image: "04_fone_bluetooth_dell_cancelamento_ruido.jpg",
                description: "Fone de ouvido Bluetooth Dell com cancelamento de ruído."
            },
            5: {
                id: 5,
                title: "Aspirador Robô Mondial Wi-Fi",
                price: 1208.14,
                originalPrice: 0,
                discount: 0,
                rating: 4.2,
                stock: 20,
                category: "Eletrodomésticos",
                brand: "Mondial",
                image: "05_aspirador_robo_mondial_wifi.jpg",
                description: "Aspirador robô Mondial com Wi-Fi e programação inteligente."
            }
        };
        
        // Usar produto baseado no ID ou primeiro produto como fallback
        this.currentProduct = fallbackProducts[productId] || fallbackProducts[1];
        
        console.log('✅ Produto fallback carregado:', this.currentProduct.title);
        this.renderCurrentProduct();
        this.renderSimilarProductsFallback();
    }

    renderSimilarProductsFallback() {
        const container = document.getElementById('similar-products-grid');
        if (!container) return;

        console.log('🎨 Renderizando produtos similares fallback...');
        
        // Aplicar classe correta
        container.className = 'products-grid-products';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        container.style.gap = '20px';
        container.style.padding = '0 16px';
        container.style.maxWidth = '1400px';
        container.style.margin = '0 auto';
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        
        // Produtos similares hardcoded
        const similarProducts = [
            {
                id: 2,
                title: "Fone Bluetooth JBL com Cancelamento de Ruído",
                price: 493.25,
                originalPrice: 548.06,
                discount: 10,
                rating: 3.8,
                stock: 55,
                brand: "JBL",
                image: "02_fone_bluetooth_jbl_cancelamento_ruido.jpg"
            },
            {
                id: 3,
                title: "Aspirador Robô Britânia Wi-Fi",
                price: 768.28,
                originalPrice: 853.65,
                discount: 10,
                rating: 4.2,
                stock: 23,
                brand: "Britânia",
                image: "03_aspirador_robo_britania_wifi.jpg"
            },
            {
                id: 4,
                title: "Fone Bluetooth Dell com Cancelamento de Ruído",
                price: 163.30,
                originalPrice: 204.12,
                discount: 20,
                rating: 3.4,
                stock: 35,
                brand: "Dell",
                image: "04_fone_bluetooth_dell_cancelamento_ruido.jpg"
            },
            {
                id: 5,
                title: "Aspirador Robô Mondial Wi-Fi",
                price: 1208.14,
                originalPrice: 0,
                discount: 0,
                rating: 4.2,
                stock: 20,
                brand: "Mondial",
                image: "05_aspirador_robo_mondial_wifi.jpg"
            }
        ];
        
        container.innerHTML = similarProducts.map(product => this.renderProductCard(product)).join('');
        console.log('✅ Produtos similares fallback renderizados');
    }

    renderProductCard(product) {
        const imageUrl = `assets/images/products/${product.image}`;
        const stars = this.generateStars(product.rating);
        const stockText = product.stock > 0 ? `Em estoque (${product.stock})` : 'Indisponível';
        const stockClass = product.stock > 0 ? 'text-green-600' : 'text-red-500';

        return `
            <div class="product-card" data-product-id="${product.id}" style="display: block !important; opacity: 1 !important; visibility: visible !important;">
                <div class="product-image-container" style="position: relative; width: 100%; height: 200px; overflow: hidden; background: #f8f9fa;">
                    ${product.discount > 0 ? `<div class="discount-badge" style="position: absolute; top: 8px; left: 8px; background: #ff4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; z-index: 2;">-${product.discount}%</div>` : ''}
                    <img src="${imageUrl}" alt="${product.title}" class="product-image" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" onload="console.log('✅ Imagem carregada:', '${imageUrl}')" onerror="console.log('❌ Erro ao carregar imagem:', '${imageUrl}'); this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format'">
                    <div class="product-actions" style="position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.3s ease;">
                        <button class="btn-add-cart" onclick="ecommerceSystem.addToCart(${product.id})" style="width: 32px; height: 32px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn-view-product" onclick="ecommerceSystem.viewProduct(${product.id})" style="width: 32px; height: 32px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info" style="padding: 16px;">
                    <h3 class="product-title" style="font-size: 14px; font-weight: 500; color: #333; margin: 0 0 8px 0; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${product.title}</h3>
                    <div class="product-rating" style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                        ${stars}
                        <span class="rating-text" style="font-size: 12px; color: #666;">(${product.rating.toFixed(1)})</span>
                    </div>
                    <div class="product-price" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="current-price" style="font-size: 16px; font-weight: 600; color: #ff6b35;">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        ${product.originalPrice > product.price ? `<span class="original-price" style="font-size: 14px; color: #999; text-decoration: line-through;">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    </div>
                    <div class="product-stock ${stockClass}" style="font-size: 12px; font-weight: 500;">${stockText}</div>
                    <div class="product-brand" style="font-size: 11px; color: #666; font-weight: 500; margin-top: 4px;">${product.brand}</div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    async loadCurrentProduct() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            console.log('🔍 URL atual:', window.location.href);
            console.log('🔍 ID do produto:', productId);
            
            if (!productId) {
                console.error('❌ ID do produto não encontrado na URL');
                this.loadFallbackProduct();
                return;
            }

            // 0) Tentar carregar de produtos locais (products-local.js)
            if (Array.isArray(window.localProducts) && window.localProducts.length) {
                const local = window.localProducts.find(p => String(p.id) === String(productId));
                if (local) {
                    this.currentProduct = {
                        id: local.id,
                        title: local.name || local.title,
                        name: local.name || local.title,
                        price: Number(local.price || 0),
                        originalPrice: Number(local.originalPrice || local.price || 0),
                        discount: Number(local.discount || 0),
                        rating: Number(local.rating || 4.5),
                        stock: Number(local.stock || 0),
                        category: local.category || 'Eletrônicos',
                        brand: local.brand || '',
                        image: (local.image && local.image.startsWith('assets/')) ? local.image : `assets/images/products/${local.image}`,
                        description: local.description || ''
                    };
                    this.renderCurrentProduct();
                    return;
                }
            }

            // 1) Tentar carregar do ecommerce-system se disponível
            if (window.ecommerceSystem && window.ecommerceSystem.products.length > 0) {
                console.log('📦 Usando produtos do ecommerce-system');
                console.log('📦 Produtos disponíveis:', window.ecommerceSystem.products.map(p => ({ id: p.id, title: p.title })));
                this.currentProduct = window.ecommerceSystem.products.find(p => p.id == productId);
                
                if (this.currentProduct) {
                    console.log('✅ Produto encontrado no ecommerce-system:', this.currentProduct.title);
                    this.renderCurrentProduct();
                    return;
                } else {
                    console.log('❌ Produto não encontrado no ecommerce-system com ID:', productId);
                }
            }

            // 2) Tentar carregar da API diretamente
            if (window.productsAPI) {
                console.log('🌐 Tentando carregar da API diretamente...');
                try {
                    const apiProducts = await window.productsAPI.getProducts(1, 500);
                    if (apiProducts && apiProducts.products) {
                        const product = apiProducts.products.find(p => p.id == productId);
                        if (product) {
                            console.log('✅ Produto encontrado na API:', product.title);
                            this.currentProduct = product;
                            this.renderCurrentProduct();
                            return;
                        }
                    }
                } catch (apiError) {
                    console.error('❌ Erro ao carregar da API:', apiError);
                }
            }

            // Se não encontrou, usar fallback
            console.error('❌ Produto não encontrado, usando fallback');
            this.loadFallbackProduct();
            
        } catch (error) {
            console.error('❌ Erro ao carregar produto atual:', error);
            this.loadFallbackProduct();
        }
    }

    renderCurrentProduct() {
        if (!this.currentProduct) {
            console.error('❌ Nenhum produto para renderizar');
            return;
        }

        console.log('🎨 Renderizando produto atual:', this.currentProduct.title);
        
        // Atualizar título
        const titleElement = document.getElementById('product-title');
        if (titleElement) {
            titleElement.textContent = this.currentProduct.title;
            console.log('✅ Título atualizado:', this.currentProduct.title);
        }

        // Atualizar breadcrumb
        const breadcrumbElement = document.getElementById('breadcrumb-product');
        if (breadcrumbElement) {
            breadcrumbElement.textContent = this.currentProduct.title;
        }

        // Atualizar imagem principal
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            // Tentar usar imagem local primeiro
            let imageUrl = `assets/images/products/${this.currentProduct.image}`;
            
            // Se não tiver imagem local, usar imagem da API ou fallback (400x400px)
            if (!this.currentProduct.image || this.currentProduct.image.includes('http')) {
                imageUrl = this.currentProduct.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format&q=85';
            }
            
            mainImage.src = imageUrl;
            mainImage.alt = this.currentProduct.title;
            console.log('🖼️ Imagem principal carregada:', imageUrl);
        }

        // Atualizar preços
        const currentPriceElement = document.getElementById('current-price');
        if (currentPriceElement) {
            currentPriceElement.textContent = `R$ ${this.currentProduct.price.toFixed(2).replace('.', ',')}`;
            console.log('✅ Preço atualizado:', this.currentProduct.price);
        }

        const originalPriceElement = document.getElementById('original-price');
        if (originalPriceElement && this.currentProduct.originalPrice > this.currentProduct.price) {
            originalPriceElement.textContent = `R$ ${this.currentProduct.originalPrice.toFixed(2).replace('.', ',')}`;
            originalPriceElement.style.display = 'inline';
        }

        // Atualizar desconto
        const discountBadge = document.getElementById('discount-badge');
        if (discountBadge && this.currentProduct.discount > 0) {
            discountBadge.textContent = `-${this.currentProduct.discount}%`;
            discountBadge.style.display = 'inline';
        }

        // Atualizar avaliação
        const ratingText = document.getElementById('product-rating-text');
        if (ratingText) {
            ratingText.textContent = `${this.currentProduct.rating.toFixed(1)} (${Math.floor(Math.random() * 1000) + 100} avaliações)`;
        }

        // Atualizar descrição
        const descriptionElement = document.getElementById('product-description');
        if (descriptionElement) {
            descriptionElement.innerHTML = `
                <h3 class="text-xl font-semibold text-gray-900 mb-4">Descrição do Produto</h3>
                <div class="prose max-w-none">
                    <p class="text-gray-600 leading-relaxed mb-4">
                        ${this.currentProduct.description}
                    </p>
                    <ul class="list-disc list-inside text-gray-600 space-y-2">
                        <li>Marca: ${this.currentProduct.brand}</li>
                        <li>Categoria: ${this.currentProduct.category}</li>
                        <li>Garantia de 12 meses</li>
                        <li>Entrega rápida para todo o Brasil</li>
                    </ul>
                </div>
            `;
        }

        // Atualizar especificações
        const specTableBody = document.getElementById('spec-table-body');
        if (specTableBody) {
            specTableBody.innerHTML = `
                <tr class="border-b border-gray-200">
                    <td class="py-3 font-semibold text-gray-700">Marca</td>
                    <td class="py-3 text-gray-600">${this.currentProduct.brand}</td>
                </tr>
                <tr class="border-b border-gray-200">
                    <td class="py-3 font-semibold text-gray-700">Categoria</td>
                    <td class="py-3 text-gray-600">${this.currentProduct.category}</td>
                </tr>
                <tr class="border-b border-gray-200">
                    <td class="py-3 font-semibold text-gray-700">Avaliação</td>
                    <td class="py-3 text-gray-600">${this.currentProduct.rating.toFixed(1)} estrelas</td>
                </tr>
                <tr class="border-b border-gray-200">
                    <td class="py-3 font-semibold text-gray-700">Estoque</td>
                    <td class="py-3 text-gray-600">${this.currentProduct.stock > 0 ? `${this.currentProduct.stock} unidades` : 'Indisponível'}</td>
                </tr>
                <tr class="border-b border-gray-200">
                    <td class="py-3 font-semibold text-gray-700">Garantia</td>
                    <td class="py-3 text-gray-600">12 meses</td>
                </tr>
            `;
        }

        console.log('✅ Produto atual renderizado com sucesso');
    }

    async loadSimilarProducts() {
        try {
            console.log('🔄 Carregando produtos similares...');
            
            // Tentar usar produtos do ecommerce-system se disponível
            if (window.ecommerceSystem && window.ecommerceSystem.products.length > 0) {
                const currentId = this.currentProduct ? this.currentProduct.id : null;
                this.similarProducts = window.ecommerceSystem.products
                    .filter(p => p.id !== currentId)
                    .slice(0, 4);
                
                console.log('✅ Produtos similares do ecommerce-system:', this.similarProducts.length);
                this.renderSimilarProducts();
                return;
            }

            // Tentar carregar da API diretamente
            if (window.productsAPI) {
                try {
                    const apiProducts = await window.productsAPI.getProducts(1, 10);
                    if (apiProducts && apiProducts.products) {
                        const currentId = this.currentProduct ? this.currentProduct.id : null;
                        this.similarProducts = apiProducts.products
                            .filter(p => p.id !== currentId)
                            .slice(0, 4);
                        
                        console.log('✅ Produtos similares da API:', this.similarProducts.length);
                        this.renderSimilarProducts();
                        return;
                    }
                } catch (apiError) {
                    console.error('❌ Erro ao carregar da API:', apiError);
                }
            }

            // Se não conseguiu carregar, usar fallback
            console.log('⚠️ Usando produtos similares fallback');
            this.renderSimilarProductsFallback();
            
        } catch (error) {
            console.error('❌ Erro ao carregar produtos similares:', error);
            this.renderSimilarProductsFallback();
        }
    }

    renderSimilarProducts() {
        const container = document.getElementById('similar-products-grid');
        if (!container) {
            console.error('❌ Container de produtos similares não encontrado');
            return;
        }

        console.log('🎨 Renderizando produtos similares...');
        
        // Aplicar classe correta
        container.className = 'products-grid-products';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        container.style.gap = '20px';
        container.style.padding = '0 16px';
        container.style.maxWidth = '1400px';
        container.style.margin = '0 auto';
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        
        // Renderizar produtos usando o mesmo sistema
        container.innerHTML = this.similarProducts.map(product => {
            return this.renderProductCard(product);
        }).join('');
        
        console.log('✅ Produtos similares renderizados');
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando ProductDetailSystem...');
    window.productDetailSystem = new ProductDetailSystem();
});
