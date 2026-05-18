const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// 1. Pega aquí tu cadena de conexión de Atlas
const uri = "mongodb+srv://alebelzamo_db_user:JLY3ZmmUWEn2G1XY@cluster0.0ix4eqt.mongodb.net/?appName=Cluster0"; 

const client = new MongoClient(uri);

// Función para cifrar la contraseña en SHA256
function aplicarSHA256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function poblarBaseDeDatos() {
    try {
        // Conectar al cluster
        await client.connect();
        console.log("Conectado correctamente a MongoDB Atlas");

        // Crear/Seleccionar la base de datos y la colección
        const database = client.db('sistema_2fa'); // Puedes cambiar el nombre
        const coleccionUsuarios = database.collection('usuarios');

        // 2. Definir los 5 usuarios según los campos de tu pizarrón
        const usuariosNuevos = [
            {
                usuario: "alejandra@correo.com",
                password: aplicarSHA256("mipassword123"), // Se cifra antes de guardar
                name: "Alejandra",
                created: new Date(), // Fecha y hora actual
                deleted: false // Falso porque están activos
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

        // 3. Insertar los usuarios en la base de datos
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
