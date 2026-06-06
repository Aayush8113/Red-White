import { create } from "zustand";

const allQuestions = [
  { id: "q1", type: "mcq", prompt: "Which data structure provides FIFO ordering?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, category: "Logic", weightage: 1 },
  { id: "q2", type: "boolean", prompt: "In JavaScript, `typeof null` returns 'object'.", correct: true, category: "Speed", weightage: 1 },
  { id: "q3", type: "short", prompt: "Name the HTTP status code for 'Not Found'.", accepted: ["404"], category: "Math", weightage: 1 },
  { id: "q4", type: "mcq", prompt: "What is the time complexity of binary search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctIndex: 2, category: "Logic", weightage: 2 },
  { id: "q5", type: "boolean", prompt: "CSS stands for Cascading Style Sheets.", correct: true, category: "Web", weightage: 1 },
  { id: "q6", type: "mcq", prompt: "Which of these is NOT a primitive type in JavaScript?", options: ["String", "Number", "Boolean", "Object"], correctIndex: 3, category: "JS", weightage: 1 },
  { id: "q7", type: "short", prompt: "Which keyword is used to define a constant in JS?", accepted: ["const"], category: "JS", weightage: 1 },
  { id: "q8", type: "mcq", prompt: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<header>"], correctIndex: 2, category: "Web", weightage: 1 },
  { id: "q9", type: "boolean", prompt: "React is a framework, not a library.", correct: false, category: "Web", weightage: 1 },
  { id: "q10", type: "mcq", prompt: "What does SQL stand for?", options: ["Strong Query Language", "Structured Query Language", "Simple Query Language", "Stable Query Language"], correctIndex: 1, category: "DB", weightage: 1 },
  { id: "q11", type: "short", prompt: "What is the port number for HTTP by default?", accepted: ["80"], category: "Network", weightage: 1 },
  { id: "q12", type: "boolean", prompt: "Python uses indentation to define code blocks.", correct: true, category: "Logic", weightage: 1 },
  { id: "q13", type: "mcq", prompt: "Which company developed Java?", options: ["Microsoft", "Google", "Sun Microsystems", "Apple"], correctIndex: 2, category: "History", weightage: 1 },
  { id: "q14", type: "mcq", prompt: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], correctIndex: 1, category: "Web", weightage: 2 },
  { id: "q15", type: "boolean", prompt: "Git and GitHub are the same thing.", correct: false, category: "Logic", weightage: 1 },
  { id: "q16", type: "mcq", prompt: "What is the result of 2 + '2' in JavaScript?", options: ["4", "'22'", "NaN", "Error"], correctIndex: 1, category: "JS", weightage: 1 },
  { id: "q17", type: "short", prompt: "Who is the creator of JavaScript?", accepted: ["brendan eich"], category: "History", weightage: 1 },
  { id: "q18", type: "boolean", prompt: "An array's first index is 0 in most programming languages.", correct: true, category: "Logic", weightage: 1 },
  { id: "q19", type: "mcq", prompt: "Which protocol is used for secure communication over the web?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctIndex: 2, category: "Network", weightage: 1 },
  { id: "q20", type: "mcq", prompt: "What is the brain of the computer?", options: ["RAM", "GPU", "CPU", "Hard Drive"], correctIndex: 2, category: "Hardware", weightage: 1 },
  { id: "q21", type: "boolean", prompt: "DOM stands for Document Object Model.", correct: true, category: "Web", weightage: 1 },
  { id: "q22", type: "mcq", prompt: "Which operator is used to check for both value and type equality in JS?", options: ["==", "=", "===", "!="], correctIndex: 2, category: "JS", weightage: 1 },
  { id: "q23", type: "short", prompt: "What is the full form of API?", accepted: ["application programming interface"], category: "Logic", weightage: 1 },
  { id: "q24", type: "boolean", prompt: "A 'Set' in JavaScript allows duplicate values.", correct: false, category: "JS", weightage: 1 },
  { id: "q25", type: "mcq", prompt: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctIndex: 1, category: "Logic", weightage: 1 },
  {
    id: "q26",
    type: "code",
    prompt: "Implement a function `sum(a, b)` that returns the sum of two numbers.",
    initialCode: "function sum(a, b) {\n  \n}",
    category: "Coding",
    weightage: 5,
  },
];

function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const useExamStore = create((set, get) => ({
  examId: null,
  attemptId: null,
  endsAtMs: null,
  questions: [],
  activeIndex: 0,
  answers: {},

  bootstrapDemo: () => {
    const shuffledPool = shuffle(allQuestions);
    const selectedSubset = shuffledPool.slice(0, 10);
    set({
      examId: "demo",
      attemptId: "demo-attempt-" + Date.now(),
      endsAtMs: Date.now() + 15 * 60 * 1000,
      questions: selectedSubset,
      activeIndex: 0,
      answers: {},
    });
  },

  setActiveIndex: (idx) => set({ activeIndex: idx }),
  setAnswer: (questionId, response) => set((s) => ({ answers: { ...s.answers, [questionId]: response } })),

  grade: () => {
    const { questions, answers } = get();
    let total = 0;
    let max = 0;
    const categories = {};

    for (const q of questions) {
      const w = Number(q.weightage ?? 1);
      max += w;
      const resp = answers[q.id];
      let ok = false;
      if (q.type === "mcq") ok = Number(resp) === q.correctIndex;
      if (q.type === "boolean") ok = resp === q.correct;
      if (q.type === "short") {
        const val = String(resp || "").trim().toLowerCase();
        ok = q.accepted.map((a) => a.toLowerCase()).includes(val);
      }
      if (q.type === "code") {
        ok = String(resp || "").length > 5;
      }

      const score = ok ? w : 0;
      total += score;
      const cat = q.category || "Overall";
      categories[cat] = (categories[cat] || 0) + score;
    }

    return { total, max, categories };
  },
}));
