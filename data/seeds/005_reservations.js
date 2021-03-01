const reservations = [
  { class_id: 1, pass_id: 1, owner_id: '22ulthapbErVUwVJy9x9' },
  { class_id: 2, pass_id: 1, owner_id: '22ulthapbErVUwVJy9x9' },
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
