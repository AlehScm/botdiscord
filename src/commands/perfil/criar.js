const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'criar',
    description: 'Cria um novo perfil de RPG',
    category: 'perfil',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) criou um novo perfil`);
        const result = profileManager.createProfile(userId, username);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Perfil criado com sucesso!')
                .setDescription(`Bem-vindo ao RPG, **${username}**!`)
                .addFields(
                    { name: '📦 Itens', value: '0', inline: true }
                )
                .setFooter({ text: 'Use # perfil ver para ver seu perfil completo' });
            
            return message.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro')
                .setDescription(result.message)
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
    }
}; 