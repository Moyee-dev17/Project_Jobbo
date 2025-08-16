import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from '../post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { RootOnlyGuard } from 'src/authorization-manager/guards/RootOnly.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuards)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId :number= req.user.id;
    return this.postService.createPost(createPostDto, +userId);
  }

  @UseGuards(JwtGuards)
  @Get('getUserPost')
  findUserPost(
    @Query('Page') Page: string,
    @Query('limit') limit: string,
    @Query('libelle') libelle: string,
    @Request() req: any,
  ) {
    const userId: number = req.user.id;
    return this.postService.findUserPost(
      +userId,
      +Page,
      +limit,
      libelle,
    );
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Get("root")
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postService.findAllforRoot(+page, +limit);
  }

  @UseGuards(JwtGuards)
  @Get()
  PostGlobal(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postService.userGlobal(+page, +limit);
  }

  @UseGuards(JwtGuards)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any
  ) {
    const userId: number = req.user.id;
    return this.postService.update(+id, updatePostDto, +userId);
  }

  @UseGuards(JwtGuards,AdminOnlyGuard, RootOnlyGuard)
  updatePublished(@Param('id') id: number) {
    return this.postService.UpdatePublished(+id);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Patch('reject/:id')
  updateReject(@Param('id') id: number) {
    return this.postService.UpdateReject(+id);
  }

  @UseGuards(JwtGuards)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req: any) {
    const userId: number = req.user.id;
    return this.postService.remove(+id, +userId);
  }
}
