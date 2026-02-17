import { PrismaClient, QuestionType, Difficulty, QuizSessionStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================
// Helper Functions
// ============================================

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInPast(days: number): Date {
  const now = Date.now();
  const pastMs = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(now - pastMs);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
    // Chemistry
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
      content: "What is the atomic number of Carbon?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["4", "6", "8", "12"],
      correctAnswer: "6",
      explanation: "Carbon has 6 protons in its nucleus, giving it an atomic number of 6.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Water is composed of hydrogen and oxygen.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Water (H2O) is made up of 2 hydrogen atoms and 1 oxygen atom.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the chemical formula for table salt?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
      correctAnswer: "NaCl",
      explanation: "Table salt is sodium chloride (NaCl), a compound of sodium and chlorine.",
      points: 15,
      timeLimit: 30,
    },
    // Physics
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
      content: "What is the unit of electrical resistance?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctAnswer: "Ohm",
      explanation: "The ohm (symbol: O) is the SI unit of electrical resistance.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Light travels faster than sound.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Light travels at about 300,000 km/s while sound travels at about 343 m/s in air.",
      points: 10,
      timeLimit: 20,
    },
    // Biology
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
      content: "DNA stands for Deoxyribonucleic Acid.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "DNA (Deoxyribonucleic Acid) is the molecule that carries genetic information.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "How many chromosomes do humans have?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["23", "46", "48", "44"],
      correctAnswer: "46",
      explanation: "Humans have 46 chromosomes arranged in 23 pairs.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "What is the powerhouse of the cell?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
      correctAnswer: "Mitochondria",
      explanation: "Mitochondria generate most of the cell's supply of ATP, used as energy.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Humans have four chambers in their heart.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The human heart has four chambers: left and right atria, and left and right ventricles.",
      points: 10,
      timeLimit: 20,
    },
    // Astronomy
    {
      content: "How many planets are in our solar system?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["7", "8", "9", "10"],
      correctAnswer: "8",
      explanation:
        "There are 8 planets in our solar system. Pluto was reclassified as a dwarf planet in 2006.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The Sun is a star.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The Sun is a G-type main-sequence star (G2V), commonly known as a yellow dwarf.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the largest planet in our solar system?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
      correctAnswer: "Jupiter",
      explanation: "Jupiter is the largest planet, with a mass more than 300 times that of Earth.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "What galaxy do we live in?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Andromeda", "Milky Way", "Triangulum", "Messier 87"],
      correctAnswer: "Milky Way",
      explanation: "Our solar system is located in the Milky Way galaxy.",
      points: 15,
      timeLimit: 30,
    },
    // Technology
    {
      content: "What does CPU stand for?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Core Processing Unit",
      ],
      correctAnswer: "Central Processing Unit",
      explanation: "CPU stands for Central Processing Unit, the primary processor of a computer.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The internet and the World Wide Web are the same thing.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.HARD,
      options: ["True", "False"],
      correctAnswer: "False",
      explanation:
        "The internet is the global network infrastructure, while the Web is a service that runs on it.",
      points: 20,
      timeLimit: 20,
    },
  ],
  History: [
    // Ancient History
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
    {
      content: "Who was the first emperor of Rome?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"],
      correctAnswer: "Augustus",
      explanation: "Augustus (Octavian) became the first Roman Emperor in 27 BC.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "The pyramids of Giza were built as tombs for pharaohs.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The Great Pyramids were built as royal tombs for Egyptian pharaohs.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which ancient wonder was located in Alexandria, Egypt?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: [
        "Colossus of Rhodes",
        "Lighthouse of Alexandria",
        "Hanging Gardens",
        "Temple of Artemis",
      ],
      correctAnswer: "Lighthouse of Alexandria",
      explanation:
        "The Lighthouse of Alexandria (Pharos) was one of the Seven Wonders of the Ancient World.",
      points: 20,
      timeLimit: 30,
    },
    // Medieval History
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
      content: "What was the name of the medieval trade route connecting East and West?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Spice Route", "Silk Road", "Gold Path", "Trade Highway"],
      correctAnswer: "Silk Road",
      explanation:
        "The Silk Road was a network of trade routes connecting China with the Mediterranean.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "In which year did the Black Death reach Europe?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["1247", "1348", "1448", "1548"],
      correctAnswer: "1348",
      explanation:
        "The Black Death arrived in Europe in 1348, killing an estimated 30-60% of the population.",
      points: 20,
      timeLimit: 30,
    },
    // Modern History
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
      content: "The French Revolution began in 1789.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The French Revolution began on July 14, 1789 with the storming of the Bastille.",
      points: 15,
      timeLimit: 20,
    },
    // Wars
    {
      content: "Which war was fought between the North and South United States?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Revolutionary War", "Civil War", "War of 1812", "Mexican-American War"],
      correctAnswer: "Civil War",
      explanation:
        "The American Civil War (1861-1865) was fought between the Union (North) and Confederacy (South).",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "World War I started in 1914.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "World War I began on July 28, 1914 and ended on November 11, 1918.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which country was NOT part of the Allied Powers in World War II?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["United Kingdom", "Soviet Union", "Italy", "United States"],
      correctAnswer: "Italy",
      explanation:
        "Italy was initially part of the Axis Powers with Germany and Japan before switching sides in 1943.",
      points: 15,
      timeLimit: 30,
    },
    // Famous People
    {
      content: "Who discovered penicillin?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Louis Pasteur", "Alexander Fleming", "Jonas Salk", "Robert Koch"],
      correctAnswer: "Alexander Fleming",
      explanation: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Leonardo da Vinci painted the Mona Lisa.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Who wrote 'The Communist Manifesto'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: [
        "Vladimir Lenin",
        "Karl Marx and Friedrich Engels",
        "Joseph Stalin",
        "Leon Trotsky",
      ],
      correctAnswer: "Karl Marx and Friedrich Engels",
      explanation: "The Communist Manifesto was written by Karl Marx and Friedrich Engels in 1848.",
      points: 20,
      timeLimit: 30,
    },
    {
      content: "Napoleon Bonaparte was born in France.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.HARD,
      options: ["True", "False"],
      correctAnswer: "False",
      explanation:
        "Napoleon was born in Corsica, which became French territory just one year before his birth.",
      points: 20,
      timeLimit: 20,
    },
    {
      content: "Who was known as the 'Iron Lady'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Angela Merkel", "Margaret Thatcher", "Indira Gandhi", "Golda Meir"],
      correctAnswer: "Margaret Thatcher",
      explanation:
        "Margaret Thatcher, UK Prime Minister from 1979-1990, was nicknamed the 'Iron Lady'.",
      points: 15,
      timeLimit: 30,
    },
  ],
  Geography: [
    // Countries
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
      content: "Which is the smallest country in the world?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correctAnswer: "Vatican City",
      explanation: "Vatican City is the smallest country at just 0.44 square kilometers.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Brazil is the largest country in South America.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Brazil covers about 47% of South America's land area.",
      points: 10,
      timeLimit: 20,
    },
    // Capitals
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
      content: "What is the capital of Australia?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: "Canberra",
      explanation: "Canberra is the capital of Australia, purpose-built to be the capital.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Tokyo is the capital of Japan.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Tokyo became the capital of Japan in 1868 when the Emperor moved there.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the capital of Brazil?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Rio de Janeiro", "Sao Paulo", "Brasilia", "Salvador"],
      correctAnswer: "Brasilia",
      explanation: "Brasilia became the capital in 1960, replacing Rio de Janeiro.",
      points: 20,
      timeLimit: 30,
    },
    // Landmarks
    {
      content: "In which country is the Eiffel Tower located?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Italy", "Germany", "France", "Spain"],
      correctAnswer: "France",
      explanation: "The Eiffel Tower is located in Paris, France, built in 1889.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The Statue of Liberty was a gift from France.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "France gifted the Statue of Liberty to the United States in 1886.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Where is the Taj Mahal located?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Pakistan", "Bangladesh", "India", "Nepal"],
      correctAnswer: "India",
      explanation: "The Taj Mahal is located in Agra, India, built between 1632-1653.",
      points: 10,
      timeLimit: 30,
    },
    // Rivers
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
      content: "The Amazon River flows through Brazil.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The Amazon flows through Brazil and several other South American countries.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which river flows through London?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Seine", "Rhine", "Thames", "Danube"],
      correctAnswer: "Thames",
      explanation: "The River Thames flows through London and is 346 km long.",
      points: 10,
      timeLimit: 30,
    },
    // Mountains
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
    {
      content: "What is the highest mountain in Africa?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Mount Kenya", "Mount Kilimanjaro", "Atlas Mountains", "Drakensberg"],
      correctAnswer: "Mount Kilimanjaro",
      explanation: "Mount Kilimanjaro in Tanzania is 5,895 meters tall, the highest in Africa.",
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
      content: "The Alps mountain range is located in Europe.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "The Alps stretch across 8 European countries including Switzerland, France, and Austria.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "What is the largest ocean on Earth?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      correctAnswer: "Pacific",
      explanation:
        "The Pacific Ocean covers about 63 million square miles, larger than all land combined.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "How many continents are there on Earth?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
      explanation:
        "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
      points: 10,
      timeLimit: 30,
    },
  ],
  Sports: [
    // Football/Soccer
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
      content: "A red card in soccer means expulsion from the game.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "A red card results in immediate expulsion from the match.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Who won the 2022 FIFA World Cup?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["France", "Brazil", "Argentina", "Germany"],
      correctAnswer: "Argentina",
      explanation: "Argentina won the 2022 World Cup in Qatar, defeating France in the final.",
      points: 10,
      timeLimit: 30,
    },
    // Basketball
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
      content: "How many players are on a basketball team on the court?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      explanation: "Each basketball team has 5 players on the court at a time.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "A three-point shot in basketball is worth 3 points.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Shots made from beyond the three-point line are worth 3 points.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which NBA player is known as 'The King'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Michael Jordan", "Kobe Bryant", "LeBron James", "Stephen Curry"],
      correctAnswer: "LeBron James",
      explanation: "LeBron James is nicknamed 'King James' or 'The King'.",
      points: 15,
      timeLimit: 30,
    },
    // Olympics
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
      content: "In which city were the first modern Olympic Games held?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Paris", "Athens", "Rome", "London"],
      correctAnswer: "Athens",
      explanation: "The first modern Olympic Games were held in Athens, Greece in 1896.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Which country has won the most Olympic gold medals in history?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["China", "Russia", "United States", "Great Britain"],
      correctAnswer: "United States",
      explanation: "The United States has won more Olympic gold medals than any other country.",
      points: 15,
      timeLimit: 30,
    },
    // Athletes
    {
      content: "Who is considered the fastest man in history?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Carl Lewis", "Usain Bolt", "Tyson Gay", "Justin Gatlin"],
      correctAnswer: "Usain Bolt",
      explanation: "Usain Bolt holds the world record for 100m (9.58s) and 200m (19.19s).",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Michael Phelps is the most decorated Olympian of all time.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Michael Phelps has won 28 Olympic medals, including 23 gold medals.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which tennis player has won the most Grand Slam titles (men's singles)?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"],
      correctAnswer: "Novak Djokovic",
      explanation: "Novak Djokovic holds the record for most Grand Slam men's singles titles.",
      points: 20,
      timeLimit: 30,
    },
    // Records
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
      content: "A perfect score in bowling is 300.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "A perfect game in bowling consists of 12 consecutive strikes for a score of 300.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "In golf, what is the term for one stroke under par?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Bogey", "Eagle", "Birdie", "Albatross"],
      correctAnswer: "Birdie",
      explanation: "A birdie is one stroke under par on a hole.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Which sport uses the terms 'love', 'deuce', and 'advantage'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Badminton", "Tennis", "Squash", "Table Tennis"],
      correctAnswer: "Tennis",
      explanation: "These terms are used in tennis scoring.",
      points: 10,
      timeLimit: 30,
    },
  ],
  Music: [
    // Artists
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
      content: "Elvis Presley was known as the 'King of Rock and Roll'.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Elvis Presley is widely regarded as the 'King of Rock and Roll'.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which artist released the album 'Thriller'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Prince", "Michael Jackson", "Madonna", "Whitney Houston"],
      correctAnswer: "Michael Jackson",
      explanation: "Thriller (1982) is the best-selling album of all time.",
      points: 10,
      timeLimit: 30,
    },
    // Songs
    {
      content: "Who wrote the song 'Imagine'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Paul McCartney", "John Lennon", "George Harrison", "Ringo Starr"],
      correctAnswer: "John Lennon",
      explanation: "John Lennon wrote and recorded 'Imagine' in 1971.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "'Stairway to Heaven' was performed by Led Zeppelin.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Led Zeppelin released 'Stairway to Heaven' in 1971 on their album Led Zeppelin IV.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which song begins with 'Is this the real life? Is this just fantasy?'",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Hotel California", "Bohemian Rhapsody", "Stairway to Heaven", "Free Bird"],
      correctAnswer: "Bohemian Rhapsody",
      explanation: "These are the opening lyrics of Queen's 'Bohemian Rhapsody'.",
      points: 10,
      timeLimit: 30,
    },
    // Instruments
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
      content: "How many keys are on a standard piano?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["76", "88", "96", "104"],
      correctAnswer: "88",
      explanation: "A standard piano has 88 keys: 52 white and 36 black.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "The saxophone is a woodwind instrument.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.HARD,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Despite being made of brass, the saxophone is classified as a woodwind because it uses a reed.",
      points: 20,
      timeLimit: 20,
    },
    // Genres
    {
      content: "Which genre of music originated in Jamaica?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Blues", "Jazz", "Reggae", "Salsa"],
      correctAnswer: "Reggae",
      explanation: "Reggae originated in Jamaica in the late 1960s.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Hip hop originated in New York City.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Hip hop originated in the Bronx, New York City in the 1970s.",
      points: 15,
      timeLimit: 20,
    },
    // History
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
      content: "In which decade did The Beatles break up?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["1960s", "1970s", "1980s", "1990s"],
      correctAnswer: "1970s",
      explanation: "The Beatles officially broke up in 1970.",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Mozart was born in Austria.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Wolfgang Amadeus Mozart was born in Salzburg, Austria in 1756.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which composer wrote 'The Four Seasons'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
      correctAnswer: "Vivaldi",
      explanation: "Antonio Vivaldi composed 'The Four Seasons' in 1723.",
      points: 20,
      timeLimit: 30,
    },
    {
      content: "What is the Italian term for 'very loud' in music?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Piano", "Forte", "Fortissimo", "Mezzo"],
      correctAnswer: "Fortissimo",
      explanation: "Fortissimo (ff) means 'very loud' in musical notation.",
      points: 20,
      timeLimit: 30,
    },
  ],
  Movies: [
    // Directors
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
      content: "Who directed 'Inception' and 'The Dark Knight'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.MEDIUM,
      options: ["Christopher Nolan", "Denis Villeneuve", "David Fincher", "Ridley Scott"],
      correctAnswer: "Christopher Nolan",
      explanation: "Christopher Nolan directed both Inception (2010) and The Dark Knight (2008).",
      points: 15,
      timeLimit: 30,
    },
    {
      content: "Steven Spielberg directed Jaws.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Steven Spielberg directed Jaws in 1975, his breakout film.",
      points: 10,
      timeLimit: 20,
    },
    // Actors
    {
      content: "Who played Jack in the movie 'Titanic'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Brad Pitt", "Leonardo DiCaprio", "Tom Hanks", "Johnny Depp"],
      correctAnswer: "Leonardo DiCaprio",
      explanation: "Leonardo DiCaprio played Jack Dawson in Titanic (1997).",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "Tom Hanks played Forrest Gump.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Tom Hanks won an Oscar for his portrayal of Forrest Gump in 1994.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Who played the Joker in 'The Dark Knight'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Jack Nicholson", "Heath Ledger", "Joaquin Phoenix", "Jared Leto"],
      correctAnswer: "Heath Ledger",
      explanation: "Heath Ledger won a posthumous Oscar for his portrayal of the Joker.",
      points: 10,
      timeLimit: 30,
    },
    // Awards
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
      content: "The Godfather won the Academy Award for Best Picture.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The Godfather won Best Picture at the 45th Academy Awards in 1973.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which film won the most Academy Awards?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: [
        "Titanic",
        "Ben-Hur",
        "The Lord of the Rings: The Return of the King",
        "All three tied",
      ],
      correctAnswer: "All three tied",
      explanation: "Ben-Hur, Titanic, and Return of the King each won 11 Academy Awards.",
      points: 20,
      timeLimit: 30,
    },
    // Quotes
    {
      content: "Which movie features the line 'I'll be back'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["RoboCop", "The Terminator", "Predator", "Total Recall"],
      correctAnswer: "The Terminator",
      explanation: "Arnold Schwarzenegger said this iconic line in The Terminator (1984).",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "'May the Force be with you' is from Star Wars.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.EASY,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "This is one of the most famous quotes from the Star Wars franchise.",
      points: 10,
      timeLimit: 20,
    },
    {
      content: "Which movie has the quote 'Here's looking at you, kid'?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.HARD,
      options: ["Gone with the Wind", "Casablanca", "The Maltese Falcon", "Citizen Kane"],
      correctAnswer: "Casablanca",
      explanation: "Humphrey Bogart says this line to Ingrid Bergman in Casablanca (1942).",
      points: 20,
      timeLimit: 30,
    },
    // Franchises
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
      content: "How many Harry Potter movies are there?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: "There are 8 Harry Potter films, with the final book split into two parts.",
      points: 10,
      timeLimit: 30,
    },
    {
      content: "The Marvel Cinematic Universe started with Iron Man.",
      type: QuestionType.TRUE_FALSE,
      difficulty: Difficulty.MEDIUM,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Iron Man (2008) was the first film in the Marvel Cinematic Universe.",
      points: 15,
      timeLimit: 20,
    },
    {
      content: "Which movie franchise features Dominic Toretto?",
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      options: ["Mission Impossible", "Fast & Furious", "Transporter", "Need for Speed"],
      correctAnswer: "Fast & Furious",
      explanation: "Vin Diesel plays Dominic Toretto in the Fast & Furious franchise.",
      points: 10,
      timeLimit: 30,
    },
  ],
};

