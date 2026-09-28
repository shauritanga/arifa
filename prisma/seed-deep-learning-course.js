/**
 * Seed the Deep Learning Crash Course (6-8 October 2026) with full curriculum
 * and instructor CVs, transcribed from the Tanzanite Prime course guides.
 *
 * Idempotent: re-running updates the existing item rather than duplicating it.
 * Run on the machine whose Postgres you want to fill:
 *   node prisma/seed-deep-learning-course.js
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SLUG = "deep-learning-crash-course";

const DETAILS = `<p>Learn how deep learning actually works &mdash; from the fundamentals of neural networks to building, training, evaluating, and improving deep learning models. This intensive 3-day crash course is designed for complete beginners who want to understand the ideas behind modern Artificial Intelligence without being overwhelmed by technical jargon.</p>
<p>You will begin by understanding the relationship between Artificial Intelligence, Machine Learning, and Deep Learning, then explore how neural networks learn from data through forward propagation, loss functions, backpropagation, gradient descent, and optimization. As the course progresses, you will learn about learning approaches, model parameters and hyperparameters, overfitting, regularization, and major neural network architectures including Fully Connected Networks, Recurrent Neural Networks (RNNs), and Convolutional Neural Networks (CNNs).</p>
<p>By the end of the course, you will understand the complete lifecycle of a deep learning project &mdash; from collecting and preparing data to training, evaluating, optimizing, and improving a model. Delivered in partnership with the Tanzanite Prime Intensive Training Program.</p>
<h2>Course at a glance</h2>
<ul>
<li><strong>Duration:</strong> 3 days of intensive training</li>
<li><strong>Level:</strong> Beginner to Intermediate &mdash; no prior AI, coding, or technical experience required</li>
<li><strong>Approach:</strong> Concepts + visual explanations + demonstrations + hands-on exercises</li>
<li><strong>Teaching mode:</strong> Online (virtual session)</li>
<li><strong>Dates:</strong> 6&ndash;8 October 2026</li>
<li><strong>Fees:</strong> 130,000 TZS with certificate, 80,000 TZS without certificate</li>
</ul>
<h2>What you&rsquo;ll learn</h2>
<ul>
<li>Understand the difference between Artificial Intelligence, Machine Learning, and Deep Learning.</li>
<li>Explain how a neural network works from input to prediction.</li>
<li>Understand neurons, layers, weights, biases, and activation functions.</li>
<li>Understand forward propagation, loss functions, backpropagation, and gradient descent.</li>
<li>Explain the role of learning rate and optimizers such as SGD and Adam.</li>
<li>Differentiate between model parameters and hyperparameters.</li>
<li>Understand epochs, batches, batch size, and training iterations.</li>
<li>Differentiate between Supervised, Unsupervised, and Reinforcement Learning.</li>
<li>Recognize classification, regression, clustering, and association problems.</li>
<li>Identify underfitting and overfitting, and understand regularization techniques.</li>
<li>Understand Fully Connected Networks, RNNs, LSTMs/gated RNNs, and CNNs.</li>
<li>Understand convolution, pooling, feature extraction, and sequence modeling.</li>
<li>Prepare data using training, validation, and test splits, normalization, and standardization.</li>
<li>Follow the complete deep learning workflow: data &rarr; preprocessing &rarr; training &rarr; evaluation &rarr; optimization.</li>
<li>Build the foundation needed for advanced AI, Computer Vision, NLP, and Generative AI.</li>
</ul>
<h2>Day-by-day outline</h2>
<h3>Day 1 &mdash; Understanding Deep Learning &amp; Neural Networks</h3>
<p>Build the mental model needed to understand what neural networks are, how information flows through them, and how they learn from mistakes.</p>
<h4>Module 1: Introduction to Artificial Intelligence</h4>
<ul>
<li>What is Artificial Intelligence, Machine Learning, and Deep Learning?</li>
<li>AI vs Machine Learning vs Deep Learning.</li>
<li>Why deep learning became practical: data, hardware, and software advances.</li>
</ul>
<h4>Module 2: Neural Network Fundamentals</h4>
<ul>
<li>The neuron as the basic building block.</li>
<li>Input, hidden, and output layers.</li>
<li>Weights, biases, and how information moves through the network.</li>
</ul>
<h4>Module 3: How Neural Networks Learn</h4>
<ul>
<li>Forward propagation, making a prediction, and comparing predicted and expected outputs.</li>
<li>Loss functions and backpropagation: the full learning loop of initialize &rarr; predict &rarr; calculate loss &rarr; backpropagate &rarr; update &rarr; repeat.</li>
</ul>
<h4>Module 4: Activation Functions</h4>
<ul>
<li>Why non-linearity matters.</li>
<li>Step function, sigmoid, and ReLU.</li>
<li>Choosing an activation function.</li>
</ul>
<p><strong>Day 1 practical:</strong> build your first neural network conceptually &mdash; trace information through a simple network across the complete learning process.</p>
<h3>Day 2 &mdash; Training, Optimization &amp; Learning Strategies</h3>
<p>Understand how a model improves during training and how choices such as learning rate, optimizer, batch size, and regularization affect performance.</p>
<h4>Module 5: Loss Functions &amp; Optimization</h4>
<ul>
<li>Regression losses (squared error, Huber).</li>
<li>Classification losses (binary and multi-class cross-entropy).</li>
<li>How the loss function guides parameter updates.</li>
</ul>
<h4>Module 6: Gradient Descent</h4>
<ul>
<li>Gradients and learning rate.</li>
<li>Stochastic Gradient Descent (SGD).</li>
<li>Momentum.</li>
<li>The Adam optimizer.</li>
</ul>
<h4>Module 7: Understanding Model Training</h4>
<ul>
<li>Parameters vs hyperparameters.</li>
<li>Epochs, batches, batch size, and iterations.</li>
<li>How they work together during training.</li>
</ul>
<h4>Module 8: Types of Learning</h4>
<ul>
<li>Supervised learning (classification, regression).</li>
<li>Unsupervised learning (clustering, association).</li>
<li>Reinforcement learning (agent, environment, state, action, reward).</li>
</ul>
<h4>Module 9: Overfitting &amp; Model Generalization</h4>
<ul>
<li>Underfitting vs overfitting.</li>
<li>Dropout.</li>
<li>Data augmentation.</li>
<li>Early stopping.</li>
<li>Regularization.</li>
</ul>
<p><strong>Day 2 practical:</strong> train and improve a neural network &mdash; explore how learning rate, epochs, batch size, neurons, and model complexity affect behavior and performance.</p>
<h3>Day 3 &mdash; Neural Network Architectures &amp; Building a Complete Model</h3>
<p>Connect the fundamentals to major neural network architectures and understand the complete development workflow from raw data to an improved model.</p>
<h4>Module 10: Fully Connected Neural Networks</h4>
<ul>
<li>Feed-forward networks and hidden layers.</li>
<li>Activation choices.</li>
<li>Why larger networks require more computation.</li>
</ul>
<h4>Module 11: Recurrent Neural Networks (RNNs)</h4>
<ul>
<li>Sequential data, feedback, and parameter sharing.</li>
<li>Backpropagation through time and the vanishing gradient problem.</li>
<li>LSTMs / gated RNNs.</li>
<li>Applied to NLP, sentiment analysis, speech, and translation.</li>
</ul>
<h4>Module 12: Convolutional Neural Networks (CNNs)</h4>
<ul>
<li>Convolutions, filters, and pooling.</li>
<li>The convolve &rarr; pool &rarr; repeat &rarr; classify pattern.</li>
<li>Applied to computer vision, image recognition, and video analysis.</li>
</ul>
<h4>Module 13: The Deep Learning Development Workflow</h4>
<ul>
<li>Gather data.</li>
<li>Prepare it (missing values, scaling, normalization).</li>
<li>Split it (train/validation/test).</li>
<li>Train the model.</li>
<li>Evaluate and optimize: hyperparameter tuning, addressing overfitting, and systematic improvement.</li>
</ul>
<p><strong>Final practical:</strong> build a deep learning model from start to finish &mdash; connect everything into one complete workflow and understand what is happening inside the model while it learns.</p>
<h2>Requirements</h2>
<p>No prior AI, coding, or technical experience required. You only need a laptop, internet access, basic computer skills, and curiosity. You do <strong>not</strong> need previous AI/ML experience, advanced mathematics, programming experience, or a Computer Science degree.</p>
<h2>Who this course is for</h2>
<ul>
<li>Complete beginners interested in AI, and university and college students.</li>
<li>Researchers entering AI and Machine Learning; software developers, engineers, and STEM professionals.</li>
<li>Entrepreneurs and innovators exploring AI opportunities.</li>
<li>Professionals who want to understand how modern AI systems work.</li>
<li>Anyone preparing to study Computer Vision, NLP, Generative AI, or advanced Machine Learning.</li>
</ul>
<h2>Key outcome</h2>
<p>By the end of the three days, you will be able to look at a deep learning system and understand the complete journey: how data enters the model, how the network makes a prediction, how errors are measured, how the network learns from those errors, and how the model is improved so it can make useful predictions on new data.</p>
<p><strong>Fees:</strong> 130,000 TZS with a Certificate of Completion, or 80,000 TZS without. Online enrollment below charges the certificate option; to enroll without a certificate, please <a href="/contact-us">contact our team</a>.</p>`;

const TUTORS = `<p>Delivered by active researchers in artificial intelligence, robotics, and intelligent systems, based at leading research institutions in South Korea.</p>
<img src="/images/courses/tutor-nicholaus-thomas.jpg" alt="Dr. Nicholaus Isack Thomas" />
<h3>Dr. Nicholaus Isack Thomas</h3>
<h4>Postdoctoral Researcher, Intelligent Systems and Learning (ISL) Lab, DGIST &mdash; Daegu Gyeongbuk Institute of Science and Technology, South Korea</h4>
<p>Dr. Nicholaus Isack Thomas is a Postdoctoral Researcher at DGIST, where his work covers human&ndash;robot interaction, action prediction, and Visual Language Action (VLA) models combined with reinforcement learning. His doctoral research introduced a Feature Mixture Transformer approach to automatic subgoal generation for reinforcement learning agents, addressing how agents learn useful representations in high-dimensional state spaces. His broader interests span multi-agent systems, robotics, and autonomous driving, using frameworks such as PyTorch, TensorFlow, RLlib, and Stable Baselines. In this course, he grounds the fundamentals of neural networks, optimization, and reinforcement learning in current research practice.</p>
<img src="/images/courses/tutor-daniel-mtowe.jpg" alt="Daniel Poul Mtowe" />
<h3>Daniel Poul Mtowe</h3>
<h4>Ph.D. Researcher, ICT Convergence, Soonchunhyang University, South Korea</h4>
<p>Daniel Poul Mtowe is a Ph.D. researcher in ICT Convergence at Soonchunhyang University, working at the intersection of edge computing, digital twin systems, and intelligent robotics. His research focuses on real-time, scalable, and communication-efficient cyber-physical systems for autonomous coordination, collision avoidance, and smart automation, drawing on deep reinforcement learning, distributed control, and low-latency decision-making architectures. He holds a B.S. in Computer Engineering (Tanzania) and an M.S. in ICT Convergence (South Korea). He brings a systems engineering perspective to the course, connecting model training and optimization to how deep learning is deployed in real, resource-constrained environments.</p>
<img src="/images/courses/tutor-isamu-ngwalo.jpg" alt="Isamu Fred Ngwalo" />
<h3>Isamu Fred Ngwalo</h3>
<h4>Ph.D. Researcher, ICT Convergence, Soonchunhyang University, South Korea</h4>
<p>Isamu Fred Ngwalo is a researcher, software engineer, and STEM advocate specializing in Wireless AI, with applied expertise in Wi-Fi sensing, web-based applications, and advanced wireless technologies. He builds AI-driven wireless systems with generative capabilities for edge intelligence, real-time sensing, and seamless web integration. His interdisciplinary background in electrical engineering, electronics, and computer programming spans robotics engineering, wireless communication, and full-stack software development. As a digital fabricator and STEM consultant, he is committed to sustainable, socially impactful innovation and hands-on training. In this course, he focuses on rapid prototyping and translating deep learning concepts into working, real-world applications.</p>`;

async function main() {
  const data = {
    date: "6 \u2013 8 October 2026",
    location: "Online (virtual session)",
    certificate: "Certificate of Completion available",
    period: "October 2026",
    price: "130,000 Tsh",
    price_tzs: "130000",
    desc: "From complete beginner to confident practitioner in 3 days. Learn how deep learning actually works \u2014 neural networks, training, CNNs, and RNNs \u2014 with no prior AI, coding, or maths background required. Live online, 6\u20138 October 2026.",
    details: DETAILS,
    tutors: TUTORS,
  };

  const latest = await prisma.contentItem.findFirst({
    where: { collection: "COURSE" },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const item = await prisma.contentItem.upsert({
    where: { collection_slug: { collection: "COURSE", slug: SLUG } },
    update: { title: "Deep Learning Crash Course", published: true, data },
    create: {
      collection: "COURSE",
      slug: SLUG,
      title: "Deep Learning Crash Course",
      published: true,
      position: (latest?.position ?? -1) + 1,
      data,
    },
  });

  console.log(`Course ready: ${item.title} (${item.slug})`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
