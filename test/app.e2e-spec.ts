import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

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
            .post('/auth/signin')
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
          .post('/auth/signin')
          .withBody({
            ...dto,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throws an error if no body is provided', async () => {
        await pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', async () => {
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get currect user', async () => {
        await pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .get('/users/me')
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', async () => {
        const userToUpdate = {
          email: 'any_email_updated@email.com',
          passwrod: '654321',
        };
        await pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .withBody(userToUpdate)
          .patch('/users')
          .expectStatus(200)
          .expectBodyContains(userToUpdate.email);
      });
    });
  });

  describe('Book', () => {
    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        description: 'any_description',
        link: 'http://link.com',
        title: 'any_title',
      };
      it('should create bookmark', async () => {
        await pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .withBody(dto)
          .post('/bookmarks')
          .expectStatus(201)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title);
      });
    });
    describe('Get bookmarks', () => {
      it.todo('should get bookmarks');
    });
    describe('Get bookmark by id', () => {
      it.todo('should get bookmark by id');
    });
    describe('Edit bookmark', () => {
      it.todo('should edit bookmark by id');
    });
    describe('Delete bookmark', () => {
      it.todo('should delete bookmark by id');
    });
  });
});
