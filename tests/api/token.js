/* eslint-env node, mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');

const { app, server } = require('../../app');

const request = supertest;
chai.use(chaiHttp);
chai.should();
const { expect, assert } = chai;


describe('GET /token', () => {
  it('expect 404', async () => {
    const res = await request(server).get('/api/token');
    res.status.should.equal(404);
  });
});


describe('POST /token', () => {
  it('should get token', async () => {
    const res = await request(server).post('/api/token');
    res.status.should.equal(200);
    res.body.should.has.all.keys(['token', 'tokenType']);
    res.body.tokenType.should.equal('Bearer');
  });
});
