import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { PaginatedItems, QueryParamsType } from '../../types/global-types';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { CreatePostSpecificBlogDto } from './dto/create-post-specific-blog.dto';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { BlogViewType } from './types/blog-types';
import { SkipThrottle } from '@nestjs/throttler';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { JwtExtractGuard } from '../auth/guards/jwt-extract.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { PostViewType } from '../posts/types/posts.types';

@SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
  ): Promise<PaginatedItems<BlogViewType>> {
    return await this.blogsQueryRepository.getBlog(queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<BlogViewType> {
    const blogId = await this.blogsService.createBlog(createBlogDto);
    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId', ParseObjectIdPipe) blogId: mongoose.Types.ObjectId,
  ): Promise<BlogViewType> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId', ParseObjectIdPipe) blogId: mongoose.Types.ObjectId,
    @Body() updateBlogDto: CreateBlogDto,
  ): Promise<boolean> {
    return await this.blogsService.updateBlog(blogId, updateBlogDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlog(@Param('blogId', ParseObjectIdPipe) blogId: mongoose.Types.ObjectId) {
    return await this.blogsService.deleteBlog(blogId);
  }

  @Post(':blogId/posts')
  async createPostForSpecificBlog(
    @Param('blogId', ParseObjectIdPipe) blogId: mongoose.Types.ObjectId,
    @Body() createPostDto: CreatePostSpecificBlogDto,
  ): Promise<PostViewType> {
    const newPostId = await this.blogsService.createPostForBlog(createPostDto, blogId);
    return this.postsQueryRepository.getPostById(newPostId);
  }

  @Get(':blogId/posts')
  @UseGuards(JwtExtractGuard)
  async getPostsByBlogId(
    @Param('blogId', ParseObjectIdPipe) blogId: mongoose.Types.ObjectId,
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ) {
    //TODO optimize query for get Blog
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postsQueryRepository.getPostsByBlogId(blogId, queryParams, userId);
  }
}
