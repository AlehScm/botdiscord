const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'dinheiro',
    description: 'Comandos para gerenciar dinheiro',
    category: 'dinheiro',
    async execute(message, args) {
        // Se não há argumentos, mostrar subcomandos disponíveis
        if (args.length === 0) {
            const dinheiroCommandsPath = path.join(__dirname, 'dinheiro');
            const dinheiroCommandFiles = fs.readdirSync(dinheiroCommandsPath).filter(file => file.endsWith('.js'));
            
            const fields = dinheiroCommandFiles.map(file => {
                const command = require(path.join(dinheiroCommandsPath, file));
                return {
                    name: `# dinheiro ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('💰 Comandos de Dinheiro')
                .setDescription('Comandos para gerenciar dinheiro dos usuários:')
                .addFields(fields)
                .addFields(
                    { name: '📝 Como usar', value: '`# dinheiro <subcomando> <argumentos>`\nExemplo: `# dinheiro criar @usuario 100`' }
                )
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Executar subcomando
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        
        try {
            const subcommandPath = path.join(__dirname, 'dinheiro', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `criar`, `ver`, `adicionar`')
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