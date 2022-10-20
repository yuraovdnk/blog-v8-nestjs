import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import { CreatePostSpecificBlogDto } from '../../blogs/dto/create-post-specific-blog.dto';

export class CreatePostDto extends CreatePostSpecificBlogDto {
  //TODO: change from objectId to string
  @IsNotEmpty()
  @IsMongoId()
  blogId: mongoose.Types.ObjectId;
}
