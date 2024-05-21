const Jwt = require('@hapi/jwt');

const createAuthStrategy = async (server) => {
  await server.register(Jwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      timeSkewSec: 15,
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: { id: artifacts.decoded.payload.id },
      };
    },
  });

  server.auth.default('jwt');
};

module.exports = createAuthStrategy;
