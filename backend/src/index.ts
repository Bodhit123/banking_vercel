import prisma from './db/prisma';

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: 'bodhit darji',
//       email: 'bodhit.darji@example.com',
//       password: 'password',
//     },
//   });

//   console.log(user);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });