import { 
  type User, 
  type InsertUser, 
  type Feedback,
  type InsertFeedback
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Feedback operations
  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private feedback: Feedback[];
  private userId: number = 1;
  private feedbackId: number = 1;

  constructor() {
    this.users = new Map();
    this.feedback = [];
  }

  async getUser(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.discordId === discordId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(insertUser.discordId, user);
    return user;
  }

  async getFeedback(): Promise<Feedback[]> {
    return this.feedback;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackId++;
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      createdAt: new Date()
    };
    this.feedback.push(feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
