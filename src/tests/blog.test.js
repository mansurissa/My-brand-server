import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import path from 'path';
import app from '../index.js';
import Post from '../models/blogModel.js';
import Subscriber from '../models/subscribers.js';
import Comment from '../models/comments.js';

const { it, describe, beforeEach, afterEach } = mocha;
const { expect } = chai;

const mockPost = {
  title: 'this is a title and it worksn2',
  body: 'this is testing body',
};

describe('Unknown route', () => {
  it('Should return Not found(any request)', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).to.be.equal(404);
    expect(res.body).to.be.a('object');
    expect(res.body).to.be.have.property('success', false);
    expect(res.body).to.be.have.property('message', 'Route not found');
  });
});

describe('Post related tests:', async () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  it('Should create a post', async () => {
    const res = await request(app)
      .post('/blogs')
      .field('title', mockPost.title)
      .field('body', mockPost.body)
      .attach('image', path.resolve(__dirname, './img/testimage.png'));
    expect(res.status).to.be.equal(201);
    expect(res.body).to.be.have.property(
      'message',
      'new post created successfully',
    );
    expect(res.body).to.be.have.property('data');
    expect(res.body.data).to.be.a('object');
    expect(res.body.data).to.be.have.property('title');
    expect(res.body.data).to.be.have.property('body');
    expect(res.body.data).to.be.have.property('comments');
  });

  it('Should Get all Blogs from database', async () => {
    const res = await request(app).get('/blogs');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('message', 'successfully read all posts');
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body.data).to.be.a('object');
    expect(res.body.data).to.have.property('posts');
    expect(res.body.data.posts).to.be.a('array');
  });

  it('Should get one post', async () => {
    const post = await Post.create(mockPost);
    await post.save();

    const res = await request(app).get(`/blogs/${post._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'post got successfully');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.be.a('object');
    expect(res.body.data).to.have.property('body');
    expect(res.body.data).to.have.property('title');
    expect(res.body.data).to.have.property('_id');
  });

  it('Should delete a post', async () => {
    const post = await Post.create(mockPost);
    await post.save();

    const res = await request(app).delete(`/blogs/${post._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'Deleted post successfully');
  });

  it('Should update a post', async () => {
    const postUpdate = {
      title: 'this is a title and it is updated',
      body: 'this is testing body',
    };
    const post = await Post.create(mockPost);
    await post.save();

    const res = await request(app)
      .patch(`/blogs/${post._id}`)
      .field('title', postUpdate.title)
      .field('body', postUpdate.body)
      .attach('image', path.resolve(__dirname, './img/testimage.png'));
    expect(res.status).to.be.equal(201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'Updated post successfully');
  });
});

describe('Subscribe related tests:', async () => {
  const email = {
    email: 'fakeemail@gmail.com',
  };

  it('Should Subscribe ', async () => {
    const res = await request(app).post('/blogs/subscribe').send(email);
    expect(res.status).to.be.equal(201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'Subscribed successfully');
    expect(res.body.data).to.a('object');
    expect(res.body.data).to.have.property('email');
  });

  it('Should fail to Subscribe (duplicate key) ', async () => {
    const res = await request(app).post('/blogs/subscribe').send(email);
    expect(res.status).to.be.equal(500);
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property(
      'message',
      'There was error while subscribing',
    );
  });

  it('Should get all subscribers', async () => {
    const res = await request(app).get('/blogs/subscribe');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.be.a('object');
    expect(res.body).to.have.property(
      'message',
      'fetched all subscriber successfully',
    );
  });

  it('Should fail to subscribe(no email sent)', async () => {
    const res = await request(app).post('/blogs/subscribe').send({
      email1: 'hello@gmail.com',
    });
    expect(res.status).to.be.equal(500);
    expect(res.body).to.be.have.property('success', false);
    expect(res.body).to.be.a('object');
    expect(res.body).to.be.have.property(
      'message',
      'There was error while subscribing',
    );
  });
  await Subscriber.deleteMany({});
});

describe('Like related tests', () => {
  it('Should like on a post', async () => {
    const post = await Post.create(mockPost);
    await post.save();
    const res = await request(app).put(`/blogs/${post._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body.success).to.be.equal(true);
    expect(res.body.message).to.be.equal('successfully liked');
  });
});

describe('Comments related tests:', async () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });
  afterEach(async () => {
    await Post.deleteMany({});
  });
  const mockComment = {
    name: 'rukara',
    email: 'rukara@gmail.com',
    message: 'this is a message',
  };
  it('Should comment on post', async () => {
    const post = await Post.create(mockPost);
    await post.save();
    const res = await request(app)
      .post(`/blogs/${post._id}/comment`)
      .send(mockComment);
    expect(res.status).to.be.equal(201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'successfully commented');
    expect(res.body).to.be.a('object');
  });

  it('Should get all comments on a post', async () => {
    const post = await Post.create(mockPost);
    await post.save();
    const res = await request(app).get(`/blogs/${post._id}/allComments`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property(
      'message',
      'successfully fetched all comments',
    );
    expect(res.body).to.be.a('object');
  });

  it('Should get one comments ', async () => {
    const comment = await Comment.create(mockComment);
    const res = await request(app).get(`/blogs/comments/${comment._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'this is one comment');
    expect(res.body).to.be.a('object');
  });

  await Comment.deleteMany({});
});
