# Anywhere Fitness Backend

## API Endpoints
Server is deployed at: https://anywherefitness-server.herokuapp.com/

### Auth
Path|Method|Requirements|Auth
---|-----|-------------|---
/register|POST|email, password, name, instructor(boolean)|none
/login|POST|email, password|none


### Classes
Path|Method|Requirements|Auth
---|-----|-------------|-----
/api/classes| GET | optional query strings to filter search | none
/api/classes|POST| name, type, start (Datetime), duration (int minutes), intensity, location, max_size (int)|valid JWT token w intstructor = true 
/api/classes/:id| PUT | id, any edits | Auth token profile id must match class owner id
/api/classes/:id| DELETE | none | Auth token profile id must match class owner id
/dash/classes|GET|none|valid auth token, will return all classes taught by token profile

### Class Passes
Path|Method|Requirements|Auth
---|-----|-------------|-----
/api/class_passes| GET | none | none
/api/class_passes|POST| total_classes, price (decimal) | valid JWT token w instructor = true
/api/class_passes/:id| PUT | id, any edits | Auth token profile id must match class_pass owner id
/api/class_passes/:id| DELETE | none | Auth token profile id must match reservation owner id
/dash/class_passes|GET|none|Auth token (will return all class passes for the token profile id)

### Client Passes
Path|Method|Requirements|Auth
---|-----|-------------|-----
/api/client_passes| GET | none | none
/api/client_passes/:id| GET | none | none
/api/client_passes|POST| class_pass_id | valid JWT token 
/api/client_passes/:id| DELETE | none | Auth token profile id must match reservation owner id
/dash/client_passes|GET|none|Auth token (will return all client passes for the token profile id)

### Reservations
Path|Method|Requirements|Auth
---|-----|-------------|-----
/api/reservations| GET | none | none
/api/reservations|POST| class_id, class_pass_id |valid JWT token 
/api/reservations:id| PUT | id, any edits | Auth token profile id must match reservation owner id
/api/reservations/:id| DELETE | none | Auth token profile id must match reservation owner id
/dash/reservations|GET|none|Auth token (will return all reservations for the token profile id)

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
