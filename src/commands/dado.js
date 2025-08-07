const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dado',
    description: 'Sistema de dados para RPG',
    category: 'dado',
    async execute(message, args) {
        // Se não há argumentos, mostrar como usar
        if (args.length === 0) {
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
                        '• `# 2d10/2` - 2d10 ÷ 2', inline: false }
                )
                .setFooter({ text: 'RPG Bot - Sistema de Dados' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Processar o comando de dado
        const diceCommand = args.join(' ');
        await processDiceRoll(message, diceCommand);
    }
};

async function processDiceRoll(message, diceCommand) {
    try {
        // Regex para capturar o padrão: quantidade d lados [operador modificador]
        const diceRegex = /^(\d+)d(\d+)([+\-*/]\d+)?$/i;
        const match = diceCommand.match(diceRegex);
        
        if (!match) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Formato inválido')
                .setDescription('Use o formato: `quantidade d lados [operador modificador]`\nExemplo: `1d20`, `2d6+3`, `1d100-5`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        const quantity = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const operator = match[3] ? match[3][0] : null;
        const modifier = match[3] ? parseInt(match[3].substring(1)) : 0;
        
        // Validações
        if (quantity <= 0 || quantity > 100) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Quantidade inválida')
                .setDescription('A quantidade deve ser entre 1 e 100.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        if (sides <= 0 || sides > 1000) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Lados inválidos')
                .setDescription('O número de lados deve ser entre 1 e 1000.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Lançar os dados
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        // Aplicar modificador
        let originalTotal = total;
        let modifierText = '';
        
        if (operator && modifier !== 0) {
            switch (operator) {
                case '+':
                    total += modifier;
                    modifierText = ` + ${modifier}`;
                    break;
                case '-':
                    total -= modifier;
                    modifierText = ` - ${modifier}`;
                    break;
                case '*':
                    total *= modifier;
                    modifierText = ` × ${modifier}`;
                    break;
                case '/':
                    if (modifier === 0) {
                        const embed = new EmbedBuilder()
                            .setColor('#ff6b6b')
                            .setTitle('❌ Divisão por zero')
                            .setDescription('Não é possível dividir por zero.')
                            .setFooter({ text: 'RPG Bot' });
                        
                        return message.reply({ embeds: [embed] });
                    }
                    total = Math.floor(total / modifier);
                    modifierText = ` ÷ ${modifier}`;
                    break;
            }
        }
        
        // Criar embed com resultado
        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('🎲 Resultado dos Dados')
            .setDescription(`**${message.author.username}** lançou **${quantity}d${sides}${modifierText}**`)
            .addFields(
                { name: '📊 Dados lançados', value: rolls.join(', '), inline: true },
                { name: '🔢 Soma dos dados', value: originalTotal.toString(), inline: true },
                { name: '🎯 Resultado final', value: total.toString(), inline: true }
            )
            .setFooter({ text: `RPG Bot - ${new Date().toLocaleString('pt-BR')}` })
            .setTimestamp();
        
        // Adicionar informações extras se houver modificador
        if (operator && modifier !== 0) {
            embed.addFields({
                name: '📝 Cálculo',
                value: `${originalTotal} ${operator} ${modifier} = ${total}`,
                inline: false
            });
        }
        
        // Adicionar informações especiais
        if (quantity === 1) {
            if (rolls[0] === 1) {
                embed.addFields({ name: '💀 Falha Crítica!', value: 'Você tirou o menor valor possível!', inline: false });
            } else if (rolls[0] === sides) {
                embed.addFields({ name: '🎉 Sucesso Crítico!', value: 'Você tirou o maior valor possível!', inline: false });
            }
        }
        
        await message.reply({ embeds: [embed] });
        
        // Log no console
        console.log(`🎲 ${message.author.username} lançou ${quantity}d${sides}${modifierText}: ${rolls.join(', ')} = ${total}`);
        
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Erro')
            .setDescription('Ocorreu um erro ao processar os dados.')
            .setFooter({ text: 'RPG Bot' });
        
        await message.reply({ embeds: [embed] });
    }
} 