// Test users data
interface TestUserSeed {
  email: string;
  username: string;
  displayName: string;
}

const testUsers: TestUserSeed[] = [
  { email: "player1@test.com", username: "player1", displayName: "Top Player" },
  { email: "player2@test.com", username: "player2", displayName: "Quiz Master" },
  { email: "player3@test.com", username: "player3", displayName: "Trivia King" },
  { email: "player4@test.com", username: "player4", displayName: "Brain Wizard" },
  { email: "player5@test.com", username: "player5", displayName: "Knowledge Seeker" },
  { email: "player6@test.com", username: "player6", displayName: "Quiz Champion" },
  { email: "player7@test.com", username: "player7", displayName: "Smarty Pants" },
  { email: "player8@test.com", username: "player8", displayName: "Quick Thinker" },
  { email: "player9@test.com", username: "player9", displayName: "Study Buddy" },
  { email: "player10@test.com", username: "player10", displayName: "Quiz Novice" },
];

// ============================================
// Seed Functions
// ============================================

async function seedUsers() {
  console.log("Seeding users...");

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

  console.log("Created test user:", testUser.email);

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

  console.log("Created admin user:", adminUser.email);
}

async function seedTestUsers() {
  console.log("\nSeeding test users for leaderboard...");

  const hashedPassword = await bcrypt.hash("Player123!", 10);

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        isEmailVerified: true,
      },
    });
    console.log(`  Created test user: ${user.displayName} (${user.email})`);
  }
}

