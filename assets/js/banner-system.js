/**
 * Sistema de Banners - E2E Shop
 * Gerencia banners responsivos para desktop e mobile
 */

class BannerSystem {
    constructor() {
        this.banners = [];
        this.currentBannerIndex = 0;
        this.isMobile = window.innerWidth <= 768;
        this.autoRotateInterval = null;
        this.rotationSpeed = 5000; // 5 segundos
        
        this.init();
    }

    init() {
        console.log('🎨 Inicializando sistema de banners...');
        this.loadBanners();
        this.setupResponsiveListener();
        this.preloadBannerImages(); // Pré-carrega imagens para qualidade
        this.renderBanners();
        this.startAutoRotation();
    }

    /**
     * Pré-carrega todas as imagens dos banners para garantir qualidade
     */
    preloadBannerImages() {
        console.log('🔄 Pré-carregando imagens dos banners...');
        
        this.banners.forEach(banner => {
            // Pré-carregar imagem desktop
            const desktopImg = new Image();
            desktopImg.onload = () => {
                console.log(`✅ Desktop carregado: ${banner.desktop}`);
            };
            desktopImg.src = banner.desktop;
            
            // Pré-carregar imagem mobile
            const mobileImg = new Image();
            mobileImg.onload = () => {
                console.log(`✅ Mobile carregado: ${banner.mobile}`);
            };
            mobileImg.src = banner.mobile;
        });
    }

    /**
     * Carrega a lista de banners disponíveis
     */
    loadBanners() {
        // Lista de banners disponíveis (ajustado para banners reais)
        this.banners = [
            {
                id: 1,
                name: 'Banner Principal',
                desktop: 'assets/images/banners/desktop/banner-01-desktop.png',
                mobile: 'assets/images/banners/mobile/banner-01-mobile.png',
                thumbnail: 'assets/images/banners/thumbnails/banner-01-thumb.jpg',
                title: 'Ofertas Especiais',
                subtitle: 'Até 50% de desconto',
                link: '#ofertas',
                active: true
            },
            {
                id: 2,
                name: 'Banner Categoria',
                desktop: 'assets/images/banners/desktop/banner-02-desktop.png',
                mobile: 'assets/images/banners/mobile/banner-02-mobile.png',
                thumbnail: 'assets/images/banners/thumbnails/banner-02-thumb.jpg',
                title: 'Eletrônicos',
                subtitle: 'Tecnologia de ponta',
                link: '#eletronicos',
                active: true
            },
            {
                id: 3,
                name: 'Banner Promocional',
                desktop: 'assets/images/banners/desktop/banner-03-desktop.png',
                mobile: 'assets/images/banners/mobile/banner-03-mobile.png',
                thumbnail: 'assets/images/banners/thumbnails/banner-03-thumb.jpg',
                title: 'Frete Grátis',
                subtitle: 'Em compras acima de R$ 100',
                link: '#frete-gratis',
                active: true
            }
        ];

        console.log(`📸 ${this.banners.length} banners carregados`);
        
        // Verificar se as imagens existem
        this.verifyBannerImages();
    }

    /**
     * Verifica se as imagens dos banners existem
     */
    verifyBannerImages() {
        this.banners.forEach(banner => {
            // Verificar imagem desktop
            this.checkImageExists(banner.desktop, (exists) => {
                if (!exists) {
                    console.warn(`⚠️ Banner desktop não encontrado: ${banner.desktop}`);
                }
            });
            
            // Verificar imagem mobile
            this.checkImageExists(banner.mobile, (exists) => {
                if (!exists) {
                    console.warn(`⚠️ Banner mobile não encontrado: ${banner.mobile}`);
                }
            });
        });
    }

    /**
     * Verifica se uma imagem existe
     */
    checkImageExists(src, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = src;
    }

