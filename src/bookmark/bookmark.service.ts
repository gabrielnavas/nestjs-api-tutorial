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

  createBookmark(user: User, bookmarkDto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        link: bookmarkDto.link,
        description: bookmarkDto.description,
        title: bookmarkDto.title,
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

  async updateBookmarkById(
    user: User,
    bookmarkId: number,
    bookmarkDto: EditBookmarkDto,
  ) {
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
        userId: true,
      },
    });

    if (!bookmark || bookmark.userId !== user.id) {
      throw new BookmarkNotFoundException();
    }

    return await this.prisma.bookmark.update({
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

  async deleteBookmarkById(user: User, bookmarkId: number) {
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
        userId: true,
      },
    });

    if (!bookmark || bookmark.userId !== user.id) {
      throw new BookmarkNotFoundException();
    }

    this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
