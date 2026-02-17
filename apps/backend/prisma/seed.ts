import { PrismaClient, QuestionType, Difficulty } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ============================================
// Category and Question Seed Data
// ============================================

interface CategorySeed {
  name: string;
  description: string;
  iconUrl: string;
  color: string;
}

interface QuestionSeed {
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  timeLimit: number;
}

const categories: CategorySeed[] = [
  {
    name: "Science",
    description: "Test your knowledge of physics, chemistry, biology, and more",
    iconUrl: "science",
    color: "#10B981",
  },
  {
    name: "History",
    description: "Journey through time and test your historical knowledge",
    iconUrl: "history",
    color: "#F59E0B",
  },
  {
    name: "Geography",
    description: "Explore the world with geography questions",
    iconUrl: "geography",
    color: "#3B82F6",
  },
  {
    name: "Sports",
    description: "Challenge yourself with sports trivia",
    iconUrl: "sports",
    color: "#EF4444",
  },
  {
    name: "Music",
    description: "Test your knowledge of music and artists",
    iconUrl: "music",
    color: "#8B5CF6",
  },
  {
    name: "Movies",
    description: "How well do you know cinema?",
    iconUrl: "movies",
    color: "#EC4899",
  },
];

const questionsByCategory: Record<string, QuestionSeed[]> = {
  Science: [
    {
      content: "What is the chemical symbol for gold?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Go", "Au", "Ag", "Gd"],
      correctAnswer: "Au",
      explanation: "Au comes from the Latin word 'aurum' meaning gold.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "What planet is known as the Red Planet?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      explanation: "Mars appears red due to iron oxide (rust) on its surface.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Water boils at 100 degrees Celsius at sea level.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "At standard atmospheric pressure (sea level), water boils at 100C (212F).",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the largest organ in the human body?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Heart", "Liver", "Skin", "Brain"],
      correctAnswer: "Skin",
      explanation: "The skin is the largest organ, covering about 20 square feet in adults.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "What is the speed of light in vacuum (approximately)?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
      correctAnswer: "300,000 km/s",
      explanation:
        "The speed of light in vacuum is approximately 299,792 km/s, often rounded to 300,000 km/s.",
      points: 20,
      timeLimit: 30,
    },
    {
      content: "DNA stands for Deoxyribonucleic Acid.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "DNA (Deoxyribonucleic Acid) is the molecule that carries genetic information.",
      points: 15,
      timeLimit: 20,
    },
  ],
  History: [
    {
      content: "In which year did World War II end?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945",
      explanation:
        "World War II ended in 1945 with Germany surrendering in May and Japan in September.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Who was the first President of the United States?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      correctAnswer: "George Washington",
      explanation: "George Washington served as the first U.S. President from 1789 to 1797.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The Great Wall of China was built during a single dynasty.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "False",
      explanation:
        "The Great Wall was built over many centuries by multiple dynasties, starting from the 7th century BC.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which ancient civilization built the Machu Picchu?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Aztec", "Maya", "Inca", "Olmec"],
      correctAnswer: "Inca",
      explanation: "Machu Picchu was built by the Inca Empire in the 15th century.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "In what year did the Berlin Wall fall?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["1987", "1988", "1989", "1990"],
      correctAnswer: "1989",
      explanation: "The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Cleopatra was Greek, not Egyptian.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.HARD,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Cleopatra was a member of the Ptolemaic dynasty, which was of Macedonian Greek origin.",
      points: 20,
      timeLimit: 20,
    },
  ],
  Geography: [
    {
      content: "What is the largest country in the world by area?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Canada", "China", "United States", "Russia"],
      correctAnswer: "Russia",
      explanation: "Russia is the largest country, covering about 17.1 million square kilometers.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "What is the longest river in the world?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correctAnswer: "Nile",
      explanation: "The Nile River is approximately 6,650 km long, making it the longest river.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Australia is both a country and a continent.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Australia is unique as it is the only country that is also a continent.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the capital city of Canada?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
      correctAnswer: "Ottawa",
      explanation: "Ottawa, located in Ontario, has been the capital of Canada since 1857.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Which desert is the largest in the world?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
      correctAnswer: "Antarctic",
      explanation:
        "The Antarctic Desert is the largest, covering about 14 million square km. The Sahara is the largest hot desert.",
      points: 20,
      timeLimit: 30,
    },
    {
      content: "Mount Everest is located in Nepal.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Mount Everest sits on the border between Nepal and Tibet (China).",
      points: 10,
      timeLimit: 20,
    },
  ],
  Sports: [
    {
      content: "How many players are on a standard soccer team on the field?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["9", "10", "11", "12"],
      correctAnswer: "11",
      explanation: "A standard soccer team has 11 players on the field, including the goalkeeper.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "In which sport would you perform a slam dunk?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Volleyball", "Basketball", "Tennis", "Golf"],
      correctAnswer: "Basketball",
      explanation:
        "A slam dunk is a basketball move where a player jumps and scores by putting the ball directly through the hoop.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The Olympics are held every 4 years.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The Summer and Winter Olympics each occur every 4 years, alternating every 2 years.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which country has won the most FIFA World Cup titles?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Germany", "Italy", "Argentina", "Brazil"],
      correctAnswer: "Brazil",
      explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "What is the maximum score in a single frame of bowling?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["10", "20", "30", "50"],
      correctAnswer: "30",
      explanation:
        "A strike in the 10th frame with two more strikes gives the maximum of 30 points for that frame.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "A marathon is exactly 26.2 miles long.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "A marathon is 26.2 miles (42.195 kilometers), a distance standardized since 1921.",
      points: 15,
      timeLimit: 20,
    },
  ],
  Music: [
    {
      content: "Which band performed 'Bohemian Rhapsody'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
      correctAnswer: "Queen",
      explanation:
        "Bohemian Rhapsody was written by Freddie Mercury and released by Queen in 1975.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "How many strings does a standard guitar have?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["4", "5", "6", "8"],
      correctAnswer: "6",
      explanation: "A standard guitar has 6 strings, tuned E-A-D-G-B-E.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Beethoven was completely deaf when he composed his 9th Symphony.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Beethoven was almost completely deaf by the time he composed his famous 9th Symphony.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "What instrument does a pianist play?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Violin", "Guitar", "Piano", "Drums"],
      correctAnswer: "Piano",
      explanation: "A pianist is someone who plays the piano.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Which pop star is known as the 'King of Pop'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Elvis Presley", "Michael Jackson", "Prince", "Justin Timberlake"],
      correctAnswer: "Michael Jackson",
      explanation:
        "Michael Jackson earned the title 'King of Pop' due to his enormous influence on pop music and culture.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The violin is a member of the string family.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The violin is one of the four main instruments in the string family, along with viola, cello, and double bass.",
      points: 10,
      timeLimit: 20,
    },
  ],
  Movies: [
    {
      content: "Who directed the movie 'Titanic'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Martin Scorsese"],
      correctAnswer: "James Cameron",
      explanation: "James Cameron directed Titanic (1997), which won 11 Academy Awards.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "In which year was the first 'Star Wars' movie released?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["1975", "1977", "1979", "1980"],
      correctAnswer: "1977",
      explanation: "Star Wars (later titled Episode IV: A New Hope) was released on May 25, 1977.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "The Lord of the Rings trilogy was directed by Peter Jackson.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Peter Jackson directed all three Lord of the Rings films (2001-2003).",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the name of the fictional African country in 'Black Panther'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Zamunda", "Wakanda", "Genovia", "Latveria"],
      correctAnswer: "Wakanda",
      explanation: "Wakanda is the fictional African nation in Marvel's Black Panther franchise.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Which movie won the first Academy Award for Best Picture?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["The Jazz Singer", "Wings", "Sunrise", "The Broadway Melody"],
      correctAnswer: "Wings",
      explanation:
        "Wings (1927) won the first Academy Award for Best Picture at the 1st Academy Awards in 1929.",
      points: 20,
      timeLimit: 30,
    },
    {
      content: "The Godfather was released in 1972.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The Godfather, directed by Francis Ford Coppola, was released on March 24, 1972.",
      points: 15,
      timeLimit: 20,
    },
  ],
};

