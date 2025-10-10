/**
 * Sistema de Logo - E2E Shop
 * Gerencia logos responsivos e contextuais
 */

class LogoSystem {
    constructor() {
        this.logos = {
            header: {
                light: 'assets/images/logo/header/logo-light.png',
                dark: 'assets/images/logo/header/logo-dark.png',
                mobile: 'assets/images/logo/header/logo-mobile.png'
            },
            footer: {
                default: 'assets/images/logo/footer/logo-footer.png',
                white: 'assets/images/logo/footer/logo-white.png'
            },
            favicon: {
                png: 'assets/images/logo/favicon/favicon.png'
            }
        };
        
        this.isMobile = window.innerWidth <= 768;
        this.isDarkMode = false;
        
        this.init();
    }

    init() {
        console.log('🎨 Inicializando sistema de logo...');
        this.setupResponsiveListener();
        this.setupDarkModeListener();
        this.loadFavicons();
        this.renderLogos();
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
                this.renderLogos();
            }
        });
    }

    /**
     * Configura listener para mudanças de tema
     */
    setupDarkModeListener() {
        // Detectar mudanças de tema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.isDarkMode = mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            console.log(`🌙 Mudança de tema: ${this.isDarkMode ? 'Escuro' : 'Claro'}`);
            this.renderLogos();
        });
    }

    /**
     * Carrega favicons no head
     */
    loadFavicons() {
        const head = document.head;
        
        // Remover favicons existentes
        const existingFavicons = head.querySelectorAll('link[rel*="icon"], link[rel*="apple-touch-icon"]');
        existingFavicons.forEach(favicon => favicon.remove());
        
        // Favicon PNG principal
        const faviconPng = document.createElement('link');
        faviconPng.rel = 'icon';
        faviconPng.type = 'image/png';
        faviconPng.href = this.logos.favicon.png;
        head.appendChild(faviconPng);
        
        // Apple Touch Icon
        const appleTouch = document.createElement('link');
        appleTouch.rel = 'apple-touch-icon';
        appleTouch.href = this.logos.favicon.png;
        head.appendChild(appleTouch);
        
        console.log('🔗 Favicon carregado:', this.logos.favicon.png);
    }

    /**
     * Renderiza logos em todos os contextos
     */
    renderLogos() {
        this.renderHeaderLogos();
        this.renderFooterLogos();
    }

    /**
     * Renderiza logos do header
     */
    renderHeaderLogos() {
        const headerLogos = document.querySelectorAll('.header-logo');
        
        headerLogos.forEach(logoElement => {
            const context = logoElement.dataset.context || 'default';
            const logoUrl = this.getHeaderLogoUrl(context);
            
            if (logoUrl) {
                logoElement.src = logoUrl;
                logoElement.alt = 'E2E Shop Logo';
                logoElement.classList.add('logo-loaded');
                
                // Fallback se imagem não carregar
                logoElement.onerror = () => {
                    this.handleLogoError(logoElement, 'header');
                };
            }
        });
    }

    /**
     * Renderiza logos do footer
     */
    renderFooterLogos() {
        const footerLogos = document.querySelectorAll('.footer-logo');
        
        footerLogos.forEach(logoElement => {
            const context = logoElement.dataset.context || 'default';
            const logoUrl = this.getFooterLogoUrl(context);
            
            if (logoUrl) {
                logoElement.src = logoUrl;
                logoElement.alt = 'E2E Shop Logo';
                logoElement.classList.add('logo-loaded');
                
                // Fallback se imagem não carregar
                logoElement.onerror = () => {
                    this.handleLogoError(logoElement, 'footer');
                };
            }
        });
    }

    /**
     * Obtém URL do logo do header baseado no contexto
     */
    getHeaderLogoUrl(context) {
        if (this.isMobile) {
            return this.logos.header.mobile;
        }
        
        // Detectar se é fundo escuro
        const isDarkBackground = this.isDarkMode || this.hasDarkBackground();
        
        if (isDarkBackground) {
            return this.logos.header.dark;
        }
        
        return this.logos.header.light;
    }

    /**
     * Obtém URL do logo do footer baseado no contexto
     */
    getFooterLogoUrl(context) {
        // Detectar se é fundo escuro
        const isDarkBackground = this.isDarkMode || this.hasDarkBackground();
        
        if (isDarkBackground) {
            return this.logos.footer.white;
        }
        
        return this.logos.footer.default;
    }

    /**
     * Verifica se o fundo é escuro
     */
    hasDarkBackground() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const backgroundColor = computedStyle.backgroundColor;
        
        // Verificar se é um fundo escuro
        const rgb = backgroundColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128;
        }
        
        return false;
    }

    /**
     * Trata erro de carregamento do logo
     */
    handleLogoError(logoElement, context) {
        console.warn(`⚠️ Logo ${context} não carregou, usando fallback`);
        
        // Fallback para texto
        const parent = logoElement.parentElement;
        if (parent) {
            parent.innerHTML = `
                <div class="logo-fallback flex items-center space-x-2">
                    <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <i class="fas fa-shopping-bag text-white text-sm"></i>
                    </div>
                    <span class="text-xl font-bold text-gray-900">E2E SHOP</span>
                </div>
            `;
        }
    }

    /**
     * Atualiza logo específico
     */
    updateLogo(context, type, newUrl) {
        if (this.logos[context] && this.logos[context][type]) {
            this.logos[context][type] = newUrl;
            this.renderLogos();
            console.log(`✅ Logo ${context}/${type} atualizado`);
        }
    }

    /**
     * Adiciona novo logo
     */
    addLogo(context, type, url) {
        if (!this.logos[context]) {
            this.logos[context] = {};
        }
        
        this.logos[context][type] = url;
        this.renderLogos();
        console.log(`✅ Novo logo adicionado: ${context}/${type}`);
    }

    /**
     * Remove logo
     */
    removeLogo(context, type) {
        if (this.logos[context] && this.logos[context][type]) {
            delete this.logos[context][type];
            this.renderLogos();
            console.log(`🗑️ Logo removido: ${context}/${type}`);
        }
    }

    /**
     * Força atualização de todos os logos
     */
    refreshLogos() {
        console.log('🔄 Atualizando todos os logos...');
        this.renderLogos();
    }

    /**
     * Obtém informações do logo atual
     */
    getLogoInfo() {
        return {
            isMobile: this.isMobile,
            isDarkMode: this.isDarkMode,
            currentHeaderLogo: this.getHeaderLogoUrl(),
            currentFooterLogo: this.getFooterLogoUrl(),
            availableLogos: this.logos
        };
    }
}

// Inicializar sistema de logo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.logoSystem = new LogoSystem();
    console.log('🎨 Sistema de logo inicializado');
});

// Exportar para uso global
window.LogoSystem = LogoSystem;
