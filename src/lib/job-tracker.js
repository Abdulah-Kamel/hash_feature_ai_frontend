"use client";
// Job tracker using Socket.IO for real-time AI job updates
// Backend emits: job:completed, job:failed, job:progress, job:stalled, job:sync
// Client emits: join-job to subscribe to a job

import { io } from "socket.io-client";
import { toast } from "sonner";

// Debug mode - set to true to see toast notifications for socket events
const DEBUG_MODE = true;

function debugLog(message, type = "info") {
  console.log(`JobTracker: ${message}`);
  if (DEBUG_MODE && typeof window !== "undefined") {
    const toastFn =
      type === "error"
        ? toast.error
        : type === "success"
        ? toast.success
        : toast.info;
    toastFn(`🔌 ${message}`, { duration: 3000, position: "bottom-left" });
  }
}

// Get Socket.IO URL at runtime
function getSocketUrl() {
  //   const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
  //   if (apiUrl) {
  //     return apiUrl;
  //   }
  //   debugLog("No API URL configured", "error");
  //   return "";
  return "https://hashplus.app"; // Just the base URL
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

      debugLog(`Connecting to ${socketUrl}`);

      try {
        // Parse URL to separate origin and path
        // https://hashplus.app/hash-flow -> origin: https://hashplus.app, path: /hash-flow
        const url = new URL(socketUrl);

        debugLog(`Origin: ${url.origin}, Path: /hash-flow/`);

        // Connect to origin with path option
        this.socket = io(url.origin, {
          path: "/hash-flow/",
          transports: ["websocket"],
          withCredentials: true,
        });

        debugLog(`Socket created, waiting...`);

        this.socket.on("connect", () => {
          debugLog("Socket.IO connected!", "success");
          this.isConnected = true;
          resolve(true);
        });

        this.socket.on("disconnect", (reason) => {
          debugLog(`Disconnected: ${reason}`, "error");
          this.isConnected = false;
        });

        this.socket.on("connect_error", (error) => {
          debugLog(`Connection error: ${error.message}`, "error");
          this.isConnected = false;
          reject(error);
        });

        // Debug: listen for ALL events to see what's coming in
        this.socket.onAny((eventName, ...args) => {
          console.log(`JobTracker: Received event "${eventName}"`, args);
          debugLog(`Event: ${eventName}`);
        });
        this.socket.on("test", () => {
          debugLog(`Joined job room test`);
          console.log("test");
        });
        // Listen for job events
        // Note: Backend emits to room (mongoId) but payload has queue jobId
        // We need to match events by room, not by payload.jobId
        this.socket.on("job:sync", (data) => {
          debugLog(`job:sync received: ${JSON.stringify(data)}`);
          this.handleJobUpdate(data, "sync");
        });

        this.socket.on("job:progress", (data) => {
          debugLog(`job:progress received: ${JSON.stringify(data)}`);
          this.handleJobUpdate(data, "progress");
        });

        this.socket.on("job:completed", (data) => {
          debugLog(
            `job:completed received: ${JSON.stringify(data)}`,
            "success"
          );
          this.handleJobUpdate(data, "completed");
        });

        this.socket.on("job:failed", (data) => {
          debugLog(`job:failed received: ${JSON.stringify(data)}`, "error");
          this.handleJobUpdate(data, "failed");
        });

        this.socket.on("job:stalled", (data) => {
          debugLog(`job:stalled received: ${JSON.stringify(data)}`, "error");
          this.handleJobUpdate(data, "stalled");
        });
      } catch (error) {
        debugLog(`Failed to create socket: ${error.message}`, "error");
        reject(error);
      }
    });
  }

  handleJobUpdate(data, eventType) {
    // Get jobId from data - backend might send different ID formats
    const payloadId = data.mongoJobId || data.jobId || data._id;

    debugLog(
      `handleJobUpdate: eventType=${eventType}, payloadId=${payloadId}, tracked=${[
        ...this.callbacks.keys(),
      ].join(",")}`
    );

    // Try to find callbacks - first by direct match, then by checking all tracked jobs
    // (since Socket.IO room-based events go to clients who joined that room)
    let cbs = this.callbacks.get(payloadId);
    let matchedJobId = payloadId;

    // If no direct match, and we only have one job tracked, use that
    // (the event came to us because we're in the room)
    if (!cbs && this.callbacks.size === 1) {
      matchedJobId = [...this.callbacks.keys()][0];
      cbs = this.callbacks.get(matchedJobId);
      debugLog(`Using single tracked job: ${matchedJobId}`);
    }

    // If still no match but we have callbacks, try first one
    if (!cbs && this.callbacks.size > 0) {
      matchedJobId = [...this.callbacks.keys()][0];
      cbs = this.callbacks.get(matchedJobId);
      debugLog(`Fallback to first tracked job: ${matchedJobId}`);
    }

    if (!cbs) {
      console.log(`JobTracker: No callbacks found`);
      return;
    }

    switch (eventType) {
      case "sync":
        // Initial sync - check status
        const status = data.status;
        if (status === "completed") {
          cbs._completed = true;
          cbs.onComplete?.(data.result || data);
          this.unsubscribe(matchedJobId);
        } else if (status === "failed") {
          cbs._completed = true;
          cbs.onError?.(data.error || "فشلت العملية");
          this.unsubscribe(matchedJobId);
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
        this.unsubscribe(matchedJobId);
        break;

      case "failed":
        cbs._completed = true;
        cbs.onError?.(data.error || "فشلت العملية");
        this.unsubscribe(matchedJobId);
        break;

      case "stalled":
        cbs._completed = true;
        cbs.onError?.("توقفت العملية");
        this.unsubscribe(matchedJobId);
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

      // Join the job room to receive updates

      console.log("listening to job room");
      this.socket.on(jobId, (data) => {
        console.log("listening to job room 2");
        debugLog(`Joined job room ${jobId}`);
        console.log(data);
      });
      this.socket.on("test", () => {
        debugLog(`Joined job room test`);
        console.log("test");
      });
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
      // Remove the specific job event listener
      this.socket.off(jobId);
      // Tell server to leave the room
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
