import { db } from "./db";
import { User } from "@shared/schema";
import session from 'express-session';
import MemoryStore from 'memorystore';
import crypto from 'crypto';

const SessionStore = MemoryStore(session);

interface IStorage {
  getUser(discordId: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  createFeedback(feedback: any): Promise<any>;
  getFeedback(): Promise<any[]>;
  sessionStore: session.Store;
}

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private feedback: any[] = [];
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new SessionStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }

  async getUser(discordId: string): Promise<User | undefined> {
    return this.users.get(discordId);
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const user = {
      id: crypto.randomUUID(),
      ...userData
    };
    this.users.set(userData.discordId, user);
    return user;
  }

  async createFeedback(feedback: any): Promise<any> {
    const newFeedback = {
      id: crypto.randomUUID(),
      ...feedback,
      createdAt: new Date().toISOString()
    };
    this.feedback.push(newFeedback);
    return newFeedback;
  }

  async getFeedback(): Promise<any[]> {
    return this.feedback;
  }
}

export const storage = new MemStorage();