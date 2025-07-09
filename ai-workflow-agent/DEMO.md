# 🎯 Demonstração do AI Workflow Agent

## 🚀 Início Rápido

### 1. Instalação e Inicialização
```bash
# Clone o projeto (se aplicável)
git clone <repository-url>
cd ai-workflow-agent

# Execute o script de inicialização
./start.sh
```

### 2. Acesse a Aplicação
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

## 🎨 Demonstração Passo a Passo

### Passo 1: Criar um Novo Workflow
1. Acesse http://localhost:8080
2. Clique em "Novo Workflow"
3. Digite um nome como "Gerador de API REST"
4. Clique em "Criar Workflow"

### Passo 2: Adicionar Elementos
1. No painel lateral, você verá diferentes tipos de elementos:
   - **Prompt de IA**: Para definir prompts
   - **Gerador de Código**: Para gerar código
   - **Escritor de Arquivo**: Para salvar arquivos
   - **Condição**: Para lógica condicional
   - **Processador de Dados**: Para transformar dados

2. Arraste um "Prompt de IA" para o canvas
3. Arraste um "Gerador de Código" para o canvas
4. Arraste um "Escritor de Arquivo" para o canvas

### Passo 3: Conectar os Elementos
1. Clique no botão "Conectar" na barra de ferramentas
2. Clique e arraste da porta de saída do "Prompt de IA" para a porta de entrada do "Gerador de Código"
3. Clique e arraste da porta de saída do "Gerador de Código" para a porta de entrada do "Escritor de Arquivo"

### Passo 4: Configurar os Elementos
1. Clique no "Prompt de IA" e depois no ícone de edição
2. Configure:
   - **Nome**: "Especificação da API"
   - **Configuração**: 
   ```json
   {
     "prompt": "Crie uma especificação para uma API REST com endpoints para CRUD de usuários",
     "model": "gpt-4",
     "temperature": 0.7
   }
   ```

3. Clique no "Gerador de Código" e configure:
   - **Nome**: "Gerador de API"
   - **Configuração**:
   ```json
   {
     "language": "javascript",
     "framework": "express",
     "includeTests": true
   }
   ```

4. Clique no "Escritor de Arquivo" e configure:
   - **Nome**: "Salvador de Arquivos"
   - **Configuração**:
   ```json
   {
     "outputPath": "./generated-api",
     "fileStructure": "organized"
   }
   ```

### Passo 5: Executar o Workflow
1. Clique em "Executar" na barra de ferramentas
2. O sistema processará o workflow e gerará os arquivos

## 🎯 Exemplos de Workflows

### Exemplo 1: Gerador de API REST
```
Prompt de IA → Gerador de Código → Escritor de Arquivo
```

### Exemplo 2: Validador de Código
```
Gerador de Código → Condição → Escritor de Arquivo
```

### Exemplo 3: Pipeline de Processamento
```
Prompt de IA → Processador de Dados → Gerador de Código → Escritor de Arquivo
```

## 🔧 Funcionalidades Avançadas

### 1. Colaboração em Tempo Real
- Múltiplos usuários podem editar o mesmo workflow
- Mudanças são sincronizadas automaticamente
- Indicadores visuais de atividade

### 2. Ferramentas de Edição
- **Selecionar**: Para mover e editar elementos
- **Conectar**: Para criar conexões entre elementos
- **Zoom**: Para navegar em workflows complexos

### 3. Validação de Workflows
- Verificação de conexões válidas
- Validação de tipos de dados
- Detecção de loops infinitos

## 🎨 Interface do Usuário

### Barra de Ferramentas
- **Voltar**: Retorna à lista de workflows
- **Selecionar/Conectar**: Alterna entre modos de edição
- **Salvar**: Salva o workflow atual
- **Executar**: Executa o workflow

### Painel Lateral
- Lista de elementos disponíveis
- Descrições detalhadas de cada tipo
- Arrastar e soltar para adicionar

### Canvas
- Área principal de edição
- Grid de fundo para alinhamento
- Zoom e pan para navegação

## 🚀 Próximos Passos

1. **Implementar Execução Real**: Conectar com APIs de IA
2. **Adicionar Mais Tipos**: Novos elementos de processamento
3. **Templates**: Workflows pré-configurados
4. **Exportação**: Salvar workflows em diferentes formatos
5. **Versionamento**: Controle de versões dos workflows

## 🆘 Solução de Problemas

### Problema: Frontend não carrega
- Verifique se o backend está rodando na porta 3000
- Verifique se não há conflitos de porta

### Problema: Conexões não funcionam
- Certifique-se de estar no modo "Conectar"
- Verifique se as portas são compatíveis (input/output)

### Problema: Elementos não aparecem
- Recarregue a página
- Verifique se o Socket.IO está conectado

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador para erros
2. Verifique os logs do servidor
3. Abra uma issue no repositório

---

**🎉 Agora você está pronto para criar workflows de IA incríveis!**