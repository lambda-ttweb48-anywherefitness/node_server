const db = require('./db-config');

const schema = {
  profiles: {
    friendlyName: 'Profile',
    requiredFields: ['email', 'name', 'password'],
  },
  classes: {
    friendlyName: 'Class',
    requiredFields: [
      'type',
      'name',
      'start',
      'duration',
      'intensity',
      'location',
      'max_size',
    ],
  },
  reservations: {
    friendlyName: 'Reservation',
    requiredFields: ['class_id'],
  },
};

const findClassesBy = async (filter) => {
  return await db('classes')
    .leftJoin('reservations', { 'classes.id': 'reservations.class_id' })
    .leftJoin('profiles', { 'classes.owner_id': 'profiles.id' })
    .select(
      db.raw(
        'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining, profiles.name as instructor'
      )
    )
    .groupBy('classes.id', 'profiles.name')
    .where(filter);
};

const findAll = async (table) => {
  if (table === 'classes') {
    return findClassesBy({});
  } else return await db(table);
};

const findBy = async (table, filter) => {
  if (table === 'classes') {
    return findClassesBy(filter);
  } else return db(table).where(filter);
};

const findById = async (table, id) => {
  if (table === 'classes') {
    return findClassesBy({ ['classes.id']: id });
  } else return db(table).where({ id }).select('*');
};

const create = async (table, newObj) => {
  return db(table).insert(newObj).returning('*');
};

const update = (table, id, changes) => {
  return db(table).where({ id }).first().update(changes).returning('*');
};

const remove = async (table, id) => {
  return await db(table).where({ id }).del();
};

module.exports = {
  schema,
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findClassesBy,
};
