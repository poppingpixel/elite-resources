// 300+ AI Topics Blueprint - Master List for 2026
// From the Master Blueprint document: 75 topics per quarter × 4 quarters

export interface AITopic {
    id: number;
    name: string;
    category: string;
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    difficulty: number; // 1-10
    status: 'not_started' | 'in_progress' | 'completed';
    keyPapers: string[];
    estimatedHours: number;
    hasImplementation: boolean;
    hasBlogPost: boolean;
}

// Q1 Topics (1-75): Foundational Excellence
export const Q1_TOPICS: AITopic[] = [
    // Core Neural Networks (1-12)
    { id: 1, name: 'Perceptrons & MLPs', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 3, status: 'not_started', keyPapers: ['Rosenblatt 1958', 'Rumelhart 1986'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 2, name: 'Backpropagation', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Rumelhart et al. 1986'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 3, name: 'Convolutional Neural Networks', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['LeCun 1998', 'Krizhevsky 2012'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 4, name: 'ResNet & Residual Connections', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['He et al. 2015'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 5, name: 'Recurrent Neural Networks', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Hochreiter 1997 LSTM'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 6, name: 'Attention Mechanisms', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Bahdanau 2014', 'Luong 2015'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 7, name: 'Transformers Architecture', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 8, status: 'not_started', keyPapers: ['Attention Is All You Need 2017'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 8, name: 'Vision Transformers (ViT)', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Dosovitskiy 2020'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 9, name: 'BERT & Pre-training', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Devlin 2019'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 10, name: 'GPT & Causal Language Models', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Radford 2018 GPT', 'GPT-2 2019'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 11, name: 'Recurrent vs Attention', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Comparative studies'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 12, name: 'Neural Network Initialization', category: 'Core Neural Networks', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Xavier 2010', 'He 2015'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },

    // Fundamental Theory (13-25)
    { id: 13, name: 'Gradient Descent Variants', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['SGD', 'Adam', 'AdaGrad'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 14, name: 'Learning Rate Scheduling', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Cosine annealing', 'Warmup'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 15, name: 'Batch Normalization', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Ioffe & Szegedy 2015'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 16, name: 'Layer Normalization', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Ba et al. 2016'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 17, name: 'Dropout & Regularization', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Srivastava 2014'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 18, name: 'Data Augmentation', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['AutoAugment', 'MixUp', 'CutOut'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 19, name: 'Loss Functions', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Cross-entropy', 'Focal Loss'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 20, name: 'Optimization Theory', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Convergence analysis'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 21, name: 'Generalization Bounds', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['PAC learning', 'VC dimension'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 22, name: 'Neural Network Expressivity', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Universal approximation'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 23, name: 'Transfer Learning', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['ImageNet pre-training'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 24, name: 'Few-Shot Learning', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Prototypical Networks', 'MAML'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 25, name: 'Multi-Task Learning', category: 'Fundamental Theory', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Caruana 1997'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },

    // Generative Models (26-40)
    { id: 26, name: 'Autoencoders', category: 'Generative Models', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Hinton 2006'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 27, name: 'Variational Autoencoders (VAE)', category: 'Generative Models', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Kingma 2013'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 28, name: 'Generative Adversarial Networks (GANs)', category: 'Generative Models', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Goodfellow 2014'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 29, name: 'GAN Training Stability', category: 'Generative Models', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['WGAN', 'Spectral Norm'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 30, name: 'Diffusion Models', category: 'Generative Models', quarter: 'Q1', difficulty: 8, status: 'not_started', keyPapers: ['Ho et al. 2020 DDPM'], estimatedHours: 35, hasImplementation: false, hasBlogPost: false },
    { id: 31, name: 'Denoising Diffusion Probabilistic Models', category: 'Generative Models', quarter: 'Q1', difficulty: 8, status: 'not_started', keyPapers: ['DDPM', 'DDIM'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 32, name: 'Flow Models', category: 'Generative Models', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Normalizing Flows', 'RealNVP'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 33, name: 'Energy-Based Models', category: 'Generative Models', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['LeCun EBM'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 34, name: 'Autoregressive Models', category: 'Generative Models', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['PixelCNN', 'WaveNet'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 35, name: 'Mixture Models', category: 'Generative Models', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['GMM', 'EM algorithm'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 36, name: 'Latent Variable Models', category: 'Generative Models', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Latent space theory'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 37, name: 'Implicit Generative Models', category: 'Generative Models', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Implicit distributions'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 38, name: 'Likelihood-Free Inference', category: 'Generative Models', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['ABC methods'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 39, name: 'Generative Model Evaluation', category: 'Generative Models', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['FID', 'IS', 'LPIPS'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 40, name: 'Generative Model Applications', category: 'Generative Models', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Image synthesis', 'Text generation'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },

    // Computer Vision Foundations (41-50)
    { id: 41, name: 'Image Classification', category: 'Computer Vision', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['ImageNet benchmarks'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 42, name: 'Object Detection', category: 'Computer Vision', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['YOLO', 'Faster R-CNN'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 43, name: 'Semantic Segmentation', category: 'Computer Vision', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['U-Net', 'DeepLab'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 44, name: 'Instance Segmentation', category: 'Computer Vision', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Mask R-CNN'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 45, name: 'Visual Feature Extraction', category: 'Computer Vision', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Feature pyramids'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 46, name: 'Geometric Computer Vision', category: 'Computer Vision', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Camera geometry'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 47, name: '3D Vision', category: 'Computer Vision', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Point clouds', 'Stereo'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 48, name: 'NeRFs', category: 'Computer Vision', quarter: 'Q1', difficulty: 8, status: 'not_started', keyPapers: ['NeRF 2020'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 49, name: 'Video Understanding', category: 'Computer Vision', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['I3D', 'SlowFast'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 50, name: 'Visual Tracking', category: 'Computer Vision', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['SORT', 'DeepSORT'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },

    // NLP & Language Models (51-62)
    { id: 51, name: 'Word Embeddings', category: 'NLP', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Word2Vec', 'GloVe'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 52, name: 'Sequence Modeling', category: 'NLP', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Seq2Seq', 'Attention'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 53, name: 'Attention for NLP', category: 'NLP', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Self-attention NLP'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 54, name: 'Transformer LM Pre-training', category: 'NLP', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Pre-training strategies'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 55, name: 'BERT Architecture', category: 'NLP', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['BERT deep dive'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 56, name: 'RoBERTa, ALBERT, ELECTRA', category: 'NLP', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['BERT variants'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 57, name: 'GPT Family', category: 'NLP', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['GPT-1/2/3 papers'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 58, name: 'Machine Translation', category: 'NLP', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Neural MT'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 59, name: 'Question Answering', category: 'NLP', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['SQuAD', 'Reading comp'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 60, name: 'Named Entity Recognition', category: 'NLP', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['NER systems'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 61, name: 'Sentiment Analysis', category: 'NLP', quarter: 'Q1', difficulty: 4, status: 'not_started', keyPapers: ['Sentiment models'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 62, name: 'Summarization', category: 'NLP', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Abstractive summarization'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },

    // Reinforcement Learning Basics (63-75)
    { id: 63, name: 'Markov Decision Processes', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Sutton & Barto'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 64, name: 'Value Functions', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['V(s), Q(s,a)'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 65, name: 'Q-Learning', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['DQN 2013'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 66, name: 'Policy Gradient Methods', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['REINFORCE', 'PPO'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 67, name: 'Actor-Critic Algorithms', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['A2C', 'A3C'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 68, name: 'Trust Region Policy Optimization', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['TRPO', 'PPO'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 69, name: 'Model-Based RL', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['World models', 'Dreamer'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 70, name: 'Imitation Learning', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Behavioral cloning', 'GAIL'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 71, name: 'Multi-Agent RL', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['MARL frameworks'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 72, name: 'Exploration in RL', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 6, status: 'not_started', keyPapers: ['Curiosity', 'Count-based'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 73, name: 'RL Applications', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 5, status: 'not_started', keyPapers: ['Games', 'Robotics'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 74, name: 'Deep RL', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Deep Q-Networks'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 75, name: 'RL Stability & Convergence', category: 'Reinforcement Learning', quarter: 'Q1', difficulty: 7, status: 'not_started', keyPapers: ['Stability analysis'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
];

// Q2 Topics (76-150): Advanced Specialization
export const Q2_TOPICS: AITopic[] = [
    // Advanced Architecture Design (76-90)
    { id: 76, name: 'Mixture of Experts', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['GShard', 'Switch Transformer'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 77, name: 'Mixture of Experts with Sparse Gating', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Sparse MoE'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 78, name: 'Dense-to-Sparse', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Pruning methods'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 79, name: 'Efficient Transformers', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Linformer', 'Performer', 'Flash Attention'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 80, name: 'Reversible Networks', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['RevNet', 'iRevNet'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 81, name: 'Neural Architecture Search', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['NAS', 'DARTS'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 82, name: 'Compound Scaling', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['EfficientNet'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 83, name: 'Architecture Scaling Laws', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Chinchilla', 'Kaplan'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 84, name: 'Depth vs Width Trade-offs', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Width/depth studies'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 85, name: 'Skip Connections Variants', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 5, status: 'not_started', keyPapers: ['Dense connections', 'Highway'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 86, name: 'Attention Variants', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Rotary', 'Alibi', 'FlashAttention'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 87, name: 'Convolution Variants', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Depthwise', 'Grouped'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 88, name: 'Activation Functions', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 4, status: 'not_started', keyPapers: ['GELU', 'SiLU', 'Mish'], estimatedHours: 10, hasImplementation: false, hasBlogPost: false },
    { id: 89, name: 'Normalization Variants', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 5, status: 'not_started', keyPapers: ['RMSNorm', 'GroupNorm'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 90, name: 'Optimizer Design', category: 'Advanced Architecture', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['AdamW', 'LAMB', 'Sharpness-aware'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },

    // Pre-training & Transfer Learning (91-105)
    { id: 91, name: 'Self-Supervised Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['SimCLR', 'BYOL', 'MoCo'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 92, name: 'Contrastive Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['InfoNCE', 'NT-Xent'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 93, name: 'CLIP & Vision-Language Pre-training', category: 'Pre-training', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['CLIP', 'ALIGN'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 94, name: 'Masked Autoencoder (MAE)', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['MAE He et al.'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 95, name: 'Domain Adaptation', category: 'Pre-training', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Domain shift'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 96, name: 'Meta-Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['MAML', 'Reptile'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 97, name: 'Federated Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['FedAvg', 'Privacy'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 98, name: 'Continual Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Catastrophic forgetting'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 99, name: 'Few-Shot Learning Deep-Dive', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Advanced few-shot'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 100, name: 'Zero-Shot Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Zero-shot classification'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 101, name: 'Open-Set Recognition', category: 'Pre-training', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['OOD detection'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 102, name: 'Lifelong Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Lifelong architectures'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 103, name: 'Curriculum Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 5, status: 'not_started', keyPapers: ['Curriculum strategies'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 104, name: 'Active Learning', category: 'Pre-training', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Query strategies'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 105, name: 'Data Selection for Pre-training', category: 'Pre-training', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Data filtering', 'Deduplication'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },

    // ... Continuing with topics 106-150 (Scaling, Multimodal, Interpretability)
    // For brevity, adding a few key ones
    { id: 106, name: 'Scaling Laws', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Kaplan et al.', 'Hoffmann et al.'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 107, name: 'Chinchilla Optimal Allocation', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Chinchilla'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 108, name: 'Compute-Optimal Training', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Compute budgets'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 109, name: 'Model Parallelism', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Megatron-LM'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 110, name: 'Distributed Training', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['FSDP', 'DeepSpeed'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 111, name: 'Mixed Precision Training', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Mixed Precision Training'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 112, name: 'Gradient Checkpointing', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Training Deep Nets with Sublinear Memory'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 113, name: 'Quantization', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['GPTQ', 'AWQ'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 114, name: 'Knowledge Distillation', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Hinton 2015 Distillation'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 115, name: 'Pruning Strategies', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Lottery Ticket Hypothesis'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 116, name: 'Efficient Inference', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Efficient Transformers Survey'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 117, name: 'Speculative Decoding', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Speculative Decoding'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 118, name: 'Tensor Parallelism', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Megatron-LM'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 119, name: 'Activation Recomputation', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Gradient Checkpointing'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 120, name: 'Hardware Acceleration', category: 'Scaling & Efficiency', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['GPU/TPU Optimization'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },

    // Multimodal & Cross-Modal (121-135)
    { id: 121, name: 'Vision-Language Models', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['CLIP', 'ALIGN'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    { id: 122, name: 'Multimodal Embeddings', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['CLIP Embeddings'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 123, name: 'Multimodal Fusion', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Cross-modal fusion surveys'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 124, name: 'Image Captioning', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Show and Tell'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 125, name: 'Visual Question Answering', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['VQA benchmark'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 126, name: 'Scene Graphs', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Scene graph generation'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 127, name: 'Video-Text Alignment', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['VideoCLIP'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 128, name: 'Cross-Modal Retrieval', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['CLIP retrieval'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 129, name: 'Audio-Visual Learning', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Audio-visual correspondence'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 130, name: 'Speech Recognition', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Whisper', 'wav2vec'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 131, name: 'Text-to-Speech', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Tacotron', 'VITS'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 132, name: 'Music & Audio Generation', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['AudioLM', 'MusicGen'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 133, name: '3D Shape & Geometry', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['3D SSL surveys'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 134, name: 'Scene Understanding', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['CLIP/MAE transfer'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 135, name: 'Embodied AI', category: 'Multimodal Learning', quarter: 'Q2', difficulty: 8, status: 'not_started', keyPapers: ['Embodied AI surveys'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },

    // Interpretability & Analysis (136-150)
    { id: 136, name: 'Attention Visualization', category: 'Interpretability', quarter: 'Q2', difficulty: 5, status: 'not_started', keyPapers: ['Attention visualizations'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 137, name: 'Feature Importance', category: 'Interpretability', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['SHAP', 'LIME'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 138, name: 'Concept Activation Vectors', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['TCAV'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 139, name: 'Adversarial Examples', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Goodfellow 2014 FGSM'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 140, name: 'Adversarial Training', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Madry PGD'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 141, name: 'Neural Backdoors', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Data poisoning surveys'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 142, name: 'Robustness Evaluation', category: 'Interpretability', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Robustness surveys'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 143, name: 'Out-of-Distribution Detection', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['OOD detection surveys'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 144, name: 'Uncertainty Quantification', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Bayesian DL', 'MC Dropout'], estimatedHours: 25, hasImplementation: false, hasBlogPost: false },
    { id: 145, name: 'Model Interpretability Metrics', category: 'Interpretability', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Probing classifiers'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
    { id: 146, name: 'Circuit Analysis', category: 'Interpretability', quarter: 'Q2', difficulty: 9, status: 'not_started', keyPapers: ['Transformer Circuits'], estimatedHours: 35, hasImplementation: false, hasBlogPost: false },
    { id: 147, name: 'Fairness in ML', category: 'Interpretability', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Fairness surveys'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 148, name: 'Interpretable-by-Design Models', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Concept-based models'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 149, name: 'Explainability Methods', category: 'Interpretability', quarter: 'Q2', difficulty: 7, status: 'not_started', keyPapers: ['Grad-CAM', 'Saliency maps'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    { id: 150, name: 'Model Auditing', category: 'Interpretability', quarter: 'Q2', difficulty: 6, status: 'not_started', keyPapers: ['Model audit frameworks'], estimatedHours: 15, hasImplementation: false, hasBlogPost: false },
];

// For brevity, Q3 and Q4 topics will be structured similarly
// Complete list available in full implementation

export const Q3_TOPICS: AITopic[] = [
    // Placeholder for topics 151-225 (Application & Mastery)
    { id: 151, name: 'Pose Estimation', category: 'CV Applications', quarter: 'Q3', difficulty: 6, status: 'not_started', keyPapers: ['OpenPose', 'MediaPipe'], estimatedHours: 20, hasImplementation: false, hasBlogPost: false },
    // ... more Q3 topics
];

export const Q4_TOPICS: AITopic[] = [
    // Placeholder for topics 226-300+ (Research Frontier & Thought Leadership)
    { id: 226, name: 'Mechanistic Interpretability Deep-Dive', category: 'Advanced Theory', quarter: 'Q4', difficulty: 9, status: 'not_started', keyPapers: ['Circuits', 'Anthropic research'], estimatedHours: 40, hasImplementation: false, hasBlogPost: false },
    { id: 251, name: 'RLHF', category: 'Frontier AI', quarter: 'Q4', difficulty: 9, status: 'not_started', keyPapers: ['InstructGPT', 'Constitutional AI'], estimatedHours: 35, hasImplementation: false, hasBlogPost: false },
    { id: 276, name: 'AI Alignment Problem', category: 'AGI Safety', quarter: 'Q4', difficulty: 9, status: 'not_started', keyPapers: ['Alignment research'], estimatedHours: 30, hasImplementation: false, hasBlogPost: false },
    // ... more Q4 topics
];

// Combined all topics
export const ALL_AI_TOPICS: AITopic[] = [
    ...Q1_TOPICS,
    ...Q2_TOPICS,
    ...Q3_TOPICS,
    ...Q4_TOPICS,
];

// Get topics by quarter
export function getTopicsByQuarter(quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'): AITopic[] {
    return ALL_AI_TOPICS.filter(t => t.quarter === quarter);
}

// Get topics by category
export function getTopicsByCategory(category: string): AITopic[] {
    return ALL_AI_TOPICS.filter(t => t.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
    return [...new Set(ALL_AI_TOPICS.map(t => t.category))];
}

// Calculate progress
export function getTopicsProgress(): { completed: number; inProgress: number; total: number; percentage: number } {
    const completed = ALL_AI_TOPICS.filter(t => t.status === 'completed').length;
    const inProgress = ALL_AI_TOPICS.filter(t => t.status === 'in_progress').length;
    const total = ALL_AI_TOPICS.length;
    return {
        completed,
        inProgress,
        total,
        percentage: Math.round((completed / total) * 100),
    };
}
