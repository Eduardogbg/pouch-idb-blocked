(function fixWeirdPouchDdQuirk() {
    window.global = window;
})();

// README: we have to wait for fixWeirdPouchDdQuirk before importing pouchdb
async function importPouchDb() {
    const { default: PouchDb } = await import('pouchdb');
    const { default: indexedbAdapter } = await import('pouchdb-adapter-indexeddb');
    const { default: findPlugin } = await import('pouchdb-find');

    PouchDb.plugin(indexedbAdapter);
    PouchDb.plugin(findPlugin);

    return PouchDb;
}

async function initTestDb() {
    const PouchDb = await importPouchDb();

    const getDb = () => (
        new PouchDb(
            'test',
            {
                adapter: 'indexeddb',
                ajax: {
                    withCredentials: false
                }
            }
        )
    );

    await getDb().destroy();

    const testDb = getDb();
    await testDb
        .replicate
        .from('http://localhost:5984/test', { checkpoint: 'target' })
        .catch(console.error);

    return testDb
}

async function main() {
    const testDb = await initTestDb();

    const { docs } = await testDb.find({ selector: { type: 'doc' } });

    document.getElementById("docs").innerText = JSON.stringify(docs, null, 2);
}

main();
