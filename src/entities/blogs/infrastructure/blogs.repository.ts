import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blogs.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<mongoose.Types.ObjectId> {
    const newBlogId = await this.blogModel.create(createBlogDto);
    return newBlogId._id;
  }

  async getBlogById(id: mongoose.Types.ObjectId): Promise<Blog> {
    return this.blogModel.findOne({ _id: id });
  }

  async updateBlog(id: mongoose.Types.ObjectId, updateBlogDto: CreateBlogDto): Promise<boolean> {
    const query = await this.blogModel.updateOne(
      { _id: id },
      { name: updateBlogDto.name, youtubeUrl: updateBlogDto.youtubeUrl },
    );
    return query.acknowledged;
  }

  async deleteBlog(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
