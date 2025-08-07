const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'tirar',
    description: 'Remove dinheiro de um usuário',
    async execute(message, args) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Argumentos insuficientes')
                .setDescription('Use: `# dinheiro tirar @usuario <quantidade>`')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const user = message.mentions.users.first();
        const isAdmin = message.author.id === config.admin.userId;
        
        // Se há menção e não é admin, bloquear
        if (user && user.id !== message.author.id && !isAdmin) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Sem permissão')
                .setDescription('Você só pode tirar dinheiro de si mesmo.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        
        const targetUser = user || message.author;
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Usuário não encontrado')
                .setDescription('Mencione um usuário válido.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Quantidade inválida')
                .setDescription('A quantidade deve ser um número positivo.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'money.json');
        let moneyData = {};
        if (fs.existsSync(dataPath)) {
            moneyData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
        if (!moneyData[targetUser.id]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Usuário sem dinheiro')
                .setDescription('O usuário não possui dinheiro registrado.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        if (moneyData[targetUser.id].money < amount) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Saldo insuficiente')
                .setDescription(`O usuário só possui ${moneyData[targetUser.id].money} moedas.`)
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        moneyData[targetUser.id].money -= amount;
        fs.writeFileSync(dataPath, JSON.stringify(moneyData, null, 2));
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('💸 Dinheiro Removido')
            .setDescription(`Foram removidas **${amount}** moedas de **${targetUser.username}**!`)
            .addFields(
                { name: '👤 Usuário', value: targetUser.username, inline: true },
                { name: '💸 Removido', value: amount.toString(), inline: true },
                { name: '💵 Total', value: moneyData[targetUser.id].money.toString(), inline: true }
            )
            .setFooter({ text: 'RPG Bot' })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
        console.log(`💸 ${message.author.username} removeu ${amount} moedas de ${targetUser.username}`);
    }
}; 