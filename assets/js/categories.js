// Sistema de Categorias - E2E SHOP
class CategoriesSystem {
    constructor() {
        this.categories = {
            'eletronicos': {
                name: 'Eletrônicos',
                icon: 'fas fa-mobile-alt',
                image: 'assets/images/category-icons/Eletrônicos.jpg',
                subcategories: {
                    'smartphones': {
                        name: 'Smartphones',
                        items: ['Smartphone', 'Tablet', 'Notebook', 'Desktop', 'Monitor', 'Acessórios']
                    },
                    'notebooks': {
                        name: 'Notebooks',
                        items: ['Notebook', 'Desktop', 'Monitor', 'Teclado', 'Mouse', 'Webcam']
                    },
                    'tablets': {
                        name: 'Tablets',
                        items: ['iPad', 'Samsung Tab', 'Amazon Fire', 'Lenovo Tab', 'Huawei MediaPad']
                    },
                    'acessorios': {
                        name: 'Acessórios',
                        items: ['Fones de Ouvido', 'Carregadores', 'Capas', 'Películas', 'Suportes']
                    }
                }
            },
            'casa-jardim': {
                name: 'Casa e Jardim',
                icon: 'fas fa-home',
                image: 'assets/images/category-icons/Casa e Jardim.jpg',
                subcategories: {
                    'moveis': {
                        name: 'Móveis',
                        items: ['Sofás', 'Mesas', 'Cadeiras', 'Estantes', 'Camas', 'Armários']
                    },
                    'decoracao': {
                        name: 'Decoração',
                        items: ['Quadros', 'Plantas', 'Vasos', 'Luminárias', 'Tapetes', 'Cortinas']
                    },
                    'cozinha': {
                        name: 'Cozinha',
                        items: ['Utensílios', 'Panelas', 'Eletrodomésticos', 'Copos', 'Pratos', 'Talheres']
                    },
                    'jardim': {
                        name: 'Jardim',
                        items: ['Ferramentas', 'Plantas', 'Vasos', 'Regadores', 'Adubos', 'Sementes']
                    }
                }
            },
            'beleza': {
                name: 'Beleza',
                icon: 'fas fa-palette',
                image: 'assets/images/category-icons/Beleza.jpg',
                subcategories: {
                    'maquiagem': {
                        name: 'Maquiagem',
                        items: ['Bases', 'Pós', 'Sombras', 'Batom', 'Rímel', 'Blush']
                    },
                    'cuidados': {
                        name: 'Cuidados',
                        items: ['Cremes', 'Hidratantes', 'Protetor Solar', 'Sérum', 'Máscaras', 'Esfoliantes']
                    },
                    'perfumes': {
                        name: 'Perfumes',
                        items: ['Femininos', 'Masculinos', 'Unissex', 'Colônias', 'Desodorantes', 'Águas de Colônia']
                    }
                }
            },
            'brinquedos': {
                name: 'Brinquedos',
                icon: 'fas fa-gamepad',
                image: 'assets/images/category-icons/Brinquedos.jpg',
                subcategories: {
                    'educativos': {
                        name: 'Educativos',
                        items: ['Quebra-cabeças', 'Livros', 'Jogos de Memória', 'Brinquedos de Montar', 'Instrumentos']
                    },
                    'eletronicos': {
                        name: 'Eletrônicos',
                        items: ['Videogames', 'Tablets Infantis', 'Robôs', 'Drones', 'Carrinhos RC']
                    },
                    'bonecas': {
                        name: 'Bonecas e Acessórios',
                        items: ['Bonecas', 'Roupas', 'Casa de Boneca', 'Carrinhos de Bebê', 'Acessórios']
                    }
                }
            },
            'esportes': {
                name: 'Esportes',
                icon: 'fas fa-dumbbell',
                image: 'assets/images/category-icons/Esportes.jpg',
                subcategories: {
                    'fitness': {
                        name: 'Fitness',
                        items: ['Halteres', 'Esteiras', 'Bicicletas', 'Elásticos', 'Colchonetes', 'Roupas']
                    },
                    'futebol': {
                        name: 'Futebol',
                        items: ['Bolas', 'Chuteiras', 'Camisas', 'Shorts', 'Meias', 'Luvas']
                    },
                    'natacao': {
                        name: 'Natação',
                        items: ['Óculos', 'Toucas', 'Maiôs', 'Bermudas', 'Pranchas', 'Nadadeiras']
                    }
                }
            },
            'automotivo': {
                name: 'Automotivo',
                icon: 'fas fa-car',
                image: 'assets/images/category-icons/Automotivo.jpg',
                subcategories: {
                    'pecas': {
                        name: 'Peças',
                        items: ['Filtros', 'Óleos', 'Pneus', 'Baterias', 'Pastilhas', 'Amortecedores']
                    },
                    'acessorios': {
                        name: 'Acessórios',
                        items: ['GPS', 'Câmeras', 'Alarmes', 'Som', 'Capas', 'Organizadores']
                    },
                    'manutencao': {
                        name: 'Manutenção',
                        items: ['Ferramentas', 'Lubrificantes', 'Aditivos', 'Limpeza', 'Proteção']
                    }
                }
            }
        };
        
        this.init();
    }

