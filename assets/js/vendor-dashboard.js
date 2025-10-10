// E2E SHOP - Dashboard do Vendedor
// Gerencia produtos, vendas e analytics do vendedor

console.log('📊 E2E SHOP - Carregando dashboard do vendedor...');

class VendorDashboard {
    constructor() {
        this.currentUser = null;
        this.vendorProducts = [];
        
        // Dados do vendedor
        this.monthlySales = 0.00;
        this.productsSold = 0;
        this.commission = 0.00;
        this.rating = 0.0;
        this.recentSales = [];
        this.topProducts = [];
        
        this.init();
    }

    init() {
        console.log('🚀 Iniciando VendorDashboard...');
        
        try {
            this.checkAuth();
            this.loadVendorData();
            this.bindEvents();
            this.updateStats();
            console.log('✅ Dashboard do vendedor inicializado');
        } catch (error) {
            console.error('❌ Erro na inicialização do VendorDashboard:', error);
            // Continuar mesmo com erro para permitir funcionalidades básicas
        }
    }

    checkAuth() {
        console.log('🔐 Verificando autenticação...');
        
        if (!window.authSystem) {
            console.log('⚠️ Sistema de autenticação não disponível, redirecionando para login');
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = window.authSystem.getCurrentUser();
        if (!this.currentUser) {
            console.log('⚠️ Usuário não logado, redirecionando para login');
            window.location.href = 'login.html';
            return;
        }

        if (this.currentUser.profile !== 'vendedor' && this.currentUser.profile !== 'administrador') {
            console.log('⚠️ Perfil não autorizado, redirecionando para página inicial');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('✅ Autenticação verificada:', this.currentUser);
        
        // Atualizar nome do usuário na interface
        this.updateUserInterface();
    }
    
    updateUserInterface() {
        if (this.currentUser) {
            const vendorNameElement = document.getElementById('vendor-name');
            if (vendorNameElement) {
                vendorNameElement.textContent = this.currentUser.fullName || this.currentUser.firstName + ' ' + this.currentUser.lastName;
                console.log('👤 Nome do usuário atualizado:', vendorNameElement.textContent);
            }
        }
    }

    loadVendorData() {
        console.log('📊 Carregando dados do vendedor...');
        
        // Carregar dados do localStorage primeiro
        this.loadRealVendorData();
        
        // Se não há produtos, carregar da API
        if (!this.vendorProducts || this.vendorProducts.length === 0) {
            this.loadProductsFromAPI();
        }
        
        this.loadProducts();
        this.loadOrders();
        this.loadAnalytics();
    }

    loadProducts() {
        console.log('📦 Carregando produtos...');
        // Implementação básica para evitar erros
    }

    loadOrders() {
        console.log('📋 Carregando pedidos...');
        // Implementação básica para evitar erros
    }

    loadAnalytics() {
        console.log('📊 Carregando analytics...');
        // Implementação básica para evitar erros
    }

    updateStats() {
        console.log('📈 Atualizando estatísticas...');
        // Implementação básica para evitar erros
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.dashboard-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Add product form
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            window.authSystem.logout();
        });
    }

