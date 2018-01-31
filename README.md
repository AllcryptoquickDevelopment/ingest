# ingest
Ingest service that collect data of cryptocoins and feeds into a database

## Build and Run
### Run locally
1. Make sure you have `node` and `mongodb` installed and running.
2. Clone the project
3. `npm install`
4. `npm run start`     

### Run with Docker
The docker mode is intended for production use. In order to do so:     
A folder `/etc/cert` is required which holds all the ssl keys/certs that are used by mongodb.      
And a folder `/mongo_data` is required which is used as the dbpath for mongodb.     

1. Clone the project
2. `docker-compose up`
