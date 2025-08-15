import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { PostStatus } from 'src/utils/enum';

@Injectable()
export class PostService {
  constructor(private readonly db: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, userId: number) {
    try {
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

  
  async findUserPost(
    userId: number,
    page: number = 1,
    limit: number = 20,
    libelle: string,
  ) {
    try {
      const userExist = await this.db.users.findUnique({
        where: { id: userId, isActive: true },
      });
      if (!userExist) throw new NotFoundException('user not found');
      const pageNumber= Number(page)||1
      const limitNumber=Number(limit)||10
      const skip = (pageNumber - 1) * limit;
      const nombrePost = await this.db.post.count({
        where: { userId, isActive: true },
      });
      const nombrePage = nombrePost / limit;
      const totalPage=Math.ceil(nombrePage)
      const searchKey = libelle || undefined;

      const Post = await this.db.post.findMany({
        where: searchKey
          ? {
              isActive: true,
              
              OR: [
                
                {categorie:{title:{contains:searchKey,mode:'insensitive'}}},
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
        take: limitNumber,
        skip,
        include:{
          categorie:true
        }
      });

      return {
        message: 'la liste des postes',
        data: Post,
        currentPage: page,
        TotalPage: totalPage,
        TotalPost: nombrePost,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

   
  async userGlobal(page: number, limit: number) {
    try {
      const pageNumber= Number(page)||1
      const limitNumber=Number(limit)||10
      const skip = (pageNumber - 1) * limit;
      const nombrePost = await this.db.post.count({
        where: { status: PostStatus.PUBLISHED, isActive: true },
      });
      const nombrePage = nombrePost / limit;
      const totalPage=Math.ceil(nombrePage)
      const posts = await this.db.post.findMany({
        where: { isActive: true, status: PostStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
        take: limitNumber,
        skip,
      });
      if (!posts) throw new NotFoundException('post not found');
      return {
        message: 'la liste des postes',
        data: posts,
        currentPage: page,
        TotalPage: totalPage,
        TotalPost: nombrePost,
      };
    } catch (error:any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

    
  async findAllforRoot(page: number, limit: number) {
    try {
      const pageNumber= Number(page)||1
      const limitNumber=Number(limit)||10
      const skip = (pageNumber - 1) * limit;
      const nombrePost = await this.db.post.count();
      const nombrePage = nombrePost / limit;
      const totalPage=Math.ceil(nombrePage)
      const allPost = await this.db.post.findMany({
        where: { status: PostStatus.PUBLISHED, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limitNumber,
        skip,
      });
      return {
        message: 'la liste des postes',
        data: allPost,
        currentPage: pageNumber,
        TotalPage: totalPage,
        TotalPost: nombrePost,
      };
    } catch (error:any) {
      console.log(error);
      throw new InternalServerErrorException('internal server error');
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
        where: { id, isActive: true, status:PostStatus.PENDING},
      });
      if(!Post)throw new BadRequestException("post already rejected or published")
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
      if(!Post)throw new BadRequestException("post already rejected or published")
      await this.db.post.update({
        where: { id, isActive: true },
        data: { status: PostStatus.REJECTED }
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
