require('dotenv').config(); // Brings in environment variables
const mongoose = require('mongoose');
const supertest = require('supertest');
const server = require('../server/routes');
const User = require('../server/models/User');
const connectDB = require('../server/utils/db');

const api = supertest(server);
const endpoint = '/api/signup';

beforeAll(async () => {
  connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Signing up', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('succeeds with valid fields', async () => {
    const newUser = {
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    };

    await api
      .post(endpoint)
      .send(newUser)
      .expect(201);

    const newUserInDB = await User.findOne({ email: newUser.email });

    expect(newUserInDB.name).toBe(newUser.name);
    expect(newUserInDB.email).toBe(newUser.email);
  });

  it('fails when email is already taken', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    await new User(newUser).save();

    const response = await api
      .post(endpoint)
      .send(newUser)
      .expect(422);

    expect(response.error.text).toMatch(
      `User already exists with email ${newUser.email}`,
    );
  });

  it('fails when name is less than 3 characters', async () => {
    const newUser = {
      name: 'Jo',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const response = await api
      .post(endpoint)
      .send(newUser)
      .expect(422);

    expect(response.error.text).toMatch(`Name must be between 3-15 characters`);
  });

  it('fails when name is greater than 15 characters', async () => {
    const newUser = {
      name: 'John Thornsbury Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const response = await api
      .post(endpoint)
      .send(newUser)
      .expect(422);

    expect(response.error.text).toMatch(`Name must be between 3-15 characters`);
  });

  it('fails when password is less than 6 characters', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
    };

    const response = await api
      .post(endpoint)
      .send(newUser)
      .expect(422);

    expect(response.error.text).toMatch(
      `Password must be at least 6 characters`,
    );
  });
});
