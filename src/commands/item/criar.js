const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'criar',
    description: 'Cria um novo item no seu inventário',
    category: 'item',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando criar um item`);
        
        // Verificar se há argumentos suficientes
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Uso incorreto')
                .setDescription('Uso: `# item criar <nome_do_item>, <descrição>`\n\nExemplo: `# item criar Espada de Fogo, Uma espada flamejante`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Juntar todos os argumentos após "criar"
        const itemArgs = args.join(' ');
        
        // Separar por vírgula
        const parts = itemArgs.split(',');
        if (parts.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Formato incorreto')
                .setDescription('Use vírgula para separar nome e descrição:\n`# item criar Espada de Fogo, Uma espada flamejante`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        const itemName = parts[0].trim();
        const itemDescription = parts[1].trim();
        
        // Criar objeto do item
        const item = {
            name: itemName,
            description: itemDescription
        };
        
        // Adicionar item ao perfil
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) criou o item "${itemName}"`);
        const result = profileManager.addItem(userId, item);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle(result.updated ? '✅ Quantidade aumentada!' : '✅ Item criado!')
                .setDescription(result.updated 
                    ? `📦 **${itemName}** - Quantidade atualizada para ${result.newQuantity}`
                    : `📦 **${itemName}** foi criado no seu inventário`)
                .addFields(
                    { name: '📝 Descrição', value: itemDescription }
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