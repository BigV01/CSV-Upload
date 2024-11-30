const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.saveData = async (data) => {
  await prisma.records.createMany({ data });
};