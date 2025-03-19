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
  canUserSubmitFeedback(userId: string): Promise<{ canSubmit: boolean, timeToWait?: number }>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private feedbacks: Feedback[] = [];
  private lastSubmissionTime: Map<string, number> = new Map();
  public sessionStore: session.Store;
  private readonly COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds

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

  async canUserSubmitFeedback(userId: string): Promise<{ canSubmit: boolean, timeToWait?: number }> {
    const lastSubmission = this.lastSubmissionTime.get(userId) || 0;
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmission;

    if (timeSinceLastSubmission < this.COOLDOWN_PERIOD) {
      const timeToWait = this.COOLDOWN_PERIOD - timeSinceLastSubmission;
      return { canSubmit: false, timeToWait };
    }

    return { canSubmit: true };
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const feedback: Feedback = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...insertFeedback
    };
    this.feedbacks.push(feedback);
    this.lastSubmissionTime.set(insertFeedback.userId, Date.now());
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