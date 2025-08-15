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
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { RootOnlyGuard } from 'src/Authentification/RootOnly.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuards)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.id;
    return this.postService.createPost(createPostDto, userId);
  }

  @UseGuards(JwtGuards)
  @Get('getUserPost')
  findUserPost(
    @Query('Page') Page: string,
    @Query('limit') limit: string,
    @Query('libelle') libelle: string,
    @Query('categorieId') categorieName: string,//TODO: retirer ce filtre
    @Request() req: any,
  ) {
    const userId: string = req.user.id;
    return this.postService.findUserPost(
      +userId,
      +Page,
      +limit,
      libelle,
      categorieName,
    );
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Get("root")
  findAll(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.postService.findAllPagination(+Page, +limit);
  }

  @UseGuards(JwtGuards)//TODO: pas besoin d'etre authentifié
  @Get()
  PostGlobal(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.postService.userGlobal(+Page, +limit);
  }

  @UseGuards(JwtGuards)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    const userId: string = req.user.id;
    return this.postService.update(+id, updatePostDto, +userId);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)//TODO: accordé aux admin aussi
  @Patch('publish/:id')
  updatePublished(@Param('id') id: string) {
    return this.postService.UpdatePublished(+id);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Patch('reject/:id')
  updateReject(@Param('id') id: string) {
    return this.postService.UpdateReject(+id);
  }

  @UseGuards(JwtGuards)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId: string = req.user.id;
    return this.postService.remove(+id, +userId);
  }
}
