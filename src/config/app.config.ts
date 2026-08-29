export default () => ({
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:3001",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "default-access-secret-minimum-32-chars",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default-refresh-secret-minimum-32-chars",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cookieSecret: process.env.COOKIE_SECRET || "cookie-secret",
});