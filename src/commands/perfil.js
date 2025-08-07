const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'perfil',
    description: 'Comandos para gerenciar perfis',
    category: 'perfil',
    async execute(message, args) {
        // Se não há argumentos, mostrar subcomandos disponíveis
        if (args.length === 0) {
            const perfilCommandsPath = path.join(__dirname, 'perfil');
            const perfilCommandFiles = fs.readdirSync(perfilCommandsPath).filter(file => file.endsWith('.js'));
            
            const fields = perfilCommandFiles.map(file => {
                const command = require(path.join(perfilCommandsPath, file));
                return {
                    name: `# perfil ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('👤 Comandos de Perfil')
                .setDescription('Comandos para gerenciar seu perfil:')
                .addFields(fields)
                .addFields(
                    { name: '📝 Como usar', value: '`# perfil <subcomando> <argumentos>`\nExemplo: `# perfil criar`' }
                )
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Executar subcomando
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        
        try {
            const subcommandPath = path.join(__dirname, 'perfil', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `criar`, `ver`, `deletar`, `resetar`')
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