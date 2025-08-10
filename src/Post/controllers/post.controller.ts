import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
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
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    categorieId: number,
  ) {
    const userId = req.user.id;
    return this.postService.createPost(
      createPostDto,
      userId,
      Number(categorieId),
    );
  }

  @UseGuards(JwtGuards)
  @Get('getUserPost')
  findOne(
    @Query('Page') Page: string,
    @Query('limit') limit: string,
    @Query('libelle') libelle: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.postService.findUserPost(userId, +Page, +limit, libelle);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Get()
  findAll(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.postService.findAllPagination(+Page, +limit);
  }

  @UseGuards(JwtGuards)
  @Get('getPost')
  getPost(
    @Body() body: { categorie: string },
    @Query('status') status: string,
    @Req() req: any,
  ) {
    return this.postService.getPostByStatusAndCategorie(status, body.categorie);
  }

  @UseGuards(JwtGuards)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.postService.update(+id, updatePostDto, userId);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
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
  @Patch('delete/:id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.postService.remove(+id, userId);
  }
}
