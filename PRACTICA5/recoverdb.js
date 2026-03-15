require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient, ServerApiVersion } = require('mongodb');

const usuario = encodeURIComponent("alebelzamo_db_user");
const password = encodeURIComponent("JLY3ZmmUWEn2G1XY");

const uri = `mongodb+srv://${usuario}:${password}@cluster0.0ix4eqt.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("\nBases de datos disponibles:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function run() {
  try {
    console.log("Conectando aMongoDB Atlas...");
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Conexion exitosa aMongoDB.");

    await listDatabases(client);

  } catch (error) {
    console.error("Error detectado al conectar:", error.message);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);