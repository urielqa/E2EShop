# 🛒 E2E SHOP - Sistema de E-commerce Completo

Sistema de e-commerce moderno e responsivo com integração de API real, carrinho funcional e painéis administrativos.

## 👥 Equipe de Desenvolvimento

**Desenvolvido por:** Uriel, Heraldo, Bruno, Fernanda, Samuel

## 🎯 Visão Geral

O E2E SHOP é uma plataforma de e-commerce completa desenvolvida com tecnologias modernas, oferecendo uma experiência de compra fluida e intuitiva. O sistema inclui funcionalidades avançadas como paginação, filtros, sistema de autenticação, carrinho de compras e painéis administrativos.

## 🚀 Estrutura do Projeto

### Páginas Principais
- `index.html` - Página inicial
- `products.html` - Catálogo de produtos
- `product-detail.html` - Detalhes do produto
- `cart.html` - Carrinho de compras
- `checkout.html` - Finalização de compra
- `login.html` - Login de usuário
- `register.html` - Cadastro de usuário
- `profile.html` - Perfil do usuário

### Páginas Administrativas
- `admin-dashboard.html` - Painel administrativo
- `vendor-dashboard.html` - Painel do vendedor

### Assets

#### CSS
- `assets/css/style.css` - Estilos principais

#### JavaScript (Sistema Limpo)
- `assets/js/products-api.js` - API de produtos (Cloudflare Pages + D1)
- `assets/js/modern-cart-system.js` - Sistema moderno de carrinho
- `assets/js/auth.js` - Sistema de autenticação
- `assets/js/categories.js` - Sistema de categorias
- `assets/js/components.js` - Componentes reutilizáveis
- `assets/js/clean-modals.js` - Sistema de modais
- `assets/js/admin-dashboard.js` - Painel administrativo
- `assets/js/vendor-dashboard.js` - Painel do vendedor
- `assets/js/profile.js` - Sistema de perfil

#### Imagens
- `assets/images/` - Imagens do sistema
- `assets/images/category-icons/` - Ícones de categorias
- `assets/images/banners/` - Banners promocionais

## 🔧 Funcionalidades Principais

### 🏠 Página Inicial
- **Seção "Mais Vendidos da Semana"** - Produtos em destaque com ranking de vendas
- **Sistema de Banners** - Banners rotativos responsivos (desktop/mobile)
- **Thumbnails Estratégicos** - Links diretos para categorias específicas
- **Design Moderno** - Interface limpa e profissional

### 🛍️ Sistema de Produtos
- **Catálogo Completo** - 30 produtos com imagens reais
- **Paginação Inteligente** - 12 produtos por página (3 páginas total)
- **Filtros Avançados** - Por categoria (Smartphones, Notebooks, Tablets, Acessórios)
- **Ordenação Dinâmica** - Por preço, avaliação, relevância, mais recentes
- **Design Responsivo** - 4 colunas desktop, 2 tablet, 1 mobile
- **Integração com API** - Cloudflare Pages + D1 com fallback local

### 🛒 Sistema de Carrinho
- **Carrinho Funcional** - Adição/remoção de produtos
- **Persistência Local** - Dados salvos no localStorage
- **Cálculo Automático** - Totais e descontos
- **Interface Moderna** - Design limpo e intuitivo
- **Integração com API** - Sincronização em tempo real

### 🔐 Sistema de Autenticação
- **Login/Cadastro** - Formulários com validação
- **Perfis de Usuário** - Cliente, Vendedor, Admin
- **Sessões Persistentes** - Login automático
- **Validação de Dados** - Email, senha, termos de uso
- **Mensagens em Português** - Interface localizada

### ⚙️ Painéis Administrativos
- **Painel do Vendedor** - Gestão de produtos e estoque
- **Painel Administrativo** - Controle total do sistema
- **Gerenciador de Estoque** - Controle de produtos
- **Relatórios** - Análise de vendas e performance
- **Sistema de Modais** - Interface moderna e responsiva

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox/Grid
- **JavaScript ES6+** - Funcionalidades avançadas
- **Tailwind CSS** - Framework CSS utilitário
- **Font Awesome** - Biblioteca de ícones

### Backend/API
- **Cloudflare Pages** - Hospedagem da API
- **Cloudflare D1** - Banco de dados SQL
- **REST API** - Endpoints para produtos e pedidos
- **LocalStorage** - Persistência local

### PWA (Progressive Web App)
- **Manifest.json** - Configuração PWA
- **Service Worker** - Cache offline
- **Ícones Responsivos** - Múltiplos tamanhos
- **Instalação Offline** - Funciona sem internet

## 🔗 Integração com API

### Endpoints Disponíveis
- **Base URL**: `https://catalogo-products.pages.dev`
- **Produtos**: `/api/products` - Catálogo completo
- **Pedidos**: `/api/orders` - Gestão de pedidos
- **Health Check**: `/api/health` - Status da API

### Sistema de Cache
- **Cache Inteligente** - Armazenamento local
- **Fallback Automático** - Dados locais em caso de indisponibilidade
- **Sincronização** - Atualização em tempo real

## 🚀 Instalação e Uso

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional)

### Instalação
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/urielqa/E2E-Shop.git
   cd E2E-Shop
   ```

2. **Abra o projeto**:
   - Abra `index.html` no navegador
   - Ou use um servidor local (Live Server, Python, etc.)

### Uso Básico
1. **Navegação** - Explore a página inicial
2. **Produtos** - Navegue pelo catálogo com filtros
3. **Carrinho** - Adicione produtos e finalize compras
4. **Conta** - Crie login e gerencie seu perfil
5. **Admin** - Acesse painéis administrativos

## 📱 Recursos PWA

- **Instalação** - Adicione à tela inicial
- **Offline** - Funciona sem conexão
- **Notificações** - Alertas de promoções
- **Performance** - Carregamento rápido

## 🎨 Design System

### Cores
- **Primária**: Laranja (#f97316) - Tema Temu/AliExpress
- **Secundária**: Cinza (#6b7280)
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: Responsivos (sm, base, lg, xl)
- **Pesos**: 300, 400, 500, 600, 700, 800, 900

## 📊 Estatísticas do Projeto

- **📄 Páginas**: 9 páginas HTML
- **🎨 Estilos**: 2 arquivos CSS principais
- **⚡ Scripts**: 15 arquivos JavaScript
- **🖼️ Imagens**: 30+ imagens de produtos
- **📱 PWA**: Totalmente funcional
- **👥 Equipe**: 5 desenvolvedores

## 🤝 Contribuição

Este é um projeto de equipe desenvolvido por:
- **Uriel** - 
- **Heraldo** - 
- **Bruno** -  
- **Fernanda** -
- **Samuel** - 

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**E2E SHOP** - Desenvolvido com ❤️ pela equipe 


