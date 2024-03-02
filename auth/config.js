import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4500, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://Admin:1234@sem5pi-g58-2324.iswl0yf.mongodb.net/?retryWrites=true&w=majority",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * My email domain
   */

  allowedEmails: process.env.ALLOWED_EMAILS || "isep.ipp.pt",

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    user: {
      name: "UserController",
      path: "../controllers/ImplControllers/userController"
    }
  },

  repos: {
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    }
  },

  services: {
    user: {
      name: "UserService",
      path: "../services/ImplServices/userService"
    },
    auth: {
      name: "AuthService",
      path: "../services/ImplServices/authService"
    }
  },
};
