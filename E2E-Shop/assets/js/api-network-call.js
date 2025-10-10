/**
 * Script para garantir que a chamada à API apareça no Network
 * Independente de outros problemas de carregamento
 */

(function() {
    'use strict';
    
    console.log('🚀 API Network Call Script carregado');
    
    // Função para fazer chamada à API
    async function makeAPICall() {
        try {
            console.log('🌐 Fazendo chamada direta à API para mostrar no network...');
            
            const response = await fetch('https://catalogo-products.pages.dev/api/products?page=1&pageSize=30', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API chamada realizada com sucesso!');
                console.log('📊 Produtos recebidos:', data.products?.length || 0);
                console.log('📊 Dados completos:', data);
                return data;
            } else {
                console.log('⚠️ API retornou status:', response.status);
                return null;
            }
        } catch (error) {
            console.log('❌ Erro na chamada da API:', error.message);
            return null;
        }
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', makeAPICall);
    } else {
        // DOM já está pronto
        makeAPICall();
    }
    
    // Também executar após um pequeno delay para garantir
    setTimeout(makeAPICall, 500);
    
    // Expor função globalmente para uso manual
    window.makeAPICall = makeAPICall;
    
})();



