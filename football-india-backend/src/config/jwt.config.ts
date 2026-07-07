export default () => ({
  jwtSecret: process.env.JWT_SECRET || 'change-me',
});

