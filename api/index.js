const express = require('express');
const app = express();

app.use(express.json());

// Aceptamos peticiones tanto en /api/move como en la raíz /
app.all('*', async (req, res) => {
    // Si la petición no es POST, devolvemos un mensaje de estado activo
    if (req.method !== 'POST') {
        return res.json({ status: "API Online", usage: "Envía un POST con { fen: '...' }" });
    }

    const { fen } = req.body || {};

    if (!fen) {
        return res.status(400).json({ success: false, error: "Falta la cadena FEN." });
    }

    try {
        const response = await fetch('https://chess-api.com/v1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fen: fen,
                depth: 12
            })
        });

        const data = await response.json();

        res.json({
            success: true,
            bestMove: data.move,
            from: data.from,
            to: data.to,
            san: data.san
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = app;
