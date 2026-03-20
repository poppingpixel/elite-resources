// Topic to Resource Mapping
// Maps each AI topic to its learning resources from data.ts

export interface TopicResource {
    name: string;
    url: string;
    type: 'video' | 'course' | 'pdf' | 'book' | 'website';
    master?: string;
}

// Resources for each AI topic by ID
export const TOPIC_RESOURCES: Record<number, TopicResource[]> = {
    // Core Neural Networks (1-12)
    1: [ // Perceptrons & MLPs
        { name: 'Neural Networks: Zero to Hero - Karpathy', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhSvMB', type: 'video', master: 'Andrej Karpathy' },
        { name: 'Deep Learning Book Ch. 6', url: 'https://www.deeplearningbook.org/contents/mlp.html', type: 'book', master: 'Ian Goodfellow' },
        { name: '3Blue1Brown Neural Networks', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'video', master: 'Grant Sanderson' },
        { name: 'CS231n: Neural Networks Part 1-3', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
        { name: 'Deep Learning (Goodfellow/Bengio/Courville) - Full Book', url: 'https://books.google.com/books/about/Deep_Learning.html?id=omivDQAAQBAJ', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    2: [ // Backpropagation
        { name: 'Karpathy: Backprop from Scratch', url: 'https://www.youtube.com/watch?v=VMj-3S1tku0', type: 'video', master: 'Andrej Karpathy' },
        { name: 'Deep Learning Book Ch. 6.5', url: 'https://www.deeplearningbook.org/contents/mlp.html', type: 'book', master: 'Ian Goodfellow' },
        { name: '3Blue1Brown: What is backpropagation?', url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U', type: 'video', master: 'Grant Sanderson' },
        { name: 'CS231n Backprop Notes', url: 'https://cs231n.github.io/optimization-2/', type: 'website', master: 'Stanford' },
        { name: 'Yann LeCun: Backprop & Lagrangian Derivation', url: 'http://yann.lecun.com/ex/research/index.html', type: 'website', master: 'Yann LeCun' },
    ],
    3: [ // CNNs
        { name: 'CS231n: CNNs for Visual Recognition', url: 'https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv', type: 'course', master: 'Fei-Fei Li' },
        { name: 'Deep Learning Book Ch. 9', url: 'https://www.deeplearningbook.org/contents/convnets.html', type: 'book', master: 'Ian Goodfellow' },
        { name: 'AlexNet Paper', url: 'https://papers.nips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf', type: 'pdf' },
        { name: 'LeCun: Gradient-Based Learning (LeNet-5) - Inventor Paper', url: 'http://vision.stanford.edu/cs598_spring07/papers/Lecun98.pdf', type: 'pdf', master: 'Yann LeCun' },
        { name: 'CS231n 2020 ConvNet Lectures', url: 'https://cs231n.stanford.edu/2020/', type: 'course', master: 'Stanford' },
    ],
    4: [ // ResNet
        { name: 'Deep Residual Learning Paper', url: 'https://arxiv.org/pdf/1512.03385.pdf', type: 'pdf', master: 'Kaiming He' },
        { name: 'Yannic Kilcher: ResNet Explained', url: 'https://www.youtube.com/watch?v=GWt6Fu05voI', type: 'video' },
        { name: 'He et al. ResNet (IEEE)', url: 'http://ieeexplore.ieee.org/document/7780459/', type: 'pdf', master: 'Kaiming He' },
        { name: 'Microsoft Research: ResNet ILSVRC Results', url: 'https://www.microsoft.com/en-us/research/publication/deep-residual-learning-for-image-recognition/', type: 'website', master: 'Microsoft Research' },
    ],
    5: [ // RNNs
        { name: 'Stanford CS224n RNN Lecture', url: 'https://www.youtube.com/watch?v=iWea12EAu6U', type: 'video' },
        { name: 'Deep Learning Book Ch. 10', url: 'https://www.deeplearningbook.org/contents/rnn.html', type: 'book' },
        { name: 'Karpathy: The Unreasonable Effectiveness of RNNs', url: 'http://karpathy.github.io/2015/05/21/rnn-effectiveness/', type: 'website', master: 'Andrej Karpathy' },
        { name: 'CS224n: RNNs and LSTMs (Manning)', url: 'https://www.youtube.com/watch?v=rmVRLeJRkl4', type: 'video', master: 'Christopher Manning' },
    ],
    6: [ // Attention
        { name: 'Bahdanau Attention Paper', url: 'https://arxiv.org/pdf/1409.0473.pdf', type: 'pdf' },
        { name: 'Illustrated Attention', url: 'https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/', type: 'website', master: 'Jay Alammar' },
        { name: 'Stanford CS224n Attention', url: 'https://www.youtube.com/watch?v=6aouXD8WMVQ', type: 'video' },
        { name: 'Vaswani et al.: Attention Is All You Need (Semantic Scholar)', url: 'https://www.semanticscholar.org/paper/Attention-is-All-you-Need-Vaswani-Shazeer/204e3073870fae3d05bcbc2f6a8e263d9b72e776', type: 'website', master: 'Vaswani et al.' },
        { name: 'CS224n: Attention & Transformers Course', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    7: [ // Transformers
        { name: 'Attention Is All You Need Paper', url: 'https://arxiv.org/pdf/1706.03762.pdf', type: 'pdf', master: 'Vaswani et al.' },
        { name: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'website', master: 'Jay Alammar' },
        { name: 'Karpathy: GPT from Scratch', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', type: 'video', master: 'Andrej Karpathy' },
        { name: 'Harvard NLP: Annotated Transformer', url: 'https://nlp.seas.harvard.edu/2018/04/03/attention.html', type: 'website' },
        { name: 'CS224n Transformer Assignments & Lectures', url: 'https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS224n/', type: 'course', master: 'Stanford' },
    ],
    8: [ // Vision Transformers
        { name: 'ViT Paper', url: 'https://arxiv.org/pdf/2010.11929.pdf', type: 'pdf', master: 'Google Research' },
        { name: 'Yannic Kilcher: ViT Explained', url: 'https://www.youtube.com/watch?v=TrdevFK_am4', type: 'video' },
        { name: 'CS231n: Conv vs Patch Embeddings & Modern Architectures', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    9: [ // BERT
        { name: 'BERT Paper', url: 'https://arxiv.org/pdf/1810.04805.pdf', type: 'pdf', master: 'Google AI' },
        { name: 'The Illustrated BERT', url: 'https://jalammar.github.io/illustrated-bert/', type: 'website', master: 'Jay Alammar' },
        { name: 'Hugging Face BERT Guide', url: 'https://huggingface.co/docs/transformers/model_doc/bert', type: 'website' },
        { name: 'CS224n: Contextual Embeddings & BERT Lectures', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    10: [ // GPT
        { name: 'GPT-2 Paper', url: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Karpathy: Let\'s Build GPT', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', type: 'video', master: 'Andrej Karpathy' },
        { name: 'Hugging Face GPT-2', url: 'https://huggingface.co/gpt2', type: 'website' },
        { name: 'Vaswani Transformer Paper (GPT Foundation)', url: 'https://s10251.pcdn.co/pdf/2017-vaswani-transformer.pdf', type: 'pdf', master: 'Vaswani et al.' },
        { name: 'CS224n: Language Models & Generative Transformers', url: 'https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS224n/', type: 'course', master: 'Stanford' },
    ],
    11: [ // Recurrent vs Attention
        { name: 'Attention vs RNN Comparison', url: 'https://www.youtube.com/watch?v=YAgjfMR9R_M', type: 'video' },
        { name: 'CS224n: RNN → LSTM → Attention → Transformer (Manning)', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
        { name: 'Deep Learning Book: Sequence Modeling Chapter', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    12: [ // Neural Network Initialization
        { name: 'Xavier Initialization Paper', url: 'http://proceedings.mlr.press/v9/glorot10a/glorot10a.pdf', type: 'pdf' },
        { name: 'He Initialization Paper', url: 'https://arxiv.org/pdf/1502.01852.pdf', type: 'pdf', master: 'Kaiming He' },
        { name: 'CS231n: Neural Networks Part 2 & 3 (Init, Activation, BN)', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
        { name: 'Deep Learning Book: Optimization & Initialization Strategies', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    // Fundamental Theory (13-25)
    13: [ // Gradient Descent
        { name: 'MIT 18.06 Linear Algebra', url: 'https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D', type: 'course', master: 'Gilbert Strang' },
        { name: 'Deep Learning Book Ch. 4', url: 'https://www.deeplearningbook.org/contents/numerical.html', type: 'book' },
        { name: 'Adam Paper', url: 'https://arxiv.org/pdf/1412.6980.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Optimization for Training Deep Models', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'CS231n: Optimization Notes (SGD, Momentum, Adam)', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    14: [ // Learning Rate Scheduling
        { name: 'Cosine Annealing Paper', url: 'https://arxiv.org/pdf/1608.03983.pdf', type: 'pdf' },
        { name: 'Fast.ai Learning Rate Finder', url: 'https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html', type: 'website', master: 'Jeremy Howard' },
        { name: 'Deep Learning Book: LR Schedules, Decay, Annealing', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    15: [ // Batch Normalization
        { name: 'Batch Norm Paper', url: 'https://arxiv.org/pdf/1502.03167.pdf', type: 'pdf', master: 'Ioffe & Szegedy' },
        { name: 'Yannic Kilcher: Batch Norm', url: 'https://www.youtube.com/watch?v=OioFONrSETc', type: 'video' },
        { name: 'CS231n: Batch Norm Implementation & Intuitions', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    16: [ // Layer Normalization
        { name: 'Layer Norm Paper', url: 'https://arxiv.org/pdf/1607.06450.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Normalization & Stability', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    17: [ // Dropout
        { name: 'Dropout Paper', url: 'https://jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Regularization (Dropout, Weight Decay)', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    18: [ // Data Augmentation
        { name: 'AutoAugment Paper', url: 'https://arxiv.org/pdf/1805.09501.pdf', type: 'pdf', master: 'Google Brain' },
        { name: 'MixUp Paper', url: 'https://arxiv.org/pdf/1710.09412.pdf', type: 'pdf' },
        { name: 'CS231n: Image Data Augmentation Strategies', url: 'https://cs231n.stanford.edu/2020/', type: 'course', master: 'Stanford' },
    ],
    19: [ // Loss Functions
        { name: 'Focal Loss Paper', url: 'https://arxiv.org/pdf/1708.02002.pdf', type: 'pdf' },
        { name: 'Deep Learning Book Ch. 6.2', url: 'https://www.deeplearningbook.org/contents/mlp.html', type: 'book' },
        { name: 'CS231n: SVM vs Softmax, Cross-Entropy, Structured Losses', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    20: [ // Optimization Theory
        { name: 'Understanding Deep Learning Optimization', url: 'https://arxiv.org/pdf/1706.10239.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Optimization (Conditioning, Curvature, Saddle Points)', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'The Modern Mathematics of Deep Learning', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    21: [ // Generalization Bounds
        { name: 'Pattern Recognition & ML Ch. 1', url: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf', type: 'pdf', master: 'Christopher Bishop' },
        { name: 'The Modern Mathematics of Deep Learning (Generalization)', url: 'https://arxiv.org/abs/2407.18384', type: 'pdf' },
        { name: 'Deep Learning Book: Research Perspectives (Generalization)', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    22: [ // Neural Network Expressivity
        { name: 'Universal Approximation Theorem', url: 'https://www.cs.cmu.edu/~epxing/Class/10715/reading/Hornik.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Universal Approximation & Depth vs Width', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'Modern Mathematics of DL: Expressive Power Results', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    23: [ // Transfer Learning
        { name: 'Fast.ai Transfer Learning', url: 'https://course.fast.ai/', type: 'course', master: 'Jeremy Howard' },
        { name: 'Deep Learning Book: Representation & Transfer Learning', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'CS224n: Fine-Tuning Pretrained Models', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    24: [ // Few-Shot Learning
        { name: 'Prototypical Networks Paper', url: 'https://arxiv.org/pdf/1703.05175.pdf', type: 'pdf' },
        { name: 'MAML Paper', url: 'https://arxiv.org/pdf/1703.03400.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Transfer Learning for Few-Shot', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'CS224n/CS231n: Fine-Tuning as Few-Shot', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Stanford' },
    ],
    25: [ // Multi-Task Learning
        { name: 'Multi-Task Learning Overview', url: 'https://arxiv.org/pdf/1706.05098.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Multi-Task Learning & Shared Representations', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'CS231n: Multi-Task Architectures (Detection + Classification)', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    // Generative Models (26-40)
    26: [ // Autoencoders
        { name: 'Deep Learning Book Ch. 14', url: 'https://www.deeplearningbook.org/contents/autoencoders.html', type: 'book' },
        { name: 'CS231n: Representation Learning & Autoencoders', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    27: [ // VAE
        { name: 'VAE Paper', url: 'https://arxiv.org/pdf/1312.6114.pdf', type: 'pdf', master: 'Kingma & Welling' },
        { name: 'Understanding VAEs', url: 'https://towardsdatascience.com/understanding-variational-autoencoders-vaes-f70510919f73', type: 'website' },
        { name: 'Kingma & Welling: Auto-Encoding Variational Bayes (Semantic Scholar)', url: 'https://www.semanticscholar.org/paper/Auto-Encoding-Variational-Bayes-Kingma-Welling/5f5dc5b9a2ba710937e2c413b37b053cd673df02', type: 'website', master: 'Kingma & Welling' },
        { name: 'VAE Derivation Walkthrough (Illinois)', url: 'https://courses.physics.illinois.edu/ece417/fa2020/slides/lec22.pdf', type: 'pdf' },
    ],
    28: [ // GANs
        { name: 'GAN Paper', url: 'https://arxiv.org/pdf/1406.2661.pdf', type: 'pdf', master: 'Ian Goodfellow' },
        { name: 'NIPS 2016 GAN Tutorial', url: 'https://arxiv.org/pdf/1701.00160.pdf', type: 'pdf', master: 'Ian Goodfellow' },
        { name: 'Deep Learning Book: Deep Generative Models (GANs)', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Ian Goodfellow' },
    ],
    29: [ // GAN Training
        { name: 'WGAN Paper', url: 'https://arxiv.org/pdf/1701.07875.pdf', type: 'pdf' },
        { name: 'Spectral Normalization Paper', url: 'https://arxiv.org/pdf/1802.05957.pdf', type: 'pdf' },
        { name: 'Original GAN Paper: Minimax Formulation & Failure Modes', url: 'https://www.semanticscholar.org/paper/Generative-Adversarial-Nets-Goodfellow-Pouget-Abadie/86ee1835a56722b76564119437070782fc90eb19', type: 'website', master: 'Ian Goodfellow' },
    ],
    30: [ // Diffusion Models
        { name: 'DDPM Paper', url: 'https://arxiv.org/pdf/2006.11239.pdf', type: 'pdf', master: 'Ho et al.' },
        { name: 'Hugging Face Diffusion Course', url: 'https://github.com/huggingface/diffusion-models-class', type: 'course' },
        { name: 'What are Diffusion Models?', url: 'https://lilianweng.github.io/posts/2021-07-11-diffusion-models/', type: 'website', master: 'Lilian Weng' },
    ],
    31: [ // DDPM/DDIM
        { name: 'DDIM Paper', url: 'https://arxiv.org/pdf/2010.02502.pdf', type: 'pdf' },
        { name: 'Ho et al. DDPM (core diffusion framework)', url: 'https://arxiv.org/pdf/2006.11239.pdf', type: 'pdf', master: 'Ho et al.' },
    ],
    32: [ // Flow Models
        { name: 'RealNVP Paper', url: 'https://arxiv.org/pdf/1605.08803.pdf', type: 'pdf' },
        { name: 'Normalizing Flows Tutorial', url: 'https://arxiv.org/pdf/1908.09257.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Invertible Mappings & Generative Models', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    33: [ // Energy-Based Models
        { name: 'LeCun EBM Tutorial', url: 'http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf', type: 'pdf', master: 'Yann LeCun' },
        { name: 'Deep Learning Book: Energy-Based & Structured Probabilistic Models', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    34: [ // Autoregressive Models
        { name: 'PixelCNN Paper', url: 'https://arxiv.org/pdf/1601.06759.pdf', type: 'pdf' },
        { name: 'WaveNet Paper', url: 'https://arxiv.org/pdf/1609.03499.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'CS224n: Language Modeling (Autoregressive LMs)', url: 'https://www.youtube.com/watch?v=rmVRLeJRkl4', type: 'video', master: 'Christopher Manning' },
    ],
    35: [ // Mixture Models
        { name: 'Pattern Recognition & ML Ch. 9', url: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf', type: 'pdf', master: 'Christopher Bishop' },
        { name: 'Deep Learning Book: Mixture Density Networks', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    36: [ // Latent Variable Models
        { name: 'Deep Learning Book Ch. 16', url: 'https://www.deeplearningbook.org/contents/partition.html', type: 'book' },
        { name: 'Latent Variable Models Lecture', url: 'https://www.youtube.com/watch?v=7Pcvdo4EJeo', type: 'video' },
        { name: 'Kingma & Welling VAE (Latent Variable Foundation)', url: 'https://www.semanticscholar.org/paper/Auto-Encoding-Variational-Bayes-Kingma-Welling/5f5dc5b9a2ba710937e2c413b37b053cd673df02', type: 'website', master: 'Kingma & Welling' },
    ],
    37: [ // Implicit Generative Models
        { name: 'Implicit Models Paper', url: 'https://arxiv.org/pdf/1610.03483.pdf', type: 'pdf' },
        { name: 'GAN Paper (Canonical Implicit Model)', url: 'https://papers.nips.cc/paper_files/paper/2014/file/f033ed80deb0234979a61f95710dbe25-Paper.pdf', type: 'pdf', master: 'Ian Goodfellow' },
        { name: 'Deep Learning Book: Implicit vs Explicit Generative Models', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    38: [ // Likelihood-Free Inference
        { name: 'ABC Methods Tutorial', url: 'https://arxiv.org/pdf/1802.09720.pdf', type: 'pdf' },
        { name: 'GAN Paper: Likelihood-Free Approach', url: 'https://www.semanticscholar.org/paper/Generative-Adversarial-Nets-Goodfellow-Pouget-Abadie/86ee1835a56722b76564119437070782fc90eb19', type: 'website', master: 'Ian Goodfellow' },
    ],
    39: [ // Generative Model Evaluation
        { name: 'FID Score Paper', url: 'https://arxiv.org/pdf/1706.08500.pdf', type: 'pdf' },
        { name: 'Inception Score Paper', url: 'https://arxiv.org/pdf/1606.03498.pdf', type: 'pdf' },
        { name: 'GAN vs VAE Evaluation (NIPS 2014)', url: 'https://papers.nips.cc/paper_files/paper/2014/file/f033ed80deb0234979a61f95710dbe25-Paper.pdf', type: 'pdf', master: 'Ian Goodfellow' },
        { name: 'Deep Learning Book: Generative Model Evaluation', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    40: [ // Generative Model Applications
        { name: 'Stable Diffusion Guide', url: 'https://huggingface.co/blog/stable_diffusion', type: 'website' },
        { name: 'DALL-E Paper', url: 'https://arxiv.org/pdf/2102.12092.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'CS231n: Style Transfer, Super-Resolution Projects', url: 'https://cs231n.stanford.edu/2020/', type: 'course', master: 'Stanford' },
    ],
    // Computer Vision (41-50)
    41: [ // Image Classification
        { name: 'CS231n Full Course', url: 'https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv', type: 'course', master: 'Stanford / Fei-Fei Li' },
        { name: 'CS231n 2020 (Master-Class on Image Classification)', url: 'https://cs231n.stanford.edu/2020/', type: 'course', master: 'Stanford' },
        { name: 'ResNet Paper (Canonical Modern Classifier)', url: 'https://arxiv.org/abs/1512.03385', type: 'pdf', master: 'Kaiming He' },
    ],
    42: [ // Object Detection
        { name: 'YOLOv1 Paper', url: 'https://arxiv.org/pdf/1506.02640.pdf', type: 'pdf' },
        { name: 'Faster R-CNN Paper', url: 'https://arxiv.org/pdf/1506.01497.pdf', type: 'pdf' },
        { name: 'ResNet Paper (Backbone Understanding)', url: 'https://arxiv.org/abs/1512.03385', type: 'pdf', master: 'Kaiming He' },
    ],
    43: [ // Semantic Segmentation
        { name: 'U-Net Paper', url: 'https://arxiv.org/pdf/1505.04597.pdf', type: 'pdf' },
        { name: 'DeepLab Paper', url: 'https://arxiv.org/pdf/1606.00915.pdf', type: 'pdf' },
        { name: 'LeCun: FCN Foundations for Segmentation', url: 'http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf', type: 'pdf', master: 'Yann LeCun' },
    ],
    44: [ // Instance Segmentation
        { name: 'Mask R-CNN Paper', url: 'https://arxiv.org/pdf/1703.06870.pdf', type: 'pdf' },
    ],
    45: [ // Visual Feature Extraction
        { name: 'FPN Paper', url: 'https://arxiv.org/pdf/1612.03144.pdf', type: 'pdf' },
        { name: 'CS231n Feature Learning', url: 'https://cs231n.github.io/convolutional-networks/', type: 'website' },
        { name: 'Deep Learning Book: Representation Learning', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    46: [ // Geometric Computer Vision
        { name: 'Multiple View Geometry (Free PDF)', url: 'https://www.robots.ox.ac.uk/~vgg/hzbook/', type: 'book' },
        { name: 'Camera Geometry Lecture', url: 'https://www.youtube.com/watch?v=RDkwklFGMfo', type: 'video' },
        { name: 'CS231n: Geometry, Receptive Fields, Spatial Structure', url: 'https://cs231n.stanford.edu/2020/', type: 'course', master: 'Stanford' },
    ],
    47: [ // 3D Vision
        { name: 'PointNet Paper', url: 'https://arxiv.org/pdf/1612.00593.pdf', type: 'pdf' },
        { name: '3D Deep Learning', url: 'https://www.youtube.com/watch?v=6F0aXB8kRIQ', type: 'video' },
        { name: 'CS231n: Spatial Reasoning & Representation', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    48: [ // NeRFs
        { name: 'NeRF Paper', url: 'https://arxiv.org/pdf/2003.08934.pdf', type: 'pdf' },
        { name: 'NeRF Explained', url: 'https://www.youtube.com/watch?v=CRlN-cYFxTk', type: 'video' },
        { name: 'LeCun: CNN Foundations for NeRF', url: 'http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf', type: 'pdf', master: 'Yann LeCun' },
    ],
    49: [ // Video Understanding
        { name: 'I3D Paper', url: 'https://arxiv.org/pdf/1705.07750.pdf', type: 'pdf' },
        { name: 'SlowFast Paper', url: 'https://arxiv.org/pdf/1812.03982.pdf', type: 'pdf' },
        { name: 'Vaswani Transformer (RNN/Transformer for Video)', url: 'https://s10251.pcdn.co/pdf/2017-vaswani-transformer.pdf', type: 'pdf', master: 'Vaswani et al.' },
    ],
    50: [ // Visual Tracking
        { name: 'DeepSORT Paper', url: 'https://arxiv.org/pdf/1703.07402.pdf', type: 'pdf' },
        { name: 'Object Tracking Tutorial', url: 'https://www.youtube.com/watch?v=FuvQ8Melz1o', type: 'video' },
        { name: 'ResNet-Like Backbones for Tracking', url: 'https://arxiv.org/abs/1512.03385', type: 'pdf', master: 'Kaiming He' },
    ],
    // NLP (51-62)
    51: [ // Word Embeddings
        { name: 'Word2Vec Paper', url: 'https://arxiv.org/pdf/1301.3781.pdf', type: 'pdf', master: 'Mikolov' },
        { name: 'GloVe Paper', url: 'https://nlp.stanford.edu/pubs/glove.pdf', type: 'pdf', master: 'Stanford NLP' },
        { name: 'CS224n Lecture 1-2: Word Vectors (Manning)', url: 'https://www.youtube.com/watch?v=nBor4jfWetQ', type: 'video', master: 'Christopher Manning' },
        { name: 'Deep Learning Book: Word Embeddings & Representation Learning', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    52: [ // Sequence Modeling
        { name: 'Seq2Seq Paper', url: 'https://arxiv.org/pdf/1409.3215.pdf', type: 'pdf' },
        { name: 'CS224n Lecture 5', url: 'https://www.youtube.com/watch?v=TQQlZhbC5ps', type: 'video', master: 'Stanford' },
        { name: 'Deep Learning Book: Sequence Modeling (RNNs, LSTMs, GRUs)', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    53: [ // Attention for NLP
        { name: 'Attention in NLP', url: 'https://www.youtube.com/watch?v=SysgYptB198', type: 'video' },
        { name: 'Illustrated Attention', url: 'https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/', type: 'website', master: 'Jay Alammar' },
        { name: 'Vaswani: Attention Is All You Need', url: 'https://www.semanticscholar.org/paper/Attention-is-All-you-Need-Vaswani-Shazeer/204e3073870fae3d05bcbc2f6a8e263d9b72e776', type: 'website', master: 'Vaswani et al.' },
    ],
    54: [ // Transformer LM Pre-training
        { name: 'Language Model Pre-training', url: 'https://arxiv.org/pdf/1801.06146.pdf', type: 'pdf' },
        { name: 'ELMo Paper', url: 'https://arxiv.org/pdf/1802.05365.pdf', type: 'pdf' },
        { name: 'CS224n: Unidirectional vs Bidirectional Pretraining', url: 'https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS224n/', type: 'course', master: 'Stanford' },
    ],
    55: [ // BERT Architecture
        { name: 'BERT Paper (Original)', url: 'https://arxiv.org/pdf/1810.04805.pdf', type: 'pdf', master: 'Google AI' },
        { name: 'The Illustrated BERT', url: 'https://jalammar.github.io/illustrated-bert/', type: 'website', master: 'Jay Alammar' },
        { name: 'BERT Deep Dive Video', url: 'https://www.youtube.com/watch?v=xI0HHN5XKDo', type: 'video' },
        { name: 'Hugging Face BERT Course', url: 'https://huggingface.co/learn/nlp-course/chapter3/1', type: 'course' },
        { name: 'CS224n: Contextual Embeddings/BERT Lecture', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    56: [ // RoBERTa, ALBERT, ELECTRA
        { name: 'RoBERTa Paper', url: 'https://arxiv.org/pdf/1907.11692.pdf', type: 'pdf', master: 'Facebook AI' },
        { name: 'ALBERT Paper', url: 'https://arxiv.org/pdf/1909.11942.pdf', type: 'pdf', master: 'Google' },
        { name: 'ELECTRA Paper', url: 'https://arxiv.org/pdf/2003.10555.pdf', type: 'pdf', master: 'Google' },
    ],
    57: [ // GPT Family
        { name: 'Ilya Sutskever 30 Papers', url: 'https://arc.net/folder/D0472A20-9C20-4D3F-8C45-56D60A0E1629', type: 'website', master: 'Ilya Sutskever' },
        { name: 'GPT-3 Paper', url: 'https://arxiv.org/pdf/2005.14165.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Karpathy: Build GPT', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', type: 'video', master: 'Andrej Karpathy' },
        { name: 'Vaswani: Attention Is All You Need (Architecture Base)', url: 'https://www.semanticscholar.org/paper/Attention-is-All-you-Need-Vaswani-Shazeer/204e3073870fae3d05bcbc2f6a8e263d9b72e776', type: 'website', master: 'Vaswani et al.' },
        { name: 'CS224n: GPT-Style Decoding Lectures', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    58: [ // Machine Translation
        { name: 'Neural Machine Translation Paper', url: 'https://arxiv.org/pdf/1409.0473.pdf', type: 'pdf' },
        { name: 'CS224n MT Lecture', url: 'https://www.youtube.com/watch?v=6aouXD8WMVQ', type: 'video', master: 'Stanford' },
        { name: 'Transformer WMT14 Experiments (Modern MT Breakthrough)', url: 'https://s10251.pcdn.co/pdf/2017-vaswani-transformer.pdf', type: 'pdf', master: 'Vaswani et al.' },
    ],
    59: [ // Question Answering
        { name: 'SQuAD Paper', url: 'https://arxiv.org/pdf/1606.05250.pdf', type: 'pdf', master: 'Stanford' },
        { name: 'QA Systems Tutorial', url: 'https://www.youtube.com/watch?v=yIdF-17HwSk', type: 'video' },
        { name: 'CS224n: QA & Reading Comprehension Lectures', url: 'https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS224n/', type: 'course', master: 'Stanford' },
    ],
    60: [ // Named Entity Recognition
        { name: 'NER with BERT', url: 'https://huggingface.co/learn/nlp-course/chapter7/2', type: 'course' },
        { name: 'NER Tutorial', url: 'https://www.youtube.com/watch?v=4Mf0h-Ga1zM', type: 'video' },
    ],
    61: [ // Sentiment Analysis
        { name: 'Sentiment Analysis Guide', url: 'https://huggingface.co/learn/nlp-course/chapter1/3', type: 'course' },
        { name: 'Stanford Sentiment Analysis', url: 'https://nlp.stanford.edu/sentiment/', type: 'website' },
        { name: 'CS224n: Sentiment Analysis Lecture', url: 'https://web.stanford.edu/class/cs224n/', type: 'course', master: 'Christopher Manning' },
    ],
    62: [ // Summarization
        { name: 'Abstractive Summarization Paper', url: 'https://arxiv.org/pdf/1704.04368.pdf', type: 'pdf' },
        { name: 'Text Summarization Tutorial', url: 'https://huggingface.co/learn/nlp-course/chapter7/5', type: 'course' },
        { name: 'Transformer for Summarization (Long-Context Generation)', url: 'https://s10251.pcdn.co/pdf/2017-vaswani-transformer.pdf', type: 'pdf', master: 'Vaswani et al.' },
    ],
    // Reinforcement Learning (63-75)
    63: [ // MDPs
        { name: 'Sutton & Barto Book (Free)', url: 'http://incompleteideas.net/book/the-book-2nd.html', type: 'book', master: 'Richard Sutton' },
        { name: 'David Silver RL Course', url: 'https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ', type: 'course', master: 'David Silver' },
        { name: 'Sutton & Barto Ch. 1-3: MDPs, Return, Value (CMU PDF)', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    64: [ // Value Functions
        { name: 'David Silver Lecture 2', url: 'https://www.youtube.com/watch?v=lfHX2hHRMVQ', type: 'video', master: 'David Silver' },
        { name: 'Sutton & Barto: Value Functions & Dynamic Programming', url: 'https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    65: [ // Q-Learning
        { name: 'DQN Paper', url: 'https://www.nature.com/articles/nature14236.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'David Silver Lecture 6', url: 'https://www.youtube.com/watch?v=UoPei5o4fps', type: 'video', master: 'David Silver' },
        { name: 'Sutton & Barto: Model-Free Prediction & Control', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    66: [ // Policy Gradient
        { name: 'Policy Gradient Methods Paper', url: 'https://proceedings.neurips.cc/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf', type: 'pdf', master: 'Sutton' },
        { name: 'PPO Paper', url: 'https://arxiv.org/pdf/1707.06347.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Sutton & Barto: Policy Gradient Methods', url: 'https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL: An Overview', url: 'https://arxiv.org/pdf/1701.07274.pdf', type: 'pdf' },
    ],
    67: [ // Actor-Critic
        { name: 'A3C Paper', url: 'https://arxiv.org/pdf/1602.01783.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'Actor-Critic Explained', url: 'https://www.youtube.com/watch?v=w_3mmm0P0j8', type: 'video' },
        { name: 'Sutton & Barto: Actor-Critic Chapter', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL Overview (A3C Discussion)', url: 'https://arxiv.org/pdf/1810.06339.pdf', type: 'pdf' },
    ],
    68: [ // TRPO/PPO
        { name: 'TRPO Paper', url: 'https://arxiv.org/pdf/1502.05477.pdf', type: 'pdf' },
        { name: 'PPO Paper', url: 'https://arxiv.org/pdf/1707.06347.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Sutton & Barto: Policy Gradients (TRPO Base)', url: 'https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL Overview: TRPO/PPO Summaries', url: 'https://arxiv.org/pdf/1701.07274.pdf', type: 'pdf' },
    ],
    69: [ // Model-Based RL
        { name: 'World Models Paper', url: 'https://arxiv.org/pdf/1803.10122.pdf', type: 'pdf' },
        { name: 'Dreamer Paper', url: 'https://arxiv.org/pdf/1912.01603.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'Sutton & Barto: Planning & Dyna Architecture', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    70: [ // Imitation Learning
        { name: 'Behavioral Cloning Tutorial', url: 'https://www.youtube.com/watch?v=WjFdD7PDGw0', type: 'video' },
        { name: 'GAIL Paper', url: 'https://arxiv.org/pdf/1606.03476.pdf', type: 'pdf' },
        { name: 'Deep RL Overview: Imitation Learning (BC, DAGGER)', url: 'https://arxiv.org/pdf/1810.06339.pdf', type: 'pdf' },
    ],
    71: [ // Multi-Agent RL
        { name: 'MARL Survey', url: 'https://arxiv.org/pdf/1911.10635.pdf', type: 'pdf' },
        { name: 'OpenAI Multi-Agent', url: 'https://openai.com/research/emergent-tool-use', type: 'website', master: 'OpenAI' },
        { name: 'Sutton & Barto: Single-Agent Base for MARL', url: 'https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    72: [ // Exploration Strategies
        { name: 'Curiosity-Driven Exploration', url: 'https://arxiv.org/pdf/1705.05363.pdf', type: 'pdf' },
        { name: 'Exploration in RL', url: 'https://www.youtube.com/watch?v=SfCa1HQMkuw', type: 'video' },
        { name: 'Sutton & Barto: Bandits & Exploration Strategies', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL Overview: Curiosity & Intrinsic Motivation', url: 'https://arxiv.org/pdf/1701.07274.pdf', type: 'pdf' },
    ],
    73: [ // RL Applications
        { name: 'Option-Critic Paper', url: 'https://arxiv.org/pdf/1609.05140.pdf', type: 'pdf' },
        { name: 'Hierarchical RL Overview', url: 'https://www.youtube.com/watch?v=6Pb8hP7CYRA', type: 'video' },
        { name: 'Sutton & Barto: Case Studies (AlphaGo)', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL Overview: Games, Robotics, NLP Applications', url: 'http://arxiv.org/pdf/1811.12560.pdf', type: 'pdf' },
    ],
    74: [ // Deep RL
        { name: 'Inverse RL Tutorial', url: 'https://arxiv.org/pdf/1806.06877.pdf', type: 'pdf' },
        { name: 'Deep RL: An Overview (Survey)', url: 'http://arxiv.org/pdf/1811.12560.pdf', type: 'pdf' },
        { name: 'Sutton & Barto: Tabular RL Foundation', url: 'https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf', type: 'pdf', master: 'Sutton & Barto' },
    ],
    75: [ // RL Stability & Convergence
        { name: 'Safe RL Survey', url: 'https://arxiv.org/pdf/2205.10330.pdf', type: 'pdf' },
        { name: 'Constrained Policy Optimization', url: 'https://arxiv.org/pdf/1705.10528.pdf', type: 'pdf' },
        { name: 'Sutton & Barto: Convergence & Stability Conditions', url: 'https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf', type: 'pdf', master: 'Sutton & Barto' },
        { name: 'Deep RL Overview: Instability (FA + Bootstrapping + Off-Policy)', url: 'https://arxiv.org/pdf/1810.06339.pdf', type: 'pdf' },
    ],

    // ═══════════════════════════════════════════════════════════════════════════════
    // Q2 TOPICS (76-150): Advanced Specialization
    // ═══════════════════════════════════════════════════════════════════════════════

    // Advanced Architecture Design (76-90)
    76: [ // Mixture of Experts
        { name: 'GShard Paper', url: 'https://arxiv.org/pdf/2006.16668.pdf', type: 'pdf', master: 'Google' },
        { name: 'Switch Transformer Paper', url: 'https://arxiv.org/pdf/2101.03961.pdf', type: 'pdf', master: 'Google' },
        { name: 'Yannic Kilcher: MoE Explained', url: 'https://www.youtube.com/watch?v=sY_gS6yQbMQ', type: 'video' },
        { name: 'Shazeer: Sparsely-Gated MoE Layer (Original)', url: 'https://arxiv.org/pdf/1701.06538.pdf', type: 'pdf', master: 'Noam Shazeer' },
        { name: 'Deep Learning Book: Feedforward Networks & Capacity', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    77: [ // Sparse MoE
        { name: 'Sparse MoE Paper', url: 'https://arxiv.org/pdf/1701.06538.pdf', type: 'pdf', master: 'Noam Shazeer' },
        { name: 'Mixtral of Experts', url: 'https://arxiv.org/pdf/2401.04088.pdf', type: 'pdf', master: 'Mistral AI' },
    ],
    78: [ // Dense-to-Sparse (Pruning)
        { name: 'Lottery Ticket Hypothesis', url: 'https://arxiv.org/pdf/1803.03635.pdf', type: 'pdf', master: 'MIT' },
        { name: 'Neural Network Pruning Survey', url: 'https://arxiv.org/pdf/2102.00554.pdf', type: 'pdf' },
        { name: 'Tay et al.: Efficient Transformers Survey', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    79: [ // Efficient Transformers
        { name: 'Flash Attention Paper', url: 'https://arxiv.org/pdf/2205.14135.pdf', type: 'pdf', master: 'Tri Dao' },
        { name: 'Flash Attention 2', url: 'https://arxiv.org/pdf/2307.08691.pdf', type: 'pdf', master: 'Tri Dao' },
        { name: 'Linformer Paper', url: 'https://arxiv.org/pdf/2006.04768.pdf', type: 'pdf', master: 'Facebook AI' },
        { name: 'Performer Paper', url: 'https://arxiv.org/pdf/2009.14794.pdf', type: 'pdf', master: 'Google' },
        { name: 'Tay et al.: Efficient Transformers - A Survey (Authoritative)', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    80: [ // Reversible Networks
        { name: 'RevNet Paper', url: 'https://arxiv.org/pdf/1707.04585.pdf', type: 'pdf' },
        { name: 'Reformer Paper (Reversible Transformer)', url: 'https://arxiv.org/pdf/2001.04451.pdf', type: 'pdf', master: 'Google' },
    ],
    81: [ // Neural Architecture Search
        { name: 'NAS Original Paper', url: 'https://arxiv.org/pdf/1611.01578.pdf', type: 'pdf', master: 'Google Brain' },
        { name: 'DARTS Paper', url: 'https://arxiv.org/pdf/1806.09055.pdf', type: 'pdf' },
        { name: 'NAS Survey', url: 'https://arxiv.org/pdf/1808.05377.pdf', type: 'pdf' },
    ],
    82: [ // Compound Scaling
        { name: 'EfficientNet Paper', url: 'https://arxiv.org/pdf/1905.11946.pdf', type: 'pdf', master: 'Google' },
        { name: 'EfficientNetV2 Paper', url: 'https://arxiv.org/pdf/2104.00298.pdf', type: 'pdf', master: 'Google' },
    ],
    83: [ // Architecture Scaling Laws
        { name: 'Scaling Laws Paper (Kaplan)', url: 'https://arxiv.org/pdf/2001.08361.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Chinchilla Paper', url: 'https://arxiv.org/pdf/2203.15556.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'Yannic Kilcher: Scaling Laws', url: 'https://www.youtube.com/watch?v=5Tr8eVxdnw0', type: 'video' },
    ],
    84: [ // Depth vs Width
        { name: 'Wide Residual Networks', url: 'https://arxiv.org/pdf/1605.07146.pdf', type: 'pdf' },
        { name: 'Depth vs Width Study', url: 'https://arxiv.org/pdf/2010.09610.pdf', type: 'pdf' },
        { name: 'Modern Mathematics of Deep Learning: Depth/Width Expressivity', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    85: [ // Skip Connections Variants
        { name: 'DenseNet Paper', url: 'https://arxiv.org/pdf/1608.06993.pdf', type: 'pdf' },
        { name: 'Highway Networks Paper', url: 'https://arxiv.org/pdf/1505.00387.pdf', type: 'pdf' },
    ],
    86: [ // Attention Variants
        { name: 'RoPE (Rotary Position Embedding)', url: 'https://arxiv.org/pdf/2104.09864.pdf', type: 'pdf' },
        { name: 'ALiBi Paper', url: 'https://arxiv.org/pdf/2108.12409.pdf', type: 'pdf' },
        { name: 'Multi-Query Attention', url: 'https://arxiv.org/pdf/1911.02150.pdf', type: 'pdf', master: 'Google' },
        { name: 'Vaswani: Attention Is All You Need (Base Multi-Head)', url: 'https://arxiv.org/pdf/1706.03762.pdf', type: 'pdf', master: 'Vaswani et al.' },
        { name: 'Efficient Transformers Survey: Attention Variants Catalog', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    87: [ // Convolution Variants
        { name: 'MobileNets Paper', url: 'https://arxiv.org/pdf/1704.04861.pdf', type: 'pdf', master: 'Google' },
        { name: 'ConvNeXt Paper', url: 'https://arxiv.org/pdf/2201.03545.pdf', type: 'pdf', master: 'Facebook AI' },
        { name: 'CS231n: ConvNet Architecture Lectures (Dilated, Separable, etc.)', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],
    88: [ // Activation Functions
        { name: 'GELU Paper', url: 'https://arxiv.org/pdf/1606.08415.pdf', type: 'pdf' },
        { name: 'Swish/SiLU Paper', url: 'https://arxiv.org/pdf/1710.05941.pdf', type: 'pdf', master: 'Google Brain' },
        { name: 'Activation Functions Survey', url: 'https://arxiv.org/pdf/2109.14545.pdf', type: 'pdf' },
    ],
    89: [ // Normalization Variants
        { name: 'RMSNorm Paper', url: 'https://arxiv.org/pdf/1910.07467.pdf', type: 'pdf' },
        { name: 'Group Normalization Paper', url: 'https://arxiv.org/pdf/1803.08494.pdf', type: 'pdf', master: 'Kaiming He' },
    ],
    90: [ // Optimizer Design
        { name: 'AdamW Paper', url: 'https://arxiv.org/pdf/1711.05101.pdf', type: 'pdf' },
        { name: 'LAMB Optimizer Paper', url: 'https://arxiv.org/pdf/1904.00962.pdf', type: 'pdf', master: 'Google' },
        { name: 'SAM (Sharpness-Aware)', url: 'https://arxiv.org/pdf/2010.01412.pdf', type: 'pdf', master: 'Google' },
        { name: 'Deep Learning Book: Optimization Chapter', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
        { name: 'CS231n: Training Neural Networks Lectures', url: 'https://cs231n.github.io', type: 'course', master: 'Stanford' },
    ],

    // Pre-training & Transfer Learning (91-105)
    91: [ // Self-Supervised Learning
        { name: 'SimCLR Paper', url: 'https://arxiv.org/pdf/2002.05709.pdf', type: 'pdf', master: 'Geoffrey Hinton' },
        { name: 'BYOL Paper', url: 'https://arxiv.org/pdf/2006.07733.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'Self-Supervised Learning Survey', url: 'https://arxiv.org/pdf/2304.12210.pdf', type: 'pdf' },
        { name: 'Jing & Tian: SSL Visual Feature Learning Survey (TPAMI)', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
        { name: 'Deep Learning Book: Unsupervised & Representation Learning', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    92: [ // Contrastive Learning
        { name: 'MoCo Paper', url: 'https://arxiv.org/pdf/1911.05722.pdf', type: 'pdf', master: 'Kaiming He' },
        { name: 'MoCo v2', url: 'https://arxiv.org/pdf/2003.04297.pdf', type: 'pdf', master: 'Facebook AI' },
        { name: 'Contrastive Learning Tutorial', url: 'https://www.youtube.com/watch?v=J3bnZCTRVJo', type: 'video' },
    ],
    93: [ // CLIP & Vision-Language
        { name: 'CLIP Paper', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Yannic Kilcher: CLIP Explained', url: 'https://www.youtube.com/watch?v=T9XSU0pKX2E', type: 'video' },
        { name: 'OpenCLIP', url: 'https://github.com/mlfoundations/open_clip', type: 'website' },
    ],
    94: [ // Masked Autoencoder (MAE)
        { name: 'MAE Paper', url: 'https://arxiv.org/pdf/2111.06377.pdf', type: 'pdf', master: 'Kaiming He' },
        { name: 'Yannic Kilcher: MAE', url: 'https://www.youtube.com/watch?v=LTaZqMPJK88', type: 'video' },
    ],
    95: [ // Domain Adaptation
        { name: 'Domain Adaptation Survey', url: 'https://arxiv.org/pdf/2010.03978.pdf', type: 'pdf' },
        { name: 'DANN Paper', url: 'https://arxiv.org/pdf/1505.07818.pdf', type: 'pdf' },
        { name: 'Deep Learning Book: Transfer Learning & Domain Shift', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    96: [ // Meta-Learning
        { name: 'MAML Paper', url: 'https://arxiv.org/pdf/1703.03400.pdf', type: 'pdf', master: 'Chelsea Finn' },
        { name: 'Chelsea Finn: Meta-Learning', url: 'https://www.youtube.com/watch?v=0rZtSwNOTQo', type: 'video', master: 'Chelsea Finn' },
        { name: 'Reptile Paper', url: 'https://arxiv.org/pdf/1803.02999.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    97: [ // Federated Learning
        { name: 'FedAvg Paper', url: 'https://arxiv.org/pdf/1602.05629.pdf', type: 'pdf', master: 'Google' },
        { name: 'Federated Learning Tutorial', url: 'https://federated.withgoogle.com/', type: 'website', master: 'Google' },
        { name: 'McMahan et al.: Communication-Efficient Learning from Decentralized Data', url: 'https://arxiv.org/abs/1602.05629', type: 'pdf', master: 'McMahan et al.' },
    ],
    98: [ // Continual Learning
        { name: 'Continual Learning Survey', url: 'https://arxiv.org/pdf/1904.07734.pdf', type: 'pdf' },
        { name: 'EWC Paper', url: 'https://arxiv.org/pdf/1612.00796.pdf', type: 'pdf', master: 'DeepMind' },
    ],
    99: [ // Few-Shot Learning
        { name: 'Prototypical Networks', url: 'https://arxiv.org/pdf/1703.05175.pdf', type: 'pdf' },
        { name: 'Matching Networks', url: 'https://arxiv.org/pdf/1606.04080.pdf', type: 'pdf', master: 'DeepMind' },
    ],
    100: [ // Zero-Shot Learning
        { name: 'Zero-Shot Learning Survey', url: 'https://arxiv.org/pdf/1707.00600.pdf', type: 'pdf' },
        { name: 'Zero-Shot with Semantic Embeddings', url: 'https://arxiv.org/pdf/1312.5650.pdf', type: 'pdf' },
        { name: 'CLIP: Zero-Shot Transfer to ImageNet (Radford et al.)', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    101: [ // Open-Set Recognition
        { name: 'OOD Detection Survey', url: 'https://arxiv.org/pdf/2110.11334.pdf', type: 'pdf' },
        { name: 'OpenMax Paper', url: 'https://arxiv.org/pdf/1511.06233.pdf', type: 'pdf' },
        { name: 'CLIP: Open-Vocabulary Recognition', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    102: [ // Lifelong Learning
        { name: 'Lifelong Learning Survey', url: 'https://arxiv.org/pdf/2004.07631.pdf', type: 'pdf' },
    ],
    103: [ // Curriculum Learning
        { name: 'Curriculum Learning Paper', url: 'https://ronan.collobert.com/pub/matos/2009_curriculum_icml.pdf', type: 'pdf', master: 'Yoshua Bengio' },
    ],
    104: [ // Active Learning
        { name: 'Active Learning Survey', url: 'https://arxiv.org/pdf/2210.11479.pdf', type: 'pdf' },
    ],
    105: [ // Data Selection
        { name: 'Data Selection for Pre-training', url: 'https://arxiv.org/pdf/2305.10429.pdf', type: 'pdf' },
        { name: 'Deduplication Paper', url: 'https://arxiv.org/pdf/2107.06499.pdf', type: 'pdf' },
    ],

    // Scaling & Efficiency (106-120)
    106: [ // Scaling Laws
        { name: 'Scaling Laws (Kaplan et al.)', url: 'https://arxiv.org/pdf/2001.08361.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Yannic Kilcher: Scaling Laws Deep Dive', url: 'https://www.youtube.com/watch?v=5Tr8eVxdnw0', type: 'video' },
        { name: 'Modern Mathematics of Deep Learning: Scaling Phenomena', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    107: [ // Chinchilla Optimal
        { name: 'Chinchilla Paper', url: 'https://arxiv.org/pdf/2203.15556.pdf', type: 'pdf', master: 'DeepMind' },
        { name: 'Yannic Kilcher: Chinchilla', url: 'https://www.youtube.com/watch?v=NJNVYxRILKg', type: 'video' },
    ],
    108: [ // Compute-Optimal Training
        { name: 'Beyond Chinchilla-Optimal', url: 'https://arxiv.org/pdf/2404.10102.pdf', type: 'pdf' },
    ],
    109: [ // Model Parallelism
        { name: 'Megatron-LM Paper', url: 'https://arxiv.org/pdf/1909.08053.pdf', type: 'pdf', master: 'NVIDIA' },
        { name: 'Megatron-LM 2', url: 'https://arxiv.org/pdf/2104.04473.pdf', type: 'pdf', master: 'NVIDIA' },
    ],
    110: [ // Distributed Training
        { name: 'DeepSpeed Paper', url: 'https://arxiv.org/pdf/2207.00032.pdf', type: 'pdf', master: 'Microsoft' },
        { name: 'PyTorch FSDP', url: 'https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/', type: 'website', master: 'PyTorch' },
        { name: 'ZeRO Paper', url: 'https://arxiv.org/pdf/1910.02054.pdf', type: 'pdf', master: 'Microsoft' },
        { name: 'McMahan et al.: Communication-Efficient Distributed Learning', url: 'https://arxiv.org/abs/1602.05629', type: 'pdf', master: 'McMahan et al.' },
    ],

    // Scaling & Efficiency (111-120)
    111: [ // Mixed Precision Training
        { name: 'Efficient Transformers Survey: Mixed Precision', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
        { name: 'Deep Learning Book: Numerical Aspects', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    112: [ // Gradient Checkpointing
        { name: 'Efficient Transformers Survey: Memory-Saving Strategies', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
        { name: 'MAE Paper: Efficient ViT Training', url: 'https://arxiv.org/pdf/2111.06377.pdf', type: 'pdf', master: 'Kaiming He' },
    ],
    113: [ // Quantization
        { name: 'Efficient Transformers Survey: Low-Precision Arithmetic', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    114: [ // Knowledge Distillation
        { name: 'Hinton et al.: Distilling the Knowledge in a Neural Network', url: 'https://arxiv.org/pdf/1503.02531.pdf', type: 'pdf', master: 'Geoffrey Hinton' },
    ],
    115: [ // Pruning Strategies
        { name: 'Lottery Ticket Hypothesis', url: 'https://arxiv.org/pdf/1803.03635.pdf', type: 'pdf', master: 'MIT' },
        { name: 'Deep Learning Book: Regularization & Capacity Control', url: 'https://www.deeplearningbook.org', type: 'book', master: 'Goodfellow, Bengio, Courville' },
    ],
    116: [ // Efficient Inference
        { name: 'Efficient Transformers Survey: Inference Cost Reduction', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
        { name: 'CLIP: Efficient Zero-Shot Inference', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    117: [ // Speculative Decoding
        { name: 'Efficient Transformers Survey: Modern Inference Optimization', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    118: [ // Tensor Parallelism
        { name: 'Megatron-LM: Tensor Parallelism', url: 'https://arxiv.org/pdf/1909.08053.pdf', type: 'pdf', master: 'NVIDIA' },
        { name: 'Efficient Transformers Survey', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],
    119: [ // Activation Recomputation
        { name: 'Efficient Transformers Survey: Activation Recomputation', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
        { name: 'MAE Training: Memory-Efficient Strategies', url: 'https://arxiv.org/pdf/2111.06377.pdf', type: 'pdf', master: 'Kaiming He' },
    ],
    120: [ // Hardware Acceleration
        { name: 'Efficient Transformers Survey: GPU/TPU Utilisation', url: 'https://arxiv.org/abs/2009.06732', type: 'pdf' },
    ],

    // Multimodal & Cross-Modal (121-135)
    121: [ // Vision-Language Models
        { name: 'CLIP Paper (Contrastive Language-Image)', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    122: [ // Multimodal Embeddings
        { name: 'CLIP: Shared Image-Text Space', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    123: [ // Multimodal Fusion
        { name: 'CLIP-Based Cross-Modal Fusion', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'SSL Survey: Multimodal SSL Taxonomy', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    124: [ // Image Captioning
        { name: 'CLIP Visual Embeddings for Captioning', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    125: [ // Visual Question Answering (VQA)
        { name: 'CLIP for V&L Tasks', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    126: [ // Scene Graphs
        { name: 'SSL Visual Understanding Survey: Scene Graph Representations', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    127: [ // Video-Text Alignment
        { name: 'CLIP Extensions to Video', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    128: [ // Cross-Modal Retrieval
        { name: 'CLIP: Cross-Modal Retrieval Evaluation', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    129: [ // Audio-Visual Learning
        { name: 'SSL Survey: Audio-Visual Correspondence Tasks', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    130: [ // Speech Recognition
        { name: 'SSL Survey: Contrastive/Masking for Speech Models', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    131: [ // Text-to-Speech
        { name: 'Multimodal Surveys: Cross-Modal Generation', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    132: [ // Music & Audio Generation
        { name: 'SSL & Generative Surveys: Audio Modality', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    133: [ // 3D Shape & Geometry
        { name: 'SSL Survey: 3D Data & Geometry-Aware Learning', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    134: [ // Scene Understanding
        { name: 'CLIP & MAE: Strong Transfer Backbones', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'MAE Paper', url: 'https://arxiv.org/pdf/2111.06377.pdf', type: 'pdf', master: 'Kaiming He' },
    ],
    135: [ // Embodied AI
        { name: 'SSL & RL Surveys: Embodied Multimodal AI', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],

    // Interpretability & Analysis (136-150)
    136: [ // Attention Visualization
        { name: 'Vaswani: Attention Visualizations', url: 'https://arxiv.org/pdf/1706.03762.pdf', type: 'pdf', master: 'Vaswani et al.' },
        { name: 'CLIP/ViT Semantic Encoding Studies', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
    ],
    137: [ // Feature Importance
        { name: 'SSL Survey: Evaluating Learned Representations', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
        { name: 'Modern Mathematics of DL: Sensitivity & Gradient Measures', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    138: [ // Concept Activation Vectors (CAVs)
        { name: 'TCAV Paper: Testing with Concept Activation Vectors', url: 'https://arxiv.org/pdf/1711.11279.pdf', type: 'pdf', master: 'Google' },
    ],
    139: [ // Adversarial Examples
        { name: 'Goodfellow et al.: Adversarial Examples', url: 'https://arxiv.org/pdf/1412.6572.pdf', type: 'pdf', master: 'Ian Goodfellow' },
        { name: 'Modern Mathematics of DL: Adversarial Vulnerability', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    140: [ // Adversarial Training
        { name: 'Madry et al.: Adversarial Training (PGD)', url: 'https://arxiv.org/pdf/1706.06083.pdf', type: 'pdf', master: 'MIT' },
    ],
    141: [ // Neural Backdoors
        { name: 'SSL Survey: Robustness & Data Poisoning', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    142: [ // Robustness Evaluation
        { name: 'SSL Survey: Robustness Across Perturbations', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
        { name: 'Modern Mathematics of DL: Generalization & Stability', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    143: [ // OOD Detection
        { name: 'CLIP: Zero-Shot OOD Robustness', url: 'https://arxiv.org/pdf/2103.00020.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'OOD Detection Survey', url: 'https://arxiv.org/pdf/2110.11334.pdf', type: 'pdf' },
    ],
    144: [ // Uncertainty Quantification
        { name: 'Modern Mathematics of DL: Bayesian Deep Learning & Calibration', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    145: [ // Model Interpretability Metrics
        { name: 'SSL Survey: Linear Probing, Mutual Information, Disentanglement', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    146: [ // Circuit Analysis
        { name: 'Transformer Circuits (Anthropic)', url: 'https://transformer-circuits.pub/', type: 'website', master: 'Anthropic' },
        { name: 'A Mathematical Framework for Transformer Circuits', url: 'https://transformer-circuits.pub/2021/framework/index.html', type: 'website', master: 'Anthropic' },
    ],
    147: [ // Fairness in ML
        { name: 'SSL Survey: Fairness & Bias in Representations', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    148: [ // Interpretable-by-Design Models
        { name: 'SSL Survey: Architectures for Transparency (Jigsaw, Clustering)', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],
    149: [ // Explainability Methods
        { name: 'SSL Survey: Gradient Saliency, Perturbation, Concept Methods', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
        { name: 'Modern Mathematics of DL: Explainability', url: 'https://arxiv.org/pdf/2105.04026.pdf', type: 'pdf' },
    ],
    150: [ // Model Auditing
        { name: 'SSL Survey: Evaluation Protocols & Distribution Shifts', url: 'https://arxiv.org/abs/1902.10206', type: 'pdf' },
    ],

    // Q3 Topics (151+)
    151: [ // Pose Estimation
        { name: 'OpenPose Paper', url: 'https://arxiv.org/pdf/1812.08008.pdf', type: 'pdf', master: 'CMU' },
        { name: 'MediaPipe Pose', url: 'https://google.github.io/mediapipe/solutions/pose.html', type: 'website', master: 'Google' },
    ],

    // Q4 Topics (226+)
    226: [ // Mechanistic Interpretability
        { name: 'Transformer Circuits (Anthropic)', url: 'https://transformer-circuits.pub/', type: 'website', master: 'Anthropic' },
        { name: 'Neel Nanda: Mechanistic Interpretability', url: 'https://www.youtube.com/playlist?list=PL7m7hLIqA0hrLCEi_NNaSeWLvnT2H4P4_', type: 'video', master: 'Neel Nanda' },
        { name: 'A Mathematical Framework for Transformer Circuits', url: 'https://transformer-circuits.pub/2021/framework/index.html', type: 'website', master: 'Anthropic' },
    ],
    251: [ // RLHF
        { name: 'InstructGPT Paper', url: 'https://arxiv.org/pdf/2203.02155.pdf', type: 'pdf', master: 'OpenAI' },
        { name: 'Constitutional AI Paper', url: 'https://arxiv.org/pdf/2212.08073.pdf', type: 'pdf', master: 'Anthropic' },
        { name: 'RLHF Illustrated', url: 'https://huggingface.co/blog/rlhf', type: 'website', master: 'Hugging Face' },
    ],
    276: [ // AI Alignment
        { name: 'AI Alignment Research Overview', url: 'https://www.alignmentforum.org/', type: 'website', master: 'Alignment Forum' },
        { name: 'Concrete Problems in AI Safety', url: 'https://arxiv.org/pdf/1606.06565.pdf', type: 'pdf', master: 'DeepMind/Google/OpenAI' },
    ],
};

// Helper function to get resources for a topic
export function getResourcesForTopic(topicId: number): TopicResource[] {
    return TOPIC_RESOURCES[topicId] || [];
}

// Get the primary resource for a topic
export function getPrimaryResource(topicId: number): TopicResource | null {
    const resources = TOPIC_RESOURCES[topicId];
    return resources && resources.length > 0 ? resources[0] : null;
}

// Updated: iteration 11

// Updated: iteration 19
