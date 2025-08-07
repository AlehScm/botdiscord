const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'editar',
    description: 'Edita o nome e descrição de uma habilidade existente',
    async execute(message, args) {
        try {
            // Verificar se foram fornecidos os argumentos necessários
            if (args.length < 2) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Argumentos insuficientes')
                    .setDescription('Use: `# habilidade editar <nome atual>, <novo nome>, <nova descrição>`')
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

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

            // Separar os argumentos por vírgula
            const fullArgs = args.join(' ');
            const parts = fullArgs.split(',').map(part => part.trim());

            if (parts.length < 3) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Formato incorreto')
                    .setDescription('Use: `# habilidade editar <nome atual>, <novo nome>, <nova descrição>`')
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            const currentName = parts[0];
            const newName = parts[1];
            const newDescription = parts[2];

            // Verificar se o novo nome não está vazio
            if (!newName || newName.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Nome inválido')
                    .setDescription('O novo nome da habilidade não pode estar vazio.')
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            // Buscar a habilidade atual (busca tolerante)
            const skillIndex = skillsData[user.id].skills.findIndex(skill => 
                normalize(skill.nome) === normalize(currentName)
            );

            if (skillIndex === -1) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Habilidade não encontrada')
                    .setDescription(`Você não possui a habilidade **${currentName}**.`)
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            // Verificar se o novo nome já existe (exceto para a habilidade atual)
            const existingSkill = skillsData[user.id].skills.find((skill, index) => 
                index !== skillIndex && normalize(skill.nome) === normalize(newName)
            );

            if (existingSkill) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Nome já existe')
                    .setDescription(`Você já possui uma habilidade chamada **${newName}**.`)
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }

            // Salvar o nome e descrição antigos para o log
            const oldName = skillsData[user.id].skills[skillIndex].nome;
            const oldDescription = skillsData[user.id].skills[skillIndex].descricao;

            // Atualizar a habilidade (preservando campos existentes)
            skillsData[user.id].skills[skillIndex].nome = newName;
            skillsData[user.id].skills[skillIndex].descricao = newDescription;
            skillsData[user.id].skills[skillIndex].updatedAt = new Date().toISOString();

            // Salvar dados
            fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2));

            // Log da ação
            console.log(`✏️ ${user.username} editou a habilidade: ${oldName} → ${newName}`);

            // Embed de sucesso
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Habilidade editada com sucesso!')
                .setDescription(`A habilidade foi atualizada.`)
                .addFields(
                    { name: 'Nome anterior', value: oldName, inline: true },
                    { name: 'Novo nome', value: newName, inline: true },
                    { name: 'Descrição anterior', value: oldDescription || 'Sem descrição', inline: false },
                    { name: 'Nova descrição', value: newDescription, inline: false }
                )
                .setFooter({ text: 'RPG Bot' })
                .setTimestamp();

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao editar habilidade:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro ao editar habilidade')
                .setDescription('Ocorreu um erro ao editar a habilidade. Tente novamente.')
                .setFooter({ text: 'RPG Bot' });
            message.reply({ embeds: [embed] });
        }
    }
};
