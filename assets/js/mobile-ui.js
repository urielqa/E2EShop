// Mobile UI Enhancer - Shared behaviors for all pages
(function(){
  if (window.__mobileUIInitialized) return; // avoid double init
  window.__mobileUIInitialized = true;

  function qs(selector, root){ return (root||document).querySelector(selector); }
  function qsa(selector, root){ return Array.prototype.slice.call((root||document).querySelectorAll(selector)); }

  function ensureStyle(){
    if (qs('#mobile-ui-style')) return;
    var style = document.createElement('style');
    style.id = 'mobile-ui-style';
    style.textContent = '\n@media (max-width: 768px){\n  .mobile-hidden{ display: none !important; }\n  .mobile-flex{ display: inline-flex !important; }\n  .mobile-block{ display: block !important; }\n}\n';
    document.head.appendChild(style);
  }
  function removeIfExists(selector){ var el = qs(selector); if (el && el.parentNode) el.parentNode.removeChild(el); }

  function markIfExists(el, cls){ if (el) el.classList.add(cls); }

  function findHeaderRoot(){
    var headers = qsa('header');
    if (headers.length) return headers[0];
    return null;
  }

  function setupMobileHeader(){
    var header = findHeaderRoot();
    if (!header) return;

    // Hide heavy topbar contacts on mobile
    var topBar = header.querySelector('.bg-gradient-to-r');
    if (topBar) {
      // keep only the free shipping message; hide the contacts on mobile
      qsa('a[href^="tel:"], a[href^="mailto:"]', topBar).forEach(function(a){ a.classList.add('mobile-hidden'); });
    }

    // Desktop search container (robust)
    var searchInput = qs('input.search-input', header) || qs('button.search-btn', header);
    var searchWrap = null;
    if (searchInput) {
      searchWrap = searchInput.closest('.flex-1') || searchInput.closest('.relative') || searchInput.closest('.flex');
    }
    // Also check if there is a select used inside the search block
    if (!searchWrap) {
      var possibleSelect = qs('.flex.rounded-xl select', header);
      if (possibleSelect) {
        searchWrap = possibleSelect.closest('.flex-1') || possibleSelect.closest('.relative') || possibleSelect.closest('.flex');
      }
    }
    if (searchWrap && !searchWrap.querySelector('img.header-logo')) {
      markIfExists(searchWrap, 'mobile-hidden');
    }

    // Ensure the full search bar (rounded container) is hidden on mobile
    var roundedSearch = qs('.flex.rounded-xl', header);
    if (roundedSearch) markIfExists(roundedSearch, 'mobile-hidden');

    // If there is a categories select visible, hide its container on mobile
    var categoriesSelect = qs('select[minlength], select[class*="min-w"], select', header);
    if (categoriesSelect) {
      var selectWrap = categoriesSelect.closest('.flex.rounded-xl') || categoriesSelect.closest('.flex-1') || categoriesSelect.parentElement;
      if (selectWrap) markIfExists(selectWrap, 'mobile-hidden');
    }

    // Auth buttons container (cover different markups)
    var loginLink = qs('#login-link', header) || qs('a[href*="login.html"]', header);
    var registerLink = qs('#register-link', header) || qs('a[href*="register.html"]', header);
    var authWrap = null;
    if (loginLink) authWrap = loginLink.parentElement;
    if (!authWrap && registerLink) authWrap = registerLink.parentElement;
    if (authWrap) markIfExists(authWrap, 'mobile-hidden');

    // Navigation (inside header or right after)
    var innerNavs = qsa('nav', header);
    innerNavs.forEach(function(n){ n.classList.add('mobile-hidden'); });
    var belowNav = header.nextElementSibling;
    if (belowNav && belowNav.tagName && belowNav.tagName.toLowerCase() === 'nav') belowNav.classList.add('mobile-hidden');

    // Header actions area to mount buttons
    var actionsArea = null;
    qsa('.flex', header).forEach(function(div){
      if (div.querySelector('i.fa-shopping-cart') || div.querySelector('.cart-count')) actionsArea = div.closest('.flex.items-center') || div;
    });
    if (!actionsArea) actionsArea = qs('header .flex.items-center.justify-between > .flex.items-center:last-child', header);

    // Prefer to place mobile buttons in the main white row (not the topbar)
    var mainHeaderRow = qs('div.bg-white .container .flex.items-center.justify-between', header)
      || qs('div.bg-white .container .flex.justify-between', header)
      || qs('div.bg-white .container .flex', header);
    var rightArea = null;
    if (mainHeaderRow) {
      rightArea = mainHeaderRow.querySelector(':scope > .flex.items-center:last-child');
      if (!rightArea) {
        rightArea = document.createElement('div');
        rightArea.className = 'flex items-center space-x-3';
        mainHeaderRow.appendChild(rightArea);
      }
    }
    var targetArea = rightArea || actionsArea;

    // Create mobile buttons only on mobile view
    if (window.innerWidth < 768) {
      if (targetArea && !qs('#mobile-search-btn', targetArea)) {
        var searchBtn = document.createElement('button');
        searchBtn.id = 'mobile-search-btn';
        searchBtn.setAttribute('aria-label', 'Buscar');
        searchBtn.className = 'mobile-flex p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 md:hidden';
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        targetArea.appendChild(searchBtn);
      }
      if (targetArea && !qs('#mobile-menu-btn', targetArea)) {
        var menuBtn = document.createElement('button');
        menuBtn.id = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Abrir menu');
        menuBtn.className = 'mobile-flex p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 active:scale-95 md:hidden';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        targetArea.appendChild(menuBtn);
      }
    }

    // If buttons ended up in the topbar, move them down to main row
    var topBarRow = qs('.bg-gradient-to-r .container .flex', header) || qs('.bg-gradient-to-r', header);
    if (topBarRow && (qs('#mobile-search-btn', topBarRow) || qs('#mobile-menu-btn', topBarRow)) && targetArea) {
      var sBtn = qs('#mobile-search-btn', topBarRow); if (sBtn) targetArea.appendChild(sBtn);
      var mBtn = qs('#mobile-menu-btn', topBarRow); if (mBtn) targetArea.appendChild(mBtn);
    }

    // Guarantee logo stays in the main white row (not the top bar)
    var logo = qs('img.header-logo', header);
    var topBarRow = qs('.bg-gradient-to-r .container .flex', header) || qs('.bg-gradient-to-r', header);
    var mainHeaderRow = qs('div.bg-white .container .flex.items-center.justify-between', header) 
      || qs('div.bg-white .container .flex.justify-between', header) 
      || qs('div.bg-white .container .flex', header);
    if (logo) {
      var logoParent = logo.closest('a, div');
      var insideTopBar = topBarRow && logoParent && topBarRow.contains(logoParent);
      if (insideTopBar && mainHeaderRow && logoParent) {
        // move logo to the start of the main header row
        mainHeaderRow.insertBefore(logoParent, mainHeaderRow.firstElementChild || null);
      }
    }

    // Inject mobile search bar only on mobile
    if (window.innerWidth < 768 && !qs('#mobile-search-bar')) {
      var mobileSearch = document.createElement('div');
      mobileSearch.id = 'mobile-search-bar';
      mobileSearch.className = 'hidden md:hidden border-b border-gray-200 bg-white';
      mobileSearch.innerHTML = '\n        <div class="container mx-auto px-4 py-2">\n          <div class="flex rounded-xl border border-gray-300">\n            <input type="text" class="flex-1 w-full px-4 py-2.5 border-0 focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400" placeholder="Buscar produtos, marcas e mais...">\n            <button class="px-3 text-white bg-primary-500 rounded-r-xl"><i class="fas fa-search"></i></button>\n          </div>\n        </div>\n      ';
      // Insert after header
      header.parentNode.insertBefore(mobileSearch, header.nextSibling);
    }

    // Inject mobile drawer only on mobile
    if (window.innerWidth < 768 && !qs('#mobile-drawer')) {
      var drawer = document.createElement('div');
      drawer.id = 'mobile-drawer';
      drawer.className = 'fixed inset-0 z-50 hidden';
      drawer.innerHTML = '\n        <div id="mobile-drawer-overlay" class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300"></div>\n        <div id="mobile-drawer-panel" class="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white/95 backdrop-blur-xl border-r border-gray-100 rounded-r-2xl shadow-2xl transform -translate-x-full transition-transform duration-300">\n          <div class="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-5 rounded-tr-2xl">\n            <div class="flex items-center space-x-3">\n              <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner"><i class="fas fa-user"></i></div>\n              <div class="flex-1">\n                <div id="drawer-user-name" class="font-semibold">Bem-vindo</div>\n                <div id="drawer-user-role" class="text-xs opacity-90">Visitante</div>\n              </div>\n              <button id="mobile-menu-close" class="p-2 rounded-lg hover:bg-white/10" aria-label="Fechar menu"><i class="fas fa-times"></i></button>\n            </div>\n          </div>\n          <nav id="mobile-drawer-nav" class="p-4 space-y-1">\n            <div class="text-xs uppercase tracking-wider text-gray-400 px-2 pt-1">Explorar</div>\n          </nav>\n        </div>\n      ';
      document.body.appendChild(drawer);
    }

    // Bind controls
    var mobileMenuBtn = qs('#mobile-menu-btn', header);
    var mobileMenuClose = qs('#mobile-menu-close');
    var mobileDrawer = qs('#mobile-drawer');
    var mobileDrawerPanel = qs('#mobile-drawer-panel');
    var mobileDrawerOverlay = qs('#mobile-drawer-overlay');
    var mobileSearchBtn = qs('#mobile-search-btn', header);
    var mobileSearchBar = qs('#mobile-search-bar');

    function openDrawer(){
      if (!mobileDrawer || !mobileDrawerPanel) return;
      mobileDrawer.classList.remove('hidden');
      requestAnimationFrame(function(){
        mobileDrawerPanel.classList.remove('-translate-x-full');
        var ov = qs('#mobile-drawer-overlay'); if (ov) ov.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
      });
    }
    function closeDrawer(){
      if (!mobileDrawer || !mobileDrawerPanel) return;
      mobileDrawerPanel.classList.add('-translate-x-full');
      var ov2 = qs('#mobile-drawer-overlay'); if (ov2) ov2.classList.remove('opacity-100');
      setTimeout(function(){ if (mobileDrawer) mobileDrawer.classList.add('hidden'); document.body.style.overflow = ''; }, 300);
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', function(e){ e.preventDefault(); openDrawer(); });
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', function(e){ e.preventDefault(); closeDrawer(); });
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);
    if (mobileDrawer) mobileDrawer.addEventListener('click', function(e){ var link = e.target.closest('a'); if (link) closeDrawer(); });
    if (mobileSearchBtn && mobileSearchBar) mobileSearchBtn.addEventListener('click', function(e){ e.preventDefault(); mobileSearchBar.classList.toggle('mobile-hidden'); });

    // Contextual cleanup for profile and vendor pages (mobile)
    var path = (location.pathname || '').toLowerCase();
    var isProfile = path.endsWith('/profile.html') || path.includes('/profile.html');
    var isVendor = path.endsWith('/vendor-dashboard.html') || path.includes('/vendor-dashboard.html');
    if (isProfile || isVendor) {
      var isMobile = window.innerWidth < 768;
      // Hide heavy/irrelevant icons only on mobile
      qsa('a, button', header).forEach(function(el){
        var hasHeart = !!el.querySelector('.fa-heart');
        var hasCart = !!el.querySelector('.fa-shopping-cart');
        if (hasHeart || hasCart) {
          if (isMobile) {
            el.classList.add('mobile-hidden');
          } else {
            el.classList.remove('mobile-hidden');
          }
        }
      });
      // User area block visibility only on mobile
      var userBadge = qs('#header-user-photo', header) || qs('#header-avatar', header) || qs('#header-default-icon', header);
      if (userBadge) {
        var userBlock = userBadge.closest('.flex');
        if (userBlock) userBlock.style.display = isMobile ? 'none' : '';
      }
      // Name/role and quick actions Início/Sair: hide on mobile, show on desktop
      qsa('#user-name, #vendor-name', header).forEach(function(el){ var wrap = el.closest('.flex'); if (wrap) wrap.style.display = isMobile ? 'none' : ''; });
      qsa('a, button', header).forEach(function(el){ var t=(el.textContent||'').trim().toLowerCase(); if (t==='início' || t==='sair') el.style.display = isMobile ? 'none' : ''; });
      // Ensure hamburger only on mobile
      if (isMobile && mobileMenuBtn) mobileMenuBtn.className = mobileMenuBtn.className.replace('md:mobile-hidden','');
    }

    // Populate drawer menu dynamically
    (function populateDrawer(){
      var nav = qs('#mobile-drawer-nav');
      var nameEl = qs('#drawer-user-name');
      var roleEl = qs('#drawer-user-role');
      if (!nav) return;
      var user=null; try{ user = JSON.parse(localStorage.getItem('e2e_current_user')||'null'); }catch{}
      if (user && (user.firstName || user.lastName)) {
        if (nameEl) nameEl.textContent = ((user.firstName||'') + ' ' + (user.lastName||'')).trim();
        if (roleEl) roleEl.textContent = (user.role || (isVendor ? 'Vendedor' : 'Cliente'));
      } else {
        if (nameEl) nameEl.textContent = 'Bem-vindo';
        if (roleEl) roleEl.textContent = 'Visitante';
      }
      var itemCls = 'block px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center';
      var iconCls = 'w-5 mr-3 text-gray-500';
      var links = '';
      links += '<a href="index.html" class="'+itemCls+'"><i class="fas fa-home '+iconCls+'"></i><span>Início</span></a>';
      links += '<a href="products.html" class="'+itemCls+'"><i class="fas fa-th-large '+iconCls+'"></i><span>Produtos</span></a>';
      links += '<a href="favorites.html" class="'+itemCls+'"><i class="fas fa-heart '+iconCls+'"></i><span>Favoritos</span></a>';
      links += '<a href="cart.html" class="'+itemCls+'"><i class="fas fa-shopping-cart '+iconCls+'"></i><span>Carrinho</span></a>';
      if (user && user.id) {
        links += '<div class="pt-3 mt-3 border-t">';
        links += '<div class="text-xs uppercase tracking-wider text-gray-400 px-2 pb-1">Minha conta</div>';
        links += '<a href="profile.html" class="'+itemCls+'"><i class="fas fa-user '+iconCls+'"></i><span>Meu Perfil</span></a>';
        links += '<a href="orders.html" class="'+itemCls+'"><i class="fas fa-receipt '+iconCls+'"></i><span>Meus Pedidos</span></a>';
        links += '<a href="vendor-dashboard.html" class="'+itemCls+'"><i class="fas fa-store '+iconCls+'"></i><span>Painel do Vendedor</span></a>';
        links += '<button id="drawer-logout" class="'+itemCls+' w-full text-left"><i class="fas fa-sign-out-alt '+iconCls+'"></i><span>Sair</span></button>';
        links += '</div>';
      } else {
        links += '<div class="pt-3 mt-3 border-t">';
        links += '<div class="text-xs uppercase tracking-wider text-gray-400 px-2 pb-1">Acessar</div>';
        links += '<a id="drawer-login" href="login.html" class="'+itemCls+'"><i class="fas fa-sign-in-alt '+iconCls+'"></i><span>Entrar</span></a>';
        links += '<a id="drawer-register" href="register.html" class="'+itemCls+'"><i class="fas fa-user-plus '+iconCls+'"></i><span>Cadastrar</span></a>';
        links += '</div>';
      }
      nav.innerHTML = links;
      var logoutBtn = qs('#drawer-logout');
      if (logoutBtn) logoutBtn.addEventListener('click', function(){ try{
        localStorage.removeItem('e2e_current_user');
      }catch{} window.location.href='index.html'; });
    })();
  }

  document.addEventListener('DOMContentLoaded', function(){
    ensureStyle();
    setupMobileHeader();

    // Ensure logo size and visibility on mobile
    var logos = document.querySelectorAll('img.header-logo');
    logos.forEach(function(img){
      img.style.maxHeight = '40px';
      img.style.width = 'auto';
      img.loading = 'eager';
      img.decoding = 'sync';
      if (!img.src || /logo-.*\.png$/.test(img.src) === false) {
        img.src = 'assets/images/logo/header/logo-dark.png';
      }
      // Unhide any parent accidentally hidden
      var parent = img.closest('a, div');
      if (parent && parent.classList.contains('mobile-hidden')) parent.classList.remove('mobile-hidden');
    });

    // Hide "Visitante/Cliente" labels when no user is logged in
    try {
      var rawUser = localStorage.getItem('e2e_current_user');
      var currentUser = rawUser ? JSON.parse(rawUser) : null;
      if (!currentUser || !currentUser.id) {
        qsa('#user-name').forEach(function(el){
          var textBlock = el.parentElement; // usually the container with role label below
          if (textBlock) textBlock.style.display = 'none';
        });
      }
    } catch {}

    // Remove mobile UI from desktop entirely
    function applyResponsiveCleanup(){
      var isDesktop = window.innerWidth >= 768;
      if (isDesktop) {
        // remove mobile controls and containers
        removeIfExists('#mobile-search-bar');
        removeIfExists('#mobile-drawer');
        removeIfExists('#mobile-menu-btn');
        removeIfExists('#mobile-search-btn');
      } else {
        // ensure minimal elements exist for mobile (buttons may be provided inline per page; otherwise they stay omitted)
        // No action required; pages já possuem os botões ou o script injeta quando necessário
      }
    }
    applyResponsiveCleanup();
    window.addEventListener('resize', applyResponsiveCleanup);

    // De-duplicar ações do header (Início / Sair) caso múltiplos scripts as insiram
    function dedupeHeaderActions(){
      try {
        var header = findHeaderRoot();
        if (!header) return;
        var rightArea = header.querySelector('.bg-white .container .flex.items-center.justify-between > .flex.items-center:last-child')
          || header.querySelector('.bg-white .container .flex.justify-between > .flex.items-center:last-child')
          || header.querySelector('header .bg-white .flex.items-center:last-child')
          || header.querySelector('header .bg-white');
        if (!rightArea) rightArea = header;
        // Remover botões Início duplicados
        var homeButtons = Array.prototype.slice.call(rightArea.querySelectorAll('a, button')).filter(function(el){
          var txt = (el.textContent||'').trim().toLowerCase();
          var href = (el.getAttribute && (el.getAttribute('href')||'').toLowerCase()) || '';
          return txt === 'início' || href === 'index.html' || href.endsWith('/index.html');
        });
        if (homeButtons.length > 1) {
          homeButtons.slice(1).forEach(function(el){ if (el && el.parentNode) el.parentNode.removeChild(el); });
        }
        // Remover botões Sair duplicados
        var logoutButtons = Array.prototype.slice.call(rightArea.querySelectorAll('a, button')).filter(function(el){
          var txt = (el.textContent||'').trim().toLowerCase();
          return txt === 'sair';
        });
        if (logoutButtons.length > 1) {
          logoutButtons.slice(1).forEach(function(el){ if (el && el.parentNode) el.parentNode.removeChild(el); });
        }
      } catch {}
    }
    // Rodar agora e após uma pequena espera para cobrir ordem de carregamento distinta de outros scripts
    var path = (location.pathname || '').toLowerCase();
    dedupeHeaderActions();
    // Mais agressivo apenas fora dos dashboards; nos dashboards o auth.js gerencia
    if (!(path.endsWith('/profile.html') || path.endsWith('/vendor-dashboard.html'))) {
      setTimeout(dedupeHeaderActions, 400);
      setTimeout(dedupeHeaderActions, 1000);
    }

    // Garantir ações no header (Início e Sair) visíveis nas páginas de cliente e vendedor
    try {
      var path = (location.pathname || '').toLowerCase();
      if (path.endsWith('/profile.html') || path.endsWith('/vendor-dashboard.html')) {
        var headerBar = document.querySelector('header .bg-white.py-4, header .bg-white.py-3, header .bg-white.py-2') || document.querySelector('header .bg-white');
        var container = headerBar ? headerBar.querySelector('.container .flex.items-center.justify-between') : null;
        var rightArea = container ? container.lastElementChild : null;
        // Para dashboards (cliente/vendedor) o auth.js já gerencia o botão "Início".
        var shouldInjectHome = !(path.endsWith('/profile.html') || path.endsWith('/vendor-dashboard.html'));
        // Botão Início (evita duplicar verificando por href e texto)
        if (shouldInjectHome && rightArea && !Array.from(rightArea.querySelectorAll('a')).some(function(a){
          var text = (a.textContent||'').trim().toLowerCase();
          var href = (a.getAttribute('href')||'').toLowerCase();
          return text === 'início' || href === 'index.html' || href.endsWith('/index.html');
        })) {
          var home = document.createElement('a');
          home.href = 'index.html';
          home.className = 'px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 font-medium text-sm';
          home.innerHTML = '<i class="fas fa-home mr-2"></i>Início';
          rightArea.insertBefore(home, rightArea.firstChild);
        }
        // Botão Sair (não duplica se já houver um existente visível)
        var existingLogout = Array.from(rightArea.querySelectorAll('button, a')).find(function(el){
          var text = (el.textContent||'').trim().toLowerCase();
          return text === 'sair';
        });
        if (rightArea && !document.getElementById('logout-btn') && !existingLogout) {
          var btn = document.createElement('button');
          btn.id = 'logout-btn';
          btn.className = 'inline-flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-300 text-sm';
          btn.style.marginLeft = 'auto';
          btn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span class="hidden sm:inline">Sair</span>';
          btn.onclick = function(){
            // Modal moderno de confirmação
            var overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            overlay.innerHTML = '<div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">\
              <div class="p-5 border-b border-gray-100 flex items-center justify-between">\
                <h3 class="text-lg font-bold text-gray-900">Sair da conta?</h3>\
                <button class="p-2 rounded-lg hover:bg-gray-100" id="m-close"><i class="fas fa-times text-gray-500"></i></button>\
              </div>\
              <div class="p-5 text-gray-700">Tem certeza que deseja encerrar sua sessão?</div>\
              <div class="p-4 border-t border-gray-100 flex gap-2 justify-end">\
                <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" id="m-cancel">Cancelar</button>\
                <button class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700" id="m-confirm">Sair</button>\
              </div>\
            </div>';
            document.body.appendChild(overlay);
            function close(){ if(overlay&&overlay.parentNode) overlay.remove(); }
            overlay.querySelector('#m-close').onclick = close;
            overlay.querySelector('#m-cancel').onclick = close;
            overlay.querySelector('#m-confirm').onclick = function(){ try { localStorage.removeItem('e2e_current_user'); } catch {}; window.location.href = 'index.html'; };
          };
          rightArea.appendChild(btn);
        }
      }
    } catch {}
  });
})();


