import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Blog } from '../blogs/schemas/blogs.schema';
import { Post } from '../posts/schemas/post.schema';
import { Token } from '../auth/schemas/token.schema';
import { Like } from '../posts/schemas/likes.schema';
import { Comment } from '../comments/schemas/comment.schema';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postsModel: Model<Post>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async deleteDbData() {
    try {
      await this.tokenModel.deleteMany({});
      await this.userModel.deleteMany({});
      await this.blogModel.deleteMany({});
      await this.postsModel.deleteMany({});
      await this.commentModel.deleteMany({});
      await this.likeModel.deleteMany({});
    } catch (e) {
      console.log(e);
    }
  }
}
