const express = require('express');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const TelegramBot = require('node-telegram-bot-api'); 

const app = express();
const port = 3000;
app.use(express.json());


app.use(express.static('public'));

const uri = "mongodb+srv://alebelzamo_db_user:JLY3ZmmUWEn2G1XY@cluster0.0ix4eqt.mongodb.net/?appName=Cluster0"; 
const client = new MongoClient(uri);
const dbName = 'sistema_2fa';

const tokenTelegram = '8516114324:AAFzx6Copju8KdkOINSUVOYDe0434bsOFVA';
const miChatId = '1532632435'; 
const bot = new TelegramBot(tokenTelegram, {polling: false});

function aplicarSHA256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function generarPIN() {
    const r = Math.random();
    const pin = Math.floor(r * 10000);
    return pin.toString().padStart(4, '0');
}


app.post('/usuarios/valida_login', async (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.json({ valido: 0, estado: 2, mensaje: "Faltan datos" });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');
        const pinesCol = db.collection('pines_temporales');

        const passwordHashed = aplicarSHA256(contraseña);
        const userFound = await usuarios.findOne({ usuario, password: passwordHashed });

        if (userFound) {
            const nuevoPin = generarPIN();
            const ahora = new Date();
            const expiracion = new Date(ahora.getTime() + 5 * 60000); 

            await pinesCol.insertOne({
                usuario: usuario,
                pin: nuevoPin,
                creado: ahora,
                finaliza: expiracion,
                utilizado: false
            });

            const mensajeParaEnviar = `🔐 Hola ${userFound.name},\nTu código de acceso es: *${nuevoPin}*\nEste código expira en 5 minutos.`;
            bot.sendMessage(miChatId, mensajeParaEnviar, {parse_mode: 'Markdown'})
                .catch((err) => console.error("Error de Telegram:", err));

            res.json({ 
                valido: 1, 
                estado: 0, 
                mensaje: "Login correcto, revisa tu Telegram para el PIN" 
            });
        } else {
            res.json({ valido: 0, estado: 1, mensaje: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ valido: 0, estado: 3, mensaje: "Error de servidor" });
    }
});


app.post('/usuarios/valida_pin', async (req, res) => {
    const { usuario, pin } = req.body;

    if (!usuario || !pin) {
        return res.json({ valido: 0, mensaje: "Falta el usuario o el PIN" });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const pinesCol = db.collection('pines_temporales');

        const ahora = new Date();

        const pinValido = await pinesCol.findOne({
            usuario: usuario,
            pin: pin,
            utilizado: false,
            finaliza: { $gte: ahora } 
        });

        if (pinValido) {
           
            await pinesCol.updateOne(
                { _id: pinValido._id },
                { $set: { utilizado: true } }
            );

            res.json({ valido: 1, estado: 0, mensaje: "¡Acceso concedido! 2FA completado exitosamente." });
        } else {
            res.json({ valido: 0, estado: 1, mensaje: "PIN incorrecto o expirado." });
        }

    } catch (error) {
        res.status(500).json({ valido: 0, estado: 3, mensaje: "Error de servidor" });
    }
});


app.listen(port, () => {
    console.log(`Servidor de UPIITA escuchando en http://localhost:${port}`);
});
