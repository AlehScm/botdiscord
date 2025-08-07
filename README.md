# 🎮 RPG Bot para Discord

Um bot completo de RPG para Discord com sistema de perfis, itens, dinheiro, habilidades e dados!

## 🚀 Funcionalidades

### 👤 Sistema de Perfis
- **`# perfil criar`** - Criar um perfil
- **`# perfil ver`** - Ver seu perfil
- **`# perfil deletar`** - Deletar seu perfil
- **`# perfil resetar`** - Resetar seu perfil (limpar itens)

### 📦 Sistema de Itens
- **`# item criar <nome>, <descrição>`** - Criar um item
- **`# item ver`** - Ver seu inventário
- **`# item adicionar <nome> <quantidade>`** - Adicionar quantidade a um item
- **`# item tirar <nome> <quantidade>`** - Remover quantidade de um item
- **`# item editar <nome>, <nova_descrição>`** - Editar descrição de um item
- **`# item deletar <nome>`** - Deletar um item
- **`# item dar @usuario <nome>`** - Dar um item para outro usuário

### 💰 Sistema de Dinheiro
- **`# dinheiro criar @usuario <quantidade>`** - Criar dinheiro para um usuário
- **`# dinheiro ver @usuario`** - Ver dinheiro de um usuário
- **`# dinheiro adicionar @usuario <quantidade>`** - Adicionar dinheiro a um usuário

### ⚔️ Sistema de Habilidades
- **`# habilidade criar @usuario <nome> <nivel>`** - Criar uma habilidade
- **`# habilidade ver @usuario`** - Ver habilidades de um usuário

### 🎲 Sistema de Dados
- **`# 1d20`** - Lançar 1 dado de 20 lados
- **`# 2d6`** - Lançar 2 dados de 6 lados
- **`# 1d20+5`** - 1d20 + 5
- **`# 3d8-2`** - 3d8 - 2
- **`# 1d100*2`** - 1d100 × 2
- **`# 2d10/2`** - 2d10 ÷ 2

### ❓ Sistema de Ajuda
- **`# help`** - Ver todas as categorias
- **`# help <categoria>`** - Ver comandos de uma categoria específica

## 📁 Estrutura do Projeto

```
src/commands/
├── perfil.js          ← Comandos de perfil
├── item.js           ← Comandos de itens
├── dinheiro.js       ← Comandos de dinheiro
├── habilidade.js     ← Comandos de habilidades
├── dado.js           ← Sistema de dados
├── help.js           ← Sistema de ajuda
├── perfil/           ← Subcomandos de perfil
├── item/             ← Subcomandos de itens
├── dinheiro/         ← Subcomandos de dinheiro
├── habilidade/       ← Subcomandos de habilidades
└── sistema/          ← Comandos do sistema
```

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o arquivo `.env` com seu token do Discord
4. Execute: `npm start`

## 📊 Armazenamento

Todos os dados são salvos em arquivos JSON na pasta `data/`:
- `profiles.json` - Perfis e inventários dos usuários
- `money.json` - Dinheiro dos usuários
- `skills.json` - Habilidades dos usuários

## 🎯 Exemplos de Uso

### Criando um personagem completo:
```
# perfil criar
# item criar Espada, Uma espada afiada
# dinheiro criar @usuario 100
# habilidade criar @usuario Combate 15
```

### Jogando com dados:
```
# 1d20+5
# 2d6
# 1d100/2
```

### Gerenciando itens:
```
# item dar @amigo Espada
# item adicionar Poção 3
# item ver
```

## 🔧 Configuração

Configure o arquivo `.env`:
```env
DISCORD_TOKEN=seu_token_aqui
```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT. 