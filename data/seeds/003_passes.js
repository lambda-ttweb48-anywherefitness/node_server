const passes = [
  {
    owner_id: '00ulthapbErVUwVJy4x6',
    type: 'YOGA',
    issued_by: '00ulthapbErVUwVJy4x6',
    total_classes: 10,
    price_paid: 120.99,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('class_passes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('class_passes').insert(passes);
    });
};
