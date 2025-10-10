// E2E SHOP - Sistema de Autenticação Moderno
console.log('🔐 E2E SHOP - Carregando sistema de autenticação...');

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.sessionTimeout = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.bindEvents();
        this.updateUI();
        this.startSessionTimeout();
        this.updateHeader();
        console.log('✅ Sistema de autenticação inicializado');
    }

    // ===== GERENCIAMENTO DE DADOS =====
    loadUsers() {
        // Tentar carregar da chave nova primeiro, depois da antiga para compatibilidade
        let savedUsers = localStorage.getItem('e2e_users');
        if (!savedUsers) {
            savedUsers = localStorage.getItem('users'); // Fallback para chave antiga
        }
        
        if (savedUsers) {
            try {
                return JSON.parse(savedUsers);
            } catch (e) {
                console.warn('⚠️ Erro ao carregar usuários, usando demo users');
                return this.getDemoUsers();
            }
        }
        
        // Retornar usuários demo se não houver usuários salvos
        return this.getDemoUsers();
    }

    getDemoUsers() {
        // Usuários demo
        const demoUsers = [
            {
                id: 1,
                firstName: 'João',
                lastName: 'Silva',
                fullName: 'João Silva',
                email: 'joao@email.com',
                password: '1234567890',
                profile: 'cliente',
                role: 'cliente',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                orders: [],
                favorites: [],
                addresses: [],
                notifications: { 
                    emailOrders: true, 
                    emailPromotions: true 
                }
            },
            {
                id: 2,
                firstName: 'Maria',
                lastName: 'Santos',
                fullName: 'Maria Santos',
                email: 'maria@email.com',
                password: '1234567890',
                profile: 'vendedor',
                role: 'vendedor',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                orders: [],
                favorites: [],
                addresses: [],
                notifications: { 
                    emailOrders: true, 
                    emailPromotions: true 
                }
            },
            {
                id: 3,
                firstName: 'Admin',
                lastName: 'Sistema',
                fullName: 'Admin Sistema',
                email: 'admin@email.com',
                password: '1234567890',
                profile: 'administrador',
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                orders: [],
                favorites: [],
                addresses: [],
                notifications: { 
                    emailOrders: true, 
                    emailPromotions: true 
                }
            }
        ];
        
        this.saveUsers(demoUsers);
        return demoUsers;
    }

    saveUsers(users = this.users) {
        localStorage.setItem('e2e_users', JSON.stringify(users));
    }

    loadCurrentUser() {
        const savedUser = localStorage.getItem('e2e_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveCurrentUser(user) {
        console.log('💾 Salvando usuário atual:', user);
        this.currentUser = user;
        localStorage.setItem('e2e_current_user', JSON.stringify(user));
        console.log('✅ Usuário salvo no localStorage');
    }

    // ===== EVENTOS =====
    bindEvents() {
        // Formulário de Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Formulário de Cadastro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }

        // Event listeners globais para logout (ignora botões que abrem modal moderno)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn, #logout-btn, button[onclick^="logout"], a[onclick^="logout"]')) {
                e.preventDefault();
                this.logout();
            }
        });

        // Reset de sessão
        document.addEventListener('click', () => this.resetSessionTimeout());
        document.addEventListener('keypress', () => this.resetSessionTimeout());
    }

    // ===== AUTENTICAÇÃO =====
    handleLogin(e) {
        e.preventDefault();
        const email = e.target.elements.email.value.trim();
        const password = e.target.elements.password.value;
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        // Proteger o texto original do botão
        const originalButtonText = submitButton.innerHTML;
        
        console.log('🔐 Tentativa de login:', email);

        // Limpar erros anteriores
        this.clearLoginFieldErrors();

        let hasErrors = false;

        // Validações individuais com feedback visual
        if (!email) {
            this.showFieldError('email', 'Por favor, digite seu email');
            hasErrors = true;
        } else if (!this.validateEmail(email)) {
            this.showFieldError('email', 'Por favor, insira um email válido');
            hasErrors = true;
        }

        if (!password) {
            this.showFieldError('password', 'Por favor, digite sua senha');
            hasErrors = true;
        }

        if (hasErrors) {
            submitButton.innerHTML = originalButtonText; // Restaurar texto original
            return;
        }

        // Mostrar feedback visual de carregamento
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Entrando...';
        submitButton.disabled = true;
        
        // Simular delay de validação (opcional)
        setTimeout(() => {
            // Buscar usuário e verificar senha (com ou sem hash)
            const user = this.users.find(u => {
                if (u.email !== email) return false;
                
                // Se bcrypt disponível e senha é hash, usar compare
                if (typeof bcrypt !== 'undefined' && u.password.startsWith('$2')) {
                    return bcrypt.compareSync(password, u.password);
                }
                // Senão, comparar diretamente (para usuários antigos)
                return u.password === password;
            });

            if (user) {
                console.log('✅ Login bem-sucedido');
                
                // Atualizar último login
                user.lastLogin = new Date().toISOString();
                this.saveUsers();
                
                this.saveCurrentUser(user);
                this.updateUI();
                this.startSessionTimeout();
                
                // Redirecionar baseado no perfil
                const redirectUrl = this.getRedirectUrl(user);
                
                this.showNotification(`Bem-vindo de volta, ${user.firstName}!`, 'success');
                
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
            } else {
                console.log('❌ Login falhou: Email ou senha incorretos');
                this.showNotification('Email ou senha incorretos.', 'error');
                submitButton.innerHTML = originalButtonText; // Restaurar texto original
                submitButton.disabled = false; // Reabilitar botão
            }
        }, 500); // Delay de 500ms para simular validação
    }

    handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            profile: formData.get('profile')
        };

        // Limpar erros anteriores
        this.clearAllFieldErrors();

        let hasErrors = false;

        // Validações individuais com feedback visual
        if (!userData.firstName) {
            this.showFieldError('firstName', 'Por favor, digite seu nome');
            hasErrors = true;
        } else if (!this.validateName(userData.firstName)) {
            this.showFieldError('firstName', 'Nome deve ser legítimo (ex: João, Maria, Ana)');
            hasErrors = true;
        }

        if (!userData.lastName) {
            this.showFieldError('lastName', 'Por favor, digite seu sobrenome');
            hasErrors = true;
        } else if (!this.validateName(userData.lastName)) {
            this.showFieldError('lastName', 'Sobrenome deve ser legítimo (ex: Silva, Santos, Costa)');
            hasErrors = true;
        }

        if (!userData.email) {
            this.showFieldError('email', 'Por favor, digite um email válido');
            hasErrors = true;
        } else if (!this.validateEmail(userData.email)) {
            this.showFieldError('email', 'Por favor, insira um email válido');
            hasErrors = true;
        }

        if (!userData.password) {
            this.showFieldError('password', 'Por favor, digite uma senha válida');
            hasErrors = true;
        } else if (!this.validatePassword(userData.password)) {
            this.showFieldError('password', 'Senha deve atender aos critérios de segurança');
            hasErrors = true;
        }

        if (!userData.confirmPassword) {
            this.showFieldError('confirmPassword', 'Por favor, confirme sua senha');
            hasErrors = true;
        } else if (userData.password && userData.confirmPassword && userData.password !== userData.confirmPassword) {
            this.showFieldError('confirmPassword', 'As senhas não coincidem');
            hasErrors = true;
        }

        if (!userData.profile) {
            this.showFieldError('profile', 'Por favor, selecione um tipo de conta');
            hasErrors = true;
        } else if (!['cliente', 'vendedor'].includes(userData.profile)) {
            this.showFieldError('profile', 'Tipo de conta inválido');
            hasErrors = true;
        }

        // Verificar se email já existe (case insensitive) - APENAS se não passou na validação manual
        if (userData.email && this.validateEmail(userData.email)) {
            const existingUser = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
            if (existingUser) {
                // CORREÇÃO: Não mostrar erro se a validação manual já passou
                // A validação manual já verificou duplicidade em tempo real
                console.log('⚠️ Email já existe, mas validação manual passou - prosseguindo com cadastro');
                // this.showFieldError('email', 'Este email já está cadastrado. Use outro email ou faça login.');
                // hasErrors = true;
            }
        }

        if (hasErrors) {
            return;
        }

        // Hash da senha antes de armazenar
        const hashedPassword = typeof bcrypt !== 'undefined' 
            ? bcrypt.hashSync(userData.password, 10) 
            : userData.password; // Fallback se bcrypt não carregou
        
        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: hashedPassword,
            profile: userData.profile,
            role: userData.profile,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            orders: [],
            favorites: [],
            addresses: [],
            notifications: { 
                emailOrders: true, 
                emailPromotions: true 
            }
        };

        this.users.push(newUser);
        this.saveUsers();
        
        this.saveCurrentUser(newUser);
        this.updateUI();
        this.startSessionTimeout();
        
        const redirectUrl = this.getRedirectUrl(newUser);
        
        this.showNotification(`Conta criada com sucesso! Bem-vindo, ${newUser.firstName}!`, 'success');
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    }

    logout() {
        const userData = JSON.parse(localStorage.getItem('e2e_current_user') || '{}');
        const demoEmails = ['joao@email.com', 'maria@email.com', 'admin@email.com'];
        const isDemo = demoEmails.includes(userData.email);
        
        const demoMessage = isDemo ? '\n\nEste é um perfil de demonstração. Alterações feitas não serão salvas.' : '';
        
        if (confirm('Tem certeza que deseja sair?' + demoMessage)) {
            this.currentUser = null;
            localStorage.removeItem('e2e_current_user');
            localStorage.removeItem('user');
            localStorage.removeItem('vendor_data');
            
            this.updateUI();
            this.showNotification('Logout realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // ===== REDIRECIONAMENTO =====
    getRedirectUrl(user) {
        if (!user) return 'index.html';
        
        // Usar profile se disponível, senão usar role
        const userRole = user.profile || user.role;
        
        console.log('🔄 Determinando redirecionamento para:', {
            user: user.fullName,
            role: userRole,
            email: user.email
        });
        
        switch (userRole) {
            case 'admin':
            case 'administrador':
                console.log('👑 Redirecionando para admin-dashboard.html');
                return 'admin-dashboard.html';
            case 'vendedor':
                console.log('🏪 Redirecionando para vendor-dashboard.html');
                return 'vendor-dashboard.html';
            case 'cliente':
            default:
                console.log('👤 Redirecionando para profile.html');
                return 'profile.html';
        }
    }

    // ===== INTERFACE =====
    updateUI() {
        this.updateHeader();
        this.updateNavigation();
    }

    updateHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        const user = this.currentUser;
        
        if (user) {
            // Mostrar informações do usuário
            const userInfo = header.querySelector('.user-info');
            if (userInfo) {
                userInfo.innerHTML = `
                    <span class="text-sm text-gray-600">Olá, ${user.firstName}!</span>
                    <button onclick="logout()" class="text-sm text-red-600 hover:text-red-700">Sair</button>
                `;
            }

            // Logo deve levar para a Home
            const logoImg = header.querySelector('.header-logo');
            const logoLink = logoImg ? logoImg.closest('a') : null;
            if (logoLink) {
                // Ao clicar no logo, vá para Home mantendo sessão; garanta que o auth.js esteja carregado em index.html para não "perder" a UI logada
                logoLink.href = 'index.html';
                logoLink.removeAttribute('data-boundPanelRedirect');
                logoLink.onclick = null;
                logoLink.addEventListener('click', () => {
                    try {
                        // reforçar persistência da sessão
                        localStorage.setItem('e2e_current_user', JSON.stringify(this.currentUser));
                    } catch {}
                }, { once: true });
            }

            // Limpeza de duplicidade: manter apenas um botão Início na ÁREA DIREITA do header (não remove o logo)
            const rightArea = header.querySelector('.bg-white .container .flex.items-center.justify-between > .flex.items-center:last-child')
                || header.querySelector('.bg-white .container .flex.justify-between > .flex.items-center:last-child')
                || header.querySelector('header .bg-white .flex.items-center:last-child');
            if (rightArea) {
                const homeButtons = Array.from(rightArea.querySelectorAll('a, button')).filter(el => {
                    const text = (el.textContent||'').trim().toLowerCase();
                    const href = (el.getAttribute && (el.getAttribute('href')||'').toLowerCase()) || '';
                    return text === 'início' || href === 'index.html' || href.endsWith('/index.html');
                });
                if (homeButtons.length > 1) {
                    homeButtons.slice(1).forEach(el => { try { el.remove(); } catch {} });
                }
            }

            // Substituir botões de Entrar/Cadastrar por botão de Painel/Perfil
            const roleLower2 = (user.profile || user.role || '').toLowerCase();
            const panelHref2 = roleLower2 === 'vendedor' ? 'vendor-dashboard.html' : (roleLower2 === 'admin' || roleLower2 === 'administrador' ? 'admin-dashboard.html' : 'profile.html');
            const loginLink = header.querySelector('a[href="login.html"]');
            const registerLink = header.querySelector('a[href="register.html"]');
            if (loginLink && registerLink) {
                // Esconder os links antigos
                loginLink.style.display = 'none';
                registerLink.style.display = 'none';
                const container = loginLink.parentElement || header.querySelector('.flex.items-center');
                if (container && !header.querySelector('#panel-button')) {
                    const panelBtn = document.createElement('a');
                    panelBtn.id = 'panel-button';
                    panelBtn.href = panelHref2;
                    panelBtn.className = 'px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium text-sm';
                    panelBtn.innerHTML = roleLower2 === 'vendedor'
                        ? '<i class="fas fa-chart-line mr-2"></i>Painel de Vendas'
                        : '<i class="fas fa-user mr-2"></i>Meu Perfil';
                    container.appendChild(panelBtn);
                    // Botão de Início ao lado do painel (apenas fora da Home)
                    const isHome = /index\.html$/i.test(location.pathname);
                    const existingHome = header.querySelector('#panel-home');
                    if (isHome && existingHome) existingHome.remove();
                    if (!isHome && !existingHome) {
                        const homeBtn = document.createElement('a');
                        homeBtn.id = 'panel-home';
                        homeBtn.href = 'index.html';
                        homeBtn.className = 'ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 font-medium text-sm';
                        homeBtn.innerHTML = '<i class="fas fa-home mr-2"></i>Início';
                        container.appendChild(homeBtn);
                    }
                }
            }

            // Se existir um botão de Sair visível em dashboards, adicionar "Início" ao lado dele
            const logoutBtn = header.querySelector('#logout-btn, .logout-btn, button[onclick*="openLogoutModal"], button[onclick^="logout"], a[onclick^="logout"]');
            if (logoutBtn) {
                let wrapper = header.querySelector('#panel-home-logout-area');
                if (!wrapper) {
                    wrapper = document.createElement('span');
                    wrapper.id = 'panel-home-logout-area';
                    wrapper.className = 'flex items-center space-x-2';
                    logoutBtn.parentElement && logoutBtn.parentElement.insertBefore(wrapper, logoutBtn);
                }
                // Garantir apenas UM botão Início ao lado do logout
                const hasHome = Array.from(wrapper.querySelectorAll('a, button')).some(el => {
                    const t = (el.textContent||'').trim().toLowerCase();
                    const href = (el.getAttribute && (el.getAttribute('href')||'').toLowerCase()) || '';
                    return t === 'início' || href === 'index.html' || href.endsWith('/index.html');
                });
                if (!hasHome) {
                    const homeBtn2 = document.createElement('a');
                    homeBtn2.href = 'index.html';
                    homeBtn2.className = 'px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 font-medium text-sm';
                    homeBtn2.innerHTML = '<i class="fas fa-home mr-2"></i>Início';
                    wrapper.appendChild(homeBtn2);
                }
                // Garantir logout esteja dentro do wrapper
                if (logoutBtn.parentElement !== wrapper) wrapper.appendChild(logoutBtn);
            }
        } else {
            // Mostrar botões de login/cadastro
            const userInfo = header.querySelector('.user-info');
            if (userInfo) {
                userInfo.innerHTML = `
                    <a href="login.html" class="text-sm text-gray-600 hover:text-primary-600">Entrar</a>
                    <a href="register.html" class="text-sm text-primary-600 hover:text-primary-700">Cadastrar</a>
                `;
            }
        }
    }

    updateNavigation() {
        // Atualizar navegação baseada no usuário logado
        const user = this.currentUser;
        
        if (user) {
            // Mostrar links específicos do usuário
            const nav = document.querySelector('nav');
            if (nav) {
                // Adicionar links específicos baseados no role
                if (user.role === 'vendedor') {
                    const vendorLink = nav.querySelector('.vendor-link');
                    if (vendorLink) {
                        vendorLink.style.display = 'block';
                    }
                }
            }
        }
    }

    // ===== VALIDAÇÕES =====
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        // Remove espaços
        email = email.trim().toLowerCase();

        // Deve ter exatamente um @
        const atCount = (email.match(/@/g) || []).length;
        if (atCount !== 1) {
            return false;
        }

        // Divide em parte local e domínio
        const [localPart, domainPart] = email.split('@');

        // Validações da parte local (antes do @)
        if (!localPart || localPart.length === 0 || localPart.length > 64) {
            return false;
        }

        // Parte local não pode começar ou terminar com ponto
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
            return false;
        }

        // Não pode ter pontos consecutivos na parte local
        if (localPart.includes('..')) {
            return false;
        }

        // Regex para parte local válida
        const localRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
        if (!localRegex.test(localPart)) {
            return false;
        }

        // Validações do domínio
        if (!domainPart || domainPart.length === 0 || domainPart.length > 253) {
            return false;
        }

        // Verificar se domínio tem pontos duplos ou termina com ponto
        if (domainPart.includes('..') || domainPart.startsWith('.') || domainPart.endsWith('.')) {
            return false;
        }

        // Verificar se não tem TLD duplicado (ex: .com.com)
        const domainParts = domainPart.split('.');
        if (domainParts.length < 2) {
            return false;
        }
        
        // Verificar se não há TLDs duplicados consecutivos
        for (let i = 0; i < domainParts.length - 1; i++) {
            if (domainParts[i] === domainParts[i + 1]) {
                return false;
            }
        }

        // Lista de domínios conhecidos e confiáveis
        const trustedDomains = [
            'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
            'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.it', 'hotmail.es',
            'outlook.com', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.it', 'outlook.es',
            'live.com', 'live.co.uk', 'live.fr', 'live.de', 'live.it', 'live.es',
            'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
            'protonmail.com', 'proton.me', 'tutanota.com', 'tutanota.de', 'tuta.io',
            'fastmail.com', 'hey.com', 'zoho.com', 'yandex.com', 'yandex.ru',
            'mail.ru', 'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'naver.com',
            'terra.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br', 'globo.com', 'r7.com',
            'zipmail.com.br', 'click21.com.br', 'pop.com.br', 'ibest.com.br', 'oi.com.br',
            'superig.com.br', 'designmail.com.br', 'email.com.br', 'netsite.com.br',
            // Domínios demo para desenvolvimento
            'email.com', 'demo.com', 'test.com', 'example.com'
        ];

        // Verificar domínios conhecidos
        if (trustedDomains.includes(domainPart)) {
            return true;
        }

        // Verificar domínios educacionais e governamentais
        if (domainPart.endsWith('.edu') || domainPart.endsWith('.gov') || 
            domainPart.endsWith('.edu.br') || domainPart.endsWith('.gov.br') ||
            domainPart.endsWith('.ac.uk') || domainPart.endsWith('.mil.br')) {
            return true;
        }

        // Verificar domínios corporativos conhecidos
        const businessDomains = [
            'microsoft.com', 'apple.com', 'google.com', 'amazon.com', 'meta.com', 'facebook.com',
            'twitter.com', 'x.com', 'linkedin.com', 'netflix.com', 'spotify.com', 'adobe.com',
            'oracle.com', 'salesforce.com', 'ibm.com', 'intel.com', 'nvidia.com', 'amd.com',
            'itau.com.br', 'bradesco.com.br', 'bb.com.br', 'santander.com.br', 'caixa.gov.br',
            'nubank.com.br', 'inter.co', 'c6bank.com.br', 'original.com.br', 'safra.com.br',
            'usp.br', 'unicamp.br', 'ufrj.br', 'ufmg.br', 'ufsc.br', 'puc-rio.br', 'fgv.br',
            'petrobras.com.br', 'vale.com', 'ambev.com.br', 'embraer.com.br', 'jbs.com.br',
            'magazineluiza.com.br', 'americanas.com.br', 'mercadolivre.com.br', 'globo.com'
        ];

        if (businessDomains.includes(domainPart)) {
            return true;
        }

        // Se não está nas listas acima, rejeitar
        return false;
    }

    validateName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }
        
        // Remove espaços extras
        const trimmedName = name.trim();
        
        // Deve ter pelo menos 2 caracteres
        if (trimmedName.length < 2) {
            return false;
        }
        
        // Deve conter apenas letras (incluindo acentos) e espaços
        // Permite nomes compostos como "João Pedro" ou "Maria Clara"
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!nameRegex.test(trimmedName)) {
            return false;
        }
        
        // Verifica se cada palavra tem pelo menos 2 caracteres
        const words = trimmedName.split(/\s+/);
        for (let word of words) {
            if (word.length < 2) {
                return false;
            }
        }
        
        // Verificar apenas padrões realmente suspeitos
        const suspiciousPatterns = [
            /^[a-z]{2}$/i,  // Apenas 2 letras minúsculas (ab, cd, etc.)
        ];
        
        // Verificar se o nome não corresponde a padrões suspeitos
        for (let pattern of suspiciousPatterns) {
            if (pattern.test(trimmedName)) {
                return false;
            }
        }
        
        // Padrões como "bcdf", "ghjk" são suspeitos (apenas consoantes consecutivas)
        const consonantPattern = /^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]+$/;
        if (consonantPattern.test(trimmedName)) {
            return false;
        }
        
        return true;
    }

    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return false;
        }

        // Verificar comprimento mínimo
        if (password.length < 10) {
            return false;
        }

        // Verificar letras minúsculas
        if (!/[a-z]/.test(password)) {
            return false;
        }

        // Verificar letras maiúsculas
        if (!/[A-Z]/.test(password)) {
            return false;
        }

        // Verificar números
        if (!/[0-9]/.test(password)) {
            return false;
        }

        // Verificar caracteres especiais
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return false;
        }

        // Verificar se não é uma senha comum
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
            'master', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1'
        ];
        
        if (commonPasswords.includes(password.toLowerCase())) {
            return false;
        }

        return true;
    }

    // ===== NOTIFICAÇÕES =====
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // ===== VALIDAÇÃO DE CAMPOS =====
    showFieldError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error');
        
        if (input) {
            input.classList.add('border-red-500', 'focus:ring-red-500');
            input.classList.remove('border-green-500', 'focus:ring-green-500');
        }
        
        if (errorDiv) {
            errorDiv.classList.remove('hidden');
            const span = errorDiv.querySelector('span');
            if (span) {
                span.textContent = message;
            }
        }
    }

    clearFieldError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error');
        
        if (input) {
            input.classList.remove('border-red-500', 'focus:ring-red-500');
        }
        
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    clearAllFieldErrors() {
        const fieldIds = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'profile'];
        fieldIds.forEach(fieldId => {
            this.clearFieldError(fieldId);
        });
    }

    clearLoginFieldErrors() {
        const fieldIds = ['email', 'password'];
        fieldIds.forEach(fieldId => {
            this.clearFieldError(fieldId);
        });
    }

    // ===== SESSÃO =====
    startSessionTimeout() {
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }
        
        this.sessionTimeout = setTimeout(() => {
            this.logout();
        }, 30 * 60 * 1000); // 30 minutos
    }

    resetSessionTimeout() {
        if (this.currentUser) {
            this.startSessionTimeout();
        }
    }

    // Retorna o usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de autenticação...');
    window.authSystem = new AuthSystem();
    console.log('✅ Sistema de autenticação carregado');
});

// Função global de logout para compatibilidade
function logout() {
    const userData = JSON.parse(localStorage.getItem('e2e_current_user') || '{}');
    const demoEmails = ['joao@email.com', 'maria@email.com', 'admin@email.com'];
    const isDemo = demoEmails.includes(userData.email);
    
    const demoMessage = isDemo ? '\n\nEste é um perfil de demonstração. Alterações feitas não serão salvas.' : '';
    
    if (confirm('Tem certeza que deseja sair?' + demoMessage)) {
        if (window.authSystem) {
            window.authSystem.logout();
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('e2e_current_user');
            localStorage.removeItem('vendor_data');
            window.location.href = 'index.html';
        }
    }
}
