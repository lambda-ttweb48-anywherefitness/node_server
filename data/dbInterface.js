const db = require('./db-config');

const schema = {
  profiles: {
    friendlyName: 'Profile',
    searchFields: ['id', 'name'],
    requiredFields: ['email', 'name', 'password'],
  },
  classes: {
    friendlyName: 'Class',
    searchFields: [
      'owner_id',
      'type',
      'name',
      'start',
      'duration',
      'intensity',
      'location',
      'max_size',
    ],
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
    searchFields: ['class_id', 'pass_id', 'owner_id'],
    requiredFields: ['class_id', 'pass_id'],
  },
  class_passes: {
    friendlyName: 'Class Pass',
    searchFields: ['owner_id', 'price', 'total_classes'],
    requiredFields: ['total_classes', 'price'],
  },
  client_passes: {
    friendlyName: 'Client Pass',
    searchFields: ['owner_id', 'instructor_id'],
    requiredFields: ['class_pass_id'],
  },
};

const findReservationsById = async (id) => {
  return await db.raw(`
  SELECT R.ID AS RESERVATION_ID,
	  CLASSES.*,
	  (CLASSES.MAX_SIZE - COUNT(RCOUNT.ID)::int) AS SPOTS_REMAINING,
	  PROFILES.NAME AS PROFILE_NAME
  FROM RESERVATIONS AS R
  LEFT JOIN CLASSES ON R.CLASS_ID = CLASSES.ID
  LEFT JOIN RESERVATIONS RCOUNT ON CLASSES.ID = RCOUNT.CLASS_ID
  LEFT JOIN PROFILES ON PROFILES.ID = CLASSES.OWNER_ID
  WHERE R.OWNER_ID = '${id}'
  GROUP BY R.ID,
	  CLASSES.ID,
	  PROFILES.NAME`);
};

const findClassesBy = async (filter) => {
  return await db('classes')
    .leftJoin('reservations', { 'classes.id': 'reservations.class_id' })
    .leftJoin('profiles', { 'classes.owner_id': 'profiles.id' })
    .select(
      db.raw(
        `classes.*, 
        (classes.max_size - count(reservations.id)::int) as spots_remaining, 
        profiles.name as instructor`
      )
    )
    .groupBy('classes.id', 'profiles.id')
    .where(filter);
};

const findClassPassesBy = async (filter) => {
  return await db('class_passes')
    .leftJoin('reservations', { 'class_passes.id': 'reservations.pass_id' })
    .select(
      db.raw(
        `class_passes.*, 
        (count(reservations.id)::int) as num_of_clients`
      )
    )
    .groupBy('class_passes.id')
    .where(filter);
};

const findClientPassesBy = async (filter) => {
  return await db('client_passes')
    .leftJoin('reservations', { 'client_passes.id': 'reservations.pass_id' })
    .leftJoin('profiles', { 'client_passes.instructor_id': 'profiles.id' })
    .select(
      db.raw(
        `client_passes.*, 
        profiles.name as instructor,
        (count(reservations.id)::int) as classes_used`
      )
    )
    .groupBy('client_passes.id', 'profiles.id')
    .where(filter);
};

const findAll = async (table) => {
  switch (table) {
    case 'classes':
      return findClassesBy({});
    case 'class_passes':
      return findClassPassesBy({});
    case 'client_passes':
      return findClientPassesBy({});
    default:
      return await db(table);
  }
};

const findBy = async (table, filter) => {
  switch (table) {
    case 'classes':
      return findClassesBy(filter);
    case 'class_passes':
      return findClassPassesBy(filter);
    case 'client_passes':
      return findClientPassesBy(filter);
    default:
      return await db(table).where(filter);
  }
};

const findById = async (table, id) => {
  switch (table) {
    case 'classes':
      return findClassesBy({ ['classes.id']: id });
    case 'class_passes':
      return findClassPassesBy({ ['class_passes.id']: id });
    case 'client_passes':
      return findClientPassesBy({ ['client_passes.id']: id });
    default:
      return await db(table).where({ id });
  }
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
  findReservationsById,
  findClassesBy,
  findClassPassesBy,
  findClientPassesBy,
};
