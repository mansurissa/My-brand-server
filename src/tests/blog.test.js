import pkg from 'mocha';
import pkg2 from 'chai';
import request from 'supertest';
import app from '../index.js';
import Post from '../models/blogModel.js';

const { it, describe, beforeEach, afterEach } = pkg;
const { expect } = pkg2;

const mockPost = {
  title: 'this is a title and it works',
  body: 'this is testing body',
};

describe('Blog related tests', () => {
  it('will give 8', () => {
    expect(2 + 6).to.be.equal(8);
  });
  beforeEach(async () => {
    await Post.deleteMany({});
  });
  afterEach(async () => {
    await Post.deleteMany({});
  });

  it('Get all Blogs from database', async () => {
    const res = await request(app).get('/blogs');
    expect(res.status).to.be.equal(200);
  });
});
