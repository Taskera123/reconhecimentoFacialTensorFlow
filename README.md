# Reconhecimento Facial com TensorFlow.js

Este projeto é uma aplicação frontend que demonstra um sistema simples de reconhecimento facial utilizando [TensorFlow.js](https://www.tensorflow.org/js), ideal para estudos e demonstrações de vivacidade facial em tempo real.

## 📌 Visão Geral

- **Frontend**: Servido em `http://localhost:3000` com `npm run start`
- **Backend (Microserviço)**: Servido em `http://localhost:5000` com `npm run backend`
- **Reconhecimento Facial**: Implementado com `TensorFlow.js` diretamente no navegador

## 📂 Estrutura do Projeto

├── public/ # Arquivos públicos e modelo HTML base
├── src/ # Código fonte React e lógica de reconhecimento
│ ├── components/ # Componentes reutilizáveis da interface
│ ├── services/ # Comunicação com backend
│ ├── App.js # Componente principal da aplicação
│ └── index.js # Entrada principal do React
├── server.js # Backend Express para auxiliar a aplicação
├── package.json # Scripts e dependências
└── README.md # Este arquivo


## 🚀 Como Executar

### 1. Pré-requisitos

- Node.js instalado (versão recomendada: 16 ou superior)
- npm (gerenciador de pacotes do Node.js)

### 2. Instalação

Clone o projeto e instale as dependências:

```bash
npm install
3. Executar o Backend
```bash
npm run backend
Isso iniciará o microserviço na porta http://localhost:5000

4. Executar o Frontend
Em outro terminal:

```bash
npm run start
Isso abrirá a aplicação em http://localhost:3000

🧠 Tecnologias Utilizadas
React.js

TensorFlow.js

Express.js

HTML5, CSS3, JavaScript

💡 Funcionalidades
Captura de imagem facial via webcam

Processamento facial com modelo do TensorFlow

Comunicação com backend para manipulação dos dados (caso necessário)

📄 Licença
Este projeto está licenciado sob os termos da MIT License.

👨‍💻 Desenvolvido por
Lucas H. Tasca de Araujo


