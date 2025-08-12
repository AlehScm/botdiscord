require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuração do cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Carregar comandos dinamicamente
client.commands = new Collection();

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Se é uma pasta, carregar comandos recursivamente
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            // Se é um arquivo .js, carregar como comando
            const command = require(filePath);
            client.commands.set(command.name, command);
        }
    }
}

const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

// Listener de mensagens
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('# ')) return;
    
    const content = message.content.slice(1).trim();
    const args = content.split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Verificar se é um comando de dados (formato: XdY[+/-/*//Z])
    const diceRegex = /^(\d+)d(\d+)([+\-*/]\d+)?$/i;
    if (diceRegex.test(commandName)) {
        const dadoCommand = client.commands.get('dado');
        if (dadoCommand) {
            try {
                await dadoCommand.execute(message, [commandName]);
            } catch (error) {
                console.error(`Erro ao executar dados:`, error);
                message.reply('❌ Ocorreu um erro ao processar os dados.');
            }
        }
        return;
    }
    
    // Comandos normais
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Erro ao executar o comando ${commandName}:`, error);
        message.reply('❌ Ocorreu um erro ao executar este comando.');
    }
});

// Evento quando o bot está pronto
client.on('ready', () => {
    console.log(`🎮 RPG Bot ${client.user.tag} está online!`);
    client.user.setActivity('RPG | #help', { type: 'PLAYING' });
});

// Tratamento de erros
client.on('error', error => {
    console.error('Erro no bot:', error);
});
process.on('unhandledRejection', error => {
    console.error('Erro não tratado:', error);
});

const mensagemMencionada = require('./commands/pergunta');

client.on('messageCreate', async (message) => {
    // Adicione outras verificações aqui se necessário
    await mensagemMencionada.execute(message);
});

// Conectar o bot
client.login(process.env.DISCORD_TOKEN); 