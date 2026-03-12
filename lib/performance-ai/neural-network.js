// Rede Neural simples para classificação de desempenho
export class PerformanceNeuralNetwork {
    constructor() {
        // Arquitetura da rede: 4 entradas -> 8 neurônios ocultos -> 3 saídas
        this.inputSize = 4; // CPU, RAM, GPU, Conexão
        this.hiddenSize = 8;
        this.outputSize = 3; // Ruim, Bom, Excelente
        
        // Inicialização de pesos com Xavier initialization
        this.weightsIH = this.initializeWeights(this.inputSize, this.hiddenSize);
        this.weightsHO = this.initializeWeights(this.hiddenSize, this.outputSize);
        this.biasH = this.initializeWeights(1, this.hiddenSize);
        this.biasO = this.initializeWeights(1, this.outputSize);
        
        this.learningRate = 0.01;
        this.epochs = 1000;
    }
    
    initializeWeights(rows, cols) {
        const weights = [];
        const scale = Math.sqrt(2.0 / (rows + cols));
        
        for (let i = 0; i < rows; i++) {
            weights[i] = [];
            for (let j = 0; j < cols; j++) {
                weights[i][j] = (Math.random() * 2 - 1) * scale;
            }
        }
        return weights;
    }
    
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    sigmoidDerivative(x) {
        const s = this.sigmoid(x);
        return s * (1 - s);
    }
    
    relu(x) {
        return Math.max(0, x);
    }
    
    reluDerivative(x) {
        return x > 0 ? 1 : 0;
    }
    
    forward(input) {
        // Camada oculta
        this.hidden = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = this.biasH[0][i];
            for (let j = 0; j < this.inputSize; j++) {
                sum += input[j] * this.weightsIH[j][i];
            }
            this.hidden[i] = this.relu(sum);
        }
        
        // Camada de saída
        this.output = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = this.biasO[0][i];
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += this.hidden[j] * this.weightsHO[j][i];
            }
            this.output[i] = this.sigmoid(sum);
        }
        
        return this.output;
    }
    
    backward(input, target, output) {
        // Calcular erro na saída
        const outputError = [];
        const outputDelta = [];
        
        for (let i = 0; i < this.outputSize; i++) {
            outputError[i] = target[i] - output[i];
            outputDelta[i] = outputError[i] * this.sigmoidDerivative(output[i]);
        }
        
        // Calcular erro na camada oculta
        const hiddenError = [];
        const hiddenDelta = [];
        
        for (let i = 0; i < this.hiddenSize; i++) {
            let error = 0;
            for (let j = 0; j < this.outputSize; j++) {
                error += outputDelta[j] * this.weightsHO[i][j];
            }
            hiddenError[i] = error;
            hiddenDelta[i] = error * this.reluDerivative(this.hidden[i]);
        }
        
        // Atualizar pesos da camada de saída
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weightsHO[i][j] += this.learningRate * outputDelta[j] * this.hidden[i];
            }
        }
        
        // Atualizar pesos da camada oculta
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weightsIH[i][j] += this.learningRate * hiddenDelta[j] * input[i];
            }
        }
        
        // Atualizar biases
        for (let i = 0; i < this.outputSize; i++) {
            this.biasO[0][i] += this.learningRate * outputDelta[i];
        }
        
        for (let i = 0; i < this.hiddenSize; i++) {
            this.biasH[0][i] += this.learningRate * hiddenDelta[i];
        }
    }
    
    train(trainingData) {
        for (let epoch = 0; epoch < this.epochs; epoch++) {
            for (const { input, target } of trainingData) {
                const output = this.forward(input);
                this.backward(input, target, output);
            }
        }
    }
    
    predict(input) {
        const output = this.forward(input);
        const maxIndex = output.indexOf(Math.max(...output));
        const classes = ['ruim', 'bom', 'excelente'];
        
        return {
            class: classes[maxIndex],
            confidence: output[maxIndex],
            probabilities: {
                ruim: output[0],
                bom: output[1],
                excelente: output[2]
            }
        };
    }
    
    // Dados de treinamento pré-definidos baseados em características comuns
    getTrainingData() {
        return [
            // Dispositivos de baixo desempenho
            { input: [0.2, 0.3, 0.1, 0.2], target: [1, 0, 0] }, // CPU fraca, pouca RAM, GPU fraca, conexão lenta
            { input: [0.3, 0.2, 0.2, 0.1], target: [1, 0, 0] },
            { input: [0.1, 0.3, 0.1, 0.3], target: [1, 0, 0] },
            
            // Dispositivos de desempenho médio
            { input: [0.5, 0.6, 0.5, 0.5], target: [0, 1, 0] }, // CPU média, RAM média, GPU média, conexão média
            { input: [0.6, 0.5, 0.6, 0.4], target: [0, 1, 0] },
            { input: [0.4, 0.7, 0.4, 0.6], target: [0, 1, 0] },
            
            // Dispositivos de alto desempenho
            { input: [0.9, 0.9, 0.9, 0.8], target: [0, 0, 1] }, // CPU forte, muita RAM, GPU forte, conexão rápida
            { input: [0.8, 0.95, 0.85, 0.9], target: [0, 0, 1] },
            { input: [0.95, 0.85, 0.9, 0.85], target: [0, 0, 1] },
        ];
    }
    
    initialize() {
        const trainingData = this.getTrainingData();
        this.train(trainingData);
    }
}
