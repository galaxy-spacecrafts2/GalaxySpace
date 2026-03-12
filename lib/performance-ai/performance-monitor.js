// Monitor de desempenho do dispositivo
export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            gpu: 0,
            connection: 0
        };
        
        this.benchmarks = {
            cpu: null,
            memory: null,
            gpu: null,
            connection: null
        };
    }
    
    async measureCPU() {
        const start = performance.now();
        
        // Teste de CPU: cálculos matemáticos intensivos
        const iterations = 1000000;
        let result = 0;
        
        for (let i = 0; i < iterations; i++) {
            result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        // Normalizar para 0-1 (menor tempo = melhor desempenho)
        const score = Math.max(0, Math.min(1, 1 - (duration / 1000)));
        
        return score;
    }
    
    async measureMemory() {
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            const used = memoryInfo.usedJSHeapSize;
            const total = memoryInfo.totalJSHeapSize;
            const limit = memoryInfo.jsHeapSizeLimit;
            
            // Calcular utilização de memória (menor utilização = melhor)
            const utilization = used / limit;
            const score = Math.max(0, Math.min(1, 1 - utilization));
            
            return score;
        }
        
        // Fallback para navegadores que não suportam performance.memory
        const start = performance.now();
        
        // Criar muitos objetos para testar gerenciamento de memória
        const objects = [];
        for (let i = 0; i < 100000; i++) {
            objects.push({ id: i, data: new Array(100).fill(Math.random()) });
        }
        
        // Limpar referências
        objects.length = 0;
        
        const end = performance.now();
        const duration = end - start;
        
        // Assumir que se o GC for rápido, a memória é boa
        const score = Math.max(0, Math.min(1, 1 - (duration / 500)));
        
        return score;
    }
    
    async measureGPU() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return 0.3; // Score baixo se não suportar WebGL
        }
        
        const start = performance.now();
        
        // Teste de GPU: renderização simples
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `);
        gl.compileShader(vertexShader);
        
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `);
        gl.compileShader(fragmentShader);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        
        // Desenhar múltiplos triângulos para testar performance
        for (let i = 0; i < 1000; i++) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        // Normalizar score
        const score = Math.max(0, Math.min(1, 1 - (duration / 100)));
        
        return score;
    }
    
    async measureConnection() {
        if (!navigator.connection) {
            // Fallback: testar velocidade de download
            return await this.measureDownloadSpeed();
        }
        
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        
        // Mapear tipos de conexão para scores
        const typeScores = {
            'slow-2g': 0.1,
            '2g': 0.2,
            '3g': 0.5,
            '4g': 0.8
        };
        
        let score = typeScores[effectiveType] || 0.5;
        
        // Ajustar baseado no downlink se disponível
        if (downlink) {
            score = Math.min(1, downlink / 10); // Assumir 10 Mbps como excelente
        }
        
        return score;
    }
    
    async measureDownloadSpeed() {
        const start = performance.now();
        
        try {
            // Baixar um pequeno arquivo de teste
            const response = await fetch('data:text/plain;base64,' + btoa('x'.repeat(10000)));
            await response.text();
            
            const end = performance.now();
            const duration = end - start;
            
            // Calcular score baseado na velocidade
            const speed = 10000 / (duration / 1000); // bytes por segundo
            const score = Math.min(1, speed / 1000000); // 1MB/s como excelente
            
            return score;
        } catch (error) {
            return 0.3; // Score médio em caso de erro
        }
    }
    
    async measureAllMetrics() {
        const results = await Promise.all([
            this.measureCPU(),
            this.measureMemory(),
            this.measureGPU(),
            this.measureConnection()
        ]);
        
        this.metrics = {
            cpu: results[0],
            memory: results[1],
            gpu: results[2],
            connection: results[3]
        };
        
        return this.metrics;
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
    
    getMetricsArray() {
        return [
            this.metrics.cpu,
            this.metrics.memory,
            this.metrics.gpu,
            this.metrics.connection
        ];
    }
    
    async runBenchmark() {
        console.log('Iniciando benchmark de desempenho...');
        
        const start = performance.now();
        await this.measureAllMetrics();
        const end = performance.now();
        
        console.log(`Benchmark concluído em ${(end - start).toFixed(2)}ms`);
        console.log('Métricas:', this.metrics);
        
        return this.metrics;
    }
}
