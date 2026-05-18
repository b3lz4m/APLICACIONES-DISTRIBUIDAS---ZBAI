require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
let client, database, collectionProyectos;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
    const usuario = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASS);
    const cluster = process.env.DB_CLUSTER;
    const uri = `mongodb+srv://${usuario}:${password}@${cluster}/?appName=Cluster0`;

    client = new MongoClient(uri);
    await client.connect();
    
    database = client.db("clase_distribuidas"); 
    collectionProyectos = database.collection("proyectos");
    console.log("Conectado a MongoDB Atlas exitosamente");
}

app.get("/", (req, res) => res.json({ message: "Servidor Activo" }));

// Crear un proyecto nuevo (POST)
app.post("/serv003/:info", async (req, res) => {
    const info = req.params.info; 
    const { nombre, descripcion, presupuesto, responsable } = req.body;

    try {
        const nuevoProyecto = {
            id_externo: info,            
            nombre: nombre,              
            descripcion: descripcion,    
            presupuesto: presupuesto,    
            responsable: responsable,    
            deleted: false // Inicializa estado lógico
        };

        const resultado = await collectionProyectos.insertOne(nuevoProyecto);
        
        res.json({ 
            mensaje: "Proyecto insertado correctamente", 
            id_interno: resultado.insertedId, 
            id_externo: info 
        });
    } catch (err) {
        res.status(500).json({ error: "Error al insertar: " + err });
    }
});

// Eliminación lógica (PUT)
app.put('/proyectos/delete/:id_externo', async (req, res) => {
    const idExterno = req.params.id_externo;

    try {
        const resultado = await collectionProyectos.updateOne(
            { id_externo: idExterno },
            { $set: { deleted: true } } 
        );

        if (resultado.modifiedCount === 1) {
            res.json({ mensaje: `Proyecto ${idExterno} marcado como eliminado (lógico)` });
        } else {
            res.json({ mensaje: "No se encontró el proyecto o ya estaba eliminado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar: " + error });
    }
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
    connectDB().catch(console.error);
});