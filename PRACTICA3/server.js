const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/mascaracteres', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (typeof cad1 !== 'string' || typeof cad2 !== 'string') 
        return res.status(400).json({ error: "Parámetros inválidos" });
    res.json({ resultado: cad1.length >= cad2.length ? cad1 : cad2 });
});

app.post('/menoscaracteres', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (typeof cad1 !== 'string' || typeof cad2 !== 'string') 
        return res.status(400).json({ error: "Parámetros inválidos" });
    res.json({ resultado: cad1.length <= cad2.length ? cad1 : cad2 });
});

app.post('/numcaracteres', (req, res) => {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') 
        return res.status(400).json({ error: "Dato inválido" });
    res.json({ resultado: cadena.length });
});

app.post('/palindroma', (req, res) => {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') 
        return res.status(400).json({ error: "Dato inválido" });
    const limpia = cadena.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversa = limpia.split("").reverse().join("");
    res.json({ resultado: limpia === reversa });
});

app.post('/concat', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (typeof cad1 !== 'string' || typeof cad2 !== 'string') 
        return res.status(400).json({ error: "Datos faltantes" });
    res.json({ resultado: cad1 + cad2 });
});

app.post('/applysha256', (req, res) => {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') 
        return res.status(400).json({ error: "Dato inválido" });
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');
    res.json({ original: cadena, encriptada: hash });
});

app.post('/verifysha256', (req, res) => {
    const { encriptada, normal } = req.body;
    if (!encriptada || !normal) 
        return res.status(400).json({ error: "Faltan datos" });
    const hashNormal = crypto.createHash('sha256').update(normal).digest('hex');
    res.json({ coinciden: hashNormal === encriptada });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
