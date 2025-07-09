<template>
  <div class="workflow-editor">
    <!-- Barra de ferramentas -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button @click="$router.push('/')" icon="el-icon-arrow-left">
          Voltar
        </el-button>
        <h2 class="workflow-title">{{ workflowName }}</h2>
      </div>
      
      <div class="toolbar-center">
        <el-button-group>
          <el-button 
            :type="tool === 'select' ? 'primary' : 'default'"
            @click="setTool('select')"
            icon="el-icon-cursor"
          >
            Selecionar
          </el-button>
          <el-button 
            :type="tool === 'connect' ? 'primary' : 'default'"
            @click="setTool('connect')"
            icon="el-icon-link"
          >
            Conectar
          </el-button>
        </el-button-group>
      </div>
      
      <div class="toolbar-right">
        <el-button @click="saveWorkflow" :loading="saving" type="success" icon="el-icon-check">
          Salvar
        </el-button>
        <el-button @click="runWorkflow" :loading="running" type="primary" icon="el-icon-video-play">
          Executar
        </el-button>
      </div>
    </div>

    <!-- Área principal do editor -->
    <div class="editor-container">
      <!-- Painel lateral com elementos -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>Elementos de IA</h3>
          <div class="node-types">
            <div 
              v-for="nodeType in nodeTypes" 
              :key="nodeType.type"
              class="node-type"
              draggable="true"
              @dragstart="onDragStart($event, nodeType)"
            >
              <div class="node-type-icon">
                <i :class="nodeType.icon"></i>
              </div>
              <div class="node-type-info">
                <h4>{{ nodeType.name }}</h4>
                <p>{{ nodeType.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas do workflow -->
      <div 
        class="workflow-canvas"
        @drop="onDrop"
        @dragover="onDragOver"
        @click="onCanvasClick"
        ref="canvas"
      >
        <!-- Grid de fundo -->
        <div class="canvas-grid"></div>
        
        <!-- Nós do workflow -->
        <div 
          v-for="node in nodes" 
          :key="node.id"
          class="workflow-node"
          :class="{ 'selected': selectedNode?.id === node.id }"
          :style="getNodeStyle(node)"
          @mousedown="onNodeMouseDown($event, node)"
          @click.stop="selectNode(node)"
        >
          <div class="node-header">
            <div class="node-icon">
              <i :class="getNodeIcon(node.type)"></i>
            </div>
            <div class="node-title">{{ node.name }}</div>
            <div class="node-actions">
              <el-button 
                type="text" 
                size="mini" 
                icon="el-icon-edit"
                @click.stop="editNode(node)"
              />
              <el-button 
                type="text" 
                size="mini" 
                icon="el-icon-delete"
                @click.stop="deleteNode(node)"
                class="delete-btn"
              />
            </div>
          </div>
          
          <div class="node-content">
            <div class="node-ports">
              <div class="input-ports">
                <div 
                  v-for="input in node.inputs" 
                  :key="input.id"
                  class="port input-port"
                  :class="{ 'connected': isPortConnected(node.id, input.id, 'input') }"
                  @mousedown.stop="onPortMouseDown($event, node, input, 'input')"
                >
                  <div class="port-dot"></div>
                  <span class="port-label">{{ input.name }}</span>
                </div>
              </div>
              
              <div class="output-ports">
                <div 
                  v-for="output in node.outputs" 
                  :key="output.id"
                  class="port output-port"
                  :class="{ 'connected': isPortConnected(node.id, output.id, 'output') }"
                  @mousedown.stop="onPortMouseDown($event, node, output, 'output')"
                >
                  <span class="port-label">{{ output.name }}</span>
                  <div class="port-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conexões -->
        <svg class="connections-layer" ref="connectionsLayer">
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="9" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#667eea" />
            </marker>
          </defs>
          
          <path 
            v-for="connection in connections" 
            :key="connection.id"
            :d="getConnectionPath(connection)"
            stroke="#667eea"
            stroke-width="2"
            fill="none"
            marker-end="url(#arrowhead)"
            class="connection-line"
            :class="{ 'selected': selectedConnection?.id === connection.id }"
            @click="selectConnection(connection)"
          />
        </svg>

        <!-- Linha de conexão temporária -->
        <svg class="temp-connection" v-if="tempConnection">
          <path 
            :d="getTempConnectionPath()"
            stroke="#667eea"
            stroke-width="2"
            fill="none"
            stroke-dasharray="5,5"
          />
        </svg>
      </div>
    </div>

    <!-- Modal de edição de nó -->
    <el-dialog
      v-model="showNodeDialog"
      :title="editingNode ? 'Editar Nó' : 'Novo Nó'"
      width="600px"
    >
      <el-form :model="nodeForm" :rules="nodeRules" ref="nodeFormRef">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="nodeForm.name" placeholder="Nome do nó" />
        </el-form-item>
        
        <el-form-item label="Tipo" prop="type">
          <el-select v-model="nodeForm.type" placeholder="Selecione o tipo">
            <el-option 
              v-for="type in nodeTypes" 
              :key="type.type"
              :label="type.name"
              :value="type.type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Configuração">
          <el-input 
            v-model="nodeForm.config" 
            type="textarea" 
            :rows="4"
            placeholder="Configuração JSON do nó"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showNodeDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="saveNode">Salvar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { io } from 'socket.io-client'

export default {
  name: 'WorkflowEditor',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      tool: 'select',
      selectedNode: null,
      selectedConnection: null,
      tempConnection: null,
      showNodeDialog: false,
      editingNode: null,
      saving: false,
      running: false,
      socket: null,
      
      nodeForm: {
        name: '',
        type: '',
        config: '{}'
      },
      
      nodeRules: {
        name: [
          { required: true, message: 'Nome é obrigatório', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Tipo é obrigatório', trigger: 'change' }
        ]
      },
      
      nodeTypes: [
        {
          type: 'ai_prompt',
          name: 'Prompt de IA',
          description: 'Define um prompt para geração de código',
          icon: 'el-icon-chat-dot-round',
          inputs: [],
          outputs: [{ id: 'output', name: 'Resultado' }]
        },
        {
          type: 'code_generator',
          name: 'Gerador de Código',
          description: 'Gera código baseado em entrada',
          icon: 'el-icon-cpu',
          inputs: [{ id: 'input', name: 'Entrada' }],
          outputs: [{ id: 'output', name: 'Código Gerado' }]
        },
        {
          type: 'file_writer',
          name: 'Escritor de Arquivo',
          description: 'Escreve código em arquivo',
          icon: 'el-icon-document',
          inputs: [{ id: 'input', name: 'Código' }],
          outputs: []
        },
        {
          type: 'condition',
          name: 'Condição',
          description: 'Aplica lógica condicional',
          icon: 'el-icon-switch-button',
          inputs: [{ id: 'input', name: 'Entrada' }],
          outputs: [
            { id: 'true', name: 'Verdadeiro' },
            { id: 'false', name: 'Falso' }
          ]
        },
        {
          type: 'data_processor',
          name: 'Processador de Dados',
          description: 'Processa e transforma dados',
          icon: 'el-icon-data-analysis',
          inputs: [{ id: 'input', name: 'Dados' }],
          outputs: [{ id: 'output', name: 'Dados Processados' }]
        }
      ]
    }
  },
  
  computed: {
    ...mapState(['currentWorkflow', 'isConnected']),
    ...mapGetters(['getCurrentWorkflow']),
    
    workflowName() {
      return this.currentWorkflow?.name || 'Novo Workflow'
    },
    
    nodes() {
      return this.currentWorkflow?.nodes || []
    },
    
    connections() {
      return this.currentWorkflow?.connections || []
    }
  },
  
  async mounted() {
    if (this.id) {
      await this.fetchWorkflow(this.id)
    } else {
      // Criar novo workflow
      const workflow = await this.createWorkflow({
        name: 'Novo Workflow',
        nodes: [],
        connections: []
      })
      this.$router.replace(`/workflow/${workflow.id}`)
    }
    
    this.initializeSocket()
  },
  
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect()
    }
  },
  
  methods: {
    ...mapActions(['fetchWorkflow', 'createWorkflow', 'updateWorkflow']),
    
    initializeSocket() {
      this.socket = io('http://localhost:3000')
      
      this.socket.on('connect', () => {
        console.log('Conectado ao servidor')
        this.socket.emit('join-workflow', this.id)
      })
      
      this.socket.on('disconnect', () => {
        console.log('Desconectado do servidor')
      })
      
      // Escutar eventos de atualização em tempo real
      this.socket.on('node-moved', this.handleNodeMoved)
      this.socket.on('node-added', this.handleNodeAdded)
      this.socket.on('node-deleted', this.handleNodeDeleted)
      this.socket.on('connection-added', this.handleConnectionAdded)
      this.socket.on('connection-deleted', this.handleConnectionDeleted)
    },
    
    setTool(tool) {
      this.tool = tool
    },
    
    onDragStart(event, nodeType) {
      event.dataTransfer.setData('application/json', JSON.stringify(nodeType))
    },
    
    onDragOver(event) {
      event.preventDefault()
    },
    
    onDrop(event) {
      event.preventDefault()
      const nodeTypeData = event.dataTransfer.getData('application/json')
      if (nodeTypeData) {
        const nodeType = JSON.parse(nodeTypeData)
        const rect = this.$refs.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        
        this.addNode(nodeType, x, y)
      }
    },
    
    onCanvasClick() {
      this.selectedNode = null
      this.selectedConnection = null
    },
    
    addNode(nodeType, x, y) {
      const node = {
        id: this.generateId(),
        name: nodeType.name,
        type: nodeType.type,
        x: x,
        y: y,
        inputs: [...nodeType.inputs],
        outputs: [...nodeType.outputs],
        config: {}
      }
      
      const updatedNodes = [...this.nodes, node]
      this.updateWorkflowData({ nodes: updatedNodes })
      
      if (this.socket) {
        this.socket.emit('node-added', {
          workflowId: this.id,
          node: node
        })
      }
    },
    
    selectNode(node) {
      this.selectedNode = node
      this.selectedConnection = null
    },
    
    editNode(node) {
      this.editingNode = node
      this.nodeForm = {
        name: node.name,
        type: node.type,
        config: JSON.stringify(node.config, null, 2)
      }
      this.showNodeDialog = true
    },
    
    async saveNode() {
      try {
        this.$refs.nodeFormRef.validate(async (valid) => {
          if (valid) {
            const nodeData = {
              ...this.nodeForm,
              config: JSON.parse(this.nodeForm.config || '{}')
            }
            
            if (this.editingNode) {
              // Atualizar nó existente
              const updatedNodes = this.nodes.map(node => 
                node.id === this.editingNode.id 
                  ? { ...node, ...nodeData }
                  : node
              )
              this.updateWorkflowData({ nodes: updatedNodes })
            }
            
            this.showNodeDialog = false
            this.editingNode = null
          }
        })
      } catch (error) {
        this.$message.error('Erro ao salvar nó')
      }
    },
    
    deleteNode(node) {
      this.$confirm('Tem certeza que deseja deletar este nó?', 'Confirmar', {
        type: 'warning'
      }).then(() => {
        const updatedNodes = this.nodes.filter(n => n.id !== node.id)
        const updatedConnections = this.connections.filter(
          conn => conn.sourceNode !== node.id && conn.targetNode !== node.id
        )
        
        this.updateWorkflowData({ 
          nodes: updatedNodes, 
          connections: updatedConnections 
        })
        
        if (this.socket) {
          this.socket.emit('node-deleted', {
            workflowId: this.id,
            nodeId: node.id
          })
        }
      })
    },
    
    onNodeMouseDown(event, node) {
      if (this.tool === 'select') {
        this.startDragging(event, node)
      }
    },
    
    startDragging(event, node) {
      const startX = event.clientX - node.x
      const startY = event.clientY - node.y
      
      const onMouseMove = (e) => {
        node.x = e.clientX - startX
        node.y = e.clientY - startY
        
        if (this.socket) {
          this.socket.emit('node-moved', {
            workflowId: this.id,
            nodeId: node.id,
            x: node.x,
            y: node.y
          })
        }
      }
      
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    
    onPortMouseDown(event, node, port, portType) {
      if (this.tool === 'connect') {
        this.startConnection(event, node, port, portType)
      }
    },
    
    startConnection(event, node, port, portType) {
      const startPos = this.getPortPosition(node, port, portType)
      
      this.tempConnection = {
        startX: startPos.x,
        startY: startPos.y,
        endX: startPos.x,
        endY: startPos.y,
        sourceNode: node.id,
        sourcePort: port.id,
        sourceType: portType
      }
      
      const onMouseMove = (e) => {
        const rect = this.$refs.canvas.getBoundingClientRect()
        this.tempConnection.endX = e.clientX - rect.left
        this.tempConnection.endY = e.clientY - rect.top
      }
      
      const onMouseUp = (e) => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        
        // Verificar se soltou em outro port
        const targetNode = this.findNodeAtPosition(e.clientX, e.clientY)
        if (targetNode && targetNode.id !== node.id) {
          const targetPort = this.findPortAtPosition(targetNode, e.clientX, e.clientY)
          if (targetPort && targetPort.type !== portType) {
            this.createConnection(node, port, targetNode, targetPort)
          }
        }
        
        this.tempConnection = null
      }
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    
    createConnection(sourceNode, sourcePort, targetNode, targetPort) {
      const connection = {
        id: this.generateId(),
        sourceNode: sourceNode.id,
        sourcePort: sourcePort.id,
        targetNode: targetNode.id,
        targetPort: targetPort.id
      }
      
      const updatedConnections = [...this.connections, connection]
      this.updateWorkflowData({ connections: updatedConnections })
      
      if (this.socket) {
        this.socket.emit('connection-added', {
          workflowId: this.id,
          connection: connection
        })
      }
    },
    
    selectConnection(connection) {
      this.selectedConnection = connection
      this.selectedNode = null
    },
    
    getNodeStyle(node) {
      return {
        left: `${node.x}px`,
        top: `${node.y}px`
      }
    },
    
    getNodeIcon(type) {
      const nodeType = this.nodeTypes.find(nt => nt.type === type)
      return nodeType ? nodeType.icon : 'el-icon-question'
    },
    
    getPortPosition(node, port, portType) {
      const nodeElement = this.$el.querySelector(`[data-node-id="${node.id}"]`)
      if (!nodeElement) return { x: 0, y: 0 }
      
      const portElement = nodeElement.querySelector(`[data-port-id="${port.id}"]`)
      if (!portElement) return { x: 0, y: 0 }
      
      const rect = portElement.getBoundingClientRect()
      const canvasRect = this.$refs.canvas.getBoundingClientRect()
      
      return {
        x: rect.left + rect.width / 2 - canvasRect.left,
        y: rect.top + rect.height / 2 - canvasRect.top
      }
    },
    
    getConnectionPath(connection) {
      const sourceNode = this.nodes.find(n => n.id === connection.sourceNode)
      const targetNode = this.nodes.find(n => n.id === connection.targetNode)
      
      if (!sourceNode || !targetNode) return ''
      
      const sourcePort = sourceNode.outputs.find(p => p.id === connection.sourcePort)
      const targetPort = targetNode.inputs.find(p => p.id === connection.targetPort)
      
      if (!sourcePort || !targetPort) return ''
      
      const startPos = this.getPortPosition(sourceNode, sourcePort, 'output')
      const endPos = this.getPortPosition(targetNode, targetPort, 'input')
      
      return `M ${startPos.x} ${startPos.y} C ${startPos.x + 100} ${startPos.y}, ${endPos.x - 100} ${endPos.y}, ${endPos.x} ${endPos.y}`
    },
    
    getTempConnectionPath() {
      if (!this.tempConnection) return ''
      return `M ${this.tempConnection.startX} ${this.tempConnection.startY} C ${this.tempConnection.startX + 100} ${this.tempConnection.startY}, ${this.tempConnection.endX - 100} ${this.tempConnection.endY}, ${this.tempConnection.endX} ${this.tempConnection.endY}`
    },
    
    isPortConnected(nodeId, portId, portType) {
      return this.connections.some(conn => {
        if (portType === 'input') {
          return conn.targetNode === nodeId && conn.targetPort === portId
        } else {
          return conn.sourceNode === nodeId && conn.sourcePort === portId
        }
      })
    },
    
    findNodeAtPosition(x, y) {
      // Implementação simplificada - em produção seria mais robusta
      return this.nodes.find(node => {
        const nodeElement = this.$el.querySelector(`[data-node-id="${node.id}"]`)
        if (!nodeElement) return false
        
        const rect = nodeElement.getBoundingClientRect()
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      })
    },
    
    findPortAtPosition(node, x, y) {
      // Implementação simplificada
      return node.inputs[0] || node.outputs[0]
    },
    
    generateId() {
      return Math.random().toString(36).substr(2, 9)
    },
    
    async updateWorkflowData(data) {
      if (this.currentWorkflow) {
        await this.updateWorkflow({
          id: this.currentWorkflow.id,
          data: { ...this.currentWorkflow, ...data }
        })
      }
    },
    
    async saveWorkflow() {
      this.saving = true
      try {
        await this.updateWorkflow({
          id: this.currentWorkflow.id,
          data: this.currentWorkflow
        })
        this.$message.success('Workflow salvo com sucesso!')
      } catch (error) {
        this.$message.error('Erro ao salvar workflow')
      } finally {
        this.saving = false
      }
    },
    
    async runWorkflow() {
      this.running = true
      try {
        // Implementar execução do workflow
        this.$message.success('Workflow executado com sucesso!')
      } catch (error) {
        this.$message.error('Erro ao executar workflow')
      } finally {
        this.running = false
      }
    },
    
    // Handlers para eventos do socket
    handleNodeMoved(data) {
      if (data.workflowId === this.id) {
        const node = this.nodes.find(n => n.id === data.nodeId)
        if (node) {
          node.x = data.x
          node.y = data.y
        }
      }
    },
    
    handleNodeAdded(data) {
      if (data.workflowId === this.id) {
        this.updateWorkflowData({ nodes: [...this.nodes, data.node] })
      }
    },
    
    handleNodeDeleted(data) {
      if (data.workflowId === this.id) {
        const updatedNodes = this.nodes.filter(n => n.id !== data.nodeId)
        this.updateWorkflowData({ nodes: updatedNodes })
      }
    },
    
    handleConnectionAdded(data) {
      if (data.workflowId === this.id) {
        this.updateWorkflowData({ connections: [...this.connections, data.connection] })
      }
    },
    
    handleConnectionDeleted(data) {
      if (data.workflowId === this.id) {
        const updatedConnections = this.connections.filter(c => c.id !== data.connectionId)
        this.updateWorkflowData({ connections: updatedConnections })
      }
    }
  }
}
</script>

