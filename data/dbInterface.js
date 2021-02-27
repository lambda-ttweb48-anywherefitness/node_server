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

const findAll = async (table) => {
  return await db(table);
};

const findBy = (table, filter) => {
  return db(table).where(filter);
};

const findById = async (table, id) => {
  return db(table).where({ id }).first().select('*');
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
};
