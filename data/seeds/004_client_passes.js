const passes = [
  {
    owner_id: '22ulthapbErVUwVJy9x9',
    instructor_id: '00ulthapbErVUwVJy1x1',
    total_classes: 10,
    price_paid: 99.99,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('client_passes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('client_passes').insert(passes);
    });
};
