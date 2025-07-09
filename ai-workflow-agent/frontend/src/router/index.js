import { createRouter, createWebHistory } from 'vue-router'
import WorkflowEditor from '../views/WorkflowEditor.vue'
import WorkflowList from '../views/WorkflowList.vue'

const routes = [
  {
    path: '/',
    name: 'WorkflowList',
    component: WorkflowList
  },
  {
    path: '/workflow/:id?',
    name: 'WorkflowEditor',
    component: WorkflowEditor,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router