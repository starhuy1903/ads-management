import * as pactum from 'pactum';

describe('Authentication services', () => {
  const authenServiceUrl = 'http://localhost:3000/api/auth';
  beforeAll(async () => {
    pactum.request.setBaseUrl(authenServiceUrl);
  });

  describe('Signup', () => {
    const dto = {
      name: 'Truong Chi Hien',
      email: 'chihien2002@gmail.com',
      password: '123456',
    };
    it('Should throw error if email is empty', () => {
      return pactum
        .spec()
        .post('/signup')
        .withBody({
          password: dto.password,
          name: dto.name,
        })
        .expectStatus(400);
    });

    it('Should throw error if password is empty', () => {
      return pactum
        .spec()
        .post('/signup')
        .withBody({
          email: dto.email,
          name: dto.name,
        })
        .expectStatus(400);
    });

    it('Should throw error if name is empty', () => {
      return pactum
        .spec()
        .post('/signup')
        .withBody({
          email: dto.email,
          password: dto.password,
        })
        .expectStatus(400);
    });

    it('Should throw error if no body provided', () => {
      return pactum.spec().post('/signup').expectStatus(400);
    });

    it('Should singup', () => {
      return pactum.spec().post('/signup').withBody(dto).expectStatus(201);
    });
  });

  describe('Signin', () => {
    const dto = {
      email: 'chihien2002@gmail.com',
      password: '56789',
    };
    it('Should throw error if email is empty', () => {
      return pactum
        .spec()
        .post('/signin')
        .withBody({
          password: dto.password,
        })
        .expectStatus(400);
    });

    it('Should throw error if password is empty', () => {
      return pactum
        .spec()
        .post('/signin')
        .withBody({
          email: dto.email,
        })
        .expectStatus(400);
    });

    it('Should throw error if no body provided', () => {
      return pactum.spec().post('/signin').expectStatus(400);
    });

    it('Should singin', () => {
      return pactum
        .spec()
        .post('/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('accessToken', 'accessToken')
        .stores('refreshToken', 'refreshToken');
    });
  });

  describe('Logout', () => {
    it('Should throw error if no access token provided', () => {});

    it('Should throw error if access token is expired', () => {});

    it('Should logout', () => {});
  });

  describe('Refresh tokens', () => {
    it('Should throw error if no refresh token provided', () => {});

    it('Should throw error if refresh token is expired', () => {});

    it('Should generate a new pair access/refresh token', () => {});
  });

  describe('Forgot password', () => {
    it('Should throw error if email is empty', () => {});

    it('Should send reset password link', () => {});
  });

  describe('Reset password', () => {
    it('Should throw error if no reset token is provided', () => {});

    it('Should throw error if new password is empty', () => {});

    it('Should reset password', () => {});
  });
});
