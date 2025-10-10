/**
 * Sistema E-commerce Unificado
 * Sistema limpo e otimizado
 */

class EcommerceSystem {
    constructor() {
        this.products = [];
        this.isLoaded = false;
        this.init();
    }

    init() {
        console.log('🚀 Inicializando sistema e-commerce...');
        this.loadProducts();
        this.setupEventListeners();
        console.log('✅ Sistema e-commerce carregado!');
    }

    async loadProducts() {
        console.log('🔄 Carregando produtos da API...');
        
        try {
            // Tentar carregar da API primeiro
            await this.loadFromAPI();
        } catch (error) {
            console.log('⚠️ Erro ao carregar da API, usando produtos locais:', error);
            this.loadLocalProducts();
        }
    }

    async loadFromAPI() {
        // Verificar se a API está disponível
        if (typeof window.productsAPI === 'undefined') {
            throw new Error('API não disponível');
        }

        console.log('🌐 Carregando produtos da API...');
        const apiProducts = await window.productsAPI.getProducts(1, 500);
        
        if (!apiProducts || !apiProducts.products) {
            throw new Error('API retornou dados inválidos');
        }

        // Filtrar produtos de tecnologia
        const techProducts = this.filterTechProducts(apiProducts.products);
        
        if (techProducts.length === 0) {
            throw new Error('Nenhum produto de tecnologia encontrado');
        }

        // Limitar a 30 produtos e mapear para imagens locais
        const apiProductsLimited = techProducts.slice(0, 30);
        
        // Mapear produtos da API para usar imagens locais
        this.products = apiProductsLimited.map((product, index) => {
            const localProduct = this.getLocalProductByIndex(index);
            return {
                ...product,
                image: localProduct.image, // Usar imagem local
                title: localProduct.title, // Usar título local
                brand: localProduct.brand, // Usar marca local
                description: localProduct.description // Usar descrição local
            };
        });
        
        this.isLoaded = true;
        
        console.log(`✅ ${this.products.length} produtos carregados da API com imagens locais`);
        this.renderProducts();
    }

