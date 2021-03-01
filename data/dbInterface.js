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
    requiredFields: ['class_id', 'pass_id'],
  },
  class_cards: {
    friendlyName: 'Class Pass',
    requiredFields: ['owner_id', 'type', 'total_classes', 'price_paid'],
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

const findReservationsBy = async (filter) => {
  return await db('reservations')
    .leftJoin('classes', 'reservations.class_id', 'classes.id')
    .leftJoin({ rcount: 'reservations' }, 'classes.id', 'rcount.class_id')
    .leftJoin('profiles', 'classes.owner_id', 'profiles.id')
    .select(
      db.raw(
        `reservations.id as reservation_id,
        classes.*,
        (classes.max_size - count(rcount.id)::int) as spots_remaining, 
        profiles.name as instructor`
      )
    )
    .where(filter)
    .groupBy('reservations.id', 'classes.id', 'profiles.name');
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

const findPassesBy = async (filter) => {
  return await db('class_cards')
    .leftJoin('reservations', { 'class_cards.id': 'reservations.pass_id' })
    .select(
      db.raw(
        `class_cards.*, 
        (count(reservations.id)::int) as classes_used`
      )
    )
    .groupBy('class_cards.id')
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
  findReservationsById,
  findReservationsBy,
  findClassesBy,
  findPassesBy,
};
