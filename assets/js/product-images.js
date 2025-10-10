/**
 * E2E SHOP - Sistema de Imagens de Produtos
 * Focado especificamente na melhoria das imagens dos produtos
 */

class ProductImages {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        console.log('🖼️ Inicializando sistema de imagens de produtos...');
        // DESABILITAR lazy loading temporariamente para debug
        // this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupProductLightbox();
    }

    setupLazyLoading() {
        // Configuração otimizada para imagens de produtos
        const options = {
            root: null,
            rootMargin: '100px', // Carregar antes de entrar na viewport
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadProductImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observar imagens de produtos existentes
        this.observeProductImages();
    }

    observeProductImages() {
        const productImages = document.querySelectorAll('.product-image, .product-card img');
        productImages.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadProductImage(img) {
        // Se já tem src válido, não fazer nada
        if (img.src && !img.src.includes('data:image/svg')) {
            console.log('✅ Imagem já carregada:', img.src);
            return;
        }

        // Adicionar placeholder enquanto carrega
        this.addLoadingPlaceholder(img);

        // Otimizar URL da imagem
        const optimizedSrc = this.optimizeProductImageUrl(img.dataset.src || img.src);
        console.log('🔄 Carregando imagem otimizada:', optimizedSrc);
        
        // Carregar imagem otimizada
        const tempImg = new Image();
        tempImg.onload = () => {
            console.log('✅ Imagem carregada com sucesso:', optimizedSrc);
            img.src = optimizedSrc;
            img.classList.remove('loading');
            img.classList.add('loaded');
            this.removeLoadingPlaceholder(img);
        };
        
        tempImg.onerror = () => {
            console.error('❌ Erro ao carregar imagem:', optimizedSrc);
            this.handleImageError(img);
        };
        
        tempImg.src = optimizedSrc;
    }

    optimizeProductImageUrl(url) {
        // Se for Unsplash, otimizar para 400x400px
        if (url.includes('unsplash.com')) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', '400'); // Padrão 400x400px
            urlObj.searchParams.set('h', '400');
            urlObj.searchParams.set('fit', 'crop');
            urlObj.searchParams.set('auto', 'format');
            urlObj.searchParams.set('q', '85'); // Qualidade alta
            return urlObj.toString();
        }

        // Se for imagem local, manter como está
        if (url.startsWith('assets/')) {
            return url;
        }

        return url;
    }

    addLoadingPlaceholder(img) {
        img.classList.add('loading');
        const container = img.parentElement;
        if (container) {
            container.classList.add('image-loading');
        }
    }

    removeLoadingPlaceholder(img) {
        img.classList.remove('loading');
        const container = img.parentElement;
        if (container) {
            container.classList.remove('image-loading');
        }
    }

    handleImageError(img) {
        console.warn('❌ Erro ao carregar imagem do produto:', img.src);
        
        // Usar fallback específico para produtos (400x400px)
        const fallbackImages = [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format&q=85',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format&q=85',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format&q=85'
        ];
        
        const fallbackIndex = Math.floor(Math.random() * fallbackImages.length);
        img.src = fallbackImages[fallbackIndex];
        img.classList.remove('loading');
        img.classList.add('error-fallback');
        this.removeLoadingPlaceholder(img);
    }

    setupProductLightbox() {
        // Criar lightbox específico para produtos
        if (!document.getElementById('product-lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.id = 'product-lightbox';
            lightbox.className = 'product-lightbox hidden';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-info">
                        <h3 class="lightbox-title"></h3>
                    </div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        // Adicionar event listeners para imagens de produtos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-image') || 
                e.target.closest('.product-image-container')) {
                e.preventDefault();
                this.openProductLightbox(e.target);
            }
        });

        // Fechar lightbox
        document.addEventListener('click', (e) => {
            const lightbox = document.getElementById('product-lightbox');
            if (e.target.classList.contains('lightbox-overlay') || 
                e.target.classList.contains('lightbox-close')) {
                this.closeProductLightbox();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProductLightbox();
            }
        });
    }

    openProductLightbox(img) {
        const lightbox = document.getElementById('product-lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');

        // Encontrar informações do produto
        const productCard = img.closest('.product-card');
        const productTitle = productCard ? 
            productCard.querySelector('.product-title, .product-name, h3')?.textContent : 
            img.alt;

        // Configurar lightbox
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = productTitle || 'Produto';

        // Mostrar lightbox
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeProductLightbox() {
        const lightbox = document.getElementById('product-lightbox');
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    optimizeExistingImages() {
        // DESABILITAR otimização temporariamente para debug
        console.log('🖼️ Sistema de otimização de imagens desabilitado para debug');
        return;
        
        // Otimizar imagens de produtos que já estão carregadas
        const productImages = document.querySelectorAll('.product-image, .product-card img');
        productImages.forEach(img => {
            if (img.src && img.src.includes('unsplash.com')) {
                const optimizedSrc = this.optimizeProductImageUrl(img.src);
                if (optimizedSrc !== img.src) {
                    img.src = optimizedSrc;
                }
            }
        });
    }

    // Método público para forçar otimização
    optimizeAllProductImages() {
        this.observeProductImages();
        this.optimizeExistingImages();
    }
}

// Inicializar sistema de imagens de produtos
document.addEventListener('DOMContentLoaded', () => {
    window.productImages = new ProductImages();
    console.log('✅ Sistema de imagens de produtos carregado');
});

// Expor método global
window.optimizeProductImages = () => {
    if (window.productImages) {
        window.productImages.optimizeAllProductImages();
    }
};

