require('dotenv').config(); // Brings in environment variables
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const server = require('../server/routes');
const User = require('../server/models/User');
const connectDB = require('../server/utils/db');

const api = supertest(server);
const endpoint = '/api/login';

beforeAll(async () => {
  connectDB();

  await User.deleteMany({});

  await new User({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: await bcrypt.hash('123456', 10),
  }).save();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Logging in', () => {
  it('succeeds when credentials are valid', async () => {
    const credentials = {
      email: 'johndoe@gmail.com',
      password: '123456',
    };
    const response = await api
      .post(endpoint)
      .send(credentials)
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  it('fails when incorrect email is sent', async () => {
    const credentials = {
      email: 'johndoegmail.com',
      password: '123456',
    };

    const response = await api
      .post(endpoint)
      .send(credentials)
      .expect(404);

    expect(response.error.text).toMatch(`Invalid email or password`);
  });

  it('fails when incorrect password is sent', async () => {
    const credentials = {
      email: 'johndoe@gmail.com',
      password: '1234567',
    };

    const response = await api
      .post(endpoint)
      .send(credentials)
      .expect(404);

    expect(response.error.text).toMatch(`Invalid email or password`);
  });
});
