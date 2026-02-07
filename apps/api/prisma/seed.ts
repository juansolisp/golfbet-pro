import { PrismaClient, RoundType, SubscriptionTier } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'juan@golfbet.pro' },
      update: {},
      create: {
        email: 'juan@golfbet.pro',
        name: 'Juan Dominguez',
        handicap: 15.4,
        passwordHash,
        tier: SubscriptionTier.PRO,
      },
    }),
    prisma.user.upsert({
      where: { email: 'miguel@golfbet.pro' },
      update: {},
      create: {
        email: 'miguel@golfbet.pro',
        name: 'Miguel Garcia',
        handicap: 12.8,
        passwordHash,
        tier: SubscriptionTier.FREE,
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos@golfbet.pro' },
      update: {},
      create: {
        email: 'carlos@golfbet.pro',
        name: 'Carlos Rodriguez',
        handicap: 18.2,
        passwordHash,
        tier: SubscriptionTier.FREE,
      },
    }),
    prisma.user.upsert({
      where: { email: 'roberto@golfbet.pro' },
      update: {},
      create: {
        email: 'roberto@golfbet.pro',
        name: 'Roberto Lopez',
        handicap: 22.5,
        passwordHash,
        tier: SubscriptionTier.FREE,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create demo courses
  const courses = await Promise.all([
    createCourse('Club Campestre de Monterrey', 'Monterrey', 'NL', 'MX', 128, 72.5, 72, [
      { number: 1, par: 4, yards: 380, handicapIndex: 7 },
      { number: 2, par: 3, yards: 165, handicapIndex: 15 },
      { number: 3, par: 5, yards: 520, handicapIndex: 1 },
      { number: 4, par: 4, yards: 410, handicapIndex: 9 },
      { number: 5, par: 4, yards: 390, handicapIndex: 5 },
      { number: 6, par: 3, yards: 175, handicapIndex: 17 },
      { number: 7, par: 4, yards: 425, handicapIndex: 3 },
      { number: 8, par: 5, yards: 545, handicapIndex: 11 },
      { number: 9, par: 4, yards: 405, handicapIndex: 13 },
      { number: 10, par: 4, yards: 395, handicapIndex: 8 },
      { number: 11, par: 3, yards: 155, handicapIndex: 16 },
      { number: 12, par: 5, yards: 510, handicapIndex: 2 },
      { number: 13, par: 4, yards: 400, handicapIndex: 10 },
      { number: 14, par: 4, yards: 385, handicapIndex: 6 },
      { number: 15, par: 3, yards: 180, handicapIndex: 18 },
      { number: 16, par: 4, yards: 430, handicapIndex: 4 },
      { number: 17, par: 5, yards: 530, handicapIndex: 12 },
      { number: 18, par: 4, yards: 415, handicapIndex: 14 },
    ]),
    createCourse('Valle Alto Golf Club', 'Monterrey', 'NL', 'MX', 135, 73.1, 72, generateHoles()),
    createCourse('Las Misiones Country Club', 'Monterrey', 'NL', 'MX', 130, 72.8, 72, generateHoles()),
    createCourse('El Bosque Country Club', 'Leon', 'GTO', 'MX', 125, 71.5, 72, generateHoles()),
    createCourse('Club de Golf Santa Anita', 'Guadalajara', 'JAL', 'MX', 132, 72.3, 72, generateHoles()),
    createCourse('Pebble Beach Golf Links', 'Pebble Beach', 'CA', 'US', 145, 75.5, 72, generateHoles()),
    createCourse('Augusta National Golf Club', 'Augusta', 'GA', 'US', 137, 74.4, 72, generateHoles()),
    createCourse('St Andrews Old Course', 'St Andrews', 'Fife', 'GB', 128, 73.1, 72, generateHoles()),
  ]);

  console.log(`Created ${courses.length} courses`);

  // Create a demo group
  const group = await prisma.group.create({
    data: {
      name: 'Weekend Warriors',
      description: 'Saturday morning golf crew',
      inviteCode: 'WKND2026',
      creatorId: users[0].id,
      members: {
        create: [
          { userId: users[0].id, role: 'OWNER' },
          { userId: users[1].id, role: 'MEMBER' },
          { userId: users[2].id, role: 'MEMBER' },
          { userId: users[3].id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log(`Created group: ${group.name}`);

  // Create a second group
  const group2 = await prisma.group.create({
    data: {
      name: 'Club Campestre League',
      description: 'Official club betting league',
      inviteCode: 'CAMP2026',
      creatorId: users[0].id,
      members: {
        create: [
          { userId: users[0].id, role: 'OWNER' },
          { userId: users[1].id, role: 'ADMIN' },
        ],
      },
    },
  });

  console.log(`Created group: ${group2.name}`);

  console.log('Seed completed successfully!');
}

async function createCourse(
  name: string,
  city: string,
  state: string,
  country: string,
  slopeRating: number,
  courseRating: number,
  totalPar: number,
  holes: Array<{ number: number; par: number; yards: number; handicapIndex: number }>,
) {
  return prisma.course.create({
    data: {
      name,
      city,
      state,
      country,
      slopeRating,
      courseRating,
      totalPar,
      holes: {
        create: holes,
      },
    },
  });
}

function generateHoles(): Array<{ number: number; par: number; yards: number; handicapIndex: number }> {
  const pars = [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4];
  const baseYards = [380, 165, 520, 410, 390, 175, 425, 545, 405, 395, 155, 510, 400, 385, 180, 430, 530, 415];
  const handicapIndexes = [7, 15, 1, 9, 5, 17, 3, 11, 13, 8, 16, 2, 10, 6, 18, 4, 12, 14];

  return pars.map((par, i) => ({
    number: i + 1,
    par,
    yards: baseYards[i] + Math.floor(Math.random() * 40) - 20,
    handicapIndex: handicapIndexes[i],
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
