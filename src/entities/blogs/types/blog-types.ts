import mongoose from 'mongoose';

export type BlogViewType = {
  id: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};