async function seedQuizData() {
  console.log("\nSeeding quiz data...");

  // Clear existing quiz data (in correct order due to foreign keys)
  console.log("Clearing existing quiz data...");
  await prisma.userAnswer.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and their questions
  console.log("Creating categories and questions...");

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

    console.log(`  Created category: ${category.name}`);

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

    console.log(`    Added ${questionCount} questions`);
  }
}

async function seedQuizSessions() {
  console.log("\nSeeding quiz sessions for leaderboard testing...");

  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany({
    include: { questions: true },
  });

  if (users.length === 0 || categories.length === 0) {
    console.log("  No users or categories found. Skipping quiz sessions.");
    return;
  }

  let totalSessions = 0;

  for (const user of users) {
    // Create 5-15 completed quiz sessions per user
    const sessionCount = Math.floor(Math.random() * 11) + 5;

    for (let i = 0; i < sessionCount; i++) {
      const category = randomPick(categories);

      if (category.questions.length === 0) continue;

      // Get random 10 questions (or less if category has fewer)
      const questionCount = Math.min(10, category.questions.length);
      const shuffledQuestions = shuffleArray(category.questions).slice(0, questionCount);
      const questionIds = shuffledQuestions.map((q) => q.id);

      // Simulate quiz results
      const correctAnswers = Math.floor(Math.random() * (questionCount + 1));
      const baseScore = correctAnswers * 10;
      const bonusScore = Math.floor(Math.random() * 50); // Random bonus for speed
      const totalScore = baseScore + bonusScore;

      const startedAt = randomDateInPast(30);
      const completedAt = new Date(startedAt.getTime() + Math.random() * 10 * 60 * 1000); // 0-10 minutes after start

      const session = await prisma.quizSession.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          status: QuizSessionStatus.COMPLETED,
          totalQuestions: questionCount,
          correctAnswers,
          score: totalScore,
          currentIndex: questionCount,
          questionIds: questionIds,
          startedAt,
          completedAt,
        },
      });

      // Create user answers for this session
      for (let j = 0; j < shuffledQuestions.length; j++) {
        const question = shuffledQuestions[j];
        const isCorrect = j < correctAnswers; // First 'correctAnswers' questions are correct
        const selectedAnswer = isCorrect
          ? question.correctAnswer
          : randomPick(
              (question.options as string[]).filter((o) => o !== question.correctAnswer)
            ) || question.correctAnswer;

        await prisma.userAnswer.create({
          data: {
            sessionId: session.id,
            questionId: question.id,
            selectedAnswer,
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
            timeSpent: Math.floor(Math.random() * question.timeLimit) + 1,
          },
        });
      }

      totalSessions++;
    }

    console.log(`  Created ${sessionCount} sessions for ${user.displayName || user.username}`);
  }

  console.log(`  Total quiz sessions created: ${totalSessions}`);
}

// ============================================
// Main Seed Function
// ============================================

async function main() {
  console.log("Starting database seed...\n");
  console.log("=".repeat(50));

  await seedUsers();
  await seedTestUsers();
  console.log("");
  await seedQuizData();
  await seedQuizSessions();

  console.log("\n" + "=".repeat(50));
  console.log("Database seeding completed!");

  // Print summary
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const questionCount = await prisma.question.count();
  const sessionCount = await prisma.quizSession.count();

  console.log("\nSummary:");
  console.log(`  Users: ${userCount}`);
  console.log(`  Categories: ${categoryCount}`);
  console.log(`  Questions: ${questionCount}`);
  console.log(`  Quiz Sessions: ${sessionCount}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
