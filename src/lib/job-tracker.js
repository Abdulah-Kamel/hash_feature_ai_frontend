// Job tracker using Socket.IO for real-time AI job updates
// Backend emits: job:completed, job:failed, job:progress, job:stalled, job:sync
// Client emits: join-job to subscribe to a job

import { io } from "socket.io-client";

// Get Socket.IO URL at runtime
function getSocketUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
  if (apiUrl) {
    return apiUrl;
  }
  console.warn(
    "JobTracker: No API URL configured. Set NEXT_PUBLIC_BASE_API in .env"
  );
  return "";
}

class JobTracker {
  constructor() {
    this.socket = null;
    this.callbacks = new Map(); // jobId -> { onProgress, onComplete, onError }
    this.isConnected = false;
  }

  /**
   * Ensure Socket.IO connection is established
   */
  ensureConnection() {
    if (this.socket?.connected) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const socketUrl = getSocketUrl();

      if (!socketUrl) {
        reject(new Error("No Socket URL configured"));
        return;
      }

      console.log(`JobTracker: Connecting to ${socketUrl}`);

      try {
        // Parse URL to separate origin and path
        // https://hashplus.app/hash-flow -> origin: https://hashplus.app, path: /hash-flow
        const url = new URL(socketUrl);
        const socketPath = url.pathname !== "/" ? url.pathname : "/socket.io";

        console.log(`JobTracker: Origin: ${url.origin}, Path: ${socketPath}`);

        // Connect to origin with path option
        this.socket = io(url.origin, {
          path: socketPath,
        });

        console.log(`JobTracker: Socket created, waiting for connection...`);

        this.socket.on("connect", () => {
          console.log("JobTracker: Socket.IO connected");
          this.isConnected = true;
          resolve(true);
        });

        this.socket.on("disconnect", (reason) => {
          console.log("JobTracker: Disconnected:", reason);
          this.isConnected = false;
        });

        this.socket.on("connect_error", (error) => {
          console.error("JobTracker: Connection error:", error);
          this.isConnected = false;
          reject(error);
        });

        // Listen for job events
        this.socket.on("job:sync", (data) => {
          console.log("JobTracker: job:sync", data);
          this.handleJobUpdate(data, "sync");
        });

        this.socket.on("job:progress", (data) => {
          console.log("JobTracker: job:progress", data);
          this.handleJobUpdate(data, "progress");
        });

        this.socket.on("job:completed", (data) => {
          console.log("JobTracker: job:completed", data);
          this.handleJobUpdate(data, "completed");
        });

        this.socket.on("job:failed", (data) => {
          console.log("JobTracker: job:failed", data);
          this.handleJobUpdate(data, "failed");
        });

        this.socket.on("job:stalled", (data) => {
          console.log("JobTracker: job:stalled", data);
          this.handleJobUpdate(data, "stalled");
        });
      } catch (error) {
        console.error("JobTracker: Failed to create socket:", error);
        reject(error);
      }
    });
  }

  handleJobUpdate(data, eventType) {
    // Get jobId from data (backend sends mongoJobId which is the _id)
    const jobId = data.mongoJobId || data.jobId || data._id;

    if (!jobId) {
      console.warn("JobTracker: Event without jobId:", data);
      return;
    }

    const cbs = this.callbacks.get(jobId);
    if (!cbs) {
      console.log(`JobTracker: No callbacks for job ${jobId}`);
      return;
    }

    switch (eventType) {
      case "sync":
        // Initial sync - check status
        const status = data.status;
        if (status === "completed") {
          cbs._completed = true;
          cbs.onComplete?.(data.result || data);
          this.unsubscribe(jobId);
        } else if (status === "failed") {
          cbs._completed = true;
          cbs.onError?.(data.error || "فشلت العملية");
          this.unsubscribe(jobId);
        } else {
          cbs.onProgress?.(data.progress || 0, status, data);
        }
        break;

      case "progress":
        cbs.onProgress?.(data.progress || 0, "processing", data);
        break;

      case "completed":
        cbs._completed = true;
        cbs.onComplete?.(data.result || data);
        this.unsubscribe(jobId);
        break;

      case "failed":
        cbs._completed = true;
        cbs.onError?.(data.error || "فشلت العملية");
        this.unsubscribe(jobId);
        break;

      case "stalled":
        cbs._completed = true;
        cbs.onError?.("توقفت العملية");
        this.unsubscribe(jobId);
        break;
    }
  }

  /**
   * Start tracking a job
   * @param {string} jobId - The job ID (mongoJobId/_id) to track
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

    try {
      await this.ensureConnection();

      // Join the job room to receive updates
      this.socket.emit("join-job", jobId);
      console.log(`JobTracker: Joined job room ${jobId}`);
    } catch (error) {
      console.error("JobTracker: Failed to connect:", error);
      callbacks?.onError?.("فشل الاتصال بالخادم");
      this.callbacks.delete(jobId);
    }

    // Return cleanup function
    return () => this.unsubscribe(jobId);
  }

  /**
   * Unsubscribe from a job
   */
  unsubscribe(jobId) {
    this.callbacks.delete(jobId);

    // Leave the job room if connected
    if (this.socket?.connected) {
      this.socket.emit("leave-job", jobId);
    }

    // Disconnect if no more jobs to track
    if (this.callbacks.size === 0 && this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
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
