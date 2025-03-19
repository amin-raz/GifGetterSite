import type { User, InsertUser, Feedback, InsertFeedback } from "@shared/schema";
import session from 'express-session';
import MemoryStore from 'memorystore';
import crypto from 'crypto';

const MemoryStoreSession = MemoryStore(session);

export interface IStorage {
  getUser(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedback(page?: number, limit?: number): Promise<{ items: Feedback[], total: number }>;
  canUserSubmitFeedback(userId: string): Promise<{ canSubmit: boolean, timeToWait?: number, reason?: string }>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private feedbacks: Feedback[] = [];
  private lastSubmissionTime: Map<string, number> = new Map();
  private dailySubmissionCount: Map<string, { count: number, date: string }> = new Map();
  public sessionStore: session.Store;
  private readonly COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds
  private readonly MAX_DAILY_SUBMISSIONS = 3;

  constructor() {
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(discordId: string): Promise<User | undefined> {
    return this.users.find(u => u.discordId === discordId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...insertUser
    };
    this.users.push(user);
    return user;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async canUserSubmitFeedback(userId: string): Promise<{ canSubmit: boolean, timeToWait?: number, reason?: string }> {
    // Check cooldown period
    const lastSubmission = this.lastSubmissionTime.get(userId) || 0;
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmission;

    if (timeSinceLastSubmission < this.COOLDOWN_PERIOD) {
      const timeToWait = this.COOLDOWN_PERIOD - timeSinceLastSubmission;
      return { 
        canSubmit: false, 
        timeToWait,
        reason: `Please wait ${Math.ceil(timeToWait / 1000)} seconds before submitting another feedback`
      };
    }

    // Check daily submission limit
    const currentDate = this.getCurrentDate();
    const dailyStats = this.dailySubmissionCount.get(userId);

    if (dailyStats && dailyStats.date === currentDate && dailyStats.count >= this.MAX_DAILY_SUBMISSIONS) {
      return { 
        canSubmit: false,
        reason: `You have reached the maximum limit of ${this.MAX_DAILY_SUBMISSIONS} feedback submissions for today`
      };
    }

    return { canSubmit: true };
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const feedback: Feedback = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...insertFeedback
    };

    // Update submission tracking
    this.feedbacks.push(feedback);
    this.lastSubmissionTime.set(insertFeedback.userId, Date.now());

    // Update daily submission count
    const currentDate = this.getCurrentDate();
    const dailyStats = this.dailySubmissionCount.get(insertFeedback.userId);

    if (!dailyStats || dailyStats.date !== currentDate) {
      this.dailySubmissionCount.set(insertFeedback.userId, { count: 1, date: currentDate });
    } else {
      this.dailySubmissionCount.set(insertFeedback.userId, {
        count: dailyStats.count + 1,
        date: currentDate
      });
    }

    return feedback;
  }

  async getFeedback(page: number = 1, limit: number = 5): Promise<{ items: Feedback[], total: number }> {
    // Sort feedbacks by createdAt in descending order (newest first)
    const sortedFeedback = [...this.feedbacks].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      items: sortedFeedback.slice(start, end),
      total: sortedFeedback.length
    };
  }
}

export const storage = new MemStorage();