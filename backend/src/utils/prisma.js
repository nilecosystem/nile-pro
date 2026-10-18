const { PrismaClient } = require('@prisma/client');

let prisma;

try {
  prisma = new PrismaClient();
} catch (err) {
  console.warn('PrismaClient initialization warning. Ensure prisma generate has been run:', err.message);
  prisma = null;
}

module.exports = prisma;
