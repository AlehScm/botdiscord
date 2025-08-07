const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

const HABILIDADES_POR_EMBED = 5;
const EMOJI_ANTERIOR = '⬅️';
const EMOJI_PROXIMO = '➡️';
const TEMPO_COLETA = 60000; // 60 segundos

module.exports = {
    name: 'ver',
    description: 'Ver as habilidades de um usuário',
    async execute(message, args) {
        const mentionedUser = message.mentions.users.first();
        const isAdmin = message.author.id === config.admin.userId;
        
        // Se há menção e não é admin, bloquear
        if (mentionedUser && !isAdmin) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Sem permissão')
                .setDescription('Você só pode ver suas próprias habilidades.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        
        const user = mentionedUser || message.author;
        const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'skills.json');

        if (!fs.existsSync(dataPath)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nenhum dado encontrado')
                .setDescription('Nenhum usuário tem habilidades registradas ainda.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        const skillsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (!skillsData[user.id] || !Array.isArray(skillsData[user.id].skills) || skillsData[user.id].skills.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Usuário sem habilidades')
                .setDescription(`**${user.username}** não tem habilidades registradas.`)
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        const userSkills = skillsData[user.id].skills;
        const total = userSkills.length;
        const totalPages = Math.ceil(total / HABILIDADES_POR_EMBED);

        function criarEmbed(pagina) {
            const inicio = pagina * HABILIDADES_POR_EMBED;
            const bloco = userSkills.slice(inicio, inicio + HABILIDADES_POR_EMBED);
            
            const desc = bloco.map((skill, idx) => {
                // Usar campos em português (com fallback para inglês se necessário)
                const nome = skill.nome || skill.name || 'Nome não encontrado';
                const descricao = skill.descricao || skill.description || 'Descrição não encontrada';
                return `**${nome}**\n${descricao}`;
            }).join('\n\n');
            return new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('⚔️ Habilidades do Usuário')
                .setDescription(`**${user.username}** possui **${total}** habilidade${total > 1 ? 's' : ''} (Página ${pagina + 1}/${totalPages}):`)
                .addFields({ name: 'Lista de Habilidades', value: desc })
                .setFooter({ text: 'Use ⬅️ e ➡️ para navegar • RPG Bot' })
                .setTimestamp();
        }

        let paginaAtual = 0;
        const embedInicial = criarEmbed(paginaAtual);
        const botMsg = await message.reply({ embeds: [embedInicial] });

        if (totalPages > 1) {
            await botMsg.react(EMOJI_ANTERIOR);
            await botMsg.react(EMOJI_PROXIMO);

            const filter = (reaction, userReact) => {
                return [EMOJI_ANTERIOR, EMOJI_PROXIMO].includes(reaction.emoji.name) && !userReact.bot && userReact.id === message.author.id;
            };

            const collector = botMsg.createReactionCollector({ filter, time: TEMPO_COLETA });

            collector.on('collect', async (reaction, userReact) => {
                if (reaction.emoji.name === EMOJI_PROXIMO) {
                    if (paginaAtual < totalPages - 1) paginaAtual++;
                } else if (reaction.emoji.name === EMOJI_ANTERIOR) {
                    if (paginaAtual > 0) paginaAtual--;
                }
                await botMsg.edit({ embeds: [criarEmbed(paginaAtual)] });
                await reaction.users.remove(userReact.id);
            });

            collector.on('end', () => {
                botMsg.reactions.removeAll().catch(() => {});
            });
        }
    }
}; 