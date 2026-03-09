# Reconhecimento Facial com TensorFlow.js

Aplicação de demonstração de reconhecimento facial em tempo real no navegador usando **React** + **face-api.js/TensorFlow.js**, com um microserviço em **Express** para listar pessoas cadastradas.

## Visão geral

- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:5000`
- **Reconhecimento facial:** executado no cliente (browser) com modelos em `public/models`

## Estrutura do projeto

```text
.
├── public/
│   ├── models/               # Modelos de visão computacional
│   └── pessoas/              # Imagens de referência para reconhecimento
├── src/
│   ├── components/
│   │   └── FaceRecognition.js
│   ├── App.js
│   └── index.js
├── server.js                 # API simples para listar pessoas
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js 16+ (recomendado)
- npm
- Navegador com permissão de webcam

## Instalação

```bash
npm install
```

## Como executar

### 1) Subir backend

```bash
npm run backend
```

Backend disponível em `http://localhost:5000`.

### 2) Subir frontend

Em outro terminal:

```bash
npm start
```

Frontend disponível em `http://localhost:3000`.

## Scripts disponíveis

- `npm start` — inicia app React
- `npm run backend` — inicia API Express
- `npm test` — executa testes
- `npm run build` — gera build de produção

## Funcionalidades

- Captura de vídeo via webcam
- Detecção e landmarks faciais
- Matching facial com base em imagens locais (`public/pessoas`)
- Exibição do nome identificado (ou "Desconhecido")

## Observações importantes

- O backend precisa estar em execução para carregar os rótulos de pessoas.
- As imagens em `public/pessoas` devem conter rostos detectáveis.
- O primeiro carregamento pode ser mais lento devido ao download dos modelos.

## Licença

MIT

## Autor

Lucas H. Tasca de Araujo
