const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/move', async (req, res) => {
    const { fen } = req.body;

    if (!fen) {
        return res.status(400).json({ error: "Falta el FEN en el body." });
    }

    try {
        // Consultamos la API pública de Stockfish
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
