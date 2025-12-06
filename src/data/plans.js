export const PLANS = {
  free: {
    name: "free",
    price: 0,
    maxFolders: 2,
    maxFilesPerFolder: 5,
    maxDailyUploads: 2,
    maxFileSize: 10,
    maxTokensPerDay: 25000,
    weeklyTries: 3,
    resourcesPerTry: 3,
    maxTriesTotal: 10,
    tryOptions: {
      stages: { min: 7, max: 10 },
      mcqs: { min: 15, max: 20 },
      flashcards: { min: 15, max: 20 },
    },
  },

  pro: {
    name: "pro",
    price: 20, // $20 per month (or user logic)
    maxFolders: 50,
    maxFilesPerFolder: 100,
    maxDailyUploads: 50,
    maxFileSize: 50,
    maxTokensPerDay: 200000,
    weeklyTries: 100,
    resourcesPerTry: 5,
    maxTriesTotal: null,
    tryOptions: {
      stages: { min: 10, max: 20 },
      mcqs: { min: 30, max: 50 },
      flashcards: { min: 30, max: 50 },
    },
  },
};
