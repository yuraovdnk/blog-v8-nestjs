import mongoose from 'mongoose';

export type UserViewType = {
  id: mongoose.Types.ObjectId;
  login: string;
  email: string;
  createdAt: Date;
};
