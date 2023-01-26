import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkNotFoundException } from './errors/bookmark-not-found.error';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(user: User) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        link: true,
        title: true,
      },
    });
  }

  async getBookmarkById(user: User, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        link: true,
        title: true,
      },
    });

    if (!bookmark) {
      throw new BookmarkNotFoundException();
    }

    return bookmark;
  }

  createBookmark(userId: number, bookmarkDto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        link: bookmarkDto.link,
        description: bookmarkDto.description,
        title: bookmarkDto.title,
        userId,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        link: true,
        title: true,
      },
    });
  }

  updateBookmarkById(bookmarkId: number, bookmarkDto: EditBookmarkDto) {
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        link: bookmarkDto.link,
        description: bookmarkDto.description,
        title: bookmarkDto.title,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        link: true,
        title: true,
      },
    });
  }

  deleteBookmarkById(bookmarkId: number) {
    this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
