const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'inventario',
    description: 'Comandos para gerenciar o inventário',
    category: 'inventario',
    async execute(message, args) {
        if (args.length === 0) {
            const inventarioCommandsPath = path.join(__dirname, 'inventario');
            const inventarioCommandFiles = fs.readdirSync(inventarioCommandsPath).filter(file => file.endsWith('.js'));
            const fields = inventarioCommandFiles.map(file => {
                const command = require(path.join(inventarioCommandsPath, file));
                return {
                    name: `# inventario ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🎒 Comandos de Inventário')
                .setDescription('Comandos para ver seus itens e dinheiro:')
                .addFields(fields)
                .addFields({ name: '📝 Como usar', value: '`# inventario ver`' })
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        try {
            const subcommandPath = path.join(__dirname, 'inventario', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `ver`')
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`Erro ao executar subcomando inventario:`, error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro')
                .setDescription('Ocorreu um erro ao executar o comando.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
    }
}; 