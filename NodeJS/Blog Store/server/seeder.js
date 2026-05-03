const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Blog = require('./models/Blog');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional, but requested to add 25 blogs)
    // await Blog.deleteMany();
    // await User.deleteMany();

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    let admin = await User.findOne({ email: 'admin@blogstore.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@blogstore.com',
        password: hashedPassword,
        role: 'Administrator'
      });
      console.log('Admin user created');
    }

    const blogs = [
      // Coding
      {
        title: "How I Rebuilt My Workflow with AI",
        category: "Coding",
        coverImage: "coding_cover_1777824050267.png",
        content: "Tired of the endless loop of boilerplate code and repetitive tasks? I stopped treating AI as a buzzword and started using it as a partner. Here’s exactly how I integrated specific AI tools into my daily coding routine to cut development time in half without sacrificing quality. From automated unit testing to real-time code refactoring, the landscape is changing fast.",
        author: admin._id
      },
      {
        title: "The Rise of Rust: Why C++ Developers are Switching",
        category: "Coding",
        coverImage: "coding_cover_1777824050267.png",
        content: "Rust has been voted the most loved programming language for several years. Its memory safety features without a garbage collector make it a formidable rival to C++. In this post, we explore the 'borrow checker' and how it prevents common bugs that plague large-scale systems.",
        author: admin._id
      },
      {
        title: "Mastering React Server Components",
        category: "Coding",
        coverImage: "coding_cover_1777824050267.png",
        content: "React Server Components are a paradigm shift in how we build web applications. By moving the rendering logic to the server, we can reduce bundle sizes and improve performance significantly. Let's dive into the differences between Client and Server components.",
        author: admin._id
      },
      {
        title: "TypeScript 5.0: New Features You Should Use",
        category: "Coding",
        coverImage: "coding_cover_1777824050267.png",
        content: "TypeScript continues to evolve, making our codebases safer and more maintainable. Version 5.0 brings decorators, const type parameters, and multiple extended configurations. We break down which features will have the biggest impact on your workflow.",
        author: admin._id
      },
      // AI
      {
        title: "The Ethics of AI Nobody Wants to Talk About",
        category: "AI",
        coverImage: "ai_cover_1777824069295.png",
        content: "As AI-assisted coding becomes the industry standard, we need to address the uncomfortable truths regarding bias, job displacement, and code ownership. Let’s move beyond the hype and look at the real challenges developers face in this new landscape of generative models.",
        author: admin._id
      },
      {
        title: "Large Language Models: Beyond ChatGPT",
        category: "AI",
        coverImage: "ai_cover_1777824069295.png",
        content: "While ChatGPT stole the spotlight, the world of LLMs is vast. From specialized medical models to lightweight on-device AI, we look at how different architectures are solving specific industry problems that general-purpose bots can't handle.",
        author: admin._id
      },
      {
        title: "The Future of Computer Vision",
        category: "AI",
        coverImage: "ai_cover_1777824069295.png",
        content: "Computer vision is no longer just about identifying cats in photos. It's powering self-driving cars, real-time medical diagnosis, and automated manufacturing. We discuss the transition from CNNs to Vision Transformers (ViTs).",
        author: admin._id
      },
      {
        title: "Generative AI in Creative Industries",
        category: "AI",
        coverImage: "ai_cover_1777824069295.png",
        content: "Is AI replacing artists, or is it the new paintbrush? We talk to creators using Midjourney and DALL-E to streamline their concept art process and how they're navigating the complex world of intellectual property in the age of AI.",
        author: admin._id
      },
      // Psychology
      {
        title: "Digital Burnout is Real: Reclaiming Focus",
        category: "Psychology",
        coverImage: "psychology_cover_1777824087737.png",
        content: "It’s not just you—the constant barrage of notifications is physically altering how we focus. We’re diving into the simple neuroscience behind digital fatigue and exploring actionable, science-backed rituals to help you reclaim your deep work time and mental clarity.",
        author: admin._id
      },
      {
        title: "Decoding the Science of Laughter",
        category: "Psychology",
        coverImage: "psychology_cover_1777824087737.png",
        content: "Laughter is a universal language, but what’s actually happening in our brains when we experience humor? From evolutionary theories to modern cognitive studies, we break down why comedy is essential for human resilience and mental health.",
        author: admin._id
      },
      {
        title: "The Psychology of Habits: Atomic Changes",
        category: "Psychology",
        coverImage: "psychology_cover_1777824087737.png",
        content: "Why is it so hard to start a new habit but so easy to keep a bad one? We explore the 'Cue-Craving-Response-Reward' loop and how small, incremental changes can lead to massive long-term transformations in your behavior.",
        author: admin._id
      },
      // Gaming
      {
        title: "The Joy of Retro Gaming: 8-Bit Comeback",
        category: "Gaming",
        coverImage: "gaming_cover_1777824106547.png",
        content: "In an era of hyper-realistic graphics and microtransactions, why are millions of players returning to the 8-bit and 16-bit classics? We explore the 'comfort factor' and why retro titles offer a sense of control and simplicity that modern games often lack.",
        author: admin._id
      },
      {
        title: "The Evolution of E-Sports: More Than a Game",
        category: "Gaming",
        coverImage: "gaming_cover_1777824106547.png",
        content: "E-sports has grown from LAN parties to filling stadiums. We look at the infrastructure behind professional gaming, the intense training regimens of pro players, and how traditional sports teams are investing in the virtual arena.",
        author: admin._id
      },
      {
        title: "Indie Games: The Heart of Innovation",
        category: "Gaming",
        coverImage: "gaming_cover_1777824106547.png",
        content: "While AAA studios play it safe with sequels, indie developers are taking the risks. We highlight five upcoming indie titles that are pushing the boundaries of storytelling and gameplay mechanics in 2026.",
        author: admin._id
      },
      // Food
      {
        title: "Future Food: Lab-Grown Proteins by 2030",
        category: "Food",
        coverImage: "food_cover_1777824125817.png",
        content: "From the reality of lab-grown proteins to AI-optimized meal planning, the way we eat is changing rapidly. We separate the fad-driven hype from the practical, climate-resilient foods that will define the next decade of our diets.",
        author: admin._id
      },
      {
        title: "The World of Fermented Foods",
        category: "Food",
        coverImage: "food_cover_1777824125817.png",
        content: "Fermentation is more than a trendy culinary technique; it's an ancient survival skill with massive modern health benefits. Learn how to master simple, gut-healthy ferments like Kimchi and Kombucha at home with these beginner-friendly guides.",
        author: admin._id
      },
      {
        title: "Street Food: A Global Culinary Journey",
        category: "Food",
        coverImage: "food_cover_1777824125817.png",
        content: "The best meals aren't always in five-star restaurants. Join us as we explore the bustling street markets of Bangkok, Mexico City, and Mumbai, uncovering the secret recipes that have been passed down through generations.",
        author: admin._id
      },
      // History
      {
        title: "Unique Museums You Must Visit",
        category: "History",
        coverImage: "history_cover_1777824145733.png",
        content: "Forget the crowded galleries you already know. We’re taking a deep dive into the world’s most eccentric museums—from shrines to forgotten inventions to collections of truly bizarre oddities. These are the hidden gems every history buff needs to visit.",
        author: admin._id
      },
      {
        title: "Lessons from History’s Lost Cities",
        category: "History",
        coverImage: "history_cover_1777824145733.png",
        content: "Behind every abandoned ruin lies a cautionary tale of innovation and eventual collapse. By examining the rise and fall of ancient civilizations like the Maya and the Indus Valley, we can uncover striking parallels to modern challenges.",
        author: admin._id
      },
      {
        title: "The Silk Road: Connecting the Ancient World",
        category: "History",
        coverImage: "history_cover_1777824145733.png",
        content: "The Silk Road was more than just a trade route for luxury goods; it was a highway for ideas, religions, and technologies. We explore how this network shaped the cultural landscape of Eurasia for centuries.",
        author: admin._id
      },
      // Historical Places
      {
        title: "Petra: The Rose City of the Nabataeans",
        category: "Historical Places",
        coverImage: "historical_places_cover_1777824164129.png",
        content: "Carved directly into vibrant red sandstone cliffs, Petra remains one of the world's most stunning archaeological sites. We look at the engineering marvels that allowed this desert city to flourish over 2,000 years ago.",
        author: admin._id
      },
      {
        title: "The Great Wall: Myths vs. Reality",
        category: "Historical Places",
        coverImage: "historical_places_cover_1777824164129.png",
        content: "Can you really see it from space? Why was it built in so many disconnected sections? We debunk common myths about China's Great Wall and explore its true historical significance as a defense system and cultural symbol.",
        author: admin._id
      },
      {
        title: "Machu Picchu: Incan Citadel in the Clouds",
        category: "Historical Places",
        coverImage: "historical_places_cover_1777824164129.png",
        content: "Perched high in the Andes, Machu Picchu continues to baffle historians. We discuss the latest theories on why the Incas built this spectacular city and how they managed to transport massive stones up steep mountain slopes.",
        author: admin._id
      },
      // Ghost
      {
        title: "Folklore or Fact? Origins of Ghost Stories",
        category: "Ghost",
        coverImage: "ghost_cover_1777824182587.png",
        content: "Every ghost story starts with a grain of truth. We track the historical origins and local legends behind the world's most enduring hauntings to uncover the stories that people were truly afraid of—and why those fears have persisted for centuries.",
        author: admin._id
      },
      {
        title: "Psychology of the Supernatural: Love to be Scared",
        category: "Ghost",
        coverImage: "ghost_cover_1777824182587.png",
        content: "Why do we pay to be terrified? We explore the fascinating intersection between folklore, cultural history, and the psychological 'thrill' of the unknown. Discover why human beings have an innate desire to seek out the things that go bump in the night.",
        author: admin._id
      }
    ];

    await Blog.insertMany(blogs);
    console.log('25 Blogs seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
