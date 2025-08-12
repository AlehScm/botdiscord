const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mensagemMencionada',
    description: 'Responde com 1% de chance quando mencionado e recebe mensagem',
    async execute(message) {
        const client = message.client;

        // Verifica se o bot foi mencionado
        if (!message.mentions.has(client.user) || message.author.bot) return;

        // Canal de logs (substitua pelo ID desejado)
        const logChannelId = '1403175471310573629';
        const logChannel = await client.channels.fetch(logChannelId).catch(() => null);

        // 1% de chance de "ganhar"
        const chance = Math.floor(Math.random() * 100) + 1;
        const ganhou = chance === 1;

        // Criação da resposta e do log
        const resultadoTexto = ganhou
            ? 'Em alguns instantes você receberá a resposta. Aguarde...'
            : 'Foi boa a tentativa... tente novamente mais tarde.';

        const resultadoEmbed = new EmbedBuilder()
            .setColor(ganhou ? '#4ecdc4' : '#ff6b6b')
            .setDescription(`**${message.author}**, ${resultadoTexto}`)
            .setFooter({ text: 'RPG Bot - Sistema de Chance' });

        await message.reply({ embeds: [resultadoEmbed] });

        // Log no canal de logs
        if (logChannel && logChannel.isTextBased()) {
            const logEmbed = new EmbedBuilder()
                .setColor('#f9c74f')
                .setTitle('📋 Tentativa de Pergunta')
                .addFields(
                    { name: '👤 Usuário', value: `${message.author.tag}`, inline: false },
                    { name: '💬 Mensagem', value: message.content, inline: false },
                    { name: '🎲 Resultado', value: ganhou ? '✅ GANHOU' : '❌ Não ganhou', inline: false }
                )
                .setTimestamp();
        
            // Sempre envia o embed de log
            await logChannel.send({ embeds: [logEmbed] });
        
            // Só menciona você se ganhou
            if (ganhou) {
                await logChannel.send('<@320583655024230400>');
            }
        }
    }
};
