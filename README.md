# ingest
Ingest service that collect data of cryptocoins and feeds into a database

## Build and Run
### Run locally
1. Make sure you have `node` and `mongodb` installed and running.
2. Clone the project, and in `config.js` make sure the mongodb url points to `localhost`
3. `npm install`
4. `npm run start`     

### Run with Docker
1. `build -t cryptoinsights/ingest .`
2. `docker-compose up`
