const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');

module.exports = {
    name: 'editar',
    description: 'Edita um item existente',
    category: 'item',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando editar um item`);
        
        // Verificar se há argumentos suficientes
        if (args.length < 3) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Uso incorreto')
                .setDescription('Uso: `# item editar <nome_atual>, <novo_nome>, <nova_descrição>`\n\nExemplo: `# item editar Espada, Espada de Fogo, Uma espada flamejante`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Juntar todos os argumentos
        const itemArgs = args.join(' ');
        
        // Separar por vírgula
        const parts = itemArgs.split(',');
        if (parts.length < 3) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Formato incorreto')
                .setDescription('Use vírgula para separar: nome atual, novo nome, nova descrição\n`# item editar Espada, Espada de Fogo, Uma espada flamejante`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        const currentName = parts[0].trim();
        const newName = parts[1].trim();
        const newDescription = parts[2].trim();
        
        // Editar o item
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está editando o item "${currentName}"`);
        const result = profileManager.editItem(userId, currentName, newName, newDescription);
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Item editado!')
                .setDescription(result.message)
                .addFields(
                    { name: '📝 Nome antigo', value: result.oldName, inline: true },
                    { name: '📝 Nome novo', value: result.newName, inline: true },
                    { name: '📝 Nova descrição', value: result.newDescription }
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