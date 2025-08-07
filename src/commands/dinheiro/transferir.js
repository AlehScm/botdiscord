const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'transferir',
    description: 'Transfere dinheiro para outro usuário',
    async execute(message, args) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Argumentos insuficientes')
                .setDescription('Use: `# dinheiro transferir @usuario <quantidade>`')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Usuário não encontrado')
                .setDescription('Mencione um usuário válido.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        if (targetUser.id === message.author.id) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Ação inválida')
                .setDescription('Você não pode transferir dinheiro para si mesmo.')
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
        // Verificar saldo do remetente
        if (!moneyData[message.author.id] || moneyData[message.author.id].money < amount) {
            const saldo = moneyData[message.author.id] ? moneyData[message.author.id].money : 0;
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Saldo insuficiente')
                .setDescription(`Você só possui ${saldo} moedas.`)
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        // Remover do remetente
        moneyData[message.author.id].money -= amount;
        // Adicionar ao destinatário
        if (!moneyData[targetUser.id]) {
            moneyData[targetUser.id] = {
                userId: targetUser.id,
                username: targetUser.username,
                money: 0,
                createdAt: new Date().toISOString()
            };
        }
        moneyData[targetUser.id].money += amount;
        moneyData[targetUser.id].username = targetUser.username;
        fs.writeFileSync(dataPath, JSON.stringify(moneyData, null, 2));
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('💸 Transferência Realizada')
            .setDescription(`Você transferiu **${amount}** moedas para **${targetUser.username}**!`)
            .addFields(
                { name: '👤 De', value: message.author.username, inline: true },
                { name: '👤 Para', value: targetUser.username, inline: true },
                { name: '💸 Valor', value: amount.toString(), inline: true },
                { name: '💵 Seu saldo', value: moneyData[message.author.id].money.toString(), inline: true },
                { name: '💵 Saldo do destinatário', value: moneyData[targetUser.id].money.toString(), inline: true }
            )
            .setFooter({ text: 'RPG Bot' })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
        console.log(`💸 ${message.author.username} transferiu ${amount} moedas para ${targetUser.username}`);
    }
}; 