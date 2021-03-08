const classes = [
  {
    name: 'Yoga 90 L2',
    type: 'yoga',
    start: new Date(2021, 2, 1, 6, 0, 0, 0),
    duration: 90,
    intensity: 'hard',
    location: 'somewhere',
    max_size: 15,
    owner_id: '00ulthapbErVUwVJy1x1',
  },
  {
    name: 'Yoga 60 Beginners',
    type: 'yoga',
    start: new Date(2021, 2, 21, 8, 0, 0, 0),
    duration: 60,
    intensity: 'easy',
    location: 'somewhere',
    max_size: 20,
    owner_id: '00ulthapbErVUwVJy1x1',
  },
  {
    name: 'Pilates 60',
    type: 'Pilates',
    start: new Date(2021, 2, 15, 10, 0, 0, 0),
    duration: 60,
    intensity: 'medium',
    location: 'somewhere',
    max_size: 15,
    owner_id: '00ulthapbErVUwVJy1x1',
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('classes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('classes').insert(classes);
    });
};
