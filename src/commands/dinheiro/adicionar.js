const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'adicionar',
    description: 'Adiciona dinheiro a um usuário',
    async execute(message, args) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Argumentos insuficientes')
                .setDescription('Use: `# dinheiro adicionar @usuario <quantidade>`')
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
                .setDescription('Você só pode adicionar dinheiro para si mesmo.')
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
        
        // Carregar dados existentes
        let moneyData = {};
        if (fs.existsSync(dataPath)) {
            moneyData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }

        // Criar usuário se não existir
        if (!moneyData[targetUser.id]) {
            moneyData[targetUser.id] = {
                userId: targetUser.id,
                username: targetUser.username,
                money: 0,
                createdAt: new Date().toISOString()
            };
        }

        const oldMoney = moneyData[targetUser.id].money;
        moneyData[targetUser.id].money += amount;
        moneyData[targetUser.id].username = targetUser.username;

        // Salvar dados
        fs.writeFileSync(dataPath, JSON.stringify(moneyData, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('💰 Dinheiro Adicionado')
            .setDescription(`**${amount}** moedas adicionadas para **${targetUser.username}**!`)
            .addFields(
                { name: '👤 Usuário', value: targetUser.username, inline: true },
                { name: '💰 Adicionado', value: amount.toString(), inline: true },
                { name: '💵 Total', value: moneyData[targetUser.id].money.toString(), inline: true }
            )
            .setFooter({ text: 'RPG Bot' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        console.log(`💰 ${message.author.username} adicionou ${amount} moedas para ${targetUser.username} (${oldMoney} → ${moneyData[targetUser.id].money})`);
    }
}; 