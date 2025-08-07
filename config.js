// Configurações do Bot RPG
module.exports = {
    // Configurações do Discord
    discord: {
        token: process.env.DISCORD_TOKEN,
        prefix: '#',
        intents: [
            'Guilds',
            'GuildMessages',
            'MessageContent'
        ]
    },

    // Configurações do RPG
    rpg: {
        maxInventorySize: 50
    },

    // Configurações de administração
    admin: {
        userId: process.env.ADMIN_ID || '320583655024230400' // Seu ID do Discord
    },

    // Configurações de cores para embeds
    colors: {
        primary: '#4ecdc4',    // Verde-azulado RPG
        success: '#51cf66',    // Verde
        warning: '#ffa500',    // Laranja
        error: '#ff6b6b',      // Vermelho
        info: '#339af0',       // Azul
        rare: '#845ef7'        // Roxo
    },

    // Configurações de emojis
    emojis: {
        sword: '⚔️',
        shield: '🛡️',
        potion: '🧪',
        coin: '🪙',
        gem: '💎',
        error: '❌',
        success: '✅',
        help: '❓',
        player: '👤',
        inventory: '🎒',
        item: '📦'
    },

    // Configurações de mensagens
    messages: {
        botReady: '🎮 RPG Bot está online e pronto para aventuras!',
        profileCreated: '✅ Perfil criado com sucesso!',
        profileDeleted: '🗑️ Perfil deletado com sucesso!',
        itemAdded: '📦 Item adicionado ao inventário!',
        notFound: '❌ Não encontrado!',
        error: '❌ Erro interno!',
        help: '❓ Use #help para ver todos os comandos'
    }
}; 