import { BlogsRepository } from './infrastructure/blogs.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import mongoose from 'mongoose';
import { CreatePostSpecificBlogDto } from './dto/create-post-specific-blog.dto';
import { PostsRepository } from '../posts/infrastructure/posts.repository';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository, private postsRepository: PostsRepository) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<mongoose.Types.ObjectId> {
    const newBlog = {
      name: createBlogDto.name,
      youtubeUrl: createBlogDto.youtubeUrl,
    };
    return this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(
    blogId: mongoose.Types.ObjectId,
    updateBlogDto: CreateBlogDto,
  ): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();

    return this.blogsRepository.updateBlog(blogId, updateBlogDto);
  }

  async deleteBlog(blogId: mongoose.Types.ObjectId): Promise<boolean> {
    const existBlog = await this.blogsRepository.getBlogById(blogId);
    if (!existBlog) throw new NotFoundException();

    return this.blogsRepository.deleteBlog(blogId);
  }
  async createPostForBlog(
    createPostDto: CreatePostSpecificBlogDto,
    blogId: mongoose.Types.ObjectId,
  ): Promise<mongoose.Types.ObjectId> {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const newPost = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: blogId,
      blogName: blog.name,
    };
    return await this.postsRepository.createPost(newPost);
  }
}
