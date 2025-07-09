<template>
  <div class="workflow-list">
    <div class="header-section">
      <h2 class="section-title">Meus Workflows</h2>
      <el-button 
        type="primary" 
        size="large" 
        @click="createNewWorkflow"
        icon="el-icon-plus"
      >
        Novo Workflow
      </el-button>
    </div>

    <div class="workflows-grid" v-if="workflows.length > 0">
      <el-card 
        v-for="workflow in workflows" 
        :key="workflow.id"
        class="workflow-card"
        @click="openWorkflow(workflow.id)"
      >
        <div class="workflow-card-content">
          <div class="workflow-icon">
            <i class="el-icon-cpu"></i>
          </div>
          <div class="workflow-info">
            <h3 class="workflow-name">{{ workflow.name }}</h3>
            <p class="workflow-stats">
              {{ workflow.nodes.length }} nós • {{ workflow.connections.length }} conexões
            </p>
            <p class="workflow-date">
              Atualizado em {{ formatDate(workflow.updatedAt) }}
            </p>
          </div>
          <div class="workflow-actions">
            <el-button 
              type="text" 
              icon="el-icon-edit"
              @click.stop="editWorkflow(workflow.id)"
            >
              Editar
            </el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete"
              @click.stop="deleteWorkflow(workflow.id)"
              class="delete-btn"
            >
              Deletar
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <i class="el-icon-folder-opened"></i>
      </div>
      <h3>Nenhum workflow encontrado</h3>
      <p>Crie seu primeiro workflow para começar a gerar código com IA</p>
      <el-button 
        type="primary" 
        size="large" 
        @click="createNewWorkflow"
        icon="el-icon-plus"
      >
        Criar Primeiro Workflow
      </el-button>
    </div>

    <!-- Modal para criar novo workflow -->
    <el-dialog
      v-model="showCreateDialog"
      title="Criar Novo Workflow"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="newWorkflow" :rules="workflowRules" ref="workflowForm">
        <el-form-item label="Nome do Workflow" prop="name">
          <el-input 
            v-model="newWorkflow.name" 
            placeholder="Digite o nome do workflow"
            size="large"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="confirmCreateWorkflow" :loading="creating">
          Criar Workflow
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'WorkflowList',
  data() {
    return {
      showCreateDialog: false,
      creating: false,
      newWorkflow: {
        name: ''
      },
      workflowRules: {
        name: [
          { required: true, message: 'Nome é obrigatório', trigger: 'blur' },
          { min: 3, message: 'Nome deve ter pelo menos 3 caracteres', trigger: 'blur' }
        ]
      }
    }
  },
  
  computed: {
    ...mapState(['workflows'])
  },
  
  async mounted() {
    await this.fetchWorkflows()
  },
  
  methods: {
    ...mapActions(['fetchWorkflows', 'createWorkflow', 'deleteWorkflow']),
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    createNewWorkflow() {
      this.newWorkflow.name = ''
      this.showCreateDialog = true
    },
    
    async confirmCreateWorkflow() {
      try {
        this.$refs.workflowForm.validate(async (valid) => {
          if (valid) {
            this.creating = true
            const workflow = await this.createWorkflow({
              name: this.newWorkflow.name,
              nodes: [],
              connections: []
            })
            this.showCreateDialog = false
            this.$router.push(`/workflow/${workflow.id}`)
          }
        })
      } catch (error) {
        this.$message.error('Erro ao criar workflow')
      } finally {
        this.creating = false
      }
    },
    
    openWorkflow(workflowId) {
      this.$router.push(`/workflow/${workflowId}`)
    },
    
    editWorkflow(workflowId) {
      this.$router.push(`/workflow/${workflowId}`)
    },
    
    async deleteWorkflow(workflowId) {
      try {
        await this.$confirm(
          'Tem certeza que deseja deletar este workflow? Esta ação não pode ser desfeita.',
          'Confirmar Exclusão',
          {
            confirmButtonText: 'Deletar',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }
        )
        
        await this.deleteWorkflow(workflowId)
        this.$message.success('Workflow deletado com sucesso')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Erro ao deletar workflow')
        }
      }
    }
  }
}
</script>

<style scoped>
.workflow-list {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.workflow-card {
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: none;
}

.workflow-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.workflow-card-content {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.workflow-icon {
  font-size: 2rem;
  color: #667eea;
  margin-right: 1rem;
}

.workflow-info {
  flex: 1;
}

.workflow-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.workflow-stats {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.25rem 0;
}

.workflow-date {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.workflow-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  color: #f78989;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}
</style>