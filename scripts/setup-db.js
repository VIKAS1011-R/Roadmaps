const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/java-roadmap';
  console.log('🔗 Using MongoDB URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('java-roadmap');
    
    // Create users collection with indexes
    const usersCollection = db.collection('users');
    
    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on email field');
    
    // Create index on createdAt for performance
    await usersCollection.createIndex({ createdAt: 1 });
    console.log('✅ Created index on createdAt field');
    
    // Create programming languages collection with indexes
    const languagesCollection = db.collection('programming_languages');
    
    // Create unique index on slug
    await languagesCollection.createIndex({ slug: 1 }, { unique: true });
    console.log('✅ Created unique index on slug field for programming languages');
    
    // Create index on createdAt for performance
    await languagesCollection.createIndex({ createdAt: 1 });
    console.log('✅ Created index on createdAt field for programming languages');
    
    // Check if Java language already exists
    const existingJava = await languagesCollection.findOne({ slug: 'java' });
    
    if (!existingJava) {
      console.log('📝 Creating default Java roadmap...');
      // Insert default Java roadmap
      const javaRoadmap = {
        name: 'Java',
        slug: 'java',
        description: 'Master Java development with this comprehensive learning roadmap covering fundamentals to advanced enterprise development.',
        phases: [
          {
            phase: "Phase 1: Getting Started",
            topics: [
              {id: 1, name: "Start with JDK & IDE", description: "Install Java Development Kit and an Integrated Development Environment"},
              {id: 2, name: "Learn Java Fundamentals", description: "Basic syntax, program structure, and core concepts"},
              {id: 3, name: "Version Control (Git & GitHub)", description: "Learn version control systems for code management"},
              {id: 4, name: "Practice Code Daily", description: "Establish a consistent coding practice routine"}
            ]
          },
          {
            phase: "Phase 2: Core Java Basics",
            topics: [
              {id: 5, name: "Variables, Data Types, Operators", description: "Primitive data types, variables declaration, and operators"},
              {id: 6, name: "Control Flow & Switch, Loops", description: "if-else, switch statements, for/while loops"},
              {id: 7, name: "Arrays & Strings", description: "Array manipulation and String handling"},
              {id: 8, name: "Object-Oriented Programming", description: "OOP principles and concepts"},
              {id: 9, name: "Classes & Objects", description: "Class definition, object creation, and methods"},
              {id: 10, name: "Data Structures & Algorithms", description: "Basic data structures and algorithmic thinking"},
              {id: 11, name: "Inheritance & Polymorphism", description: "Inheritance relationships and polymorphic behavior"},
              {id: 12, name: "Encapsulation & Abstraction", description: "Data hiding and abstract concepts"}
            ]
          },
          {
            phase: "Phase 3: Advanced Core Java",
            topics: [
              {id: 13, name: "Core Java APIs", description: "Essential Java libraries and APIs"},
              {id: 14, name: "Collections Framework", description: "Lists, Sets, Maps and collection utilities"},
              {id: 15, name: "Exception Handling", description: "Try-catch blocks, custom exceptions, and error handling"},
              {id: 16, name: "I/O Streams", description: "File I/O, streams, and data persistence"},
              {id: 17, name: "Multithreading", description: "Thread creation, synchronization, and concurrent programming"},
              {id: 18, name: "Master Concurrency", description: "Advanced concurrency concepts and patterns"},
              {id: 19, name: "Threads & Synchronization", description: "Thread safety and synchronization mechanisms"},
              {id: 20, name: "Executors & Futures", description: "Thread pools and asynchronous programming"}
            ]
          },
          {
            phase: "Phase 4: Java 8+ Features",
            topics: [
              {id: 21, name: "Advanced Java", description: "Advanced Java concepts and best practices"},
              {id: 22, name: "Lambda & Streams (Java 8+)", description: "Functional programming with lambdas and streams"},
              {id: 23, name: "Modern JDK & IDEs", description: "IntelliJ, Eclipse, VSCode, and modern Java features"},
              {id: 24, name: "Keep Learning & Join Community", description: "Continuous learning and community engagement"}
            ]
          },
          {
            phase: "Phase 5: Database & Web Development",
            topics: [
              {id: 25, name: "JDBC & Database Connectivity", description: "Database connections and SQL operations"},
              {id: 26, name: "Web Development", description: "Web application development concepts"},
              {id: 27, name: "Servlets & JSP", description: "Server-side Java web technologies"},
              {id: 28, name: "Spring Framework & Boot", description: "Spring ecosystem for enterprise applications"},
              {id: 29, name: "REST APIs & Microservices", description: "RESTful services and microservice architecture"},
              {id: 30, name: "Security - JWT, OAuth", description: "Web application security and authentication"}
            ]
          },
          {
            phase: "Phase 6: Build Tools & Testing",
            topics: [
              {id: 31, name: "Maven", description: "Maven build tool and dependency management"},
              {id: 32, name: "Gradle", description: "Gradle build automation"},
              {id: 33, name: "Build Tools", description: "General build and deployment tools"},
              {id: 34, name: "Testing", description: "Unit testing and test-driven development"},
              {id: 35, name: "Mockito", description: "Mocking framework for unit tests"},
              {id: 36, name: "DevOps & Deployment", description: "Deployment strategies and DevOps practices"}
            ]
          },
          {
            phase: "Phase 7: Advanced Topics & Tools",
            topics: [
              {id: 37, name: "Docker", description: "Containerization with Docker"},
              {id: 38, name: "Kubernetes", description: "Container orchestration and deployment"},
              {id: 39, name: "CI/CD - Jenkins, GitHub Actions", description: "Continuous integration and deployment pipelines"},
              {id: 40, name: "Cloud Platforms - AWS, Azure, GCP", description: "Cloud services and deployment"}
            ]
          }
        ],
        totalTopics: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null // System created
      };
      
      const result = await languagesCollection.insertOne(javaRoadmap);
      console.log('✅ Created default Java programming language with ID:', result.insertedId);
    } else {
      console.log('ℹ️  Java programming language already exists with ID:', existingJava._id);
    }
    
    console.log('🎉 Database setup complete!');
    console.log('📊 Collections created:');
    console.log('  - users (with email unique index)');
    console.log('  - programming_languages (with slug unique index)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupDatabase();