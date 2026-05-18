require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
let client, database, collection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
    const usuario = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASS);
    const cluster = process.env.DB_CLUSTER;
    const uri = `mongodb+srv://${usuario}:${password}@${cluster}/?appName=Cluster0`;

    client = new MongoClient(uri);
    await client.connect();
    database = client.db("myDatabase");
    collection = database.collection("recipes");
}

app.get("/", (req, res) => res.json({ message: "Server is running" }));

app.post("/receipt/insert", async (req, res) => {
    const recipes = req.body.recipes; 
    let result = "";

    try {
        const insertManyResult = await collection.insertMany(recipes);
        result = `${insertManyResult.insertedCount} documentos insertados correctamente.`;
        console.log(result);
    } catch (err) {
        result = `Error al insertar: ${err}`;
        console.error(result);
    }
    res.json({ result: result });
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
    connectDB().catch(console.error);
});
