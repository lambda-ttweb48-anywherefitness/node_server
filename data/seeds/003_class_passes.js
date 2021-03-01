const passes = [
  {
    owner_id: '00ulthapbErVUwVJy1x1',
    total_classes: 10,
    price: 99.99,
  },
  {
    owner_id: '00ulthapbErVUwVJy1x1',
    total_classes: 5,
    price: 69.99,
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
