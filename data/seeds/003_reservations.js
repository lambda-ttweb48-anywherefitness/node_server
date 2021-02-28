const reservations = [
  { class_id: 1, owner_id: '00ulthapbErVUwVJy4x6' },
  { class_id: 1, owner_id: '00ulthapbErVUwVJy4x6' },
  { class_id: 1, owner_id: '00ulthapbErVUwVJy4x6' },
  { class_id: 2, owner_id: '00ulthapbErVUwVJy4x6' },
  { class_id: 2, owner_id: '00ulthapbErVUwVJy4x6' },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('reservations')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('reservations').insert(reservations);
    });
};
