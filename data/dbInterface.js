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
    searchFields: ['class_id', 'pass_id', 'owner_id', 'start'],
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

const findReservationsBy = async (filter) => {
  return await db('reservations')
    .leftJoin('classes', { 'reservations.class_id': 'classes.id' })
    .leftJoin('reservations as rcount', { 'classes.id': 'rcount.class_id' })
    .leftJoin('profiles', { 'classes.owner_id': 'profiles.id' })
    .select(
      db.raw(
        `reservations.id as reservation_id,
        reservations.pass_id as client_pass_id,
        reservations.owner_id as owner_id,
        CLASSES.id as CLASS_ID,
        classes.name as class_name,
        CLASSES.OWNER_ID as INSTRUCTOR_ID,
        PROFILES.NAME AS INSTRUCTOR,
        classes.type as class_type,
        classes.duration as class_duration,
        classes.start as class_start,
        classes.intensity as class_intensity,
        classes.location as class_location,
        classes.max_size as class_size,
        (CLASSES.MAX_SIZE - COUNT(RCOUNT.ID)::int) AS SPOTS_REMAINING`
      )
    )
    .groupBy('reservations.id', 'classes.id', 'profiles.id')
    .where((builder) => {
      const { 'reservations.start': start, ...newFilter } = filter;
      if (start === 'all') {
        builder.where(newFilter);
      } else if (start) {
        builder
          .where(newFilter)
          .andWhereRaw(`classes.start::date = ?`, [start]);
      } else {
        builder
          .where(newFilter)
          .andWhere('classes.start', '>=', new Date().toISOString());
      }
    });
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
    .where((builder) => {
      const { 'classes.start': start, ...newFilter } = filter;
      if (start === 'all') {
        builder.where(newFilter);
      } else if (start) {
        builder
          .where(newFilter)
          .andWhereRaw(`classes.start::date = ?`, [start]);
      } else {
        builder
          .where(newFilter)
          .andWhere('classes.start', '>=', new Date().toISOString());
      }
    });
};

const findClassPassesBy = async (filter) => {
  return await db('class_passes')
    .leftJoin('profiles', { 'class_passes.owner_id': 'profiles.id' })
    .select(
      db.raw(
        `class_passes.*, 
        profiles.name as instructor`
      )
    )
    .groupBy('class_passes.id', 'profiles.id')
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
        profiles.id as instructor_id,
        (count(reservations.id)::int) as classes_used`
      )
    )
    .groupBy('client_passes.id', 'profiles.id')
    .where(filter);
};

const findBy = async (table, filter) => {
  switch (table) {
    case 'classes':
      return findClassesBy(filter);
    case 'class_passes':
      return findClassPassesBy(filter);
    case 'client_passes':
      return findClientPassesBy(filter);
    case 'reservations':
      return findReservationsBy(filter);
    default:
      return await db(table).where(filter);
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
  findBy,
  create,
  update,
  remove,
};