// ============================================
// Seed Functions
// ============================================

async function seedUsers() {
  console.warn("Seeding users...");

  // Create test user
  const hashedPassword = await bcrypt.hash("Test123!", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      username: "testuser",
      displayName: "Test User",
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  console.warn("Created test user:", testUser.email);

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@quizapp.com" },
    update: {},
    create: {
      email: "admin@quizapp.com",
      username: "admin",
      displayName: "Admin User",
      password: adminPassword,
      isEmailVerified: true,
    },
  });

  console.warn("Created admin user:", adminUser.email);
}

async function seedQuizData() {
  console.warn("Seeding quiz data...");

  // Clear existing quiz data (in correct order due to foreign keys)
  console.warn("Clearing existing quiz data...");
  await prisma.userAnswer.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and their questions
  console.warn("Creating categories and questions...");

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        iconUrl: categoryData.iconUrl,
        color: categoryData.color,
        isActive: true,
        questionCount: 0,
      },
    });

    console.warn(`  Created category: ${category.name}`);

    // Create questions for this category
    const questions = questionsByCategory[categoryData.name] || [];
    let questionCount = 0;

    for (const questionData of questions) {
      await prisma.question.create({
        data: {
          categoryId: category.id,
          content: questionData.content,
          type: questionData.type,
          difficulty: questionData.difficulty,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          points: questionData.points,
          timeLimit: questionData.timeLimit,
          isActive: true,
        },
      });
      questionCount++;
    }

    // Update question count for the category
    await prisma.category.update({
      where: { id: category.id },
      data: { questionCount },
    });

    console.warn(`    Added ${questionCount} questions`);
  }
}

// ============================================
// Main Seed Function
// ============================================

async function main() {
  console.warn("Starting database seed...\n");

  await seedUsers();
  console.warn("");
  await seedQuizData();

  console.warn("\nDatabase seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
