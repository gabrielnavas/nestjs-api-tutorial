import {
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

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser() user: User) {
    return this.bookmarkService.getBookmarks(user);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(user, bookmarkId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBookmark(
    @GetUser('id') userId: number,
    @Body() bookmarkDto: CreateBookmarkDto,
  ) {
    try {
      return this.bookmarkService.createBookmark(userId, bookmarkDto);
    } catch (ex) {
      throw new InternalServerErrorException('server error');
    }
  }

  @Patch(':id')
  updateBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmarkDto: EditBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmarkById(bookmarkId, bookmarkDto);
  }

  @Delete(':id')
  deleteBookmarkById(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmarkById(bookmarkId);
  }
}
