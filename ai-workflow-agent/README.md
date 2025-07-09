# AI Workflow Agent - Gerador de Código

Um agente de IA para montagem de workflows de geração de código com interface drag-and-drop, construído com Node.js, JavaScript e Vue.js.

## 🚀 Funcionalidades

- **Interface Drag-and-Drop**: Arraste e solte elementos para criar workflows
- **Conexões Lógicas**: Conecte elementos para criar fluxos de processamento
- **Tempo Real**: Colaboração em tempo real com Socket.IO
- **Elementos de IA**: Diferentes tipos de nós para geração de código
- **Interface Moderna**: Design responsivo e intuitivo
- **Persistência**: Salve e carregue workflows

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **UUID** - Geração de IDs únicos

### Frontend
- **Vue.js 3** - Framework JavaScript progressivo
- **Vuex** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Element Plus** - Componentes UI
- **Socket.IO Client** - Cliente para comunicação em tempo real

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd ai-workflow-agent
```

### 2. Instale as dependências do backend
```bash
cd backend
npm install
```

### 3. Instale as dependências do frontend
```bash
cd ../frontend
npm install
```

## 🚀 Executando o Projeto

### 1. Inicie o backend
```bash
cd backend
npm run dev
```
O servidor estará disponível em `http://localhost:3000`

### 2. Inicie o frontend
```bash
cd frontend
npm run serve
```
A aplicação estará disponível em `http://localhost:8080`

## 🎯 Como Usar

### 1. Criando um Workflow
1. Acesse a aplicação em `http://localhost:8080`
2. Clique em "Novo Workflow"
3. Digite um nome para o workflow
4. Clique em "Criar Workflow"

### 2. Adicionando Elementos
1. No painel lateral, você verá diferentes tipos de elementos de IA
2. Arraste um elemento para o canvas
3. Posicione-o onde desejar

### 3. Conectando Elementos
1. Clique no botão "Conectar" na barra de ferramentas
2. Clique e arraste de uma porta de saída (lado direito) para uma porta de entrada (lado esquerdo)
3. Solte para criar a conexão

### 4. Editando Elementos
1. Clique em um elemento para selecioná-lo
2. Clique no ícone de edição para modificar suas propriedades
3. Configure o nome, tipo e parâmetros

### 5. Executando o Workflow
1. Clique em "Executar" na barra de ferramentas
2. O sistema processará o workflow e gerará o código

## 🧩 Tipos de Elementos

### 1. Prompt de IA
- **Função**: Define prompts para geração de código
- **Entradas**: Nenhuma
- **Saídas**: Resultado do prompt

### 2. Gerador de Código
- **Função**: Gera código baseado em entrada
- **Entradas**: Dados de entrada
- **Saídas**: Código gerado

### 3. Escritor de Arquivo
- **Função**: Escreve código em arquivo
- **Entradas**: Código para escrever
- **Saídas**: Nenhuma

### 4. Condição
- **Função**: Aplica lógica condicional
- **Entradas**: Dados para avaliar
- **Saídas**: Verdadeiro/Falso

### 5. Processador de Dados
- **Função**: Processa e transforma dados
- **Entradas**: Dados brutos
- **Saídas**: Dados processados

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na pasta `backend`:

```env
PORT=3000
NODE_ENV=development
```

### Personalização
- Modifique os tipos de nós em `frontend/src/views/WorkflowEditor.vue`
- Adicione novos elementos de IA conforme necessário
- Personalize o estilo em `frontend/src/App.vue`

## 📁 Estrutura do Projeto

```
ai-workflow-agent/
├── backend/
│   ├── server.js          # Servidor principal
│   ├── package.json       # Dependências do backend
│   └── routes/            # Rotas da API
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── views/         # Páginas
│   │   ├── store/         # Gerenciamento de estado
│   │   ├── router/        # Roteamento
│   │   ├── App.vue        # Componente principal
│   │   └── main.js        # Entrada da aplicação
│   ├── public/            # Arquivos públicos
│   └── package.json       # Dependências do frontend
└── README.md
```

## 🔌 API Endpoints

### Workflows
- `GET /api/workflows` - Lista todos os workflows
- `POST /api/workflows` - Cria um novo workflow
- `GET /api/workflows/:id` - Obtém um workflow específico
- `PUT /api/workflows/:id` - Atualiza um workflow
- `DELETE /api/workflows/:id` - Deleta um workflow

### Socket.IO Events
- `join-workflow` - Entra em um workflow
- `node-moved` - Nó movido
- `node-added` - Nó adicionado
- `node-deleted` - Nó deletado
- `connection-added` - Conexão adicionada
- `connection-deleted` - Conexão deletada

## 🚀 Próximos Passos

- [ ] Implementar execução real dos workflows
- [ ] Adicionar mais tipos de elementos de IA
- [ ] Implementar autenticação de usuários
- [ ] Adicionar persistência em banco de dados
- [ ] Implementar versionamento de workflows
- [ ] Adicionar templates de workflows
- [ ] Implementar exportação/importação de workflows

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para facilitar a geração de código com IA**