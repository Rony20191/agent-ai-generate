#!/bin/bash

echo "🚀 Iniciando AI Workflow Agent..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "📦 Instalando dependências..."

# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo "✅ Dependências instaladas com sucesso!"

# Iniciar o projeto
echo "🚀 Iniciando o projeto..."
npm run dev

echo "🎉 AI Workflow Agent está rodando!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar o servidor"