# Relatório técnico: falhas e possíveis melhorias

## 1) README e documentação

### Falhas encontradas
- O bloco de instalação/execução estava com marcação Markdown quebrada, dificultando leitura e cópia dos comandos.
- A árvore de diretórios documentada não refletia totalmente a estrutura real (ex.: `src/services` não existe).
- Não havia seção de troubleshooting para os erros mais comuns (webcam bloqueada, backend fora do ar, modelos ausentes).

### Melhorias sugeridas
- Padronizar README com seções: requisitos, execução local, scripts, arquitetura, troubleshooting e limitações conhecidas.
- Explicitar necessidade de executar frontend e backend simultaneamente.
- Incluir validação rápida pós-subida (`curl` no backend e checklist visual no frontend).

---

## 2) Frontend React (`src/`)

### Falhas encontradas
- `FaceRecognition` usava `setInterval` sem limpeza no `unmount`, gerando risco de vazamento de memória.
- O stream da webcam não era encerrado ao sair da página/componente.
- Era feita atribuição incorreta em canvas (`innerHTML`), comportamento não confiável para desenho em tempo real.
- Havia pouca tolerância a falhas na carga de modelos e no `fetch` das pessoas.
- Estilo inline usava `position: 'center'` (valor inválido em CSS).

### Melhorias sugeridas
- Centralizar tratamento de erros com mensagens amigáveis para o usuário.
- Incluir estado de carregamento (`loading`) e feedback visual durante inicialização de modelos.
- Permitir ajuste de threshold de reconhecimento via configuração.
- Considerar mover estilos inline para CSS para facilitar manutenção.

---

## 3) Backend (`server.js`)

### Falhas encontradas
- Porta fixa (`5000`) sem suporte a variável de ambiente.
- Rota de listagem não valida extensão com abordagem case-insensitive.
- Não existe limitação/rate-limit e nem middlewares de segurança básicos (`helmet`, por exemplo).

### Melhorias sugeridas
- Ler porta via `process.env.PORT`.
- Adicionar validação de entrada e logs estruturados.
- Implementar um healthcheck (`/health`) para observabilidade.

---

## 4) Testes e qualidade

### Falhas encontradas
- O teste padrão do CRA estava desatualizado para o componente atual.
- Dependências de reconhecimento facial pesadas tornam testes unitários frágeis se não houver mock.

### Melhorias sugeridas
- Criar testes unitários para:
  - carregamento de modelos;
  - fluxo de erro do backend;
  - renderização de estados (`loading`, erro, sucesso).
- Configurar pipeline de lint/test/build em CI.

---

## 5) Segurança e operação

### Falhas encontradas
- Imagens de pessoas reais em `public/pessoas` sem documentação de consentimento/uso.
- Modelos e assets pesados em `public/models` podem degradar tempo de carregamento.

### Melhorias sugeridas
- Definir política de privacidade e uso de dados biométricos para ambiente de demonstração.
- Habilitar compressão e cache agressivo de modelos estáticos.
- Avaliar lazy-load de modelos e detector mais leve conforme capacidade do dispositivo.
