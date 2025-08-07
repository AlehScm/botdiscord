const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Mostra informações sobre comandos',
    category: 'sistema',
    async execute(message, args) {
        // Se não há argumentos, mostrar categorias disponíveis
        if (args.length === 0) {
            const sistemaCommandsPath = path.join(__dirname, 'sistema');
            const sistemaCommandFiles = fs.readdirSync(sistemaCommandsPath).filter(file => file.endsWith('.js'));
            
            const fields = sistemaCommandFiles.map(file => {
                const command = require(path.join(sistemaCommandsPath, file));
                return {
                    name: `# ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('❓ Comandos do Sistema')
                .setDescription('Comandos para gerenciar o sistema:')
                .addFields(fields)
                .addFields(
                    { name: '📝 Como usar', value: '`# <comando> <argumentos>`\nExemplo: `# help perfil`' }
                )
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Executar subcomando
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        
        try {
            const subcommandPath = path.join(__dirname, 'sistema', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `help`')
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