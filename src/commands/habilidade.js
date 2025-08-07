const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'habilidade',
    description: 'Comandos para gerenciar habilidades',
    category: 'habilidade',
    async execute(message, args) {
        // Se não há argumentos, mostrar subcomandos disponíveis
        if (args.length === 0) {
            const habilidadeCommandsPath = path.join(__dirname, 'habilidade');
            const habilidadeCommandFiles = fs.readdirSync(habilidadeCommandsPath).filter(file => file.endsWith('.js'));
            
            const fields = habilidadeCommandFiles.map(file => {
                const command = require(path.join(habilidadeCommandsPath, file));
                return {
                    name: `# habilidade ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                };
            });
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('⚔️ Comandos de Habilidades')
                .setDescription('Comandos para gerenciar habilidades dos usuários:')
                .addFields(fields)
                .addFields(
                    { name: '📝 Como usar', value: '`# habilidade <subcomando> <argumentos>`\nExemplo: `# habilidade criar @usuario Espada 10`' }
                )
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Executar subcomando
        const subcommand = args[0].toLowerCase();
        const subcommandArgs = args.slice(1);
        
        try {
            const subcommandPath = path.join(__dirname, 'habilidade', `${subcommand}.js`);
            if (fs.existsSync(subcommandPath)) {
                const subcommandModule = require(subcommandPath);
                await subcommandModule.execute(message, subcommandArgs);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Subcomando não encontrado')
                    .setDescription('Subcomandos disponíveis: `criar`, `ver`, `deletar`, `editar`')
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