    switchTab(tabId) {
        // Update nav buttons
        document.querySelectorAll('.dashboard-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tabs
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    updateStats() {
        // Total products
        document.getElementById('total-products').textContent = this.vendorProducts.length;

        // Total sales (mock data)
        const totalSales = Math.floor(Math.random() * 100) + 50;
        document.getElementById('total-sales').textContent = totalSales;

        // Total revenue (mock data)
        const totalRevenue = (Math.random() * 50000 + 10000).toFixed(2);
        document.getElementById('total-revenue').textContent = `R$ ${totalRevenue.replace('.', ',')}`;

        // Low stock products
        const lowStockProducts = this.vendorProducts.filter(product => product.stock < 10).length;
        document.getElementById('low-stock').textContent = lowStockProducts;
    }

    loadProducts() {
        const productsList = document.getElementById('vendor-products-list');
        if (this.vendorProducts.length === 0) {
            productsList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-box"></i>
                            <h3>Nenhum produto encontrado</h3>
                            <p>Adicione seu primeiro produto para começar a vender.</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            productsList.innerHTML = this.vendorProducts.map(product => this.createProductRow(product)).join('');
        }
    }

    createProductRow(product) {
        return `
            <tr>
                <td>
                    <div class="product-info">
                        <img src="assets/images/products/${product.image}" alt="${product.name}" onerror="this.src='assets/images/https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format'" class="product-thumb">
                        <div>
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                        </div>
                    </div>
                </td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
                <td>
                    <span class="stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                        ${product.stock} unidades
                    </span>
                </td>
                <td>
                    <span class="status-badge ${product.isActive ? 'active' : 'inactive'}">
                        ${product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="vendorDashboard.editProduct(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="vendorDashboard.addStock(${product.id})" title="Adicionar Estoque">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="vendorDashboard.deleteProduct(${product.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getCategoryName(category) {
        const categories = {
            'smartphones': 'Smartphones',
            'notebooks': 'Notebooks',
            'tablets': 'Tablets',
            'acessorios': 'Acessórios'
        };
        return categories[category] || category;
    }

    addProduct() {
        const formData = new FormData(document.getElementById('add-product-form'));
        const productData = {
            id: Date.now(),
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            image: formData.get('image') || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format',
            vendorId: this.currentUser.id,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        // Add to products array
        window.productSystem.products.push(productData);
        window.productSystem.saveProducts();

        // Reload data
        this.loadVendorData();
        this.updateStats();

        // Clear form
        document.getElementById('add-product-form').reset();

        // Switch to products tab
        this.switchTab('products');

        this.showNotification('Produto adicionado com sucesso!', 'success');
    }

    editProduct(productId) {
        const product = this.vendorProducts.find(p => p.id === productId);
        if (!product) return;

        // Fill form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;

        // Switch to add product tab
        this.switchTab('add-product');

        // Update form to edit mode
        const form = document.getElementById('add-product-form');
        form.dataset.editId = productId;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    }

    addStock(productId) {
        const product = this.vendorProducts.find(p => p.id === productId);
        if (!product) return;

        if (window.productSystem && window.productSystem.showStockModal) {
            window.productSystem.showStockModal(productId);
        } else if (window.showCleanModal) {
            const modalContent = `
                <div class="clean-stock-modal">
                    <div class="clean-stock-header">
                        <div class="clean-stock-icon">
                            <i class="fas fa-boxes"></i>
                        </div>
                        <div class="clean-stock-info">
                            <h4>Adicionar Estoque</h4>
                            <p><strong>Produto:</strong> ${product.name}</p>
                            <p><strong>Estoque atual:</strong> ${product.stock} unidades</p>
                        </div>
                    </div>
                    <div class="clean-stock-form">
                        <label for="stock-quantity" class="clean-form-label">Quantidade (múltiplos de 10):</label>
                        <input type="number" id="stock-quantity" class="clean-form-input" value="10" min="10" step="10" placeholder="Digite a quantidade">
                        <small class="clean-form-help">A quantidade deve ser múltipla de 10</small>
                    </div>
                </div>
            `;
            
            const footerContent = `
                <button class="clean-modal-btn clean-modal-btn-secondary modal-cancel">Cancelar</button>
                <button class="clean-modal-btn clean-modal-btn-primary modal-confirm">Adicionar Estoque</button>
            `;
            
            const modal = window.showCleanModal('addStockModal', 'Adicionar Estoque', modalContent, {
                type: 'stock',
                footerContent: footerContent
            });
            
            const quantityInput = modal.querySelector('#stock-quantity');
            
            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                window.closeCleanModal('addStockModal');
            });
            
            modal.querySelector('.modal-confirm').addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                
                if (!quantity || isNaN(quantity)) {
                    this.showNotification('Digite uma quantidade válida!', 'error');
                    return;
                }
                
                if (quantity % 10 !== 0) {
                    this.showNotification('A quantidade deve ser múltipla de 10!', 'error');
                    return;
                }

                this.updateStock(productId, quantity);
                window.closeCleanModal('addStockModal');
            });
        } else {
            // Fallback para prompt nativo
            const quantity = prompt(`Adicionar estoque para ${product.name}\nEstoque atual: ${product.stock}\nDigite a quantidade (múltiplos de 10):`, '10');
            if (quantity && !isNaN(quantity)) {
                this.updateStock(productId, parseInt(quantity));
            }
        }
    }

    updateStock(productId, quantity) {
        const product = window.productSystem.products.find(p => p.id === productId);
        if (!product) return;

        if (quantity % 10 !== 0) {
            this.showNotification('A quantidade deve ser múltipla de 10!', 'error');
            return;
        }

        product.stock += quantity;
        window.productSystem.saveProducts();

        this.loadVendorData();
        this.updateStats();

        this.showNotification(`Adicionadas ${quantity} unidades ao estoque de ${product.name}. Novo estoque: ${product.stock} unidades.`, 'success');
    }

    deleteProduct(productId) {
        const product = this.vendorProducts.find(p => p.id === productId);
        if (!product) return;

        if (window.showCleanModal) {
            const modalContent = `
                <div class="clean-confirmation-modal">
                    <div class="clean-confirmation-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="clean-confirmation-content">
                        <h4>Confirmar Exclusão</h4>
                        <p>Tem certeza que deseja excluir o produto <strong>"${product.name}"</strong>?</p>
                        <p class="text-warning">Esta ação não pode ser desfeita.</p>
                    </div>
                </div>
            `;
            
            const footerContent = `
                <button class="clean-modal-btn clean-modal-btn-secondary modal-cancel">Cancelar</button>
                <button class="clean-modal-btn clean-modal-btn-danger modal-confirm">Excluir</button>
            `;
            
            const modal = window.showCleanModal('deleteProductModal', 'Confirmar Exclusão', modalContent, {
                type: 'confirmation',
                footerContent: footerContent
            });
            
            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                window.closeCleanModal('deleteProductModal');
            });
            
            modal.querySelector('.modal-confirm').addEventListener('click', () => {
                const index = window.productSystem.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    window.productSystem.products.splice(index, 1);
                    window.productSystem.saveProducts();

                    this.loadVendorData();
                    this.updateStats();

                    this.showNotification('Produto excluído com sucesso!', 'success');
                }
                window.closeCleanModal('deleteProductModal');
            });
        } else {
            // Fallback para confirm nativo
            if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
                const index = window.productSystem.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    window.productSystem.products.splice(index, 1);
                    window.productSystem.saveProducts();

                    this.loadVendorData();
                    this.updateStats();

                    this.showNotification('Produto excluído com sucesso!', 'success');
                }
            }
        }
    }

    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const vendorOrders = orders.filter(order => 
            order.items.some(item => 
                this.vendorProducts.some(product => product.id === item.id)
            )
        );

        const ordersList = document.getElementById('vendor-orders-list');
        if (vendorOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Você ainda não tem pedidos para seus produtos.</p>
                </div>
            `;
        } else {
            ordersList.innerHTML = vendorOrders.map(order => this.createOrderCard(order)).join('');
        }
    }

    createOrderCard(order) {
        const vendorItems = order.items.filter(item => 
            this.vendorProducts.some(product => product.id === item.id)
        );

        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Pedido #${order.id}</h4>
                        <p>Data: ${new Date(order.date).toLocaleDateString('pt-BR')}</p>
                        <p>Cliente: ${order.customerName}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status}">${this.getStatusName(order.status)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${vendorItems.map(item => `
                        <div class="order-item">
                            <img src="assets/images/products/${item.image}" alt="${item.name}" onerror="this.src='assets/images/https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format'">
                            <div class="item-info">
                                <h5>${item.name}</h5>
                                <p>Quantidade: ${item.quantity}</p>
                                <p>Preço: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: R$ ${vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="vendorDashboard.viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i>
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusName(status) {
        const statuses = {
            'pending': 'Pendente',
            'processing': 'Processando',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        };
        return statuses[status] || status;
    }

    loadAnalytics() {
        // Top products (mock data)
        const topProducts = this.vendorProducts.slice(0, 5).map(product => ({
            ...product,
            sales: Math.floor(Math.random() * 50) + 10
        })).sort((a, b) => b.sales - a.sales);

        const topProductsList = document.getElementById('top-products');
        topProductsList.innerHTML = topProducts.map(product => `
            <div class="analytics-item">
                <div class="analytics-item-info">
                    <h5>${product.name}</h5>
                    <p>${product.sales} vendas</p>
                </div>
                <div class="analytics-item-value">
                    R$ ${(product.price * product.sales).toFixed(2).replace('.', ',')}
                </div>
            </div>
        `).join('');

        // Category sales (mock data)
        const categorySales = {
            'smartphones': Math.floor(Math.random() * 10000) + 5000,
            'notebooks': Math.floor(Math.random() * 15000) + 8000,
            'tablets': Math.floor(Math.random() * 8000) + 3000,
            'acessorios': Math.floor(Math.random() * 5000) + 2000
        };

        const categorySalesList = document.getElementById('category-sales');
        categorySalesList.innerHTML = Object.entries(categorySales).map(([category, sales]) => `
            <div class="analytics-item">
                <div class="analytics-item-info">
                    <h5>${this.getCategoryName(category)}</h5>
                    <p>Vendas</p>
                </div>
                <div class="analytics-item-value">
                    R$ ${sales.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `).join('');
    }

    cancelAddProduct() {
        document.getElementById('add-product-form').reset();
        document.getElementById('add-product-form').removeAttribute('data-edit-id');
        document.getElementById('add-product-form').querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Adicionar Produto';
        this.switchTab('products');
    }

    showNotification(message, type = 'info') {
        if (window.components && window.components.showNotification) {
            return window.components.showNotification(message, type);
        } else if (window.showCleanModal) {
            const modalContent = `
                <div class="clean-notification-modal">
                    <div class="clean-notification-icon">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    </div>
                    <div class="clean-notification-content">
                        <p>${message}</p>
                    </div>
                </div>
            `;
            
            const footerContent = `
                <button class="clean-modal-btn clean-modal-btn-primary modal-ok">OK</button>
            `;
            
            const modal = window.showCleanModal('notificationModal', 'Notificação', modalContent, {
                type: 'notification',
                footerContent: footerContent
            });
            
            modal.querySelector('.modal-ok').addEventListener('click', () => {
                window.closeCleanModal('notificationModal');
            });
        } else {
            alert(message);
        }
    }




    loadPerformanceAnalytics() {
        console.log('📊 Carregando dados de Performance Analytics...');
        
        // Carregar dados reais do localStorage ou da API
        this.loadRealVendorData();
        
        // Calcular métricas reais baseadas nos produtos do vendedor
        const vendorProducts = this.vendorProducts;
        const totalProducts = vendorProducts.length;
        
        // Simular dados de vendas baseados nos produtos
        const salesData = this.calculateSalesData(vendorProducts);
        const commissionData = this.calculateCommissionData(salesData);
        const ratingData = this.calculateRatingData(vendorProducts);
        
        // Atualizar cards de métricas
        this.updateAnalyticsCards(salesData, commissionData, ratingData);
        
        // Atualizar tabela de produtos
        this.updateProductsTable(vendorProducts, salesData);
        
        console.log('✅ Dados de Performance Analytics carregados');
    }

    loadRealVendorData() {
        console.log('📊 Carregando dados do vendedor...');
        
        // Verificar se é conta demo
        const demoEmails = ['joao@email.com', 'maria@email.com', 'admin@email.com'];
        const isDemoAccount = this.currentUser && (
            demoEmails.includes(this.currentUser.email) ||
            this.currentUser.email === 'demo@e2eshop.com' || 
            this.currentUser.id === 'demo' ||
            this.currentUser.profile === 'demo'
        );
        
        if (isDemoAccount) {
            console.log('🏢 Carregando dados DEMONSTRATIVOS para conta demo');
            
            // Dados demonstrativos altos para demo
            this.monthlySales = 196074.17; // R$ 196k+ como na imagem
            this.productsSold = 1405; // 1405 produtos vendidos
            this.commission = 15685.93; // R$ 15k+ de comissão
            this.rating = 4.7; // Avaliação alta
            
            console.log('📊 Dados DEMONSTRATIVOS carregados:');
            console.log('💰 Vendas mensais:', this.monthlySales);
            console.log('📦 Produtos vendidos:', this.productsSold);
            console.log('💵 Comissão:', this.commission);
            console.log('⭐ Avaliação:', this.rating);
        } else if (this.currentUser && this.currentUser.id) {
            console.log('👤 Carregando dados do usuário real:', this.currentUser.fullName);
            
            // Verificar se é usuário recém-cadastrado (sem histórico de vendas)
            const hasSalesHistory = this.currentUser.orders && this.currentUser.orders.length > 0;
            const isNewUser = !hasSalesHistory && (!this.currentUser.lastLogin || this.isNewUser());
            
            if (isNewUser) {
                console.log('🆕 Usuário recém-cadastrado - dados zerados');
                // Dados zerados para usuários novos
                this.monthlySales = 0;
                this.productsSold = 0;
                this.commission = 0;
                this.rating = 0;
            } else {
                console.log('👤 Usuário com histórico - dados baseados em vendas reais');
                // Dados baseados em vendas reais (se existirem)
                this.monthlySales = this.calculateRealSales();
                this.productsSold = this.calculateRealProductsSold();
                this.commission = Math.floor(this.monthlySales * 0.08);
                this.rating = this.calculateRealRating();
            }
            
            console.log('📊 Dados para usuário real:', this.currentUser.fullName);
            console.log('💰 Vendas mensais:', this.monthlySales);
            console.log('📦 Produtos vendidos:', this.productsSold);
            console.log('💵 Comissão:', this.commission);
            console.log('⭐ Avaliação:', this.rating);
        }
        
        // Funções auxiliares para usuários reais
        this.isNewUser = function() {
            if (!this.currentUser.createdAt) return true;
            const createdDate = new Date(this.currentUser.createdAt);
            const now = new Date();
            const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
            return daysDiff < 1; // Usuário criado há menos de 1 dia
        };
        
        this.calculateRealSales = function() {
            // Calcular vendas baseadas em pedidos reais
            if (this.currentUser.orders && this.currentUser.orders.length > 0) {
                return this.currentUser.orders.reduce((total, order) => total + (order.total || 0), 0);
            }
            return 0;
        };
        
        this.calculateRealProductsSold = function() {
            // Calcular produtos vendidos baseados em pedidos reais
            if (this.currentUser.orders && this.currentUser.orders.length > 0) {
                return this.currentUser.orders.reduce((total, order) => total + (order.items ? order.items.length : 0), 0);
            }
            return 0;
        };
        
        this.calculateRealRating = function() {
            // Calcular avaliação baseada em feedback real
            if (this.currentUser.rating && this.currentUser.rating > 0) {
                return this.currentUser.rating;
            }
            return 0;
        };
        
        // Tentar carregar dados do localStorage como fallback
        const savedVendorData = localStorage.getItem('vendor_data');
        if (savedVendorData) {
            try {
                const vendorData = JSON.parse(savedVendorData);
                console.log('📊 Dados do vendedor carregados do localStorage:', vendorData);
                
                // Atualizar produtos do vendedor
                if (vendorData.myProducts && vendorData.myProducts.length > 0) {
                    this.vendorProducts = vendorData.myProducts;
                    console.log('📦 Produtos do vendedor carregados:', this.vendorProducts.length);
                }
                
                // Atualizar estatísticas se existirem
                if (vendorData.monthlySales !== undefined) {
                    this.monthlySales = vendorData.monthlySales;
                }
                if (vendorData.productsSold !== undefined) {
                    this.productsSold = vendorData.productsSold;
                }
                if (vendorData.commission !== undefined) {
                    this.commission = vendorData.commission;
                }
                if (vendorData.rating !== undefined) {
                    this.rating = vendorData.rating;
                }
                
                return;
            } catch (error) {
                console.error('❌ Erro ao carregar dados do vendedor:', error);
            }
        }
        
        // Se não há dados salvos, carregar da API
        this.loadProductsFromAPI();
    }

    async loadProductsFromAPI() {
        console.log('🌐 Carregando produtos da API...');
        
        try {
            if (window.productsAPI) {
                const products = await window.productsAPI.getProducts();
                if (products && products.length > 0) {
                    this.vendorProducts = products.slice(0, 30); // Limitar a 30 produtos
                    console.log('✅ Produtos carregados da API:', this.vendorProducts.length);
                }
            } else {
                console.log('⚠️ API não disponível, usando produtos padrão');
                this.vendorProducts = this.getDefaultProducts();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produtos da API:', error);
            this.vendorProducts = this.getDefaultProducts();
        }
    }

    getDefaultProducts() {
        // Produtos padrão caso a API não esteja disponível
        return [
            {
                id: 1,
                name: 'Smart TV Lenovo 55" 4K UHD',
                price: 2500.00,
                stock: 15,
                category: 'eletronicos',
                image: '01_smart_tv_lenovo_55_4k_uhd.jpg'
            },
            {
                id: 2,
                name: 'Fone Bluetooth JBL Cancelamento de Ruído',
                price: 450.00,
                stock: 25,
                category: 'eletronicos',
                image: '02_fone_bluetooth_jbl_cancelamento_ruido.jpg'
            },
            {
                id: 3,
                name: 'Aspirador Robô Britânia WiFi',
                price: 800.00,
                stock: 12,
                category: 'casa',
                image: '03_aspirador_robo_britania_wifi.jpg'
            }
        ];
    }

    calculateSalesData(products) {
        // Simular dados de vendas baseados nos produtos
        const totalSales = products.reduce((sum, product) => {
            const sales = Math.floor(Math.random() * 20) + 5; // 5-25 vendas por produto
            return sum + sales;
        }, 0);
        
        const totalRevenue = products.reduce((sum, product) => {
            const sales = Math.floor(Math.random() * 20) + 5;
            return sum + (product.price * sales);
        }, 0);
        
        return {
            totalSales,
            totalRevenue,
            averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
        };
    }

    calculateCommissionData(salesData) {
        const commissionRate = 0.15; // 15% de comissão
        return {
            totalCommission: salesData.totalRevenue * commissionRate,
            rate: commissionRate
        };
    }

    calculateRatingData(products) {
        // Simular avaliações baseadas na qualidade dos produtos
        const totalRating = products.reduce((sum, product) => {
            const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
            return sum + rating;
        }, 0);
        
        return {
            averageRating: products.length > 0 ? totalRating / products.length : 0,
            totalReviews: Math.floor(Math.random() * 100) + 20
        };
    }

    updateAnalyticsCards(salesData, commissionData, ratingData) {
        // Atualizar vendas do mês
        const salesElement = document.getElementById('analytics-sales');
        const salesBar = document.getElementById('analytics-sales-bar');
        if (salesElement) {
            salesElement.textContent = `R$ ${salesData.totalRevenue.toFixed(2).replace('.', ',')}`;
        }
        if (salesBar) {
            const percentage = Math.min((salesData.totalRevenue / 50000) * 100, 100);
            salesBar.style.width = `${percentage}%`;
        }

        // Atualizar produtos vendidos
        const productsElement = document.getElementById('analytics-products');
        const productsBar = document.getElementById('analytics-products-bar');
        if (productsElement) {
            productsElement.textContent = salesData.totalSales;
        }
        if (productsBar) {
            const percentage = Math.min((salesData.totalSales / 100) * 100, 100);
            productsBar.style.width = `${percentage}%`;
        }

        // Atualizar comissão
        const commissionElement = document.getElementById('analytics-commission');
        const commissionBar = document.getElementById('analytics-commission-bar');
        if (commissionElement) {
            commissionElement.textContent = `R$ ${commissionData.totalCommission.toFixed(2).replace('.', ',')}`;
        }
        if (commissionBar) {
            const percentage = Math.min((commissionData.totalCommission / 10000) * 100, 100);
            commissionBar.style.width = `${percentage}%`;
        }

        // Atualizar avaliação
        const ratingElement = document.getElementById('analytics-rating');
        const ratingBar = document.getElementById('analytics-rating-bar');
        if (ratingElement) {
            ratingElement.textContent = ratingData.averageRating.toFixed(1);
        }
        if (ratingBar) {
            const percentage = (ratingData.averageRating / 5) * 100;
            ratingBar.style.width = `${percentage}%`;
        }
    }

    updateProductsTable(products, salesData) {
        const tableBody = document.getElementById('analytics-products-table');
        if (!tableBody) return;

        const productsWithSales = products.map(product => ({
            ...product,
            sales: Math.floor(Math.random() * 20) + 5,
            revenue: 0
        }));

        // Calcular receita para cada produto
        productsWithSales.forEach(product => {
            product.revenue = product.price * product.sales;
        });

        // Ordenar por receita
        productsWithSales.sort((a, b) => b.revenue - a.revenue);

        tableBody.innerHTML = productsWithSales.map(product => `
            <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-4 py-4">
                    <div class="flex items-center space-x-3">
                        <img src="assets/images/products/${product.image}" 
                             alt="${product.name}" 
                             class="w-12 h-12 rounded-lg object-cover"
                             onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&auto=format'">
                        <div>
                            <div class="font-semibold text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500">${this.getCategoryName(product.category)}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-gray-900">${product.sales}</div>
                    <div class="text-sm text-gray-500">vendas</div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-green-600">R$ ${product.revenue.toFixed(2).replace('.', ',')}</div>
                </td>
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000" 
                                 style="width: ${Math.min((product.sales / 25) * 100, 100)}%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-600">${Math.min((product.sales / 25) * 100, 100).toFixed(0)}%</span>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// ===== FUNÇÕES GLOBAIS PARA O HTML =====


// Função para carregar dados básicos do analytics
function loadBasicAnalyticsData() {
    console.log('📊 Carregando dados do analytics...');
    
    // Verificar se é conta demo
    const currentUser = JSON.parse(localStorage.getItem('e2e_current_user') || '{}');
    const demoEmails = ['joao@email.com', 'maria@email.com', 'admin@email.com'];
    const isDemoAccount = currentUser && (
        demoEmails.includes(currentUser.email) ||
        currentUser.email === 'demo@e2eshop.com' || 
        currentUser.id === 'demo' ||
        currentUser.profile === 'demo'
    );
    
    let realData;
    
    if (isDemoAccount) {
        console.log('🏢 Carregando dados DEMONSTRATIVOS para conta demo');
        // Dados demonstrativos altos para demo
        realData = {
            monthlySales: 196074.17, // R$ 196k+ como na imagem
            productsSold: 1405,      // 1405 produtos vendidos
            commission: 15685.93,     // R$ 15k+ de comissão
            rating: 4.7              // Avaliação alta
        };
    } else {
        console.log('👤 Carregando dados para usuário real');
        
        // Verificar se é usuário recém-cadastrado
        const hasSalesHistory = currentUser.orders && currentUser.orders.length > 0;
        const isNewUser = !hasSalesHistory && (!currentUser.lastLogin || isRecentlyCreated(currentUser));
        
        if (isNewUser) {
            console.log('🆕 Usuário recém-cadastrado - dados zerados');
            // Dados zerados para usuários novos
            realData = {
                monthlySales: 0,
                productsSold: 0,
                commission: 0,
                rating: 0
            };
        } else {
            console.log('👤 Usuário com histórico - dados baseados em vendas reais');
            // Dados baseados em vendas reais
            realData = {
                monthlySales: calculateRealSales(currentUser),
                productsSold: calculateRealProductsSold(currentUser),
                commission: Math.floor(calculateRealSales(currentUser) * 0.08),
                rating: calculateRealRating(currentUser)
            };
        }
    }
    
    // Atualizar elementos com dados reais
    const salesElement = document.getElementById('analytics-sales');
    if (salesElement) {
        salesElement.textContent = `R$ ${realData.monthlySales.toLocaleString('pt-BR')}`;
        console.log('✅ Vendas atualizadas:', salesElement.textContent);
    }
    
    const productsElement = document.getElementById('analytics-products');
    if (productsElement) {
        productsElement.textContent = realData.productsSold.toString();
        console.log('✅ Produtos zerados:', productsElement.textContent);
    }
    
    const commissionElement = document.getElementById('analytics-commission');
    if (commissionElement) {
        commissionElement.textContent = `R$ ${realData.commission.toLocaleString('pt-BR')}`;
        console.log('✅ Comissão atualizada:', commissionElement.textContent);
    }
    
    const ratingElement = document.getElementById('analytics-rating');
    if (ratingElement) {
        ratingElement.textContent = realData.rating;
        console.log('✅ Avaliação atualizada:', ratingElement.textContent);
    }
    
    // Atualizar barras de progresso com dados reais
    updateProgressBars(realData);
    
    // Carregar tabela de produtos reais
    console.log('📦 Carregando tabela de produtos reais...');
    loadRealProductsTable();
    
    console.log('✅ Dados reais do analytics carregados');
}

// Funções auxiliares globais
function isRecentlyCreated(user) {
    if (!user.createdAt) return true;
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff < 1; // Usuário criado há menos de 1 dia
}

function calculateRealSales(user) {
    // Calcular vendas baseadas em pedidos reais
    if (user.orders && user.orders.length > 0) {
        return user.orders.reduce((total, order) => total + (order.total || 0), 0);
    }
    return 0;
}

function calculateRealProductsSold(user) {
    // Calcular produtos vendidos baseados em pedidos reais
    if (user.orders && user.orders.length > 0) {
        return user.orders.reduce((total, order) => total + (order.items ? order.items.length : 0), 0);
    }
    return 0;
}

function calculateRealRating(user) {
    // Calcular avaliação baseada em feedback real
    if (user.rating && user.rating > 0) {
        return user.rating;
    }
    return 0;
}

// Função para obter dados reais do vendedor
function getRealVendorData() {
    console.log('🔍 Buscando dados reais do vendedor...');
    
    // Tentar carregar do localStorage primeiro
    const savedData = localStorage.getItem('vendor_data');
    if (savedData) {
        try {
            const vendorData = JSON.parse(savedData);
            console.log('📊 Dados encontrados no localStorage:', vendorData);
            return {
                monthlySales: vendorData.monthlySales || 0,
                productsSold: vendorData.productsSold || 0,
                commission: vendorData.commission || 0,
                rating: vendorData.rating || 0,
                products: vendorData.myProducts || []
            };
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
    }
    
    // Se não há dados salvos, usar dados da página atual
    const monthlySalesElement = document.getElementById('monthly-sales');
    const productsSoldElement = document.getElementById('products-sold');
    const commissionElement = document.getElementById('commission');
    const ratingElement = document.getElementById('rating');
    
    let monthlySales = 0;
    let productsSold = 0;
    let commission = 0;
    let rating = 0;
    
    if (monthlySalesElement) {
        const salesText = monthlySalesElement.textContent.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
        monthlySales = parseFloat(salesText) || 0;
    }
    
    if (productsSoldElement) {
        const productsText = productsSoldElement.textContent.replace(/\./g, '');
        productsSold = parseInt(productsText) || 0;
    }
    
    if (commissionElement) {
        const commissionText = commissionElement.textContent.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
        commission = parseFloat(commissionText) || 0;
    }
    
    if (ratingElement) {
        rating = parseFloat(ratingElement.textContent) || 0;
    }
    
    console.log('📊 Dados extraídos da página:', { monthlySales, productsSold, commission, rating });
    
    // FORÇAR dados zerados - igual à página inicial
    console.log('📊 FORÇANDO dados zerados...');
    return {
        monthlySales: 0,
        productsSold: 0,
        commission: 0,
        rating: 0,
        products: getRealProducts()
    };
}

// Função para obter produtos reais da página
function getRealProducts() {
    console.log('📦 FORÇANDO uso dos 30 produtos locais...');

    // FORÇAR uso dos 30 produtos locais - não tentar outras fontes
    console.log('📦 Usando APENAS os 30 produtos locais...');
    const localProducts = getLocalProducts30();
    console.log('📦 Produtos locais carregados:', localProducts.length);
    console.log('📦 Primeiro produto:', localProducts[0]);
    console.log('📦 Lista completa de produtos:', localProducts.map(p => ({ name: p.name, image: p.image })));
    return localProducts;
}


// Função para corrigir caminho de imagem duplicado
function fixImagePath(imagePath) {
    if (!imagePath) return 'assets/images/products/placeholder.jpg';
    
    // Se já tem o caminho completo, usar diretamente
    if (imagePath.startsWith('assets/images/products/')) {
        return imagePath;
    }
    
    // Se é apenas o nome do arquivo, adicionar o caminho
    return `assets/images/products/${imagePath}`;
}

// Função para obter os 30 produtos locais
function getLocalProducts30() {
    return [
        {
            id: '1',
            name: 'Smart TV Lenovo 55" 4K UHD',
            brand: 'Lenovo',
            category: 'eletronicos',
            price: 1204.84,
            stock: 10,
            image: '01_smart_tv_lenovo_55_4k_uhd.jpg'
        },
        {
            id: '2',
            name: 'Fone Bluetooth JBL com Cancelamento de Ruído',
            brand: 'JBL',
            category: 'eletronicos',
            price: 493.25,
            stock: 16,
            image: '02_fone_bluetooth_jbl_cancelamento_ruido.jpg'
        },
        {
            id: '3',
            name: 'Aspirador Robô Britânia Wi-Fi',
            brand: 'Britânia',
            category: 'casa',
            price: 768.28,
            stock: 16,
            image: '03_aspirador_robo_britania_wifi.jpg'
        },
        {
            id: '4',
            name: 'Fone Bluetooth Dell com Cancelamento de Ruído',
            brand: 'Dell',
            category: 'eletronicos',
            price: 163.30,
            stock: 13,
            image: '04_fone_bluetooth_dell_cancelamento_ruido.jpg'
        },
        {
            id: '5',
            name: 'Aspirador Robô Mondial Wi-Fi',
            brand: 'Mondial',
            category: 'casa',
            price: 450.00,
            stock: 8,
            image: '05_aspirador_robo_mondial_wifi.jpg'
        },
        {
            id: '6',
            name: 'Monitor Dell 24" 75Hz',
            brand: 'Dell',
            category: 'eletronicos',
            price: 320.50,
            stock: 25,
            image: '06_monitor_dell_24_75hz.jpg'
        },
        {
            id: '7',
            name: 'Cafeteira Elétrica Mondial 18 Xícaras',
            brand: 'Mondial',
            category: 'casa',
            price: 89.90,
            stock: 30,
            image: '07_cafeteira_eletrica_mondial_18_xicaras.jpg'
        },
        {
            id: '8',
            name: 'Cafeteira Elétrica Arno 18 Xícaras',
            brand: 'Arno',
            category: 'casa',
            price: 95.00,
            stock: 22,
            image: '08_cafeteira_eletrica_arno_18_xicaras.jpg'
        },
        {
            id: '9',
            name: 'Cafeteira Elétrica Electrolux 18 Xícaras',
            brand: 'Electrolux',
            category: 'casa',
            price: 120.00,
            stock: 18,
            image: '09_cafeteira_eletrica_electrolux_18_xicaras.jpg'
        },
        {
            id: '10',
            name: 'Monitor Sony 24" 75Hz',
            brand: 'Sony',
            category: 'eletronicos',
            price: 380.00,
            stock: 12,
            image: '10_monitor_sony_24_75hz.jpg'
        },
        {
            id: '11',
            name: 'Aspirador Robô Arno Wi-Fi',
            brand: 'Arno',
            category: 'casa',
            price: 520.00,
            stock: 5,
            image: '11_aspirador_robo_arno_wifi.jpg'
        },
        {
            id: '12',
            name: 'Monitor Philips 29" 75Hz',
            brand: 'Philips',
            category: 'eletronicos',
            price: 450.00,
            stock: 7,
            image: '12_monitor_philips_29_75hz.jpg'
        },
        {
            id: '13',
            name: 'Smartphone Samsung Galaxy A54',
            brand: 'Samsung',
            category: 'eletronicos',
            price: 899.00,
            stock: 35,
            image: '13_smartphone_samsung_galaxy_a54.jpg'
        },
        {
            id: '14',
            name: 'Laptop Dell Inspiron 15 3000',
            brand: 'Dell',
            category: 'eletronicos',
            price: 1899.00,
            stock: 15,
            image: '14_laptop_dell_inspiron_15_3000.jpg'
        },
        {
            id: '15',
            name: 'Headphone Sony WH-1000XM4',
            brand: 'Sony',
            category: 'eletronicos',
            price: 1299.00,
            stock: 20,
            image: '15_headphone_sony_wh_1000xm4.jpg'
        },
        {
            id: '16',
            name: 'Tablet Apple iPad Air 5',
            brand: 'Apple',
            category: 'eletronicos',
            price: 2499.00,
            stock: 8,
            image: '16_tablet_apple_ipad_air_5.jpg'
        },
        {
            id: '17',
            name: 'Smartwatch Apple Watch Series 8',
            brand: 'Apple',
            category: 'eletronicos',
            price: 1999.00,
            stock: 12,
            image: '17_smartwatch_apple_watch_series_8.jpg'
        },
        {
            id: '18',
            name: 'Câmera Canon EOS R6 Mark II',
            brand: 'Canon',
            category: 'eletronicos',
            price: 8999.00,
            stock: 3,
            image: '18_camera_canon_eos_r6_mark_ii.jpg'
        },
        {
            id: '19',
            name: 'Console PlayStation 5',
            brand: 'Sony',
            category: 'eletronicos',
            price: 3999.00,
            stock: 6,
            image: '19_console_playstation_5.jpg'
        },
        {
            id: '20',
            name: 'Teclado Mecânico Razer BlackWidow',
            brand: 'Razer',
            category: 'eletronicos',
            price: 299.00,
            stock: 40,
            image: '20_teclado_mecanico_razer_blackwidow.jpg'
        },
        {
            id: '21',
            name: 'Mouse Gaming Logitech G502',
            brand: 'Logitech',
            category: 'eletronicos',
            price: 199.00,
            stock: 50,
            image: '21_mouse_gaming_logitech_g502.jpg'
        },
        {
            id: '22',
            name: 'Webcam Logitech C920 HD',
            brand: 'Logitech',
            category: 'eletronicos',
            price: 399.00,
            stock: 25,
            image: '22_webcam_logitech_c920_hd.jpg'
        },
        {
            id: '23',
            name: 'Roteador Wi-Fi TP-Link Archer AX73',
            brand: 'TP-Link',
            category: 'eletronicos',
            price: 599.00,
            stock: 18,
            image: '23_roteador_wifi_tp_link_archer_ax73.jpg'
        },
        {
            id: '24',
            name: 'SSD Samsung 970 EVO Plus 1TB',
            brand: 'Samsung',
            category: 'eletronicos',
            price: 699.00,
            stock: 30,
            image: '24_ssd_samsung_970_evo_plus_1tb.jpg'
        },
        {
            id: '25',
            name: 'RAM Corsair Vengeance 16GB DDR4',
            brand: 'Corsair',
            category: 'eletronicos',
            price: 299.00,
            stock: 45,
            image: '25_ram_corsair_vengeance_16gb_ddr4.jpg'
        },
        {
            id: '26',
            name: 'Placa Mãe ASUS ROG Strix B550',
            brand: 'ASUS',
            category: 'eletronicos',
            price: 899.00,
            stock: 12,
            image: '26_placa_mae_asus_rog_strix_b550.jpg'
        },
        {
            id: '27',
            name: 'Processador Intel Core i7-12700K',
            brand: 'Intel',
            category: 'eletronicos',
            price: 1999.00,
            stock: 8,
            image: '27_processador_intel_core_i7_12700k.jpg'
        },
        {
            id: '28',
            name: 'Placa de Vídeo NVIDIA RTX 4070',
            brand: 'NVIDIA',
            category: 'eletronicos',
            price: 3999.00,
            stock: 5,
            image: '28_placa_video_nvidia_rtx_4070.jpg'
        },
        {
            id: '29',
            name: 'Fonte Corsair RM850x 850W',
            brand: 'Corsair',
            category: 'eletronicos',
            price: 599.00,
            stock: 20,
            image: '29_fonte_corsair_rm850x_850w.jpg'
        },
        {
            id: '30',
            name: 'Gabinete Corsair 4000D Airflow',
            brand: 'Corsair',
            category: 'eletronicos',
            price: 399.00,
            stock: 15,
            image: '30_gabinete_corsair_4000d_airflow.jpg'
        }
    ];
}

// Função para gerar dados realistas baseados nos produtos
function generateRealisticData(products) {
    console.log('📊 Gerando dados realistas para', products.length, 'produtos...');
    
    let totalRevenue = 0;
    let totalSales = 0;
    
    products.forEach(product => {
        const sales = Math.floor(Math.random() * 20) + 5; // 5-25 vendas por produto
        const revenue = product.price * sales;
        totalSales += sales;
        totalRevenue += revenue;
    });
    
    const commission = totalRevenue * 0.15; // 15% de comissão
    const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
    
    console.log('📊 Dados gerados:', { totalRevenue, totalSales, commission, rating });
    
    return {
        monthlySales: totalRevenue,
        productsSold: totalSales,
        commission: commission,
        rating: rating,
        products: products
    };
}

// Função para obter produtos padrão
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Smart TV Lenovo 55" 4K UHD',
            price: 2500.00,
            category: 'eletronicos',
            image: '01_smart_tv_lenovo_55_4k_uhd.jpg'
        },
        {
            id: 2,
            name: 'Fone Bluetooth JBL Cancelamento de Ruído',
            price: 450.00,
            category: 'eletronicos',
            image: '02_fone_bluetooth_jbl_cancelamento_ruido.jpg'
        },
        {
            id: 3,
            name: 'Aspirador Robô Britânia WiFi',
            price: 800.00,
            category: 'casa',
            image: '03_aspirador_robo_britania_wifi.jpg'
        }
    ];
}

// Função para atualizar barras de progresso
function updateProgressBars(data) {
    console.log('📊 FORÇANDO barras de progresso zeradas...');
    
    // FORÇAR barra de vendas zerada
    const salesBar = document.getElementById('analytics-sales-bar');
    if (salesBar) {
        salesBar.style.width = '0%';
        console.log('📊 Barra de vendas FORÇADAMENTE zerada: 0%');
    }
    
    // FORÇAR barra de produtos zerada
    const productsBar = document.getElementById('analytics-products-bar');
    if (productsBar) {
        productsBar.style.width = '0%';
        console.log('📊 Barra de produtos FORÇADAMENTE zerada: 0%');
    }
    
    // FORÇAR barra de comissão zerada
    const commissionBar = document.getElementById('analytics-commission-bar');
    if (commissionBar) {
        commissionBar.style.width = '0%';
        console.log('📊 Barra de comissão FORÇADAMENTE zerada: 0%');
    }
    
    // FORÇAR barra de rating zerada
    const ratingBar = document.getElementById('analytics-rating-bar');
    if (ratingBar) {
        ratingBar.style.width = '0%';
        console.log('📊 Barra de rating FORÇADAMENTE zerada: 0%');
    }
}

// Função para carregar tabela de produtos reais
function loadRealProductsTable() {
    console.log('📦 Carregando tabela de produtos reais...');
    
    const tableBody = document.getElementById('analytics-products-table');
    if (!tableBody) {
        console.log('⚠️ Tabela de produtos não encontrada');
        return;
    }
    
    // FORÇAR uso dos 30 produtos locais
    const products = getLocalProducts30();
    console.log('📦 Produtos locais FORÇADAMENTE carregados:', products.length);
    console.log('📦 Primeiro produto:', products[0]);
    console.log('📦 Lista completa de produtos:', products.map(p => ({ name: p.name, image: p.image })));
    
    // Mostrar todos os produtos (30 produtos)
    const displayProducts = products;
    console.log('📦 Produtos para exibir:', displayProducts.length);
    
    // FORÇAR tabela com valores zerados
    tableBody.innerHTML = displayProducts.map(product => {
        const sales = 0; // FORÇAR vendas zeradas
        const revenue = 0; // FORÇAR receita zerada
        const performance = 0; // FORÇAR performance zerada
        
        // Corrigir caminho de imagem para evitar duplicação
        const imageSrc = product.image && product.image !== 'default.jpg' 
            ? fixImagePath(product.image)
            : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&auto=format';
        
        console.log('🖼️ FORÇANDO carregamento da imagem:', imageSrc, 'para produto:', product.name);
        console.log('📦 Produto completo:', product);
        
        return `
            <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-4 py-4">
                    <div class="flex items-center space-x-3">
                        <img src="${imageSrc}" 
                             alt="${product.name}" 
                             class="w-12 h-12 rounded-lg object-cover"
                             onerror="console.log('❌ Erro ao carregar imagem REAL:', this.src); this.style.display='none';"
                             onload="console.log('✅ Imagem REAL carregada com sucesso:', this.src)"
                             loading="lazy"
                             style="background-color: #f3f4f6;"
                             crossorigin="anonymous"
                             data-product-id="${product.id}">
                        <div>
                            <div class="font-semibold text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500">${getCategoryName(product.category)}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-gray-900">0</div>
                    <div class="text-sm text-gray-500">vendas</div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-green-600">R$ 0,00</div>
                </td>
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000" 
                                 style="width: 0%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-600">0%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Tabela de produtos carregada:', displayProducts.length);
    
    // Verificar se todos os 30 produtos foram carregados
    if (displayProducts.length < 30) {
        console.warn('⚠️ Apenas', displayProducts.length, 'produtos carregados, esperado 30');
        console.log('📦 Produtos carregados:', displayProducts.map(p => p.name));
    } else {
        console.log('✅ Todos os 30 produtos carregados com sucesso!');
    }
}

// Função para obter produtos da API
function getProductsFromAPI() {
    console.log('🌐 Tentando carregar produtos da API...');
    
    // Se a API estiver disponível, usar ela
    if (window.productsAPI) {
        try {
            const products = window.productsAPI.getProducts();
            if (products && products.length > 0) {
                console.log('✅ Produtos carregados da API:', products.length);
                return products.slice(0, 30);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar da API:', error);
        }
    }
    
    // Fallback para produtos padrão
    return [
        {
            id: 1,
            name: 'Smart TV Lenovo 55" 4K UHD',
            price: 2500.00,
            category: 'eletronicos',
            image: '01_smart_tv_lenovo_55_4k_uhd.jpg'
        },
        {
            id: 2,
            name: 'Fone Bluetooth JBL Cancelamento de Ruído',
            price: 450.00,
            category: 'eletronicos',
            image: '02_fone_bluetooth_jbl_cancelamento_ruido.jpg'
        },
        {
            id: 3,
            name: 'Aspirador Robô Britânia WiFi',
            price: 800.00,
            category: 'casa',
            image: '03_aspirador_robo_britania_wifi.jpg'
        }
    ];
}

// Função para obter nome da categoria
function getCategoryName(category) {
    const categories = {
        'eletronicos': 'Eletrônicos',
        'casa': 'Casa e Decoração',
        'informatica': 'Informática',
        'celulares': 'Celulares',
        'games': 'Games',
        'livros': 'Livros'
    };
    return categories[category] || 'Outros';
}


// Função para carregar tabela de produtos reais
function forceLoadZeroProductsTable() {
    console.log('📦 Carregando tabela de produtos reais...');
    
    const tableBody = document.querySelector('#analytics-products-table tbody');
    if (!tableBody) {
        console.log('⚠️ Tabela de produtos não encontrada');
        return;
    }
    
    // FORÇAR uso dos 30 produtos locais
    const products = getLocalProducts30();
    console.log('📦 Produtos locais FORÇADAMENTE carregados:', products.length);
    console.log('📦 Primeiro produto:', products[0]);
    console.log('📦 Lista completa de produtos:', products.map(p => ({ name: p.name, image: p.image })));
    
    // FORÇAR tabela com valores zerados
    tableBody.innerHTML = products.map(product => {
        // FORÇAR valores zerados
        const sales = 0;
        const revenue = 0;
        const performance = 0;
        
        // Corrigir caminho de imagem para evitar duplicação
        const imageSrc = fixImagePath(product.image);
        
        console.log('🖼️ FORÇANDO imagem REAL:', imageSrc, 'para produto:', product.name);
        console.log('📦 Produto completo:', product);
        console.log('🖼️ Caminho da imagem:', imageSrc);
        
        return `
            <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-4 py-4">
                    <div class="flex items-center space-x-3">
                        <img src="${imageSrc}" 
                             alt="${product.name}" 
                             class="w-12 h-12 rounded-lg object-cover"
                             onerror="console.log('❌ Erro ao carregar imagem REAL:', this.src); this.style.display='none';"
                             onload="console.log('✅ Imagem REAL carregada com sucesso:', this.src)"
                             loading="lazy"
                             style="background-color: #f3f4f6;"
                             crossorigin="anonymous"
                             data-product-id="${product.id}">
                        <div>
                            <div class="font-semibold text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500">${getCategoryName(product.category)}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-gray-900">0</div>
                    <div class="text-sm text-gray-500">vendas</div>
                </td>
                <td class="px-4 py-4">
                    <div class="text-lg font-semibold text-green-600">R$ 0,00</div>
                </td>
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000" 
                                 style="width: 0%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-600">0%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Tabela FORÇADAMENTE zerada carregada:', products.length);
}
}

// Initialize vendor dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando VendorDashboard...');
    try {
        window.vendorDashboard = new VendorDashboard();
        console.log('✅ VendorDashboard inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar VendorDashboard:', error);
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});
