/**
 * E2E SHOP - API de Produtos Cloudflare Pages + D1
 * Integração com catálogo de produtos
 */

function ProductsAPI() {
    this.API_BASE = 'https://catalogo-products.pages.dev';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    console.log('🚀 ProductsAPI inicializada com API real:', this.API_BASE);
}

/**
 * Busca produtos da API
 * @param {Object} params - Parâmetros de busca
 * @returns {Promise<Object>} Dados dos produtos
 */
ProductsAPI.prototype.getProducts = async function(params) {
    params = params || {};
    var page = params.page || 1;
    var pageSize = params.pageSize || 30;
    var q = params.q || '';
    var category = params.category || '';
    var brand = params.brand || '';
    var minPrice = params.minPrice || '';
    var maxPrice = params.maxPrice || '';

    var cacheKey = 'products_' + JSON.stringify(params);
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
        var cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
    }

    try {
        // Buscar todos os produtos primeiro para filtrar localmente
        var urlParams = new URLSearchParams({
            page: '1',
            pageSize: '500' // Buscar mais produtos para filtrar
        });

        var url = this.API_BASE + '/api/products?' + urlParams.toString();
        
        var response = await fetch(url);
        if (!response.ok) {
            throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }

        var data = await response.json();
        
        // Filtrar produtos de tecnologia
        var techProducts = this.filterTechProducts(data.products || []);
        
        // Limitar a 30 produtos
        var limitedProducts = techProducts.slice(0, 30);
        
        // Aplicar paginação nos produtos filtrados
        var startIndex = (page - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        var paginatedProducts = limitedProducts.slice(startIndex, endIndex);
        
        // Criar resposta com dados filtrados
        var filteredData = {
            products: paginatedProducts,
            meta: {
                total: limitedProducts.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(limitedProducts.length / pageSize)
            }
        };
        
        // Cache dos dados (com TTL menor para produtos filtrados)
        this.cache.set(cacheKey, {
            data: filteredData,
            timestamp: Date.now()
        });
        
        console.log('🔍 Produtos filtrados:', {
            total: data.products ? data.products.length : 0,
            techProducts: techProducts.length,
            limited: limitedProducts.length,
            final: paginatedProducts.length
        });

        return filteredData;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

/**
 * Busca um produto específico por ID
 * @param {string} productId - ID do produto
 * @returns {Promise<Object>} Dados do produto
 */
ProductsAPI.prototype.getProduct = async function(productId) {
    var cacheKey = 'product_' + productId;
    
    if (this.cache.has(cacheKey)) {
        var cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
    }

    try {
        console.log('🔍 Buscando produto específico:', productId);
        
        // A API não tem endpoint individual, buscar na lista geral
        console.log('🔄 Buscando produto na lista geral...');
        var products = await this.getProducts({ page: 1, pageSize: 100 });
        var product = products.products && products.products.find(function(p) {
            return String(p.id) === String(productId) || String(p.slug || '') === String(productId);
        });
        
        if (product) {
            console.log('✅ Produto encontrado na lista geral:', product);
            
            // Normalizar o produto antes de retornar
            var normalizedProduct = this.normalizeProduct(product);
            console.log('🔄 Produto normalizado:', normalizedProduct);
            
            this.cache.set(cacheKey, {
                data: normalizedProduct,
                timestamp: Date.now()
            });
            
            return normalizedProduct;
        } else {
            console.error('❌ Produto não encontrado:', productId);
            throw new Error('Produto não encontrado: ' + productId);
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar produto:', error);
        throw error;
    }
};

/**
 * Cria um pedido
 * @param {Object} orderData - Dados do pedido
 * @returns {Promise<Object>} Resultado do pedido
 */
ProductsAPI.prototype.createOrder = async function(orderData) {
    try {
        var url = this.API_BASE + '/api/orders';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            var errorData = await response.json();
            throw new Error(errorData.error || 'HTTP ' + response.status + ': ' + response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
};

/**
 * Formata preço em BRL
 * @param {number} value - Valor numérico
 * @returns {string} Preço formatado
 */
ProductsAPI.prototype.formatPrice = function(value, currency) {
    currency = currency || 'BRL';
    try {
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: currency
        });
    } catch (e) {
        return 'R$ ' + Number(value).toFixed(2);
    }
};

/**
 * Extrai dados do produto de forma segura
 * @param {Object} product - Produto da API
 * @returns {Object} Dados normalizados
 */
ProductsAPI.prototype.normalizeProduct = function(product) {
    var price = (product.price && typeof product.price === 'object') 
        ? (product.price.final || product.price.price_final || 0) 
        : (product.price_final || product.priceFinal || product.price || 0);

    var stock = (product.stock && typeof product.stock === 'object') 
        ? (product.stock.quantity || product.stock.stock_quantity || 0) 
        : (product.stock_quantity || product.stockQuantity || 0);

    var ratingAvg = (product.rating && typeof product.rating === 'object') 
        ? (product.rating.average || 0) 
        : (product.rating_average || 0);

    var ratingCount = (product.rating && typeof product.rating === 'object') 
        ? (product.rating.count || 0) 
        : (product.rating_count || 0);

    return {
        id: product.id,
        title: product.title || product.name || product.slug || product.id,
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: Number(price || 0),
        originalPrice: product.price && product.price.original ? Number(product.price.original) : null,
        discountPercent: product.price && product.price.discount_percent ? Number(product.price.discount_percent) : 0,
        currency: (product.price && product.price.currency) || 'BRL',
        stock: Number(stock || 0),
        sku: (product.stock && product.stock.sku) || product.sku || product.id,
        warehouse: (product.stock && product.stock.warehouse) || product.warehouse || 'SP',
        rating: {
            average: Number(ratingAvg || 0),
            count: Number(ratingCount || 0)
        },
        image: product.image || product.thumbnail || '',
        slug: product.slug || product.id,
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString(),
        original: product
    };
};

/**
 * Limpa cache
 */
ProductsAPI.prototype.clearCache = function() {
    this.cache.clear();
    console.log('🗑️ Cache limpo - produtos serão recarregados');
};

/**
 * Filtra produtos de tecnologia
 * @param {Array} products - Lista de produtos
 * @returns {Array} Produtos de tecnologia
 */
    ProductsAPI.prototype.filterTechProducts = function(products) {
        // Grandes marcas de tecnologia conhecidas
        var techBrands = [
            // Smartphones
            'apple', 'samsung', 'xiaomi', 'motorola', 'huawei', 'oneplus', 'google', 'pixel',
            'iphone', 'galaxy', 'pixel', 'oneplus',
            
            // Laptops/Computadores
            'apple', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'surface',
            'macbook', 'inspiron', 'xps', 'pavilion', 'envy', 'thinkpad', 'ideapad',
            'zenbook', 'vivobook', 'swift', 'aspire', 'predator', 'nitro',
            
            // Monitores
            'dell', 'samsung', 'lg', 'asus', 'acer', 'benq', 'viewsonic', 'philips',
            'ultrasharp', 'gaming', 'curved', '4k', 'oled',
            
            // Áudio
            'jbl', 'sony', 'bose', 'sennheiser', 'audio-technica', 'beats', 'airpods',
            'wh-1000xm', 'qc35', 'momentum', 'ath-m50x',
            
            // Tablets
            'apple', 'samsung', 'microsoft', 'huawei', 'lenovo', 'ipad', 'galaxy tab', 'surface',
            
            // Smartwatches
            'apple', 'samsung', 'fitbit', 'garmin', 'huawei', 'fossil', 'apple watch', 'galaxy watch',
            
            // Câmeras
            'canon', 'nikon', 'sony', 'fujifilm', 'panasonic', 'olympus', 'leica',
            'eos', 'd850', 'a7', 'xt-4', 'gh5', 'om-1',
            
            // Gaming
            'sony', 'microsoft', 'nintendo', 'razer', 'corsair', 'logitech', 'steelSeries',
            'playstation', 'xbox', 'switch', 'dualshock', 'xbox controller',
            
            // Smart Home
            'amazon', 'google', 'philips', 'nest', 'ring', 'alexa', 'google home', 'echo',
            'hue', 'nest', 'ring doorbell',
            
            // Aspiradores/Smart Home
            'irobot', 'ecovacs', 'shark', 'dyson', 'roomba', 'deebot', 'ninja',
            
            // Smart TVs
            'samsung', 'lg', 'sony', 'tcl', 'hisense', 'vizio', 'smart tv', 'oled', 'qled'
        ];
        
        // Palavras-chave específicas de tecnologia
        var techKeywords = [
            // Dispositivos móveis
            'smartphone', 'celular', 'iphone', 'samsung galaxy', 'xiaomi', 'motorola',
            'android', 'ios', 'mobile', 'telefone inteligente',
            
            // Computadores e laptops
            'notebook', 'laptop', 'computador', 'pc', 'macbook', 'dell', 'hp', 'lenovo',
            'desktop', 'workstation', 'ultrabook',
            
            // Tablets e e-readers
            'tablet', 'ipad', 'kindle', 'e-reader',
            
            // Áudio e fones
            'headphone', 'fone de ouvido', 'airpods', 'earphone', 'bluetooth',
            'headset', 'microfone', 'speaker', 'caixa de som',
            
            // Smartwatches e wearables
            'smartwatch', 'apple watch', 'galaxy watch', 'relógio inteligente',
            'fitness tracker', 'pulseira inteligente',
            
            // Câmeras e fotografia
            'camera', 'câmera', 'canon', 'nikon', 'sony', 'gopro', 'dslr',
            'mirrorless', 'action camera', 'webcam',
            
            // Gaming
            'gaming', 'console', 'playstation', 'xbox', 'nintendo switch',
            'pc gamer', 'gpu', 'placa de vídeo', 'nvidia', 'amd',
            
            // Monitores e displays
            'monitor', 'tela', 'display', 'led', 'oled', '4k', '8k',
            'ultrawide', 'curved', 'gaming monitor',
            
            // Periféricos
            'teclado', 'keyboard', 'mouse', 'mousepad', 'webcam',
            'microfone', 'headset', 'controle', 'joystick',
            
            // Hardware interno
            'processador', 'cpu', 'intel', 'amd', 'ryzen', 'core i',
            'placa mãe', 'motherboard', 'memória ram', 'ssd', 'hdd',
            'fonte', 'cooler', 'ventilador',
            
            // Rede e internet
            'roteador', 'wifi', 'internet', 'modem', 'switch', 'hub',
            'ethernet', 'bluetooth', 'nfc',
            
            // Cabos e acessórios
            'carregador', 'cabo usb', 'cabo lightning', 'cabo hdmi',
            'adaptador', 'hub usb', 'dock station',
            
            // Drones e tecnologia avançada
            'drone', 'quadcopter', 'fpv', 'drone racing',
            
            // Smart home
            'smart home', 'casa inteligente', 'alexa', 'google home',
            'assistente virtual', 'automação residencial',
            
            // Categorias de tecnologia
            'eletrônicos', 'eletrônico', 'tecnologia', 'tech',
            'informática', 'computação', 'digital',
            
            // Sistemas operacionais
            'windows', 'linux', 'macos', 'chrome os',
            
            // Software e apps
            'software', 'app', 'aplicativo', 'programa',
            
            // Tecnologias emergentes
            'realidade virtual', 'vr', 'ar', 'realidade aumentada',
            'ia', 'inteligência artificial', 'machine learning',
            'blockchain', 'criptomoeda', 'bitcoin',
            
            // Componentes específicos
            'chip', 'processador', 'memória', 'armazenamento',
            'bateria', 'carregador', 'cabo', 'conector'
        ];
    
    // Palavras que indicam NÃO tecnologia (para excluir)
    var nonTechKeywords = [
        'calça', 'jeans', 'camiseta', 'camisa', 'blusa', 'vestido',
        'sapato', 'tênis', 'sandália', 'bota', 'chinelo',
        'bolsa', 'mochila', 'carteira', 'cinto',
        'relógio tradicional', 'pulseira', 'colar', 'brinco',
        'perfume', 'maquiagem', 'creme', 'shampoo',
        'livro', 'revista', 'jornal', 'papel',
        'móvel', 'cadeira', 'mesa', 'sofá', 'cama',
        'decoração', 'quadro', 'vaso', 'planta',
        'brinquedo', 'boneca', 'carrinho', 'lego',
        'esporte', 'futebol', 'basquete', 'tênis esporte',
        'cozinha', 'panela', 'prato', 'copo', 'talher',
        'alimento', 'comida', 'bebida', 'suplemento'
    ];
    
        return products.filter(function(product) {
            var title = (product.title || product.name || '').toLowerCase();
            var description = (product.description || '').toLowerCase();
            var category = (product.category || '').toLowerCase();
            var brand = (product.brand || '').toLowerCase();
            
            // Primeiro, verificar se NÃO é tecnologia (exclusão)
            var isNonTech = nonTechKeywords.some(function(keyword) {
                return title.includes(keyword) || 
                       description.includes(keyword) || 
                       category.includes(keyword);
            });
            
            if (isNonTech) {
                return false; // Excluir produtos não-tecnologia
            }
            
            // Priorizar marcas conhecidas de tecnologia
            var isKnownBrand = techBrands.some(function(brandName) {
                return title.includes(brandName) || 
                       description.includes(brandName) || 
                       brand.includes(brandName);
            });
            
            if (isKnownBrand) {
                return true; // Incluir produtos de marcas conhecidas
            }
            
            // Depois, verificar se É tecnologia (inclusão)
            var isTech = techKeywords.some(function(keyword) {
                return title.includes(keyword) || 
                       description.includes(keyword) || 
                       category.includes(keyword) || 
                       brand.includes(keyword);
            });
            
            return isTech;
        });
};

/**
 * Verifica se a API está disponível
 * @returns {Promise<boolean>} Status da API
 */
ProductsAPI.prototype.checkHealth = async function() {
    try {
        var response = await fetch(this.API_BASE + '/api/health');
        return response.ok;
    } catch (e) {
        return false;
    }
};

// Instância global
window.productsAPI = new ProductsAPI();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsAPI;
}
