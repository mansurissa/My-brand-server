import pkg from 'mocha';
import pkg2 from 'chai';
// import request from 'supertest';
// import app from '../index.js';
// import Post from '../models/blogModel';
const { expect } = pkg2;
const { it, describe } = pkg;

describe('a sum of nbra', () => {
  it('Should give 6', () => {
    expect(2 + 4).to.be.equal(6);
  });
});
