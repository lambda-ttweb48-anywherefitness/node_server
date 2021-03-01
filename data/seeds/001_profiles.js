const faker = require('faker');

const fakeProfiles = [...new Array(5)].map(() => ({
  id: faker.random.alphaNumeric(20),
  password: faker.internet.password(),
  email: faker.internet.email(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  instructor: true,
}));

const profiles = [
  {
    id: '00ulthapbErVUwVJy1x1',
    password: 'instructor_pass',
    email: 'instructor@fake.com',
    name: 'Fanny Fitness',
    instructor: true,
  },
  {
    id: '22ulthapbErVUwVJy9x9',
    password: 'client_pass',
    email: 'client@fake.com',
    name: 'Frank Fatness',
    instructor: false,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('profiles')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert(profiles.concat(fakeProfiles));
    });
};
