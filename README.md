# Anywhere Fitness Backend

## API Endpoints

### Auth
POST to /register to create a new account
- email
- password
- name 
- instructor (boolean)

POST to /login to login
- email
- password

### Classes
All POST, PUT, DELETE actions for classes will require an auth header token for a logged in instructor.
GET classes will be an unprotected route.
Route is /api/classes

Required fields for creation:
- name
- type
- start
-- Datetime object
- duration
-- integer (minutes)
- intensity
- location
- max_size
-- integer (number of slots in class)


### Reservations
All POST & DELETE actions for reservations will require an auth header token for a logged in user.
GET classes TBD.
Route is /api/reserverations

POST to /api/reservations to create a new student reservation. 
- class_id

PUTS

## Getting Started

### Enviornment Variables

See .env.sample for example values

### Setup postgres

There are 3 options to get postgresql installed locally [Choose one]:

1. Use docker. [Install](https://docs.docker.com/get-docker/) for your platform
   - run: `docker-compose up -d` to start up the postgresql database and pgadmin.
   - Open a browser to [pgadmin](http://localhost:5050/) and you should see the Dev server already defined.
   - If you need to start over you will need to delete the folder `$ rm -rf ./data/pg` as this is where all of the server data is stored.
     - if the database `api-dev` was not created then start over.
2. Download and install postgresql directly from the [main site](https://www.postgresql.org/download/)
   - make note of the port, username and password you use to setup the database.
   - Connect your client to the server manually using the values previously mentioned
   - You will need to create a database manually using a client.
   - Make sure to update the DATABASE_URL connection string with the values for username/password, databasename and server port (if not 5432).
3. Setup a free account at [ElephantSQL](https://www.elephantsql.com/plans.html)
   - Sign up for a free `Tiney Turtle` plan
   - copy the URL to the DATABASE_URL .env variable
   - make sure to add `?ssl=true` to the end of this url

### Setup the application

- create your project repo by forking or using this as a template.
- run: `npm install` to download all dependencies.
- run: `cp .env.sample .env` and update the enviornment variables to match your local setup.
- run: `npm run knex migrate:latest` to create the starting schema.
- run: `npm run knex seed:run` to populate your db with some data.
- run: `npm run tests` to confirm all is setup and tests pass.
- run: `npm run watch:dev` to start nodemon in local dev enviornment.

> Make sure to update the details of the app name, description and version in
> the `package.json` and `config/jsdoc.js` files.
