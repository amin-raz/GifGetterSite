import { db } from "./db";
import { users, type User, type InsertUser, feedback, type Feedback, type InsertFeedback } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';

const PostgresStore = connectPg(session);

export interface IStorage {
  getUser(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedback(): Promise<Feedback[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      tableName: 'sessions',
      createTableIfMissing: true
    });
  }

  async getUser(discordId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.discordId, discordId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values(insertFeedback).returning();
    return newFeedback;
  }

  async getFeedback(): Promise<Feedback[]> {
    return db.select().from(feedback);
  }
}

export const storage = new DatabaseStorage();