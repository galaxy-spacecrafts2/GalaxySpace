// Sistema de otimização baseado no desempenho
export class PerformanceOptimizer {
    constructor() {
        this.optimizations = {
            images: true,
            animations: true,
            shadows: true,
            gradients: true,
            javascript: true,
            css: true,
            fonts: true,
            videos: true
        };
        
        this.performanceLevel = 'bom';
        this.originalStyles = new Map();
        this.optimizedElements = new Set();
    }
    
    setPerformanceLevel(level) {
        this.performanceLevel = level;
        this.applyOptimizations();
    }
    
    applyOptimizations() {
        switch (this.performanceLevel) {
            case 'ruim':
                this.applyHeavyOptimizations();
                break;
            case 'bom':
                this.applyModerateOptimizations();
                break;
            case 'excelente':
                this.applyMinimalOptimizations();
                break;
        }
    }
    
    applyHeavyOptimizations() {
        console.log('Aplicando otimizações pesadas para desempenho ruim...');
        
        // Otimizações de imagens
        this.optimizeImages('aggressive');
        
        // Remover animações
        this.disableAnimations();
        
        // Remover sombras complexas
        this.disableShadows();
        
        // Simplificar gradientes
        this.simplifyGradients();
        
        // Otimizar JavaScript
        this.optimizeJavaScript('aggressive');
        
        // Otimizar CSS
        this.optimizeCSS('aggressive');
        
        // Otimizar fontes
        this.optimizeFonts('aggressive');
        
        // Desabilitar vídeos
        this.disableVideos();
    }
    
    applyModerateOptimizations() {
        console.log('Aplicando otimizações moderadas para desempenho bom...');
        
        // Otimizações essenciais apenas
        this.optimizeImages('moderate');
        this.optimizeJavaScript('moderate');
        this.optimizeCSS('moderate');
        this.optimizeFonts('moderate');
    }
    
    applyMinimalOptimizations() {
        console.log('Aplicando otimizações mínimas para desempenho excelente...');
        
        // Manter todas as funcionalidades, apenas otimizações básicas
        this.optimizeImages('minimal');
    }
    
    optimizeImages(level) {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!this.optimizedElements.has(img)) {
                this.originalStyles.set(img, {
                    loading: img.loading,
                    decoding: img.decoding,
                    style: img.getAttribute('style')
                });
                
                switch (level) {
                    case 'aggressive':
                        img.loading = 'lazy';
                        img.decoding = 'async';
                        img.style.filter = 'contrast(0.9)';
                        break;
                    case 'moderate':
                        img.loading = 'lazy';
                        img.decoding = 'async';
                        break;
                    case 'minimal':
                        img.loading = 'lazy';
                        break;
                }
                
                this.optimizedElements.add(img);
            }
        });
    }
    
    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'performance-animations-disabled';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        
        if (!document.getElementById('performance-animations-disabled')) {
            document.head.appendChild(style);
        }
    }
    
    disableShadows() {
        const style = document.createElement('style');
        style.id = 'performance-shadows-disabled';
        style.textContent = `
            * {
                box-shadow: none !important;
                text-shadow: none !important;
                filter: none !important;
            }
        `;
        
        if (!document.getElementById('performance-shadows-disabled')) {
            document.head.appendChild(style);
        }
    }
    
    simplifyGradients() {
        const style = document.createElement('style');
        style.id = 'performance-gradients-simplified';
        style.textContent = `
            [style*="gradient"], [style*="linear-gradient"], [style*="radial-gradient"] {
                background: #f0f0f0 !important;
            }
        `;
        
        if (!document.getElementById('performance-gradients-simplified')) {
            document.head.appendChild(style);
        }
    }
    
    optimizeJavaScript(level) {
        // Adiar execução de scripts não críticos
        const scripts = document.querySelectorAll('script[data-defer="true"]');
        
        scripts.forEach(script => {
            if (level === 'aggressive' && !script.hasAttribute('data-optimized')) {
                script.setAttribute('data-optimized', 'true');
                script.defer = true;
            }
        });
        
        // Limitar event listeners em nível agressivo
        if (level === 'aggressive') {
            this.limitEventListeners();
        }
    }
    
    optimizeCSS(level) {
        const style = document.createElement('style');
        style.id = `performance-css-${level}`;
        
        let css = '';
        
        switch (level) {
            case 'aggressive':
                css = `
                    * {
                        will-change: auto !important;
                        transform: translateZ(0) !important;
                        backface-visibility: hidden !important;
                    }
                    
                    .performance-heavy {
                        display: none !important;
                    }
                `;
                break;
            case 'moderate':
                css = `
                    * {
                        will-change: auto !important;
                    }
                `;
                break;
        }
        
        style.textContent = css;
        
        if (!document.getElementById(`performance-css-${level}`)) {
            document.head.appendChild(style);
        }
    }
    
    optimizeFonts(level) {
        const style = document.createElement('style');
        style.id = `performance-fonts-${level}`;
        
        let css = '';
        
        switch (level) {
            case 'aggressive':
                css = `
                    * {
                        font-family: system-ui, -apple-system, sans-serif !important;
                        font-variation-settings: normal !important;
                        font-feature-settings: normal !important;
                    }
                `;
                break;
            case 'moderate':
                css = `
                    * {
                        font-display: swap !important;
                    }
                `;
                break;
        }
        
        style.textContent = css;
        
        if (!document.getElementById(`performance-fonts-${level}`)) {
            document.head.appendChild(style);
        }
    }
    
    disableVideos() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            if (!video.hasAttribute('data-performance-disabled')) {
                video.setAttribute('data-performance-disabled', 'true');
                video.pause();
                video.style.display = 'none';
            }
        });
    }
    
    limitEventListeners() {
        // Limitar frequência de eventos scroll e resize
        let scrollTimeout;
        let resizeTimeout;
        
        const originalScroll = window.onscroll;
        const originalResize = window.onresize;
        
        window.onscroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (originalScroll) originalScroll();
            }, 100);
        };
        
        window.onresize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (originalResize) originalResize();
            }, 200);
        };
    }
    
    resetOptimizations() {
        console.log('Resetando otimizações de desempenho...');
        
        // Remover estilos de performance
        const performanceStyles = document.querySelectorAll('[id^="performance-"]');
        performanceStyles.forEach(style => style.remove());
        
        // Restaurar estilos originais
        this.originalStyles.forEach((original, element) => {
            if (original.style) {
                element.setAttribute('style', original.style);
            }
            element.loading = original.loading;
            element.decoding = original.decoding;
        });
        
        // Limpar conjuntos
        this.optimizedElements.clear();
        this.originalStyles.clear();
    }
    
    getOptimizationReport() {
        return {
            performanceLevel: this.performanceLevel,
            optimizedElements: this.optimizedElements.size,
            activeOptimizations: Object.keys(this.optimizations).filter(key => this.optimizations[key])
        };
    }
}
