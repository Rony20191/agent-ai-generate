const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Armazenamento em memória para workflows
const workflows = new Map();
const activeConnections = new Map();

// Rotas da API
app.get('/api/workflows', (req, res) => {
  const workflowsList = Array.from(workflows.values());
  res.json(workflowsList);
});

app.post('/api/workflows', (req, res) => {
  const { name, nodes, connections } = req.body;
  const workflowId = uuidv4();
  
  const workflow = {
    id: workflowId,
    name: name || 'Novo Workflow',
    nodes: nodes || [],
    connections: connections || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  workflows.set(workflowId, workflow);
  res.json(workflow);
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow não encontrado' });
  }
  res.json(workflow);
});

app.put('/api/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow não encontrado' });
  }
  
  const { name, nodes, connections } = req.body;
  workflow.name = name || workflow.name;
  workflow.nodes = nodes || workflow.nodes;
  workflow.connections = connections || workflow.connections;
  workflow.updatedAt = new Date().toISOString();
  
  workflows.set(req.params.id, workflow);
  
  // Notificar clientes conectados sobre a atualização
  io.emit('workflow-updated', workflow);
  
  res.json(workflow);
});

app.delete('/api/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow não encontrado' });
  }
  
  workflows.delete(req.params.id);
  io.emit('workflow-deleted', req.params.id);
  
  res.json({ message: 'Workflow deletado com sucesso' });
});

// Socket.IO para comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  activeConnections.set(socket.id, socket);
  
  socket.on('join-workflow', (workflowId) => {
    socket.join(workflowId);
    console.log(`Cliente ${socket.id} entrou no workflow ${workflowId}`);
  });
  
  socket.on('node-moved', (data) => {
    socket.to(data.workflowId).emit('node-moved', data);
  });
  
  socket.on('node-added', (data) => {
    socket.to(data.workflowId).emit('node-added', data);
  });
  
  socket.on('node-deleted', (data) => {
    socket.to(data.workflowId).emit('node-deleted', data);
  });
  
  socket.on('connection-added', (data) => {
    socket.to(data.workflowId).emit('connection-added', data);
  });
  
  socket.on('connection-deleted', (data) => {
    socket.to(data.workflowId).emit('connection-deleted', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    activeConnections.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});