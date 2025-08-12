# 🎮 RPG Bot - Configuração Rápida

## ⚡ Setup Inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `env.example` para `.env` e configure:
```env
DISCORD_TOKEN=seu_token_aqui
```

### 3. Executar o bot
```bash
npm start
```

## 📝 Comandos Principais

### Para Jogadores
- `# perfil` - Ver seu perfil
- `# perfil criar` - Criar perfil
- `# perfil deletar confirmar` - Deletar perfil
- `# perfil resetar confirmar` - Resetar perfil

### Para Todos
- `# item criar nome, descrição` - Criar item
- `# item deletar nome` - Deletar item
- `# item adicionar nome quantidade` - Adicionar quantidade
- `# item tirar nome quantidade` - Subtrair quantidade
- `# item editar nome_atual, novo_nome, nova_descrição` - Editar item
- `# help` - Ver categorias
- `# help item` - Ver comandos de itens
- `# help perfil` - Ver comandos de perfil

## 🎒 Sistema de Itens

**Como gerenciar itens:**
- Criar: `# item criar Espada de Fogo, Uma espada flamejante`
- Deletar: `# item deletar Espada de Fogo`
- Adicionar: `# item adicionar Moeda 5`
- Subtrair: `# item tirar Moeda 2`
- Editar: `# item editar Espada, Espada de Fogo, Uma espada flamejante`
- Os itens são gerenciados no seu próprio inventário

## 📊 Estrutura de Dados

Os perfis são salvos em `data/profiles.json` com:
- ID do usuário
- Nome do usuário
- Data de criação
- Lista de itens

## 🛠️ Sistema de Logs

Todas as ações são registradas no console com:
- Timestamp da ação
- Nome e ID do usuário
- Tipo de ação realizada

## 🔧 Permissões do Bot

Certifique-se de que o bot tenha:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
- ✅ Use Slash Commands

## 🚀 Pronto para usar!

O bot agora está configurado para RPG! Use `# help` para ver todos os comandos disponíveis. 