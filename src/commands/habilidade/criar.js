const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'criar',
    description: 'Cria uma habilidade para um usuário',
    async execute(message, args) {
        if (args.length < 1) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Argumentos insuficientes')
                .setDescription('Use: `# habilidade criar <nome>, <descrição>`')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        const input = args.join(' ');
        const [nome, descricao] = input.split(',').map(s => s.trim());
        if (!nome || !descricao) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Formato inválido')
                .setDescription('Use: `# habilidade criar <nome>, <descrição>`')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        // Verificar se há menção de usuário
        const mentionedUser = message.mentions.users.first();
        const isAdmin = message.author.id === config.admin.userId;
        
        // Se há menção e não é admin, bloquear
        if (mentionedUser && !isAdmin) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Sem permissão')
                .setDescription('Você só pode criar habilidades para si mesmo.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
        
        const user = mentionedUser || message.author;
        const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'skills.json');
        const dataDir = path.dirname(dataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let skillsData = {};
        if (fs.existsSync(dataPath)) {
            skillsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }

        if (!skillsData[user.id]) {
            skillsData[user.id] = {
                userId: user.id,
                username: user.username,
                skills: [],
                createdAt: new Date().toISOString()
            };
        }
        if (!Array.isArray(skillsData[user.id].skills)) {
            skillsData[user.id].skills = [];
        }

        if (skillsData[user.id].skills.some(skill => skill.nome && skill.nome.toLowerCase() === nome.toLowerCase())) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Habilidade já existe')
                .setDescription('Você já possui uma habilidade com esse nome.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        skillsData[user.id].skills.push({
            nome,
            descricao,
            createdAt: new Date().toISOString()
        });
        skillsData[user.id].username = user.username;

        fs.writeFileSync(dataPath, JSON.stringify(skillsData, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('⚔️ Habilidade Criada')
            .setDescription(`**${nome}** criada para **${user.username}**!`)
            .addFields(
                { name: '👤 Usuário', value: user.username, inline: true },
                { name: '⚔️ Habilidade', value: nome, inline: true },
                { name: '📝 Descrição', value: descricao, inline: false }
            )
            .setFooter({ text: 'RPG Bot' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        console.log(`⚔️ ${user.username} criou habilidade ${nome}`);
    }
}; 