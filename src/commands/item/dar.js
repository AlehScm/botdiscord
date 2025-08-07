const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config.js');

module.exports = {
    name: 'dar',
    description: 'Dar um item seu para outro usuário',
    async execute(message, args) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Argumentos insuficientes')
                .setDescription('Use: `# item dar @usuario <nome_do_item>`')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Usuário não encontrado')
                .setDescription('Mencione um usuário válido.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        if (targetUser.id === message.author.id) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Ação inválida')
                .setDescription('Você não pode dar itens para si mesmo.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        const mention = message.mentions.users.first();
        let itemName = args.join(' ').replace(/<@!?\d+>/, '').trim();
        if (!itemName) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nome do item não especificado')
                .setDescription('Especifique o nome do item que deseja dar.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        // Capturar nome do item e quantidade (ex: "faca 2" ou só "faca")
        let partes = itemName.split(' ');
        let qtd = 1;
        if (!isNaN(partes[partes.length - 1])) {
            qtd = parseInt(partes.pop());
            itemName = partes.join(' ');
        }
        itemName = itemName.trim();
        if (!itemName) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nome do item não especificado')
                .setDescription('Especifique o nome do item que deseja dar.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }

        const profilesPath = path.join(__dirname, '..', '..', '..', 'data', 'profiles.json');
        
        if (!fs.existsSync(profilesPath)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Nenhum perfil encontrado')
                .setDescription('Você precisa ter um perfil criado primeiro.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
        
        // Verificar se o autor tem perfil
        if (!profiles[message.author.id]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Perfil não encontrado')
                .setDescription('Você precisa criar um perfil primeiro com `# perfil criar`.')
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        // Verificar se o usuário alvo tem perfil
        if (!profiles[targetUser.id]) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Perfil do alvo não encontrado')
                .setDescription(`${targetUser.username} precisa criar um perfil primeiro.`)
                .setFooter({ text: 'RPG Bot' });
            
            return message.reply({ embeds: [embed] });
        }

        const authorProfile = profiles[message.author.id];
        const targetProfile = profiles[targetUser.id];

        // Usar sempre o campo 'items' como inventário
        if (!Array.isArray(authorProfile.items)) {
            authorProfile.items = [];
        }
        if (!Array.isArray(targetProfile.items)) {
            targetProfile.items = [];
        }
        const authorInventory = authorProfile.items;
        const targetInventory = targetProfile.items;

        try {
            // Função para normalizar nomes (remover espaços extras e deixar minúsculo)
            function normalize(str) {
                return (str || '').normalize('NFD').replace(/\s+/g, ' ').trim().toLowerCase();
            }
            // LOG: Inventário do autor antes da busca
            console.log('Inventário do autor:', JSON.stringify(authorInventory, null, 2));
            console.log('Nome do item buscado (normalizado):', normalize(itemName));
            // Verificar se o autor tem o item (busca tolerante, name ou nome)
            const authorItem = authorInventory.find(item => 
                normalize(item.name) === normalize(itemName) || normalize(item.nome) === normalize(itemName)
            );
            console.log('Resultado da busca authorItem:', authorItem);
            if (!authorItem || (authorItem.quantity || 1) < qtd) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Item não encontrado ou quantidade insuficiente')
                    .setDescription(`Você não possui quantidade suficiente do item **${itemName}**.`)
                    .setFooter({ text: 'RPG Bot' });
                return message.reply({ embeds: [embed] });
            }
            // Subtrair quantidade do autor
            authorItem.quantity = (authorItem.quantity || 1) - qtd;
            // Se quantidade <= 0, remover do inventário
            if (authorItem.quantity <= 0) {
                authorProfile.items = authorInventory.filter(item =>
                    !(normalize(item.name) === normalize(itemName) || normalize(item.nome) === normalize(itemName))
                );
            }
            // Adicionar item ao alvo (busca tolerante, name ou nome)
            let targetItem;
            try {
                targetItem = targetInventory.find(item => 
                    normalize(item.name) === normalize(itemName) || normalize(item.nome) === normalize(itemName)
                );
            } catch (e) {
                console.error('Erro ao buscar item no inventário do alvo:', e);
                throw e;
            }
            if (targetItem) {
                targetItem.quantity = (targetItem.quantity || 1) + qtd;
            } else {
                targetInventory.push({
                    name: authorItem.name || authorItem.nome,
                    description: authorItem.description,
                    quantity: qtd
                });
            }
            // Salvar alterações
            try {
                fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
            } catch (e) {
                console.error('Erro ao salvar perfis:', e);
                throw e;
            }
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('📦 Item Transferido')
                .setDescription(`**${authorItem.name || authorItem.nome}** transferido com sucesso!`)
                .addFields(
                    { name: '👤 De', value: message.author.username, inline: true },
                    { name: '👤 Para', value: targetUser.username, inline: true },
                    { name: '📦 Item', value: authorItem.name || authorItem.nome, inline: true },
                    { name: '📊 Quantidade', value: qtd.toString(), inline: true },
                    { name: '📝 Descrição', value: authorItem.description, inline: false }
                )
                .setFooter({ text: 'RPG Bot' })
                .setTimestamp();
            await message.reply({ embeds: [embed] });
            console.log(`📦 ${message.author.username} deu ${authorItem.name || authorItem.nome} (${qtd}) para ${targetUser.username}`);
            // LOG: Nome normalizado de cada item do inventário
            authorInventory.forEach((item, idx) => {
                console.log(`Item ${idx + 1}:`, {
                    name: item.name,
                    nome: item.nome,
                    nameNorm: normalize(item.name),
                    nomeNorm: normalize(item.nome)
                });
            });
        } catch (err) {
            console.error('Erro inesperado no comando item dar:', err);
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Erro inesperado')
                .setDescription('Ocorreu um erro inesperado ao tentar transferir o item. Veja o console para detalhes.')
                .setFooter({ text: 'RPG Bot' });
            return message.reply({ embeds: [embed] });
        }
    }
}; 