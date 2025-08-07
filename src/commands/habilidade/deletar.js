const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'deletar',
    description: 'Deleta uma habilidade específica do seu perfil',
    async execute(message, args) {
        try {
            // Verificar se foi fornecido o nome da habilidade
            if (args.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Nome da habilidade não fornecido')
                    .setDescription('Use: `# habilidade deletar <nome da habilidade>`')
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            const skillName = args.join(' ').trim();
            const user = message.author;
            const skillsPath = path.join(__dirname, '..', '..', '..', 'data', 'skills.json');

            // Carregar dados de habilidades
            let skillsData = {};
            if (fs.existsSync(skillsPath)) {
                skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
            }

            // Verificar se o usuário tem habilidades
            if (!skillsData[user.id] || !Array.isArray(skillsData[user.id].skills)) {
                skillsData[user.id] = { skills: [] };
            }

            // Função para normalizar strings (remover acentos, espaços extras, etc.)
            function normalize(str) {
                return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
            }

            // Buscar a habilidade (busca tolerante)
            const skillIndex = skillsData[user.id].skills.findIndex(skill => 
                normalize(skill.nome) === normalize(skillName)
            );

            if (skillIndex === -1) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Habilidade não encontrada')
                    .setDescription(`Você não possui a habilidade **${skillName}**.`)
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            // Remover a habilidade
            const deletedSkill = skillsData[user.id].skills.splice(skillIndex, 1)[0];
            
            // Salvar dados
            fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2));

            // Log da ação
            console.log(`🗑️ ${user.username} deletou a habilidade: ${deletedSkill.nome}`);

            // Embed de sucesso
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Habilidade deletada com sucesso!')
                .setDescription(`A habilidade **${deletedSkill.nome}** foi removida do seu perfil.`)
                .addFields(
                    { name: 'Habilidade', value: deletedSkill.nome, inline: true },
                    { name: 'Descrição', value: deletedSkill.descricao || 'Sem descrição', inline: true }
                )
                .setFooter({ text: 'RPG Bot' })
                .setTimestamp();

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao deletar habilidade:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro ao deletar habilidade')
                .setDescription('Ocorreu um erro ao deletar a habilidade. Tente novamente.')
                .setFooter({ text: 'RPG Bot' });
            message.reply({ embeds: [embed] });
        }
    }
};
