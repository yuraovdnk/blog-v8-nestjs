import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { createApp } from './main';
import mongoose from 'mongoose';
import { PaginatedItems } from './types/global-types';
import { BlogViewType } from './entities/blogs/types/blog-types';

describe('Blog', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });
  let createdBlog = null;

  describe('Create blog', () => {
    it('Should empty array of items', async () => {
      const blog = await request(app.getHttpServer()).get('/blog').expect(200);
      expect((blog.body as PaginatedItems<BlogViewType>).items).toStrictEqual([]);
    });

    it('Should create Blogger with Correct data', async () => {
      const name = 'Yura';
      const youtubeUrl = 'https://www.youtube.com/c/TarunSharma7372';
      const res = await request(app.getHttpServer())
        .post('/blog')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl })
        .expect(201);
      createdBlog = res.body;
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(name);
      expect(res.body.youtubeUrl).toEqual(youtubeUrl);
    });
    it('Shouldn`t create blog with incorrect data', async () => {
      const name = 2;
      const youtubeUrl = 'c/TarunSharma7372';
      await request(app.getHttpServer())
        .post('/blog')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl })
        .expect(400);
    });
  });
  describe('Update blog', () => {
    it('Should update blog', async () => {
      const id = createdBlog.id;

      const newName = 'Yana';
      await request(app.getHttpServer())
        .put('/blog/' + id)
        .auth('admin', 'qwerty')
        .send({ name: newName, youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA' })
        .expect(204);

      const updatedBlog = await request(app.getHttpServer())
        .get('/blog/' + id)
        .expect(200);
      expect(updatedBlog.body.name).toStrictEqual(newName);
    });
  });
  describe('Delete blog', () => {
    it('Should delete blog', async () => {
      const id = createdBlog.id;
      await request(app.getHttpServer())
        .delete('/blog/' + id)
        .auth('admin', 'qwerty')
        .expect(204);

      request(app.getHttpServer())
        .get('/blog/' + id)
        .expect(404);
    });
  });
  let createdBloggerId;
  describe('Create post for blog', () => {
    it('Should create posts for blog with correct Data', async () => {
      const name = 'Ronald';
      const youtubeUrl = 'https://www.youtube.com/c/TarunSharma7372';
      const createdBlogger = await request(app.getHttpServer())
        .post('/blog')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl });

      createdBloggerId = createdBlogger.body.id;
      const postPayload = {
        title: 'about war',
        shortDescription: 'rwe',
        content: 'ewrw',
      };
      const res = await request(app.getHttpServer())
        .post(`/blog/${createdBloggerId}/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(201);
      expect(res.body.title).toEqual(postPayload.title);
      expect(res.body.shortDescription).toEqual(postPayload.shortDescription);
      expect(res.body.content).toEqual(postPayload.content);
      expect(res.body.bloggerId).toEqual(createdBloggerId);
      expect(res.body.extendedLikesInfo.newestLikes).toEqual([]);
    });
    it('shouldn`t create post for blog', async () => {
      const postPayload = {
        title: 'about war dsfs fsdv dfsdfsdc fgdfgd',
        shortDescription: 'rwe dfdfgdfgdfgfdvfdgfdgdfgdfgdfgfdgfd',
        content: 'ewrw',
      };
      await request(app.getHttpServer())
        .post(`/blog/${createdBloggerId}/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(400);
    });
  });

  it('should return all post by blogger', async () => {
    const posts = await request(app.getHttpServer())
      .get(`/blog/${createdBloggerId}/posts`)
      .expect(200);
    expect(posts.body.items).toHaveLength(1);
  });
  afterAll(async () => {
    await app.close();
  });
});
