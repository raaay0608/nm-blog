/* eslint-env node, mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');

const { app, server } = require('../app');
const database = require('../database');

const request = supertest;
chai.use(chaiHttp);
chai.should();
const { expect, assert } = chai;


before(async () => {
  // const listenting = new Promise((resolve, reject) => app.on('listening', resolve));
  const databaseConnected = await new Promise((resolve, reject) => app.on('database connected', resolve));
});


beforeEach(async () => {
});


afterEach(async () => {
});


after(async () => {
});

