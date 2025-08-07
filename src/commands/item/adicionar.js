const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'adicionar',
    description: 'Adiciona quantidade a um item existente',
    category: 'item',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando adicionar quantidade a um item`);
        
        // Verificar se há argumentos suficientes
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Uso incorreto')
                .setDescription('Uso: `# item adicionar <nome_do_item> <quantidade>`\n\nExemplo: `# item adicionar Moeda 5`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Separar quantidade do nome do item
        const quantity = parseInt(args[args.length - 1]);
        const itemName = args.slice(0, -1).join(' ');
        
        // Verificar se a quantidade é válida
        if (isNaN(quantity) || quantity <= 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Quantidade inválida')
                .setDescription('A quantidade deve ser um número maior que zero!')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Adicionar quantidade
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está adicionando ${quantity} ao item "${itemName}"`);
        const result = profileManager.addQuantity(userId, itemName, quantity);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Quantidade adicionada!')
                .setDescription(result.message)
                .addFields(
                    { name: '📦 Nova quantidade', value: `${result.newQuantity}`, inline: true },
                    { name: '➕ Adicionado', value: `+${quantity}`, inline: true }
                )
                .setFooter({ text: 'RPG Bot' });
            
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