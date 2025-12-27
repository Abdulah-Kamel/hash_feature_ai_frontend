"use client";
// Job tracker using polling for AI job updates
// Polls the API endpoint every 10 seconds to check job status

import { toast } from "sonner";

// Debug mode - set to true to see toast notifications for polling events
const DEBUG_MODE = false;

// Polling interval in milliseconds
const POLL_INTERVAL = 5000; // 5 seconds

function debugLog(message, type = "info") {
  console.log(`JobTracker: ${message}`);
  if (DEBUG_MODE && typeof window !== "undefined") {
    const toastFn =
      type === "error"
        ? toast.error
        : type === "success"
        ? toast.success
        : toast.info;
    toastFn(`� ${message}`, { duration: 3000, position: "bottom-left" });
  }
}

// Get API URL at runtime
function getApiUrl() {
  return process.env.NEXT_PUBLIC_BASE_API;
}

class JobTracker {
  constructor() {
    this.pollingIntervals = new Map(); // jobId -> intervalId
    this.callbacks = new Map(); // jobId -> { onProgress, onComplete, onError }
  }

  /**
   * Fetch job status from the API
   * @param {string} jobId - The job ID to check
   * @returns {Promise<object>} - The job data
   */
  async fetchJobStatus(jobId) {
    const url = `/api/jobs/${jobId}`;

    debugLog(`Polling: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Handle the job response from polling
   * @param {string} jobId - The job ID
   * @param {object} response - The API response { status: "success", data: {...} }
   */
  handleJobResponse(jobId, response) {
    const cbs = this.callbacks.get(jobId);
    if (!cbs) {
      console.log(`JobTracker: No callbacks found for ${jobId}`);
      return;
    }

    // Extract job data from response
    const job = response.data;
    if (!job) {
      debugLog(`No job data in response`, "error");
      return;
    }

    debugLog(`Response for ${jobId}: status=${job.status}`);

    // Check job status
    const status = job.status;

    if (status === "completed") {
      debugLog(`Job completed!`, "success");
      cbs._completed = true;
      cbs.onComplete?.(job.result || job);
      this.unsubscribe(jobId);
    } else if (status === "failed") {
      debugLog(`Job failed: ${job.error}`, "error");
      cbs._completed = true;
      cbs.onError?.(job.error || "فشلت العملية");
      this.unsubscribe(jobId);
    } else if (status === "stalled") {
      debugLog(`Job stalled`, "error");
      cbs._completed = true;
      cbs.onError?.("توقفت العملية");
      this.unsubscribe(jobId);
    } else {
      // Job is still processing (e.g., "active", "waiting", "delayed")
      cbs.onProgress?.(job.progress || 0, status, job);
    }
  }

  /**
   * Start tracking a job
   * @param {string} jobId - The job ID to track
   * @param {object} callbacks - { onProgress, onComplete, onError }
   * @returns {function} cleanup function to stop tracking
   */
  async track(jobId, callbacks = {}) {
    if (!jobId) {
      console.error("JobTracker: jobId is required");
      return () => {};
    }

    // Store callbacks
    this.callbacks.set(jobId, callbacks);

    debugLog(`Starting to track job: ${jobId}`);

    // Poll immediately on start
    try {
      const data = await this.fetchJobStatus(jobId);
      this.handleJobResponse(jobId, data);

      // If job is already completed/failed, don't start polling
      if (callbacks._completed) {
        return () => this.unsubscribe(jobId);
      }
    } catch (error) {
      debugLog(`Initial poll failed: ${error.message}`, "error");
      // Continue to set up polling anyway
    }

    // Set up polling interval
    const intervalId = setInterval(async () => {
      try {
        const data = await this.fetchJobStatus(jobId);
        this.handleJobResponse(jobId, data);
      } catch (error) {
        debugLog(`Poll error: ${error.message}`, "error");
        // Don't stop polling on error, let it retry
      }
    }, POLL_INTERVAL);

    this.pollingIntervals.set(jobId, intervalId);
    debugLog(`Polling started for ${jobId} (every ${POLL_INTERVAL / 1000}s)`);

    // Return cleanup function
    return () => this.unsubscribe(jobId);
  }

  /**
   * Unsubscribe from a job
   */
  unsubscribe(jobId) {
    // Clear the polling interval
    const intervalId = this.pollingIntervals.get(jobId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(jobId);
      debugLog(`Stopped polling for ${jobId}`);
    }

    // Remove callbacks
    this.callbacks.delete(jobId);
  }

  /**
   * Stop all tracking
   */
  stopAll() {
    for (const jobId of this.callbacks.keys()) {
      this.unsubscribe(jobId);
    }
  }
}

// Singleton instance
export const jobTracker = new JobTracker();

/**
 * React hook for tracking a job
 * Usage: useJobTracker(jobId, { onProgress, onComplete, onError })
 */
export function useJobTracker(jobId, callbacks) {
  const { useEffect } = require("react");

  useEffect(() => {
    if (!jobId) return;
    let cleanup;
    jobTracker.track(jobId, callbacks).then((fn) => {
      cleanup = fn;
    });
    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [jobId]);
}
