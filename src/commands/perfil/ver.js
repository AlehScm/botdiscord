const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'ver',
    description: 'Ver seu perfil de RPG',
    async execute(message, args) {
        const mentionedUser = message.mentions.users.first();
        const isAdmin = message.author.id === config.admin.userId;
        
        // Se há menção e não é admin, bloquear
        if (mentionedUser && !isAdmin) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Sem permissão')
                .setDescription('Você só pode ver seu próprio perfil.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        
        const user = mentionedUser || message.author;
        const profilesPath = path.join(__dirname, '..', '..', '..', 'data', 'profiles.json');
        if (!fs.existsSync(profilesPath)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nenhum perfil encontrado')
                .setDescription('Você ainda não criou um perfil.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
        if (!profiles[user.id]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nenhum perfil encontrado')
                .setDescription('Você ainda não criou um perfil.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const perfil = profiles[user.id];
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle(`👤 Perfil de ${user.username}`)
            .addFields(
                { name: 'ID', value: perfil.userId, inline: true },
                { name: 'Criado em', value: new Date(perfil.createdAt).toLocaleString('pt-BR'), inline: true }
            )
            .setFooter({ text: 'RPG Bot - Perfil' })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    }
}; 