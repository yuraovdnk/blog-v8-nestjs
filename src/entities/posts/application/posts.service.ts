import { PostsRepository } from '../infrastructure/posts.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { mapErrors } from '../../../exceptions/mapErrors';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { Like } from '../schemas/likes.schema';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async createPost(createPost: CreatePostDto): Promise<mongoose.Types.ObjectId> {
    const blog = await this.blogsRepository.getBlogById(createPost.blogId);
    if (!blog) {
      throw new BadRequestException(mapErrors('blog is not defined', 'blog'));
    }
    const newPost = {
      title: createPost.title,
      shortDescription: createPost.shortDescription,
      content: createPost.content,
      blogId: blog._id,
      blogName: blog.name,
    };
    return await this.postsRepository.createPost(newPost);
  }

  async updatePost(
    postId: mongoose.Types.ObjectId,
    updatePostDto: CreatePostDto,
  ): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return this.postsRepository.updatePost(postId, updatePostDto);
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return this.postsRepository.deletePost(postId);
  }
}
