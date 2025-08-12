const { EmbedBuilder, PermissionsBitField } = require('discord.js');

// Função para criar um pequeno atraso, evitando spam e rate limits do Discord
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'dizer',
    description: 'Envia uma mensagem para um canal específico, com opção de repetição (loop).',
    category: 'moderação',
    async execute(message, args) {
        // --- 1. Verificação de Permissão (sem alterações) ---
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Acesso Negado')
                .setDescription('Você precisa ter permissão de **Administrador** para usar este comando.')
                .setFooter({ text: 'Bot de Moderação' });
            
            return message.reply({ embeds: [noPermsEmbed] });
        }

        // --- 2. Verificação de Argumentos (melhorada para incluir o loop) ---
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('💬 Comando: Dizer')
                .setDescription('Faz o bot enviar uma mensagem em um canal de texto. Agora com modo de repetição!')
                .addFields(
                    { name: '📝 Uso Padrão', value: '`!dizer <#canal> <sua mensagem>`', inline: false },
                    { name: '🔁 Uso com Loop', value: '`!dizer <#canal> loop <Nº de vezes> <sua mensagem>`', inline: false },
                    { name: '🎯 Exemplo com Loop', value: '`!dizer #avisos loop 3 Alguém online?`', inline: false }
                )
                .setFooter({ text: 'Bot de Moderação' });
            
            return message.reply({ embeds: [usageEmbed] });
        }
        
        // --- 3. Processamento do Comando ---
        try {
            // Pega o canal mencionado no primeiro argumento
            const channel = message.mentions.channels.first();

            if (!channel) {
                const invalidChannelEmbed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Canal Inválido')
                    .setDescription('Você precisa mencionar um canal de texto válido como primeiro argumento. Exemplo: `#geral`')
                    .setFooter({ text: 'Bot de Moderação' });
                
                return message.reply({ embeds: [invalidChannelEmbed] });
            }

            // --- Lógica para decidir entre envio normal ou em loop ---
            const isLoop = args[1]?.toLowerCase() === 'loop';

            if (isLoop) {
                // --- LÓGICA DO LOOP ---
                
                // Validação dos argumentos do loop
                if (args.length < 4) {
                    return message.reply({ content: 'Formato inválido para loop. Use: `!dizer #canal loop <número> <mensagem>`' });
                }

                const loopCount = parseInt(args[2]);
                if (isNaN(loopCount)) {
                    return message.reply({ content: 'O número de repetições deve ser um número válido.' });
                }
                
                // Limite de segurança para evitar abuso/spam
                if (loopCount <= 0 || loopCount > 20) {
                     return message.reply({ content: 'O número de repetições deve ser entre 1 e 20.' });
                }

                const textToSend = args.slice(3).join(' ');
                if (!textToSend) {
                    return message.reply({ content: 'Você precisa fornecer uma mensagem para enviar no loop.' });
                }

                // Confirmação antes de iniciar o loop
                await message.reply(`Ok! Enviando a mensagem no canal ${channel} **${loopCount}** vezes.`);

                // Executa o loop para enviar as mensagens
                for (let i = 0; i < loopCount; i++) {
                    await channel.send(textToSend);
                    await delay(500); // Adiciona um atraso de 0.5 segundos entre as mensagens
                }

                console.log(`${message.author.username} usou o comando !dizer em loop ${loopCount} vezes no canal ${channel.name}`);

            } else {
                // --- LÓGICA DE ENVIO ÚNICO (original) ---
                const textToSend = args.slice(1).join(' ');

                await channel.send(textToSend);

                const successEmbed = new EmbedBuilder()
                    .setColor('#4ecdc4')
                    .setTitle('✅ Mensagem Enviada!')
                    .setDescription(`Sua mensagem foi enviada com sucesso no canal ${channel}.`)
                    .setFooter({ text: `Comando executado por: ${message.author.username}` })
                    .setTimestamp();

                await message.reply({ embeds: [successEmbed] });
            }

        } catch (error) {
            console.error('Erro ao executar o comando "dizer":', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Ops, algo deu errado!')
                .setDescription('Não consegui enviar a mensagem. Verifique se eu tenho as permissões corretas no canal de destino.')
                .setFooter({ text: 'Bot de Moderação' });
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};