    init() {
        this.createCategoriesSidebar();
        this.createMegaMenu();
        this.bindEvents();
    }

    createCategoriesSidebar() {
        const sidebar = document.querySelector('.categories-sidebar');
        if (!sidebar) return;

        console.log('🔄 Atualizando sidebar com imagens 3D...');
        
        let sidebarHTML = '<div class="categories-list">';
        
        Object.entries(this.categories).forEach(([key, category]) => {
            console.log(`📱 Carregando categoria: ${category.name} - ${category.image}`);
            sidebarHTML += `
                <div class="category-item" data-category="${key}">
                    <div class="category-icon" style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);">
                        <img src="${category.image}?v=${Date.now()}" alt="${category.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="console.error('Erro ao carregar imagem:', this.src)">
                    </div>
                    <span class="category-name">${category.name}</span>
                    <i class="fas fa-chevron-right category-arrow"></i>
                </div>
            `;
        });
        
        sidebarHTML += '</div>';
        sidebar.innerHTML = sidebarHTML;
        console.log('✅ Sidebar atualizada com imagens 3D!');
    }

    createMegaMenu() {
        const megaMenu = document.querySelector('.mega-menu');
        if (!megaMenu) return;

        let megaMenuHTML = '<div class="mega-menu-content">';
        
        Object.entries(this.categories).forEach(([key, category]) => {
            megaMenuHTML += `
                <div class="mega-category" data-category="${key}" style="display: none;">
                    <div class="mega-category-header">
                        <h3>${category.name}</h3>
                        <p>Encontre os melhores produtos em ${category.name.toLowerCase()}</p>
                    </div>
                    <div class="mega-category-content">
                        ${this.createSubcategoriesHTML(category.subcategories)}
                    </div>
                </div>
            `;
        });
        
        megaMenuHTML += '</div>';
        megaMenu.innerHTML = megaMenuHTML;
    }

    createSubcategoriesHTML(subcategories) {
        let html = '<div class="subcategories-grid">';
        
        Object.entries(subcategories).forEach(([key, subcategory]) => {
            html += `
                <div class="subcategory-column">
                    <h4 class="subcategory-title">${subcategory.name}</h4>
                    <ul class="subcategory-items">
                        ${subcategory.items.map(item => `
                            <li><a href="products.html?category=${key}&subcategory=${item.toLowerCase().replace(/\s+/g, '-')}">${item}</a></li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    bindEvents() {
        console.log('🔗 Configurando eventos das categorias...');
        
        // Click no botão de categorias
        document.addEventListener('click', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const categoriesBtn = e.target.closest('.categories-btn');
                if (categoriesBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Clique no botão de categorias');
                    this.toggleCategoriesMenu();
                }
            }
        });

        // Hover nos itens da sidebar
        document.addEventListener('mouseover', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const categoryItem = e.target.closest('.category-item');
                if (categoryItem) {
                    const categoryKey = categoryItem.dataset.category;
                    console.log('🖱️ Hover na categoria:', categoryKey);
                    this.showMegaCategory(categoryKey);
                }
            }
        });

