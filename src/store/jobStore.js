import { create } from "zustand";

// Job states: queued, processing, completed, failed
export const useJobStore = create((set, get) => ({
  // Active jobs by type
  jobs: {
    stages: null,
    mcq: null,
    flashcards: null,
    mindmap: null,
  },

  // Set a job for a specific type
  setJob: (type, job) =>
    set((state) => ({
      jobs: { ...state.jobs, [type]: job },
    })),

  // Update job progress/status
  updateJob: (type, updates) =>
    set((state) => {
      const current = state.jobs[type];
      if (!current) return state;
      return {
        jobs: { ...state.jobs, [type]: { ...current, ...updates } },
      };
    }),

  // Clear a job
  clearJob: (type) =>
    set((state) => ({
      jobs: { ...state.jobs, [type]: null },
    })),

  // Get job by type
  getJob: (type) => get().jobs[type],

  // Check if a job is active (queued or processing)
  isJobActive: (type) => {
    const job = get().jobs[type];
    return job && (job.status === "queued" || job.status === "processing");
  },
}));
