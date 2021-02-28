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
  if (table === 'classes') {
    return await db('classes')
      .join('reservations', 'classes.id', '=', 'reservations.class_id')
      .select(
        db.raw(
          'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining'
        )
      )
      .groupBy('classes.id');
  } else return await db(table);
};

const findBy = async (table, filter) => {
  if (table === 'classes') {
    return await db('classes')
      .join('reservations', 'classes.id', '=', 'reservations.class_id')
      .select(
        db.raw(
          'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining'
        )
      )
      .groupBy('classes.id')
      .where(filter);
  } else return db(table).where(filter);
};

const findById = async (table, id) => {
  if (table === 'classes') {
    return await db('classes')
      .join('reservations', 'classes.id', '=', 'reservations.class_id')
      .select(
        db.raw(
          'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining'
        )
      )
      .groupBy('classes.id')
      .where({ 'classes.id': id })
      .first();
  } else return db(table).where({ id }).first().select('*');
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

const findAllClasses = async (classes) => {
  return await db(classes)
    .join('reservations', 'classes.id', '=', 'reservations.class_id')
    .select(
      db.raw(
        'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining'
      )
    )
    .groupBy('classes.id');
};

const findClassById = async (classes, id) => {
  return await db(classes)
    .join('reservations', 'classes.id', '=', 'reservations.class_id')
    .select(
      db.raw(
        'classes.*, (classes.max_size - count(reservations.id)::int) as spots_remaining'
      )
    )
    .where({ id })
    .first()
    .groupBy('classes.id');
};

module.exports = {
  schema,
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findClassById,
  findAllClasses,
};
