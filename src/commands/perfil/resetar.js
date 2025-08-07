const { EmbedBuilder } = require('discord.js');
const profileManager = require('../../services/profileManager');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'resetar',
    description: 'Reseta seu perfil (mantém o perfil mas limpa todos os itens e habilidades)',
    category: 'perfil',
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        
        // Log da ação
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) está tentando resetar o perfil`);
        
        // Verificar se o usuário quer confirmar o reset
        if (args.length === 0 || args[0].toLowerCase() !== 'confirmar') {
            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⚠️ Confirmação necessária')
                .setDescription('Você está prestes a resetar seu perfil!\n\n**Todos os itens e habilidades serão removidos, mas o perfil continuará existindo.**\n\nPara confirmar, use: `# perfil resetar confirmar`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }
        
        // Resetar o perfil
        console.log(`[${new Date().toISOString()}] ${username} (${userId}) resetou seu perfil`);
        const result = profileManager.resetProfile(userId);

        // Remover habilidades do usuário
        const skillsPath = path.join(__dirname, '..', '..', '..', 'data', 'skills.json');
        let habilidadesRemovidas = 0;
        if (fs.existsSync(skillsPath)) {
            const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
            if (skillsData[userId]) {
                habilidadesRemovidas = skillsData[userId].skills ? skillsData[userId].skills.length : 0;
                delete skillsData[userId];
                fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2));
            }
        }
        
        // Remover dinheiro do usuário
        const moneyPath = path.join(__dirname, '..', '..', '..', 'data', 'money.json');
        let dinheiroRemovido = 0;
        if (fs.existsSync(moneyPath)) {
            const moneyData = JSON.parse(fs.readFileSync(moneyPath, 'utf8'));
            if (moneyData[userId]) {
                dinheiroRemovido = moneyData[userId].money || 0;
                delete moneyData[userId];
                fs.writeFileSync(moneyPath, JSON.stringify(moneyData, null, 2));
            }
        }
        
        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor('#51cf66')
                .setTitle('✅ Perfil resetado!')
                .setDescription(result.message)
                .addFields(
                    { name: '🗑️ Itens removidos', value: `${result.itemsRemoved} itens` },
                    { name: '🗑️ Habilidades removidas', value: `${habilidadesRemovidas} habilidades` },
                    { name: '🗑️ Dinheiro removido', value: `${dinheiroRemovido} moedas` }
                )
                .setFooter({ text: 'Use # perfil ver para ver seu perfil limpo' });
            
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