    getLocalProductByIndex(index) {
        const localProducts = [
            { image: "01_smart_tv_lenovo_55_4k_uhd.jpg", title: "Smart TV Lenovo 55\" 4K UHD", brand: "Lenovo", description: "Smart TV Lenovo 55 polegadas com resolução 4K UHD" },
            { image: "02_fone_bluetooth_jbl_cancelamento_ruido.jpg", title: "Fone Bluetooth JBL com Cancelamento de Ruído", brand: "JBL", description: "Fone de ouvido Bluetooth JBL com cancelamento de ruído" },
            { image: "03_aspirador_robo_britania_wifi.jpg", title: "Aspirador Robô Britânia Wi-Fi", brand: "Britânia", description: "Aspirador robô inteligente com Wi-Fi" },
            { image: "04_fone_bluetooth_dell_cancelamento_ruido.jpg", title: "Fone Bluetooth Dell com Cancelamento de Ruído", brand: "Dell", description: "Fone de ouvido Bluetooth Dell" },
            { image: "05_aspirador_robo_mondial_wifi.jpg", title: "Aspirador Robô Mondial Wi-Fi", brand: "Mondial", description: "Aspirador robô Mondial com Wi-Fi" },
            { image: "06_monitor_dell_24_75hz.jpg", title: "Monitor Dell 24\" 75Hz", brand: "Dell", description: "Monitor Dell 24 polegadas 75Hz" },
            { image: "07_cafeteira_eletrica_mondial_18_xicaras.jpg", title: "Cafeteira Elétrica Mondial 18 Xícaras", brand: "Mondial", description: "Cafeteira elétrica Mondial 18 xícaras" },
            { image: "08_cafeteira_eletrica_arno_18_xicaras.jpg", title: "Cafeteira Elétrica Arno 18 Xícaras", brand: "Arno", description: "Cafeteira elétrica Arno 18 xícaras" },
            { image: "09_cafeteira_eletrica_electrolux_18_xicaras.jpg", title: "Cafeteira Elétrica Electrolux 18 Xícaras", brand: "Electrolux", description: "Cafeteira elétrica Electrolux 18 xícaras" },
            { image: "10_monitor_sony_24_75hz.jpg", title: "Monitor Sony 24\" 75Hz", brand: "Sony", description: "Monitor Sony 24 polegadas 75Hz" },
            { image: "11_aspirador_robo_arno_wifi.jpg", title: "Aspirador Robô Arno Wi-Fi", brand: "Arno", description: "Aspirador robô Arno com Wi-Fi" },
            { image: "12_monitor_philips_29_75hz.jpg", title: "Monitor Philips 29\" 75Hz", brand: "Philips", description: "Monitor Philips 29 polegadas 75Hz" },
            { image: "13_smartphone_samsung_galaxy_a54.jpg", title: "Smartphone Samsung Galaxy A54", brand: "Samsung", description: "Smartphone Samsung Galaxy A54" },
            { image: "14_laptop_dell_inspiron_15_3000.jpg", title: "Laptop Dell Inspiron 15 3000", brand: "Dell", description: "Laptop Dell Inspiron 15 3000" },
            { image: "15_headphone_sony_wh_1000xm4.jpg", title: "Headphone Sony WH-1000XM4", brand: "Sony", description: "Headphone Sony WH-1000XM4" },
            { image: "16_tablet_apple_ipad_air_5.jpg", title: "Tablet Apple iPad Air 5", brand: "Apple", description: "Tablet Apple iPad Air 5" },
            { image: "17_smartwatch_apple_watch_series_8.jpg", title: "Smartwatch Apple Watch Series 8", brand: "Apple", description: "Smartwatch Apple Watch Series 8" },
            { image: "18_camera_canon_eos_r6_mark_ii.jpg", title: "Câmera Canon EOS R6 Mark II", brand: "Canon", description: "Câmera Canon EOS R6 Mark II" },
            { image: "19_console_playstation_5.jpg", title: "Console PlayStation 5", brand: "Sony", description: "Console PlayStation 5" },
            { image: "20_teclado_mecanico_razer_blackwidow.jpg", title: "Teclado Mecânico Razer BlackWidow", brand: "Razer", description: "Teclado Mecânico Razer BlackWidow" },
            { image: "21_mouse_gaming_logitech_g502.jpg", title: "Mouse Gaming Logitech G502", brand: "Logitech", description: "Mouse Gaming Logitech G502" },
            { image: "22_webcam_logitech_c920_hd.jpg", title: "Webcam Logitech C920 HD", brand: "Logitech", description: "Webcam Logitech C920 HD" },
            { image: "23_roteador_wifi_tp_link_archer_ax73.jpg", title: "Roteador Wi-Fi TP-Link Archer AX73", brand: "TP-Link", description: "Roteador Wi-Fi TP-Link Archer AX73" },
            { image: "24_ssd_samsung_970_evo_plus_1tb.jpg", title: "SSD Samsung 970 EVO Plus 1TB", brand: "Samsung", description: "SSD Samsung 970 EVO Plus 1TB" },
            { image: "25_ram_corsair_vengeance_16gb_ddr4.jpg", title: "RAM Corsair Vengeance 16GB DDR4", brand: "Corsair", description: "RAM Corsair Vengeance 16GB DDR4" },
            { image: "26_placa_mae_asus_rog_strix_b550.jpg", title: "Placa Mãe ASUS ROG Strix B550", brand: "ASUS", description: "Placa Mãe ASUS ROG Strix B550" },
            { image: "27_processador_intel_core_i7_12700k.jpg", title: "Processador Intel Core i7-12700K", brand: "Intel", description: "Processador Intel Core i7-12700K" },
            { image: "28_placa_video_nvidia_rtx_4070.jpg", title: "Placa de Vídeo NVIDIA RTX 4070", brand: "NVIDIA", description: "Placa de Vídeo NVIDIA RTX 4070" },
            { image: "29_fonte_corsair_rm850x_850w.jpg", title: "Fonte Corsair RM850x 850W", brand: "Corsair", description: "Fonte Corsair RM850x 850W" },
            { image: "30_gabinete_corsair_4000d_airflow.jpg", title: "Gabinete Corsair 4000D Airflow", brand: "Corsair", description: "Gabinete Corsair 4000D Airflow" }
        ];
        
        return localProducts[index] || localProducts[0];
    }