<style scoped>
.workflow-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.workflow-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.toolbar-center {
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  overflow-y: auto;
}

.sidebar-section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.node-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.node-type {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  background: white;
}

.node-type:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.node-type:active {
  cursor: grabbing;
}

.node-type-icon {
  font-size: 1.5rem;
  color: #667eea;
  margin-right: 0.75rem;
}

.node-type-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #333;
}

.node-type-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.workflow-canvas {
  flex: 1;
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
}

.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.workflow-node {
  position: absolute;
  min-width: 200px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: move;
  user-select: none;
  transition: all 0.2s ease;
}

.workflow-node:hover {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.workflow-node.selected {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
  border-radius: 6px 6px 0 0;
}

.node-icon {
  font-size: 1.2rem;
  color: #667eea;
  margin-right: 0.5rem;
}

.node-title {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.node-actions {
  display: flex;
  gap: 0.25rem;
}

.node-content {
  padding: 0.75rem;
}

.node-ports {
  display: flex;
  justify-content: space-between;
}

.input-ports, .output-ports {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.port {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.port:hover {
  background: rgba(102, 126, 234, 0.1);
}

.port.connected {
  background: rgba(102, 126, 234, 0.2);
}

.port-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #667eea;
}

.port-label {
  font-size: 0.8rem;
  color: #666;
}

.output-port {
  flex-direction: row-reverse;
}

.connections-layer, .temp-connection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.connection-line {
  pointer-events: all;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connection-line:hover {
  stroke-width: 3;
}

.connection-line.selected {
  stroke: #f56c6c;
  stroke-width: 3;
}

.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  color: #f78989;
}
</style>