    /**
     * Otimiza a qualidade da imagem
     */
    optimizeImageQuality(img) {
        // Força alta qualidade
        img.style.imageRendering = 'high-quality';
        img.style.imageRendering = 'auto';
        img.style.imageRendering = 'crisp-edges';
        
        // Melhora performance
        img.style.backfaceVisibility = 'hidden';
        img.style.transform = 'translateZ(0)';
        
        // Força redimensionamento suave
        img.style.imageRendering = '-webkit-optimize-contrast';
        
        console.log(`🖼️ Imagem otimizada: ${img.src}`);
    }

    /**
     * Configura listener para mudanças de responsividade
     */
    setupResponsiveListener() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                console.log(`📱 Mudança de responsividade: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
                this.renderBanners();
            }
        });
    }

    /**
     * Renderiza os banners na página
     */
    renderBanners() {
        const bannerContainer = document.getElementById('banner-container');
        if (!bannerContainer) {
            console.warn('⚠️ Container de banner não encontrado');
            return;
        }

        const activeBanners = this.banners.filter(banner => banner.active);
        if (activeBanners.length === 0) {
            console.warn('⚠️ Nenhum banner ativo encontrado');
            return;
        }

        // Limpar container
        bannerContainer.innerHTML = '';

        // Renderizar banner atual
        this.renderCurrentBanner(activeBanners);

        // Controles já estão incluídos no renderCurrentBanner
    }

    /**
     * Renderiza o banner atual
     */
    renderCurrentBanner(banners) {
        const bannerContainer = document.getElementById('banner-container');
        const currentBanner = banners[this.currentBannerIndex];
        
        if (!currentBanner) return;

        const imageSrc = this.isMobile ? currentBanner.mobile : currentBanner.desktop;
        const fallbackSrc = currentBanner.desktop; // Fallback para desktop se mobile não existir

        const bannerHTML = `
            <div class="banner-slide relative overflow-hidden rounded-2xl shadow-2xl">
                <div class="banner-image-container relative" style="min-height: 200px; max-height: 400px;">
                    <img 
                        src="${imageSrc}" 
                        alt="${currentBanner.name}"
                        class="banner-image w-full h-auto transition-all duration-500 hover:scale-105"
                        onerror="this.src='${fallbackSrc}'"
                        loading="lazy"
                        style="object-position: center center; max-width: 100%; height: auto; opacity: 0; transition: opacity 0.3s ease;"
                        onload="this.style.opacity='1'"
                    >
                    
                    <!-- Controles de navegação laterais -->
                    <button class="banner-controls banner-prev" onclick="window.bannerSystem?.previousBanner()" aria-label="Banner anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="banner-controls banner-next" onclick="window.bannerSystem?.nextBanner()" aria-label="Próximo banner">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <!-- Indicadores inferiores -->
                    <div class="banner-indicators">
                        ${this.banners.map((_, index) => `
                            <button class="banner-indicator ${index === this.currentBannerIndex ? 'active' : ''}" 
                                    onclick="window.bannerSystem?.goToBanner(${index})" 
                                    aria-label="Ir para banner ${index + 1}">
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        bannerContainer.innerHTML = bannerHTML;
        
        // Aplicar otimização de qualidade após inserir no DOM
        setTimeout(() => {
            const bannerImg = bannerContainer.querySelector('.banner-image');
            if (bannerImg) {
                this.optimizeImageQuality(bannerImg);
            }
        }, 100);
    }


    /**
     * Vai para o próximo banner
     */
    nextBanner() {
        const activeBanners = this.banners.filter(banner => banner.active);
        this.currentBannerIndex = (this.currentBannerIndex + 1) % activeBanners.length;
        this.renderBanners();
        this.resetAutoRotation();
    }

    /**
     * Vai para o banner anterior
     */
    previousBanner() {
        const activeBanners = this.banners.filter(banner => banner.active);
        this.currentBannerIndex = this.currentBannerIndex === 0 
            ? activeBanners.length - 1 
            : this.currentBannerIndex - 1;
        this.renderBanners();
        this.resetAutoRotation();
    }

    /**
     * Vai para um banner específico
     */
    goToBanner(index) {
        this.currentBannerIndex = index;
        this.renderBanners();
        this.resetAutoRotation();
    }

    /**
     * Inicia rotação automática
     */
    startAutoRotation() {
        const activeBanners = this.banners.filter(banner => banner.active);
        if (activeBanners.length <= 1) return;

        this.autoRotateInterval = setInterval(() => {
            this.nextBanner();
        }, this.rotationSpeed);
    }

    /**
     * Para a rotação automática
     */
    stopAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    /**
     * Reinicia a rotação automática
     */
    resetAutoRotation() {
        this.stopAutoRotation();
        this.startAutoRotation();
    }

    /**
     * Detecta automaticamente banners disponíveis
     */
    detectAvailableBanners() {
        const availableBanners = [];
        
        // Lista de possíveis banners (baseado nos arquivos encontrados)
        const possibleBanners = [
            { id: 1, name: 'Banner Principal', title: 'Ofertas Especiais', subtitle: 'Até 50% de desconto', link: '#ofertas' },
            { id: 2, name: 'Banner Categoria', title: 'Eletrônicos', subtitle: 'Tecnologia de ponta', link: '#eletronicos' },
            { id: 3, name: 'Banner Promocional', title: 'Frete Grátis', subtitle: 'Em compras acima de R$ 100', link: '#frete-gratis' }
        ];
        
        possibleBanners.forEach(banner => {
            const desktopPath = `assets/images/banners/desktop/banner-${banner.id.toString().padStart(2, '0')}-desktop.png`;
            const mobilePath = `assets/images/banners/mobile/banner-${banner.id.toString().padStart(2, '0')}-mobile.png`;
            const thumbnailPath = 'assets/images/banners/thumbnails/banner-01-thumb.jpg'; // Usando thumbnail existente
            
            availableBanners.push({
                ...banner,
                desktop: desktopPath,
                mobile: mobilePath,
                thumbnail: thumbnailPath,
                active: true
            });
        });
        
        return availableBanners;
    }

    /**
     * Navega para o banner anterior
     */
    previousBanner() {
        this.currentBannerIndex = this.currentBannerIndex > 0 
            ? this.currentBannerIndex - 1 
            : this.banners.length - 1;
        this.renderBanners();
        this.resetAutoRotation();
    }

    /**
     * Navega para o próximo banner
     */
    nextBanner() {
        this.currentBannerIndex = this.currentBannerIndex < this.banners.length - 1 
            ? this.currentBannerIndex + 1 
            : 0;
        this.renderBanners();
        this.resetAutoRotation();
    }

    /**
     * Vai para um banner específico
     */
    goToBanner(index) {
        if (index >= 0 && index < this.banners.length) {
            this.currentBannerIndex = index;
            this.renderBanners();
            this.resetAutoRotation();
        }
    }

    /**
     * Adiciona um novo banner
     */
    addBanner(bannerData) {
        const newBanner = {
            id: this.banners.length + 1,
            ...bannerData,
            active: true
        };
        
        this.banners.push(newBanner);
        this.renderBanners();
        console.log('✅ Novo banner adicionado:', newBanner.name);
    }

    /**
     * Remove um banner
     */
    removeBanner(bannerId) {
        this.banners = this.banners.filter(banner => banner.id !== bannerId);
        this.currentBannerIndex = 0;
        this.renderBanners();
        console.log('🗑️ Banner removido:', bannerId);
    }

    /**
     * Ativa/desativa um banner
     */
    toggleBanner(bannerId) {
        const banner = this.banners.find(b => b.id === bannerId);
        if (banner) {
            banner.active = !banner.active;
            this.renderBanners();
            console.log(`${banner.active ? '✅' : '❌'} Banner ${banner.active ? 'ativado' : 'desativado'}:`, banner.name);
        }
    }
}

// Inicializar sistema de banners quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.bannerSystem = new BannerSystem();
    console.log('🎨 Sistema de banners inicializado');
});

// Exportar para uso global
window.BannerSystem = BannerSystem;
