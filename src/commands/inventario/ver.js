const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'ver',
    description: 'Veja todos os seus itens e dinheiro',
    async execute(message, args) {
        const mentionedUser = message.mentions.users.first();
        const isAdmin = message.author.id === config.admin.userId;
        
        // Se há menção e não é admin, bloquear
        if (mentionedUser && !isAdmin) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Sem permissão')
                .setDescription('Você só pode ver seu próprio inventário.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        
        const user = mentionedUser || message.author;
        // Itens
        const profilesPath = path.join(__dirname, '..', '..', '..', 'data', 'profiles.json');
        let items = [];
        if (fs.existsSync(profilesPath)) {
            const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
            if (profiles[user.id] && Array.isArray(profiles[user.id].items)) {
                items = profiles[user.id].items;
            }
        }
        // Dinheiro
        const moneyPath = path.join(__dirname, '..', '..', '..', 'data', 'money.json');
        let money = 0;
        if (fs.existsSync(moneyPath)) {
            const moneyData = JSON.parse(fs.readFileSync(moneyPath, 'utf8'));
            if (moneyData[user.id]) {
                money = moneyData[user.id].money;
            }
        }
        // Montar embed
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle(`🎒 Inventário de ${user.username}`)
            .addFields({ name: '💰 Dinheiro', value: `${money} moedas`, inline: false });
        if (items.length > 0) {
            embed.addFields({
                name: '📦 Itens',
                value: items.map((item, idx) => `**${idx + 1}. ${item.name}** x${item.quantity}\n${item.description}`).join('\n\n'),
                inline: false
            });
        } else {
            embed.addFields({ name: '📦 Itens', value: 'Nenhum item encontrado.', inline: false });
        }
        embed.setFooter({ text: 'RPG Bot - Inventário' }).setTimestamp();
        await message.reply({ embeds: [embed] });
    }
}; 