    filterTechProducts(products) {
        const techKeywords = [
            'smartphone', 'laptop', 'notebook', 'tablet', 'smartphone', 'iphone', 'samsung', 'xiaomi',
            'monitor', 'tv', 'smart tv', 'led', 'oled', '4k', 'uhd', 'hd',
            'fone', 'headphone', 'bluetooth', 'wireless', 'cancellation', 'ruído',
            'camera', 'câmera', 'canon', 'nikon', 'sony', 'fujifilm',
            'console', 'playstation', 'xbox', 'nintendo', 'gaming', 'jogo',
            'teclado', 'keyboard', 'mouse', 'gaming', 'mecânico', 'mechanical',
            'webcam', 'microfone', 'microphone', 'streaming',
            'roteador', 'router', 'wifi', 'internet', 'network',
            'ssd', 'hd', 'hard disk', 'storage', 'armazenamento',
            'ram', 'memória', 'memory', 'ddr4', 'ddr5',
            'placa mãe', 'motherboard', 'asus', 'msi', 'gigabyte',
            'processador', 'processor', 'intel', 'amd', 'core', 'ryzen',
            'placa de vídeo', 'gpu', 'nvidia', 'rtx', 'gtx', 'amd',
            'fonte', 'power supply', 'psu', 'corsair', 'evga',
            'gabinete', 'case', 'pc', 'computador', 'desktop',
            'smartwatch', 'relógio', 'watch', 'apple watch',
            'aspirador', 'robô', 'robot', 'vacuum', 'limpeza',
            'cafeteira', 'coffee', 'café', 'elétrica', 'eletric'
        ];

        const nonTechKeywords = [
            'calça', 'jeans', 'camisa', 'blusa', 'vestido', 'sapato', 'tênis',
            'maquiagem', 'perfume', 'creme', 'shampoo', 'condicionador',
            'brinquedo', 'boneca', 'carrinho', 'lego', 'bicicleta',
            'esporte', 'futebol', 'basquete', 'tênis', 'corrida',
            'automotivo', 'carro', 'moto', 'pneu', 'óleo', 'combustível'
        ];

        const techBrands = [
            'apple', 'samsung', 'sony', 'lg', 'dell', 'hp', 'lenovo', 'asus',
            'msi', 'gigabyte', 'intel', 'amd', 'nvidia', 'corsair', 'logitech',
            'razer', 'steelseries', 'hyperx', 'jbl', 'bose', 'sennheiser',
            'canon', 'nikon', 'fujifilm', 'panasonic', 'olympus',
            'microsoft', 'google', 'amazon', 'netflix', 'spotify'
        ];

        return products.filter(product => {
            const title = (product.title || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();

            // Primeiro, excluir produtos não-tecnologia
            const isNonTech = nonTechKeywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword) || category.includes(keyword)
            );

            if (isNonTech) return false;

            // Priorizar marcas conhecidas de tecnologia
            const isKnownTechBrand = techBrands.some(brandName => 
                brand.includes(brandName) || title.includes(brandName)
            );

            if (isKnownTechBrand) return true;

            // Verificar palavras-chave de tecnologia
            const isTech = techKeywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword) || category.includes(keyword)
            );

