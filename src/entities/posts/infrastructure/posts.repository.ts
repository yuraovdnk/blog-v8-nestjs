import { Post } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postsModel: Model<Post>) {}

  async createPost(createPostDto: CreatePostDto): Promise<mongoose.Types.ObjectId> {
    const newPost: Post = await this.postsModel.create(createPostDto);
    return newPost._id;
  }

  async getPostById(postId: mongoose.Types.ObjectId) {
    return this.postsModel.findOne({ _id: postId });
  }
  async updatePost(
    postId: mongoose.Types.ObjectId,
    updatePostDto: CreatePostDto,
  ): Promise<boolean> {
    const result = await this.postsModel.updateOne(
      { _id: postId },
      {
        title: updatePostDto.title,
        shortDescription: updatePostDto.shortDescription,
        content: updatePostDto.content,
        blogId: updatePostDto.blogId,
      },
    );
    return result.acknowledged;
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.postsModel.deleteOne({ _id: postId });
    return result.acknowledged;
  }
}
