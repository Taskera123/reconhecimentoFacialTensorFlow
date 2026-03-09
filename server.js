const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());

// Rota para listar as imagens dentro da pasta 'public/pessoas'
app.get('/api/pessoas', (req, res) => {
  const folderPath = path.join(__dirname, 'public', 'pessoas');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler a pasta de pessoas:', err);
      return res.status(500).send('Erro ao ler a pasta de pessoas');
    }

    // Filtrar apenas arquivos .jpg, .jpeg ou .png
    const images = files
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
      .map(file => path.parse(file).name); // Pega só o nome sem extensão

    res.json(images);
  });
});

// Rota para servir as imagens
app.use('/pessoas', express.static(path.join(__dirname, 'public', 'pessoas')));

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
