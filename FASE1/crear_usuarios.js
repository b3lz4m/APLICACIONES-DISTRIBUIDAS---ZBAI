const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const uri = "mongodb+srv://alebelzamo_db_user:JLY3ZmmUWEn2G1XY@cluster0.0ix4eqt.mongodb.net/?appName=Cluster0"; 

const client = new MongoClient(uri);

function aplicarSHA256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function poblarBaseDeDatos() {
    try {
        // Cluster
        await client.connect();
        console.log("Conectado correctamente a MongoDB Atlas");

        const database = client.db('sistema_2fa'); 
        const coleccionUsuarios = database.collection('usuarios');

        const usuariosNuevos = [
            {
                usuario: "alejandra@correo.com",
                password: aplicarSHA256("mipassword123"), 
                name: "Alejandra",
                created: new Date(), 
                deleted: false 
            },
            {
                usuario: "isabel@correo.com",
                password: aplicarSHA256("secreta456"),
                name: "Isabel",
                created: new Date(),
                deleted: false
            },
            {
                usuario: "erick@correo.com",
                password: aplicarSHA256("hola789"),
                name: "Erick",
                created: new Date(),
                deleted: false
            },
            {
                usuario: "cristian@correo.com",
                password: aplicarSHA256("test000"),
                name: "Cristian",
                created: new Date(),
                deleted: false
            },
            {
                usuario: "karla@correo.com",
                password: aplicarSHA256("admin111"),
                name: "Karla",
                created: new Date(),
                deleted: false
            }
        ];

  
        const resultado = await coleccionUsuarios.insertMany(usuariosNuevos);
        console.log(`${resultado.insertedCount} usuarios fueron agregados exitosamente.`);

    } catch (error) {
        console.error("Hubo un error:", error);
    } finally {
        // Cerrar la conexión
        await client.close();
    }
}

poblarBaseDeDatos();
