import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    workflows: [],
    currentWorkflow: null,
    selectedNode: null,
    isConnected: false,
    socket: null
  },
  
  mutations: {
    SET_WORKFLOWS(state, workflows) {
      state.workflows = workflows
    },
    
    SET_CURRENT_WORKFLOW(state, workflow) {
      state.currentWorkflow = workflow
    },
    
    UPDATE_WORKFLOW(state, workflow) {
      const index = state.workflows.findIndex(w => w.id === workflow.id)
      if (index !== -1) {
        state.workflows[index] = workflow
      } else {
        state.workflows.push(workflow)
      }
      
      if (state.currentWorkflow && state.currentWorkflow.id === workflow.id) {
        state.currentWorkflow = workflow
      }
    },
    
    DELETE_WORKFLOW(state, workflowId) {
      state.workflows = state.workflows.filter(w => w.id !== workflowId)
      if (state.currentWorkflow && state.currentWorkflow.id === workflowId) {
        state.currentWorkflow = null
      }
    },
    
    SET_SELECTED_NODE(state, node) {
      state.selectedNode = node
    },
    
    SET_CONNECTION_STATUS(state, status) {
      state.isConnected = status
    },
    
    SET_SOCKET(state, socket) {
      state.socket = socket
    }
  },
  
  actions: {
    async fetchWorkflows({ commit }) {
      try {
        const response = await axios.get('/api/workflows')
        commit('SET_WORKFLOWS', response.data)
      } catch (error) {
        console.error('Erro ao buscar workflows:', error)
      }
    },
    
    async createWorkflow({ commit }, workflowData) {
      try {
        const response = await axios.post('/api/workflows', workflowData)
        commit('UPDATE_WORKFLOW', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao criar workflow:', error)
        throw error
      }
    },
    
    async updateWorkflow({ commit }, { id, data }) {
      try {
        const response = await axios.put(`/api/workflows/${id}`, data)
        commit('UPDATE_WORKFLOW', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar workflow:', error)
        throw error
      }
    },
    
    async deleteWorkflow({ commit }, workflowId) {
      try {
        await axios.delete(`/api/workflows/${workflowId}`)
        commit('DELETE_WORKFLOW', workflowId)
      } catch (error) {
        console.error('Erro ao deletar workflow:', error)
        throw error
      }
    },
    
    async fetchWorkflow({ commit }, workflowId) {
      try {
        const response = await axios.get(`/api/workflows/${workflowId}`)
        commit('SET_CURRENT_WORKFLOW', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao buscar workflow:', error)
        throw error
      }
    },
    
    selectNode({ commit }, node) {
      commit('SET_SELECTED_NODE', node)
    },
    
    initializeSocket({ commit, state }, socket) {
      commit('SET_SOCKET', socket)
      commit('SET_CONNECTION_STATUS', true)
    },
    
    disconnectSocket({ commit }) {
      commit('SET_CONNECTION_STATUS', false)
      commit('SET_SOCKET', null)
    }
  },
  
  getters: {
    getWorkflowById: (state) => (id) => {
      return state.workflows.find(w => w.id === id)
    },
    
    getCurrentWorkflow: (state) => {
      return state.currentWorkflow
    },
    
    getSelectedNode: (state) => {
      return state.selectedNode
    },
    
    isConnected: (state) => {
      return state.isConnected
    }
  }
})