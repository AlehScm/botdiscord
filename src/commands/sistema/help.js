const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Mostra a lista de comandos disponíveis',
    category: 'sistema',
    async execute(message, args) {
        const commandsPath = path.join(__dirname, '..');
        
        // Se não há argumentos, mostrar categorias
        if (args.length === 0) {
            const categories = {
                'perfil': '👤 Comandos de perfil',
                'item': '📦 Comandos de itens',
                'dado': '🎲 Sistema de dados',
                'dinheiro': '💰 Comandos de dinheiro',
                'habilidade': '⚔️ Comandos de habilidades'
            };
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🎮 RPG Bot - Categorias')
                .setDescription('Escolha uma categoria para ver os comandos:\n\n' + 
                    Object.entries(categories).map(([key, value]) => `**${key}** - ${value}`).join('\n'))
                .addFields(
                    { name: '📝 Como usar', value: '`# help <categoria>`\nExemplo: `# help item`' }
                )
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Se há argumentos, mostrar comandos da categoria
        const category = args[0].toLowerCase();
        
        if (category === 'item') {
            // Comandos de item estão em subpasta
            const itemCommandsPath = path.join(commandsPath, 'item');
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
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (category === 'perfil') {
            // Comandos de perfil estão em subpasta
            const perfilCommandsPath = path.join(commandsPath, 'perfil');
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
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (category === 'dado') {
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🎲 Sistema de Dados')
                .setDescription('Lance dados para seu RPG!')
                .addFields(
                    { name: '📝 Como usar', value: '`# <quantidade>d<lados>[+/-/*//<modificador>]`', inline: false },
                    { name: '🎯 Exemplos', value: 
                        '• `# 1d20` - 1 dado de 20 lados\n' +
                        '• `# 2d6` - 2 dados de 6 lados\n' +
                        '• `# 1d20+5` - 1d20 + 5\n' +
                        '• `# 3d8-2` - 3d8 - 2\n' +
                        '• `# 1d100*2` - 1d100 × 2\n' +
                        '• `# 2d10/2` - 2d10 ÷ 2', inline: false },
                    { name: '⚡ Comando alternativo', value: '`# dado` - Mostra informações sobre o sistema', inline: false }
                )
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (category === 'dinheiro') {
            // Comandos de dinheiro estão em subpasta
            const dinheiroCommandsPath = path.join(commandsPath, 'dinheiro');
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
                .setTitle('💰 Sistema de Dinheiro')
                .setDescription('Gerencie o dinheiro dos usuários!')
                .addFields(fields)
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        if (category === 'habilidade') {
            // Comandos de habilidade estão em subpasta
            const habilidadeCommandsPath = path.join(commandsPath, 'habilidade');
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
                .setTitle('⚔️ Sistema de Habilidades')
                .setDescription('Gerencie as habilidades dos usuários!')
                .addFields(fields)
                .setFooter({ text: 'RPG Bot criado com ❤️' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Comandos gerais
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'help.js');
        const categoryCommands = [];
        
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.category === category) {
                categoryCommands.push({
                    name: `# ${command.name}`,
                    value: command.description || 'Sem descrição',
                    inline: false
                });
            }
        }
        
        if (categoryCommands.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Categoria não encontrada')
                .setDescription('Categorias disponíveis: `perfil`, `item`, `dado`, `dinheiro`, `habilidade`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        const categoryNames = {
            'perfil': '👤 Comandos de Perfil',
            'dado': '🎲 Sistema de Dados',
            'dinheiro': '💰 Comandos de Dinheiro',
            'habilidade': '⚔️ Comandos de Habilidades',
            'sistema': '⚙️ Comandos do Sistema'
        };
        
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle(categoryNames[category] || `Comandos - ${category}`)
            .setDescription(`Comandos da categoria **${category}**:`)
            .addFields(categoryCommands)
            .setFooter({ text: 'RPG Bot criado com ❤️' })
            .setTimestamp();
        
        return message.reply({ embeds: [embed] });
    }
}; 