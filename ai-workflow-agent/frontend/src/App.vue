<template>
  <div id="app">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <i class="el-icon-cpu"></i>
            AI Workflow Agent
          </h1>
          <p class="app-subtitle">Gerador de Código com Workflow Visual</p>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.header-content {
  text-align: center;
  color: white;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.app-main {
  padding: 2rem;
  background: transparent;
}

/* Estilos globais */
.el-button {
  border-radius: 8px;
  font-weight: 600;
}

.el-card {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.el-input {
  border-radius: 8px;
}

.el-select {
  border-radius: 8px;
}
</style>