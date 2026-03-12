// Interface principal da IA de otimização de desempenho
import { PerformanceNeuralNetwork } from './neural-network.js';
import { PerformanceMonitor } from './performance-monitor.js';
import { PerformanceOptimizer } from './optimizer.js';

export class PerformanceAI {
    constructor(options = {}) {
        this.neuralNetwork = new PerformanceNeuralNetwork();
        this.monitor = new PerformanceMonitor();
        this.optimizer = new PerformanceOptimizer();
        
        this.options = {
            autoOptimize: true,
            continuousMonitoring: false,
            monitoringInterval: 30000, // 30 segundos
            ...options
        };
        
        this.isInitialized = false;
        this.monitoringInterval = null;
        this.lastPrediction = null;
        
        // Callbacks
        this.onPerformanceUpdate = null;
        this.onOptimizationApplied = null;
    }
    
    async initialize() {
        console.log('Inicializando IA de desempenho...');
        
        // Inicializar rede neural com dados pré-treinados
        this.neuralNetwork.initialize();
        
        // Medir desempenho inicial
        await this.monitor.runBenchmark();
        
        // Fazer primeira predição
        await this.analyzeAndOptimize();
        
        this.isInitialized = true;
        
        // Iniciar monitoramento contínuo se configurado
        if (this.options.continuousMonitoring) {
            this.startContinuousMonitoring();
        }
        
        console.log('IA de desempenho inicializada com sucesso!');
        return this.getReport();
    }
    
    async analyzeAndOptimize() {
        if (!this.isInitialized) {
            throw new Error('PerformanceAI não foi inicializado. Chame initialize() primeiro.');
        }
        
        // Medir métricas atuais
        const metrics = await this.monitor.measureAllMetrics();
        const metricsArray = this.monitor.getMetricsArray();
        
        // Fazer predição com a rede neural
        const prediction = this.neuralNetwork.predict(metricsArray);
        this.lastPrediction = prediction;
        
        console.log('Análise de desempenho:', {
            metrics,
            prediction
        });
        
        // Aplicar otimizações baseadas na predição
        if (this.options.autoOptimize) {
            this.optimizer.setPerformanceLevel(prediction.class);
            
            if (this.onOptimizationApplied) {
                this.onOptimizationApplied(prediction);
            }
        }
        
        // Notificar atualização
        if (this.onPerformanceUpdate) {
            this.onPerformanceUpdate({
                metrics,
                prediction,
                optimization: this.optimizer.getOptimizationReport()
            });
        }
        
        return {
            metrics,
            prediction,
            optimization: this.optimizer.getOptimizationReport()
        };
    }
    
    startContinuousMonitoring() {
        if (this.monitoringInterval) {
            this.stopContinuousMonitoring();
        }
        
        console.log(`Iniciando monitoramento contínuo (intervalo: ${this.options.monitoringInterval}ms)`);
        
        this.monitoringInterval = setInterval(async () => {
            try {
                await this.analyzeAndOptimize();
            } catch (error) {
                console.error('Erro no monitoramento contínuo:', error);
            }
        }, this.options.monitoringInterval);
    }
    
    stopContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('Monitoramento contínuo parado');
        }
    }
    
    // Métodos de controle manual
    async forceOptimization(level) {
        if (!['ruim', 'bom', 'excelente'].includes(level)) {
            throw new Error('Nível de otimização inválido. Use: ruim, bom ou excelente');
        }
        
        this.optimizer.setPerformanceLevel(level);
        
        const fakePrediction = {
            class: level,
            confidence: 1.0,
            probabilities: {
                ruim: level === 'ruim' ? 1.0 : 0.0,
                bom: level === 'bom' ? 1.0 : 0.0,
                excelente: level === 'excelente' ? 1.0 : 0.0
            }
        };
        
        this.lastPrediction = fakePrediction;
        
        if (this.onOptimizationApplied) {
            this.onOptimizationApplied(fakePrediction);
        }
        
        return this.optimizer.getOptimizationReport();
    }
    
    resetOptimizations() {
        this.optimizer.resetOptimizations();
        console.log('Otimizações resetadas');
    }
    
    // Métodos de informação
    getReport() {
        return {
            isInitialized: this.isInitialized,
            isMonitoring: !!this.monitoringInterval,
            lastPrediction: this.lastPrediction,
            currentMetrics: this.monitor.getMetrics(),
            optimizationReport: this.optimizer.getOptimizationReport(),
            options: this.options
        };
    }
    
    getMetrics() {
        return this.monitor.getMetrics();
    }
    
    getLastPrediction() {
        return this.lastPrediction;
    }
    
    // Métodos de configuração
    setAutoOptimize(enabled) {
        this.options.autoOptimize = enabled;
        console.log(`Auto-otimização ${enabled ? 'ativada' : 'desativada'}`);
    }
    
    setContinuousMonitoring(enabled, interval = this.options.monitoringInterval) {
        this.options.continuousMonitoring = enabled;
        this.options.monitoringInterval = interval;
        
        if (enabled) {
            this.startContinuousMonitoring();
        } else {
            this.stopContinuousMonitoring();
        }
    }
    
    // Event listeners
    onPerformanceUpdate(callback) {
        this.onPerformanceUpdate = callback;
    }
    
    onOptimizationApplied(callback) {
        this.onOptimizationApplied = callback;
    }
    
    // Utilitários
    async benchmark() {
        console.log('Executando benchmark completo...');
        const start = performance.now();
        
        const metrics = await this.monitor.runBenchmark();
        const prediction = this.neuralNetwork.predict(this.monitor.getMetricsArray());
        
        const end = performance.now();
        
        return {
            duration: end - start,
            metrics,
            prediction
        };
    }
    
    destroy() {
        this.stopContinuousMonitoring();
        this.resetOptimizations();
        
        this.neuralNetwork = null;
        this.monitor = null;
        this.optimizer = null;
        this.isInitialized = false;
        
        console.log('PerformanceAI destruído');
    }
}

// Exportar classes individuais para uso avançado
export { PerformanceNeuralNetwork, PerformanceMonitor, PerformanceOptimizer };

// Função de inicialização rápida
export function createPerformanceAI(options = {}) {
    return new PerformanceAI(options);
}

// Auto-inicialização opcional
export async function autoInitialize(options = {}) {
    const ai = new PerformanceAI(options);
    await ai.initialize();
    return ai;
}
