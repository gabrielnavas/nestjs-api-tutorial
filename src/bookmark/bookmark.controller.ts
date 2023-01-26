import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkNotFoundException } from './errors/bookmark-not-found.error';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser() user: User) {
    try {
      return this.bookmarkService.getBookmarks(user);
    } catch (ex) {
      if (ex instanceof BookmarkNotFoundException) {
        throw new BadRequestException(ex.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Get(':id')
  getBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    try {
      return this.bookmarkService.getBookmarkById(user, bookmarkId);
    } catch (ex) {
      throw new InternalServerErrorException('server error');
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBookmark(
    @GetUser() user: User,
    @Body() bookmarkDto: CreateBookmarkDto,
  ) {
    try {
      return this.bookmarkService.createBookmark(user, bookmarkDto);
    } catch (ex) {
      throw new InternalServerErrorException('server error');
    }
  }

  @Patch(':id')
  updateBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmarkDto: EditBookmarkDto,
  ) {
    try {
      return this.bookmarkService.updateBookmarkById(
        user,
        bookmarkId,
        bookmarkDto,
      );
    } catch (ex) {
      if (ex instanceof BookmarkNotFoundException) {
        throw new BadRequestException(ex.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Delete(':id')
  deleteBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    try {
      return this.bookmarkService.deleteBookmarkById(user, bookmarkId);
    } catch (ex) {
      if (ex instanceof BookmarkNotFoundException) {
        throw new BadRequestException(ex.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }
}
