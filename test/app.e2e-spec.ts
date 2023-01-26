import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // ignore all data that is not on dto class validator body
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.clearDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'any_email@email.com',
      password: '123456',
    };

    describe('Signup', () => {
      it('should signup', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throws an error if email is not correct', async () => {
        const emailCases = [
          '',
          '@email.com',
          'abc@.com',
          'abc@emailcom',
          'abc@email.',
        ];
        for (const email of emailCases) {
          await pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              ...dto,
              email,
            })
            .expectStatus(400);
        }
      });
      it('should throws an error if password is not correct', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...dto,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throws an error if no body is provided', async () => {
        await pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Signin', () => {
      it.todo('Should signin');
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it.todo('should get me');
    });
    describe('Edit user', () => {
      it.todo('should edit user');
    });
  });

  describe('Book', () => {
    describe('Create bookmark', () => {
      it.todo('should create bookmark');
    });
    describe('Get bookmarks', () => {
      it.todo('should get bookmarks');
    });
    describe('Get bookmark by id', () => {
      it.todo('should get bookmark by id');
    });
    describe('Edit bookmark', () => {
      it.todo('should edit bookmark');
    });
    describe('Delete bookmark', () => {
      it.todo('should delete bookmark');
    });
  });
});