        // Hover no mega menu
        document.addEventListener('mouseover', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const megaCategory = e.target.closest('.mega-category');
                if (megaCategory) {
                    const categoryKey = megaCategory.dataset.category;
                    console.log('🖱️ Hover no mega menu:', categoryKey);
                    this.showMegaCategory(categoryKey);
                }
            }
        });

        // Fechar menu ao sair do container
        document.addEventListener('mouseleave', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const categoriesContainer = e.target.closest('.categories-container');
                if (categoriesContainer) {
                    console.log('🖱️ Mouse saiu do container de categorias');
                    setTimeout(() => {
                        this.hideMegaMenu();
                    }, 300);
                }
            }
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            const categoriesContainer = document.querySelector('.categories-container');
            if (categoriesContainer && !categoriesContainer.contains(e.target)) {
                console.log('🖱️ Clique fora do container de categorias');
                this.hideMegaMenu();
                categoriesContainer.classList.remove('active');
            }
        });

        // Fechar menu ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('⌨️ Tecla ESC pressionada');
                this.hideMegaMenu();
                const categoriesContainer = document.querySelector('.categories-container');
                if (categoriesContainer) {
                    categoriesContainer.classList.remove('active');
                }
            }
        });

        console.log('✅ Eventos das categorias configurados!');
    }

    showMegaCategory(categoryKey) {
        // Esconder todas as categorias
        document.querySelectorAll('.mega-category').forEach(cat => {
            cat.style.display = 'none';
        });

        // Mostrar a categoria selecionada
        const targetCategory = document.querySelector(`.mega-category[data-category="${categoryKey}"]`);
        if (targetCategory) {
            targetCategory.style.display = 'block';
        }

        // Mostrar o mega menu
        const megaMenu = document.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.style.display = 'block';
            // Forçar reflow para aplicar a animação
            megaMenu.offsetHeight;
            megaMenu.style.opacity = '1';
            megaMenu.style.transform = 'translateX(0)';
        }

        // Destacar item da sidebar
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`.category-item[data-category="${categoryKey}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    hideMegaMenu() {
        console.log('🔒 Fechando mega menu...');
        
        const megaMenu = document.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.style.opacity = '0';
            megaMenu.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                megaMenu.style.display = 'none';
            }, 300);
        }

        const categoriesSidebar = document.querySelector('.categories-sidebar');
        if (categoriesSidebar) {
            categoriesSidebar.style.opacity = '0';
            categoriesSidebar.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                categoriesSidebar.style.display = 'none';
            }, 300);
        }

        const categoriesContainer = document.querySelector('.categories-container');
        if (categoriesContainer) {
            categoriesContainer.classList.remove('active');
        }

        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        console.log('✅ Mega menu fechado');
    }

    toggleCategoriesMenu() {
        console.log('🔄 Alternando menu de categorias...');
        const categoriesContainer = document.querySelector('.categories-container');
        const categoriesSidebar = document.querySelector('.categories-sidebar');
        
        if (!categoriesContainer || !categoriesSidebar) {
            console.error('❌ Elementos do menu de categorias não encontrados');
            return;
        }
        
        const isActive = categoriesContainer.classList.contains('active');
        console.log('📊 Estado atual do menu:', isActive ? 'aberto' : 'fechado');
        
        if (isActive) {
            // Fechar menu
            console.log('🔒 Fechando menu de categorias');
            this.hideMegaMenu();
        } else {
            // Abrir menu
            console.log('🔓 Abrindo menu de categorias');
            categoriesContainer.classList.add('active');
            categoriesSidebar.style.display = 'block';
            categoriesSidebar.style.opacity = '0';
            categoriesSidebar.style.transform = 'translateY(-10px)';
            
            // Forçar reflow para aplicar a animação
            categoriesSidebar.offsetHeight;
            
            // Aplicar animação
            requestAnimationFrame(() => {
                categoriesSidebar.style.opacity = '1';
                categoriesSidebar.style.transform = 'translateY(0)';
            });
        }
    }
}

// Inicializar sistema de categorias
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de categorias...');
    window.categoriesSystem = new CategoriesSystem();
    console.log('✅ Sistema de categorias inicializado!');
    
    // Debug: verificar se os elementos existem
    setTimeout(() => {
        const categoriesBtn = document.querySelector('.categories-btn');
        const categoriesContainer = document.querySelector('.categories-container');
        const categoriesSidebar = document.querySelector('.categories-sidebar');
        const megaMenu = document.querySelector('.mega-menu');
        
        console.log('🔍 Debug - Elementos encontrados:');
        console.log('- Botão de categorias:', categoriesBtn ? '✅' : '❌');
        console.log('- Container de categorias:', categoriesContainer ? '✅' : '❌');
        console.log('- Sidebar de categorias:', categoriesSidebar ? '✅' : '❌');
        console.log('- Mega menu:', megaMenu ? '✅' : '❌');
        
        if (categoriesBtn) {
            console.log('🎯 Botão de categorias encontrado, adicionando listener manual...');
            categoriesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Clique manual no botão de categorias');
                if (window.categoriesSystem) {
                    window.categoriesSystem.toggleCategoriesMenu();
                }
            });
        }
    }, 1000);
});
