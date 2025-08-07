const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'deletar',
    description: 'Deleta um item do seu inventário',
    category: 'item',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando deletar um item`);
        
        // Verificar se há argumentos
        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Uso incorreto')
                .setDescription('Uso: `# item deletar <nome_do_item>`\n\nExemplo: `# item deletar Espada de Fogo`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Juntar todos os argumentos como nome do item
        const itemName = args.join(' ');
        
        // Deletar o item
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está deletando o item "${itemName}"`);
        const result = profileManager.deleteItem(userId, itemName);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Item deletado!')
                .setDescription(result.message)
                .addFields(
                    { name: '🗑️ Item removido', value: `📦 **${result.deletedItem.name}**` }
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