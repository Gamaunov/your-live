import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../src/app';
import { CreateUserModel } from '../../src/models/user/CreateUserModel';
import { authHeader, encodeCredentials } from '../helpers.test';

dotenv.config();

const mongoURI: string =
  process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`;

if (!mongoURI) throw new Error('mongoURI not found');

describe('users router', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await request(app).delete('/testing/all-data');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('users', () => {
    beforeAll(async () => {
      await request(app).delete(`${'/testing'}/all-data`);
    });

    let createdUser: any;

    it('should ', async () => {
      const createUserData: CreateUserModel = {
        login: 'login',
        password: 'string123',
        email: 'qvccgaov11@gmail.com',
      };

      const createdUserData = await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(createUserData)
        .expect(201);

      createdUser = createdUserData.body;

      expect(createdUser).toEqual({
        id: expect.any(String),
        email: createUserData.email,
        login: createUserData.login,
        createdAt: expect.any(String),
      });
    });

    it(`should find user by searchLoginTerm +
        should find user by searchEmailTerm`, async () => {
      const params = {
        sortBy: 'createdAt',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 4,
        searchLoginTerm: 'login',
      };

      const usersWithPaging = await request(app)
        .get(`/users`)
        .query(params)
        .set('Authorization', authHeader)
        .expect(200);

      const userBySearchLoginTerm = usersWithPaging.body;
      const user = userBySearchLoginTerm.items[0];

      expect(userBySearchLoginTerm).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: userBySearchLoginTerm.pageSize,
        totalCount: 1,
        items: [
          {
            id: user.id,
            email: user.email,
            login: user.login,
            createdAt: user.createdAt,
          },
        ],
      });

      //should find user by searchEmailTerm
      const paramsForEmail = {
        sortBy: 'createdAt',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 4,
        searchEmailTerm: 'qv',
      };

      const usersWithPagingEmail = await request(app)
        .get(`/users`)
        .query(paramsForEmail)
        .set('Authorization', authHeader)
        .expect(200);

      const userBySearchEmailTerm = usersWithPagingEmail.body;
      const user2 = userBySearchEmailTerm.items[0];

      expect(userBySearchEmailTerm).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: userBySearchEmailTerm.pageSize,
        totalCount: 1,
        items: [
          {
            id: user2.id,
            email: user2.email,
            login: user2.login,
            createdAt: user2.createdAt,
          },
        ],
      });
    });

    it(`should delete user by id`, async () => {
      await request(app)
        .delete(`/users/${createdUser.id}`)
        .set('Authorization', authHeader)
        .expect(204);
    });

    it(`shouldn't create user with incorrect input data`, async () => {
      const username = 'admin';
      const password = 'qwerty';

      const authHeader = encodeCredentials(username, password);

      //case empty login
      const data: CreateUserModel = {
        login: '',
        password: 'string123',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(data)
        .expect(400);

      //case empty password
      const invalidPasswordData: CreateUserModel = {
        login: 'login',
        password: '',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(invalidPasswordData)
        .expect(400);

      //case empty email
      const emptyEmail: CreateUserModel = {
        login: 'login',
        password: 'string123',
        email: '',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(emptyEmail)
        .expect(400);

      //case max length > 10 login
      const loginLength10: CreateUserModel = {
        login: 'loginloginloginloginloginloginloginlogin',
        password: 'string123',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(loginLength10)
        .expect(400);

      //case max length <3  login
      const loginLength3: CreateUserModel = {
        login: 'lo',
        password: 'string123',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(loginLength3)
        .expect(400);

      //case invalid pattern login
      const loginPattern: CreateUserModel = {
        login: '+++!!!',
        password: 'string123',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(loginPattern)
        .expect(400);

      //case invalid password max length <6
      const passwordLength6: CreateUserModel = {
        login: 'login',
        password: 'str',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(passwordLength6)
        .expect(400);

      //case invalid password max length >20
      const passwordLength20: CreateUserModel = {
        login: 'login',
        password:
          'passwordLength20passwordLength20passwordLength20passwordLength20',
        email: 'qvccgaov11@gmail.com',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(passwordLength20)
        .expect(400);

      //case invalid email pattern
      const emailPattern: CreateUserModel = {
        login: 'login',
        password: '123123',
        email: 'qvccgaov11@gmail',
      };

      await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(emailPattern)
        .expect(400);
    });
  });
});
