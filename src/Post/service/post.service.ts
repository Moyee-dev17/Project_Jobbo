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

  async createPost(createPostDto: CreatePostDto, userId: number) {
    try {
      //TODO: bien revoir la logique
      const post = await this.db.post.findFirst({
        where: { title: createPostDto.title, isActive: true },
      });
      if (post) throw new BadRequestException('post already exist');

      const userExist = await this.db.users.findUnique({
        where: { id: userId, isActive: true },
      });
      if (!userExist) throw new NotFoundException('user not found');

      const categorieExist = await this.db.category.findUnique({
        where: { id: createPostDto.categorieId, isActive: true },
      });
      if (!categorieExist) throw new NotFoundException('category not found');

      await this.db.post.create({
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
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }

  //TODO: revoir la logique
  async findUserPost(
    userId: number,
    Page: number = 1,
    limit: number = 20,
    libelle: string,
    categorieName: string,
  ) {
    try {
      const userExist = await this.db.users.findUnique({
        where: { id: userId, isActive: true },
      });
      if (!userExist) throw new NotFoundException('user not found');
      const categorie = await this.db.category.findFirst({
        where: { title: categorieName, isActive: true },
      });
      if (!categorie) throw new NotFoundException('categorie not found');
      const skip = (Page - 1) * limit;

      const NombreDePost = await this.db.post.count({
        where: { userId, isActive: true },
      });
      const nombreDePage = NombreDePost / limit;

      const searchKey = libelle || undefined;

      const Post = await this.db.post.findMany({
        where: searchKey
          ? {
              isActive: true,
              title: { equals: categorieName, mode: 'insensitive' },
              OR: [
                { title: { contains: searchKey, mode: 'insensitive' } },
                { description: { contains: searchKey, mode: 'insensitive' } },
                { adress: { contains: searchKey, mode: 'insensitive' } },
                { contact: { contains: searchKey, mode: 'insensitive' } },
              ],
              userId: userExist.id,
            }
          : {
              userId: userExist.id,
              isActive: true,
            },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      });

      return {
        message: 'la liste des postes',
        data: Post,
        currentPage: Page,
        TotalPage: nombreDePage,
        TotalPost: NombreDePost,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

    //TODO: revoir la logique
  async userGlobal(Page: number, limit: number) {
    try {
      const skip = (Page - 1) * limit;
      const NbrTotalPost = await this.db.post.count({
        where: { status: PostStatus.PUBLISHED, isActive: true },
      });
      const NbrTotalPage = NbrTotalPost / limit;

      const posts = await this.db.post.findMany({
        where: { isActive: true, status: PostStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      });
      if (!posts) throw new NotFoundException('post not found');
      return {
        message: 'la liste des postes',
        data: posts,
        currentPage: Page,
        TotalPage: NbrTotalPage,
        TotalPost: NbrTotalPost,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

    //TODO: revoir la logique
  async findAllPagination(Page: number, limit: number) {
    try {
      const skip = (Page - 1) * limit;
      const NbrTotalPost = await this.db.post.count();
      const NbrTotalPage = NbrTotalPost / limit;

      const allPost = await this.db.post.findMany({
        where: { status: PostStatus.PUBLISHED, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      });
      return {
        message: 'la liste des postes',
        data: allPost,
        currentPage: Page,
        TotalPage: NbrTotalPage,
        TotalPost: NbrTotalPost,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    try {
      const userExist = await this.db.users.findUnique({
        where: { id: userId, isActive: true },
      });

      const Post = await this.db.post.findUnique({
        where: { id, isActive: true , userId : userExist?.id},
      });
      if(!Post)throw new NotFoundException('post not found')
      if (!userExist) throw new NotFoundException('user not found');
      await this.db.post.update({
        where: { id: Post.id},
        data: updatePostDto,
      });
      return { message: 'updated' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async UpdatePublished(id: number) {
    try {
      const Post = await this.db.post.findUnique({
        where: { id, isActive: true },
      });
      if (Post?.status == PostStatus.REJECTED)
        throw new ForbiddenException(
          'cannot publish a post that has been rejected',
        );
      if (Post?.status == PostStatus.PUBLISHED)
        throw new BadRequestException(
          'cannot reject a post that has been published',
        );
      await this.db.post.update({
        where: { id : Post?.id},
        data: { status: PostStatus.PUBLISHED },
      });
      return { message: 'published' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async UpdateReject(id: number) {
    try {
      const Post = await this.db.post.findUnique({
        where: { id,
           isActive: true,
           status : PostStatus.PENDING 
          },
      });
      if(!Post)throw new BadRequestException("post already rejected or publshed")
      await this.db.post.update({
        where: { id, isActive: true },
        data: { status: PostStatus.REJECTED },
      });
      return { message: 'rejected' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async remove(id: number, userId: number) {
    try {
      const userExist = await this.db.users.findUnique({
        where: { id:userId, isActive: true },
      });
      if (!userExist) throw new NotFoundException('user not found');
    
      const post = await this.db.post.findUnique({
        where: {id, isActive: true , userId},
      });
      if (!post) throw new NotFoundException('aucun post pour cet user');
         
      await this.db.post.update({
        where: { id: post.id },
        data: { isActive: false },
      });
      return {
        mesage: 'deleted',
      };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      )
        throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }
}
