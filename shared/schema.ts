import { Schema } from '@aws-amplify/datastore';

export const schema: Schema = {
  models: {
    User: {
      name: 'User',
      fields: {
        id: { type: 'ID', isRequired: true, isArray: false },
        discordId: { type: 'String', isRequired: true, isArray: false },
        username: { type: 'String', isRequired: true, isArray: false },
        avatar: { type: 'String', isRequired: false, isArray: false },
      },
    },
    Feedback: {
      name: 'Feedback',
      fields: {
        id: { type: 'ID', isRequired: true, isArray: false },
        userId: { type: 'String', isRequired: true, isArray: false },
        content: { type: 'String', isRequired: true, isArray: false },
        type: { type: 'String', isRequired: true, isArray: false },
        createdAt: { type: 'AWSDateTime', isRequired: false, isArray: false },
      },
    },
  },
  enums: {},
  nonModels: {},
  version: '1',
};

export type User = {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
};

export type Feedback = {
  id: string;
  userId: string;
  content: string;
  type: string;
  createdAt?: string;
};

export type InsertUser = Omit<User, 'id'>;
export type InsertFeedback = Omit<Feedback, 'id' | 'createdAt'>;