import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../index.js';
import User from '../models/usersModel.js';

const { it, describe, beforeEach, afterEach } = mocha;
const { expect } = chai;

const mockUser = {
  name: 'tester',
  email: 'egide123@gmail.com',
  password: '123abc',
};
const mockLoginCredentials = {
  email: 'egide123@gmail.com',
  password: '123abc',
};

describe('User related tests:', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('Should create a user', async () => {
    const res = await request(app).post('/users/register').send(mockUser);
    expect(res.status).to.be.equal(201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'Created Successfully');
  });

  it('Shouldnot create create a user(missing field)', async () => {
    const res = await request(app).post('/users/register').send({
      name: 'name',
      email: 'email@gmail.com',
    });
    expect(res.status).to.be.equal(500);
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property(
      'message',
      'There was problem Registering',
    );
  });

  it('Should not create create a user(short password)', async () => {
    const res = await request(app).post('/users/register').send({
      name: 'name',
      email: 'email@gmail.com',
      password: 'r',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'password is too short');
  });

  it('User should log in', async () => {
    await request(app).post('/users/register').send(mockUser);
    const res = await request(app)
      .post('/users/login')
      .send(mockLoginCredentials);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'succesfull loged in');
  });

  it('Should get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property(
      'message',
      'all users fetched successfully',
    );
  });

  it('Should get one user', async () => {
    const user = await User.create(mockUser);
    user.save();

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'Successfully got one user');
  });

  it('Should delete a user', async () => {
    const user = await User.create(mockUser);
    user.save();
    console.log(user._id);

    const res = await request(app).delete(`/users/${user._id}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'Deleted post successfully');
  });
});
