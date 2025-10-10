// E2E SHOP - Sistema de Perfil
// Gerencia perfil do usuário, pedidos, endereços e configurações

console.log('👤 E2E SHOP - Carregando sistema de perfil...');

class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.bindEvents();
        console.log('✅ Sistema de perfil inicializado');
    }

    checkAuth() {
        if (!window.authSystem) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = window.authSystem.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update profile info
        document.getElementById('user-name').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('user-email').textContent = this.currentUser.email;
        document.getElementById('user-profile').textContent = this.getProfileName(this.currentUser.profile);

        // Load form data
        document.getElementById('firstName').value = this.currentUser.firstName || '';
        document.getElementById('lastName').value = this.currentUser.lastName || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('phone').value = this.currentUser.phone || '';
        document.getElementById('birthDate').value = this.currentUser.birthDate || '';

        // Load orders, addresses, favorites
        this.loadOrders();
        this.loadAddresses();
        this.loadFavorites();
    }

    getProfileName(profile) {
        const profiles = {
            'cliente': 'Cliente',
            'vendedor': 'Vendedor',
            'administrador': 'Administrador'
        };
        return profiles[profile] || 'Cliente';
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.profile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Settings form
        document.getElementById('settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSettings();
        });

        // Add address button
        document.getElementById('add-address-btn').addEventListener('click', () => {
            this.showAddAddressModal();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            window.authSystem.logout();
        });
    }

    switchTab(tabId) {
        // Update nav links
        document.querySelectorAll('.profile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    updateProfile() {
        const formData = new FormData(document.getElementById('profile-form'));
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birthDate: formData.get('birthDate')
        };

        // Update user data
        this.currentUser = { ...this.currentUser, ...userData };
        window.authSystem.updateUser(this.currentUser);

        this.showNotification('Perfil atualizado com sucesso!', 'success');
    }

    updateSettings() {
        const formData = new FormData(document.getElementById('settings-form'));
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword && newPassword !== confirmPassword) {
            this.showNotification('As senhas não coincidem!', 'error');
            return;
        }

        if (newPassword) {
            if (!currentPassword) {
                this.showNotification('Digite a senha atual!', 'error');
                return;
            }
            
            if (currentPassword !== this.currentUser.password) {
                this.showNotification('Senha atual incorreta!', 'error');
                return;
            }

            this.currentUser.password = newPassword;
        }

        // Update notifications settings
        this.currentUser.emailNotifications = document.getElementById('emailNotifications').checked;
        this.currentUser.smsNotifications = document.getElementById('smsNotifications').checked;

        window.authSystem.updateUser(this.currentUser);
        this.showNotification('Configurações atualizadas com sucesso!', 'success');
    }

    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userOrders = orders.filter(order => order.userId === this.currentUser.id);
        
        const ordersList = document.getElementById('orders-list');
        if (userOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Você ainda não fez nenhum pedido.</p>
                    <a href="products.html" class="btn btn-primary">Ver Produtos</a>
                </div>
            `;
        } else {
            ordersList.innerHTML = userOrders.map(order => this.createOrderCard(order)).join('');
        }
    }

    createOrderCard(order) {
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Pedido #${order.id}</h4>
                        <p>Data: ${new Date(order.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status}">${this.getStatusName(order.status)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="assets/images/products/${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format'">
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
                        <strong>Total: R$ ${order.total.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="profileSystem.viewOrder('${order.id}')">
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

    loadAddresses() {
        const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        const userAddresses = addresses.filter(addr => addr.userId === this.currentUser.id);
        
        const addressesList = document.getElementById('addresses-list');
        if (userAddresses.length === 0) {
            addressesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Nenhum endereço cadastrado</h3>
                    <p>Adicione um endereço para facilitar suas compras.</p>
                    <button class="btn btn-primary" onclick="profileSystem.showAddAddressModal()">
                        <i class="fas fa-plus"></i>
                        Adicionar Endereço
                    </button>
                </div>
            `;
        } else {
            addressesList.innerHTML = userAddresses.map(address => this.createAddressCard(address)).join('');
        }
    }

    createAddressCard(address) {
        return `
            <div class="address-card">
                <div class="address-header">
                    <h4>${address.name}</h4>
                    ${address.isDefault ? '<span class="default-badge">Padrão</span>' : ''}
                </div>
                <div class="address-info">
                    <p>${address.street}, ${address.number}</p>
                    <p>${address.neighborhood} - ${address.city}/${address.state}</p>
                    <p>CEP: ${address.zipCode}</p>
                    <p>Telefone: ${address.phone}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-outline" onclick="profileSystem.editAddress('${address.id}')">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-danger" onclick="profileSystem.deleteAddress('${address.id}')">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }

    loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const favoriteProducts = window.productSystem.products.filter(product => 
            favorites.includes(product.id)
        );
        
        const favoritesList = document.getElementById('favorites-list');
        if (favoriteProducts.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>Nenhum favorito</h3>
                    <p>Adicione produtos aos seus favoritos para encontrá-los facilmente.</p>
                    <a href="products.html" class="btn btn-primary">Ver Produtos</a>
                </div>
            `;
        } else {
            try {
                if (window.renderProductGrid && typeof window.renderProductGrid === 'function') {
                    favoritesList.classList.add('e2e-product-grid');
                    favoritesList.innerHTML = window.renderProductGrid(favoriteProducts);
                } else if (window.productSystem && typeof window.productSystem.createProductCard === 'function') {
                    favoritesList.innerHTML = favoriteProducts.map(product => window.productSystem.createProductCard(product)).join('');
                } else {
                    // Last fallback: simple list
                    favoritesList.innerHTML = favoriteProducts.map(p => `<div class="fav-item">${p.title}</div>`).join('');
                }
            } catch (e) {
                console.error('Erro ao renderizar favoritos com renderer:', e);
                favoritesList.innerHTML = favoriteProducts.map(product => window.productSystem.createProductCard(product)).join('');
            }
        }
    }

    showAddAddressModal() {
        // This would open a modal to add address
        this.showNotification('Funcionalidade de adicionar endereço será implementada em breve!', 'info');
    }

    showNotification(message, type = 'info') {
        // Use the existing notification system
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
}

// Initialize profile system
document.addEventListener('DOMContentLoaded', function() {
    window.profileSystem = new ProfileSystem();
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
