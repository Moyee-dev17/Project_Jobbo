import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { PostStatus } from 'src/utils/status.enum';

@Injectable()
export class PostService {
  constructor(private readonly db: PrismaService) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    categorieId: number,
  ) {
    try {
      const post = await this.db.post.findFirst({
        where: { title: createPostDto.title },
      });
      if (post) throw new BadRequestException('post already exist');

      const userExist = await this.db.users.findUnique({
        where: { id: userId },
      });
      if (!userExist) throw new NotFoundException('user not found');

      const categorieExist = await this.db.category.findUnique({
        where: { id: createPostDto.categorieId },
      });
      if (!categorieExist) throw new NotFoundException('category not found');

      const createPost = await this.db.post.create({
        data: {
          title: createPostDto.title,
          description: createPostDto.description,
          adress: createPostDto.address,
          addressTechnique: createPostDto.addressTechnique,
          contact: createPostDto.contact,
          user: { connect: { id: userExist.id } },
          categorie: { connect: { id: categorieExist.id } },
        },
      });

      return { message: 'created' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('internal server error', error);
    }
  }

  async findUserPost(
    userId: number,
    Page: number = 1,
    limit: number = 20,
    libelle: string,
  ) {
    const userExist = await this.db.users.findUnique({ where: { id: userId } });
    if (!userExist) throw new NotFoundException('user not found');
    const skip = (Page - 1) * limit;
    const NombreDePost = await this.db.post.count({ where: { userId } });
    const nombreDePage = NombreDePost / limit;

    const searchKey = libelle || undefined;
    const Post = await this.db.post.findMany({
      where: searchKey
        ? {
          isActive:true,
            OR: [
              { title: { contains: searchKey, mode: 'insensitive' } },
              { description: { contains: searchKey, mode: 'insensitive' } },
              { adress: { contains: searchKey, mode: 'insensitive' } },
              { contact: { contains: searchKey, mode: 'insensitive' } },
            ],
            userId: userExist.id
          }
        : { userId: userExist.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });

    return {
      message: 'la liste des postes',
      data: Post,
      currentPage: Page,
      NbrTotalPage: nombreDePage,
      NbrTotalPost: NombreDePost,
    };
  }

  async getPostByStatusAndCategorie(status: string, categorie: string) {
    return await this.db.post.findMany({
      where: {
        status,isActive:true,
        categorie: {
          title: {
            equals: categorie,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  async findAllPagination(Page: number, limit: number) {
    try {
      const skip = (Page - 1) * limit;
      const NbrTotalPost = await this.db.post.count();
      const NbrTotalPage = NbrTotalPost / limit;

      const allPost = await this.db.post.findMany({
        where: { status: PostStatus.PUBLISHED ,isActive:true},
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      });
      return {
        message: 'la liste des postes',
        data: allPost,
        currentPage: Page,
        NbrTotalPage: NbrTotalPage,
        NbrTotalPost: NbrTotalPost,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const userExist = await this.db.users.findUnique({ where: { id: userId } });
    if (!userExist) throw new NotFoundException('user not found');
    await this.db.post.update({
      where: { id },
      data: updatePostDto,
    });
    return { message: 'updated' };
  }

  async UpdatePublished(id: number) {
    const Post = await this.db.post.findUnique({ where: { id , isActive:true} });
    if (Post?.status == PostStatus.REJECTED)
      throw new ForbiddenException(
        'cannot publish a post that has been rejected',
      );
    if (Post?.status == PostStatus.PUBLISHED)
      throw new BadRequestException(
        'cannot reject a post that has been published',
      );
    await this.db.post.update({
      where: { id ,isActive:true},
      data: { status: PostStatus.PUBLISHED },
    });
    return { message: 'published' };
  }

  async UpdateReject(id: number) {
    const Post = await this.db.post.findUnique({ where: { id , isActive:true} });
    if (Post?.status == PostStatus.PUBLISHED)
      throw new ForbiddenException(
        'cannot reject a post that has been published',
      );
    if (Post?.status == PostStatus.REJECTED)
      throw new BadRequestException('post already reject');
    await this.db.post.update({
      where: { id },
      data: { status: PostStatus.REJECTED },
    });
    return { message: 'rejected' };
  }

  async remove(id: number, userId: number) {
    const userExist = await this.db.users.findUnique({
      where: { id: userId, isActive: true },
    });
    if (!userExist) throw new NotFoundException('user not found');
    console.log(userExist);
    const post = await this.db.post.findUnique({
      where: { id, isActive: true },
    });
    if (!post) throw new NotFoundException('aucun post pour cet user');
    console.log(post);
    if (userId != post.userId)
      throw new UnauthorizedException('action non autorisée');

    await this.db.post.update({
      where: { id: post.id },
      data: { isActive: false },
    });

    return {
      mesage: 'deleted',
    };
  }
}
