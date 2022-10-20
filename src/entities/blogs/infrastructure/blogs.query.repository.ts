import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blogs.schema';
import mongoose, { Model } from 'mongoose';
import { PaginatedItems, QueryParamsType } from '../../../types/global-types';
import { paginator } from '../../../utils/paginator.helper';
import { BlogsMapper } from './query-service/blogs.mapper';
import { BlogViewType } from '../types/blog-types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlog(queryParams: QueryParamsType): Promise<PaginatedItems<BlogViewType>> {
    const filter = queryParams.searchNameTerm;
    const blog = await this.blogModel
      .find({ filter })
      .skip(queryParams.skip)
      .limit(queryParams.pageSize);

    const paginatedItems = paginator<Blog>(blog, queryParams);
    return BlogsMapper.mapPaginatedBlogs(paginatedItems);
  }

  async getBlogById(id: mongoose.Types.ObjectId): Promise<BlogViewType> {
    const blog = await this.blogModel.findOne({ _id: id });
    return BlogsMapper.mapBlog(blog);
  }
}
