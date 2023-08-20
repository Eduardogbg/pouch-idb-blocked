import express from 'express';
import pouchDbServer from 'express-pouchdb';
import PouchDb from 'pouchdb';
import PouchDbFindPlugin from 'pouchdb-find';
import cors from 'pouchdb-server/lib/cors';

async function initTestDb() {
    const testDb = new PouchDb('http://localhost:5984/test');

    PouchDb.plugin(PouchDbFindPlugin);

    testDb.createIndex({ index: { fields: ['type'] } });

    return testDb;
}

function startPouchDbServer() {
    const pouchDbBuilder = PouchDb.defaults({
        prefix: './pouch/',
    });

    const serverConfig = {
        mode: 'fullCouchDB',
        configPath: './config.json'
    };

    const pouchDBApp = pouchDbServer(pouchDbBuilder, serverConfig);

    const app = express();
    app.use(cors(pouchDBApp.couchConfig));
    app.use(pouchDBApp);

    return app.listen(5984);
}

async function main() {
    startPouchDbServer();
    const testDb = await initTestDb();
    await testDb.post({ type: 'doc', value: 'abacaba' });
}

main();
