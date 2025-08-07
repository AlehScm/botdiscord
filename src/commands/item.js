const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'item',
    description: 'Comandos para gerenciar itens',
    category: 'item',
    async execute(message, args) {
        // Se não há argumentos, mostrar subcomandos disponíveis
        if (args.length === 0) {
            const itemCommandsPath = path.join(__dirname, 'item');
            const itemCommandFiles = fs.readdirSync(itemCommandsPath).filter(file => file.endsWith('.js'));
            
            const fields = itemCommandFiles.map(file => {
                const command = require(path.join(itemCommandsPath, file));
                return {
                    name: `# item ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('📦 Comandos de Itens')
                .setDescription('Comandos para gerenciar itens no seu inventário:')
                .addFields(fields)
                .addFields(
                    { name: '📝 Como usar', value: '`# item <subcomando> <argumentos>`\nExemplo: `# item criar Espada, Uma espada`' }
                )
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Executar subcomando
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        
        try {
            const subcommandPath = path.join(__dirname, 'item', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `criar`, `deletar`, `adicionar`, `tirar`, `editar`, `dar`')
                    .setFooter({ text: 'RPG Bot' });
                
                return message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`Erro ao executar subcomando ${subcommand}:`, error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro')
                .setDescription('Ocorreu um erro ao executar o comando.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
    }
}; 