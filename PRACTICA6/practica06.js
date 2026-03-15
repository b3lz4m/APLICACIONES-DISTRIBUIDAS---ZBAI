
require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient } = require('mongodb');

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function findAllData(client) {
    const db = client.db("sample_mflix");


    console.log("primeros 5 comentarios (comments):");
    const commentsCursor = await db.collection("comments").find({}).limit(5);
    const commentsResults = await commentsCursor.toArray();
    console.log(JSON.stringify(commentsResults, null, 2));

    console.log("Primeras 5 películas incrustadas (embedded_movies):");
    const embeddedMoviesCursor = await db.collection("embedded_movies").find({}).limit(5);
    const embeddedMoviesResults = await embeddedMoviesCursor.toArray();
    console.log(JSON.stringify(embeddedMoviesResults, null, 2));
}

async function main() {
    const usuario = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASS);
    const cluster = process.env.DB_CLUSTER;

    const uri = `mongodb+srv://${usuario}:${password}@${cluster}/?appName=Cluster0`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await listDatabases(client);
        await findAllData(client);
    } catch (e) {
        console.error("Ocurrió un error:", e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);