            return isTech;
        });
    }

    loadLocalProducts() {
        console.log('📦 Carregando produtos locais...');
        if (Array.isArray(window.localProducts) && window.localProducts.length) {
            // Usar exatamente os mesmos 30 produtos da base local (IDs alinhados com products.html)
            this.products = window.localProducts.map(p => ({
                id: p.id,
                title: p.name || p.title,
                name: p.name || p.title,
                price: Number(p.price),
                originalPrice: Number(p.originalPrice || p.price),
                discount: Number(p.discount || 0),
                rating: Number(p.rating || 4.5),
                stock: Number(p.stock || 0),
                category: p.category,
                brand: p.brand || '',
                image: p.image, // já vem com caminho completo
                description: p.description || ''
            }));
        } else {
            console.warn('⚠️ window.localProducts não encontrado; mantendo fallback mínimo.');
        }
        this.isLoaded = true;
        console.log(`✅ ${this.products.length} produtos locais carregados (IDs alinhados)`);
        this.renderProducts();
    }

    getProductImage(product) {
        // Verificar se o caminho já contém o prefixo
        let imagePath = product.image;
        
        if (!imagePath) {
            // Imagem padrão otimizada se não houver (400x400px)
            imagePath = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format&q=85';
        } else if (!imagePath.startsWith('assets/images/products/') && !imagePath.startsWith('http')) {
            // Adicionar prefixo apenas se necessário
            imagePath = `assets/images/products/${imagePath}`;
        } else if (imagePath.startsWith('http')) {
            // Otimizar URLs externas
            imagePath = this.optimizeImageUrl(imagePath);
        }
        
        console.log('🖼️ Carregando imagem otimizada:', imagePath, 'para produto:', product.title);
        return imagePath;
    }

    optimizeImageUrl(url) {
        // Se for Unsplash, otimizar parâmetros para 400x400px
        if (url.includes('unsplash.com')) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', '400');
            urlObj.searchParams.set('h', '400');
            urlObj.searchParams.set('fit', 'crop');
            urlObj.searchParams.set('auto', 'format');
            urlObj.searchParams.set('q', '85'); // Qualidade 85%
            return urlObj.toString();
        }
        return url;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-gray-300"></i>';
        }

        return stars;
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Card moderno (igual à página de produtos)
    renderModernProductCard(product) {
        const name = this.escapeHtml(product.name || product.title || 'Produto');
        const brand = this.escapeHtml(product.brand || '');
        const description = this.escapeHtml(product.description || 'Produto de alta qualidade com tecnologia avançada e design moderno.');
        const price = Number(product.price || 0);
        const originalPrice = Number(product.originalPrice || 0);
        const discount = Number(product.discount || 0);
        const stock = Number(product.stock || 0);
        const rating = Number(product.rating || 4.5);
        const image = this.getProductImage(product);

        return `
            <div class="product-card group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-1 hover:scale-101 relative flex flex-col h-full cursor-pointer" onclick="openProductDetail(${product.id})">
                <div class="product-image-container relative overflow-hidden" style="width: 400px; height: 400px; margin: 0 auto;">
                    <img src="${image}" alt="${name}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 optimized-image product-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format&q=85'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <i class="fas fa-tag mr-1"></i>${product.category || 'Eletrônicos'}
                    </div>
                    ${discount > 0 ? `<div class=\"absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg\">-${discount}%</div>` : ''}
                    <div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm backdrop-blur-sm">
                        <i class="fas fa-box mr-1"></i>${stock} em estoque
                    </div>
                    <button class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0" onclick="event.stopPropagation(); toggleFavorite(${product.id})">
                        <i class="fas fa-heart text-gray-400 hover:text-red-500 transition-colors duration-300"></i>
                    </button>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex items-center mb-4 h-6">
                        <div class="flex text-yellow-400 mr-3">
                            ${Array.from({ length: 5 }, (_, i) => `<i class=\"fas fa-star text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}\"></i>`).join('')}
                        </div>
                        <span class="text-sm text-gray-600 font-medium">(${rating})</span>
                        <span class="text-sm text-gray-500 ml-2">• ${Math.floor(Math.random() * 50) + 10} avaliações</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 h-14 flex items-center justify-center">${name}</h3>
                    <p class="text-sm text-gray-500 mb-3 font-medium h-6 flex items-center justify-center">${brand}</p>
                    <div class="mb-4 h-12 flex items-center justify-center"><p class="text-sm text-gray-600 line-clamp-2 text-center">${description}</p></div>
                    <div class="mb-6 h-16 flex flex-col justify-center">
                        <div class="flex items-center space-x-3 justify-center">
                            <span class="text-3xl font-bold text-gray-900">R$ ${price.toFixed(2).replace('.', ',')}</span>
                            ${discount > 0 && originalPrice > price ? `<span class=\"text-lg text-gray-500 line-through\">R$ ${originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                        </div>
                        <div class="text-sm text-green-600 font-medium mt-1"><i class="fas fa-check-circle mr-1"></i>Em estoque (${stock} unidades)</div>
                    </div>
                    <div class="flex gap-3 mt-auto">
                        <button class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-102 hover:shadow-lg hover:shadow-orange-500/25" onclick="event.stopPropagation(); addToCart(${product.id})"><i class="fas fa-shopping-cart mr-2"></i>Adicionar</button>
                        <button class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-102 hover:shadow-lg hover:shadow-green-500/25" onclick="event.stopPropagation(); buyNow(${product.id})"><i class="fas fa-bolt mr-2"></i>Comprar</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductCard(product) {
        const imageUrl = this.getProductImage(product);
        const stars = this.generateStars(product.rating);
        const stockText = product.stock > 0 ? `Em estoque (${product.stock})` : 'Indisponível';
        const stockClass = product.stock > 0 ? 'text-green-600' : 'text-red-500';
        
        // Sanitizar dados do produto
        const safeTitle = this.escapeHtml(product.title);
        const safeBrand = this.escapeHtml(product.brand);

        return `
            <div class="product-card" data-product-id="${product.id}" onclick="openProductDetail(${product.id})" style="display: block !important; opacity: 1 !important; visibility: visible !important; cursor:pointer;">
                <div class="product-image-container" style="position: relative; width: 100%; height: 200px; overflow: hidden; background: #f8f9fa;">
                    ${product.discount > 0 ? `<div class="discount-badge" style="position: absolute; top: 8px; left: 8px; background: #ff4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; z-index: 2;">-${product.discount}%</div>` : ''}
                    <img src="${imageUrl}" alt="${product.title}" class="product-image optimized-image" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" onload="console.log('✅ Imagem carregada:', '${imageUrl}')" onerror="console.log('❌ Erro ao carregar imagem:', '${imageUrl}'); this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format&q=80'">
                    <div class="product-actions" style="position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.3s ease;">
                        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})" style="width: 32px; height: 32px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn-fav favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${product.id})" style="width: 32px; height: 32px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #e11d48; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-view-product" onclick="event.stopPropagation(); ecommerceSystem.viewProduct(${product.id})" style="width: 32px; height: 32px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info" style="padding: 16px;">
                    <h3 class="product-title" style="font-size: 14px; font-weight: 500; color: #333; margin: 0 0 8px 0; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${safeTitle}</h3>
                    <div class="product-rating" style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                        ${stars}
                        <span class="rating-text" style="font-size: 12px; color: #666;">(${product.rating.toFixed(1)})</span>
                    </div>
                    <div class="product-price" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="current-price" style="font-size: 16px; font-weight: 600; color: #ff6b35;">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        ${product.originalPrice > product.price ? `<span class="original-price" style="font-size: 14px; color: #999; text-decoration: line-through;">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    </div>
                    <div class="product-stock ${stockClass}" style="font-size: 12px; font-weight: 500;">${stockText}</div>
                    <div class="product-brand" style="font-size: 11px; color: #666; font-weight: 500; margin-top: 4px;">${safeBrand}</div>
                </div>
            </div>
        `;
    }

    renderProducts() {
        // Renderizar 12 produtos na Home (Mais Vendidos da Semana) - 3 fileiras x 4
        const homeContainer = document.getElementById('modern-bestsellers-grid') || document.getElementById('home-featured');
        if (homeContainer) {
            homeContainer.className = 'products-grid-home';
            homeContainer.style.display = 'grid';
            homeContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
            homeContainer.style.gap = '20px';
            homeContainer.style.padding = '0 16px';
            homeContainer.style.maxWidth = '1400px';
            homeContainer.style.margin = '0 auto';
            homeContainer.style.opacity = '1';
            homeContainer.style.visibility = 'visible';

            const homeProducts = this.products.slice(0, 12);
            homeContainer.innerHTML = homeProducts.map(p => this.renderModernProductCard(p)).join('');

            // Navegação consistente ao clicar no card/imagem
            this.addProductNavigationListeners();
        }

        // Renderizar produtos na página de produtos (todos os produtos)
        const productsContainer = document.getElementById('products-grid');
        if (productsContainer) {
            console.log('🔍 Container de produtos encontrado:', productsContainer);
            console.log('📦 Produtos disponíveis:', this.products.length);
            
            // NÃO renderizar se já tem conteúdo (deixar o products.html renderizar)
            if (productsContainer.innerHTML.trim() === '') {
                console.log('🔄 Container vazio, renderizando produtos...');
                // Garantir que a classe correta seja aplicada
                productsContainer.className = 'products-grid-products';
                productsContainer.style.display = 'grid';
                productsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
                productsContainer.style.gap = '20px';
                productsContainer.style.padding = '0 16px';
                productsContainer.style.maxWidth = '1400px';
                productsContainer.style.margin = '0 auto';
                productsContainer.style.opacity = '1';
                productsContainer.style.visibility = 'visible';
                
                // Renderizar produtos
                productsContainer.innerHTML = this.products.map(product => this.renderModernProductCard(product)).join('');
                
                console.log('✅ Produtos renderizados na página de produtos');
            } else {
                console.log('⚠️ Container já tem conteúdo, não renderizando novamente');
            }
        }

        // Renderizar produtos no dashboard do vendedor
        const vendorContainer = document.getElementById('vendor-products');
        if (vendorContainer) {
            const vendorProducts = this.products.slice(0, 30);
            vendorContainer.innerHTML = vendorProducts.map(product => this.renderProductCard(product)).join('');
            console.log('✅ Produtos renderizados no dashboard do vendedor');
        }

        // Renderizar produtos no dashboard do admin
        const adminContainer = document.getElementById('admin-products');
        if (adminContainer) {
            const adminProducts = this.products.slice(0, 15);
            adminContainer.innerHTML = adminProducts.map(product => this.renderProductCard(product)).join('');
            console.log('✅ Produtos renderizados no dashboard do admin');
        }
    }

    addToCart(productId) {
        // Delegar para o cart unificado
        if (typeof window.addToCart === 'function') {
            window.addToCart(productId, 1);
        } else {
            console.warn('addToCart global não disponível');
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            console.log('👁️ Visualizando produto:', product.title);
            window.location.href = `product-detail.html?id=${productId}`;
        }
    }

    addProductNavigationListeners() {
        // Adicionar event listeners para cliques nos cards de produto
        document.addEventListener('click', (e) => {
            // Clique no card do produto (exceto nos botões)
            if (e.target.closest('.product-card') && !e.target.closest('button') && !e.target.closest('.product-actions')) {
                e.preventDefault();
                const card = e.target.closest('.product-card');
                let productId = card.dataset.productId;
                // fallback: extrair pelo texto do título a partir do localProducts
                if ((!productId || isNaN(Number(productId))) && Array.isArray(window.localProducts)) {
                    const titleEl = card.querySelector('.product-title');
                    const title = titleEl ? titleEl.textContent.trim() : '';
                    const match = (window.localProducts || []).find(p => String(p.title||p.name).trim() === title);
                    if (match) productId = match.id;
                }
                
                if (productId) {
                    console.log('🖱️ Navegando para produto:', productId);
                    window.location.href = `product-detail.html?id=${productId}`;
                }
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProducts();
        });
    }
}

// Inicializar sistema e-commerce
window.ecommerceSystem = new EcommerceSystem();
