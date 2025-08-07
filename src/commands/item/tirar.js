const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'tirar',
    description: 'Subtrai quantidade de um item existente',
    category: 'item',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando subtrair quantidade de um item`);
        
        // Verificar se há argumentos suficientes
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Uso incorreto')
                .setDescription('Uso: `# item tirar <nome_do_item> <quantidade>`\n\nExemplo: `# item tirar Moeda 2`')
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
        
        // Subtrair quantidade
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está subtraindo ${quantity} do item "${itemName}"`);
        const result = profileManager.subtractQuantity(userId, itemName, quantity);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle(result.deleted ? '✅ Item removido!' : '✅ Quantidade reduzida!')
                .setDescription(result.message)
                .addFields(
                    result.deleted 
                        ? { name: '🗑️ Item removido', value: `📦 **${result.deletedItem.name}**` }
                        : [
                            { name: '📦 Nova quantidade', value: `${result.newQuantity}`, inline: true },
                            { name: '➖ Removido', value: `-${quantity}`, inline: true }
                        ]
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