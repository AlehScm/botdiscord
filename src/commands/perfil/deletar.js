const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'deletar',
    description: 'Deleta seu perfil de RPG permanentemente',
    category: 'perfil',
    async execute(message, args) {
        const userId = message.author.id;
        
        // Verificar se o usuário quer confirmar a exclusão
        if (args.length === 0 || args[0].toLowerCase() !== 'confirmar') {
            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⚠️ Confirmação necessária')
                .setDescription('Você está prestes a deletar seu perfil de RPG permanentemente!\n\n**Esta ação não pode ser desfeita!**\n\nPara confirmar, use: `# perfil deletar confirmar`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Deletar o perfil
        console.log(`[${new Date().toISOString()}] ${message.author.username} (${userId}) deletou seu perfil`);
        const result = profileManager.deleteProfile(userId);

        // Remover habilidades do usuário
        const skillsPath = path.join(__dirname, '..', '..', '..', 'data', 'skills.json');
        if (fs.existsSync(skillsPath)) {
            const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
            if (skillsData[userId]) {
                delete skillsData[userId];
                fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2));
            }
        }
        
        // Remover dinheiro do usuário
        const moneyPath = path.join(__dirname, '..', '..', '..', 'data', 'money.json');
        if (fs.existsSync(moneyPath)) {
            const moneyData = JSON.parse(fs.readFileSync(moneyPath, 'utf8'));
            if (moneyData[userId]) {
                delete moneyData[userId];
                fs.writeFileSync(moneyPath, JSON.stringify(moneyData, null, 2));
            }
        }
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Perfil deletado')
                .setDescription(result.message)
                .setFooter({ text: 'Use # perfil criar para criar um novo perfil' });
            
            return message.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro')
                .setDescription(result.message)
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
    }
}; 