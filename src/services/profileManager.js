const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON que armazenará os perfis
const PROFILES_FILE = path.join(__dirname, '..', '..', 'data', 'profiles.json');

// Garantir que o diretório data existe
const dataDir = path.dirname(PROFILES_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Carregar perfis do arquivo JSON
function loadProfiles() {
    try {
        if (fs.existsSync(PROFILES_FILE)) {
            const data = fs.readFileSync(PROFILES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar perfis:', error);
    }
    return {};
}

// Salvar perfis no arquivo JSON
function saveProfiles(profiles) {
    try {
        fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erro ao salvar perfis:', error);
        return false;
    }
}

// Criar um novo perfil
function createProfile(userId, username) {
    const profiles = loadProfiles();
    
    if (profiles[userId]) {
        return { success: false, message: 'Você já possui um perfil!' };
    }
    
    const newProfile = {
        userId: userId,
        username: username,
        createdAt: new Date().toISOString(),
        items: []
    };
    
    profiles[userId] = newProfile;
    
    if (saveProfiles(profiles)) {
        return { success: true, profile: newProfile };
    } else {
        return { success: false, message: 'Erro ao criar perfil!' };
    }
}

// Obter perfil de um usuário
function getProfile(userId) {
    const profiles = loadProfiles();
    return profiles[userId] || null;
}

// Deletar perfil de um usuário
function deleteProfile(userId) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você não possui um perfil para deletar!' };
    }
    
    delete profiles[userId];
    
    if (saveProfiles(profiles)) {
        return { success: true, message: 'Perfil deletado com sucesso!' };
    } else {
        return { success: false, message: 'Erro ao deletar perfil!' };
    }
}

// Adicionar item ao perfil
function addItem(userId, item) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    if (!profiles[userId].items) {
        profiles[userId].items = [];
    }
    
    // Verificar se o item já existe
    const existingItemIndex = profiles[userId].items.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
    
    if (existingItemIndex !== -1) {
        // Item já existe, aumentar quantidade
        profiles[userId].items[existingItemIndex].quantity += (item.quantity || 1);
        profiles[userId].items[existingItemIndex].obtainedAt = new Date().toISOString();
        
        if (saveProfiles(profiles)) {
            return { 
                success: true, 
                message: `Quantidade de "${item.name}" aumentada!`,
                updated: true,
                newQuantity: profiles[userId].items[existingItemIndex].quantity
            };
        } else {
            return { success: false, message: 'Erro ao atualizar item!' };
        }
    } else {
        // Item não existe, adicionar novo
        profiles[userId].items.push({
            name: item.name,
            description: item.description,
            quantity: item.quantity || 1,
            obtainedAt: new Date().toISOString()
        });
        
        if (saveProfiles(profiles)) {
            return { success: true, message: 'Item adicionado com sucesso!' };
        } else {
            return { success: false, message: 'Erro ao adicionar item!' };
        }
    }
}

// Deletar item do perfil
function deleteItem(userId, itemName) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    if (!profiles[userId].items) {
        return { success: false, message: 'Você não possui itens!' };
    }
    
    const itemIndex = profiles[userId].items.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (itemIndex === -1) {
        return { success: false, message: 'Item não encontrado!' };
    }
    
    const deletedItem = profiles[userId].items.splice(itemIndex, 1)[0];
    
    if (saveProfiles(profiles)) {
        return { 
            success: true, 
            message: `Item "${deletedItem.name}" deletado com sucesso!`,
            deletedItem: deletedItem
        };
    } else {
        return { success: false, message: 'Erro ao deletar item!' };
    }
}

// Adicionar quantidade a um item existente
function addQuantity(userId, itemName, quantity) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    if (!profiles[userId].items) {
        return { success: false, message: 'Você não possui itens!' };
    }
    
    const itemIndex = profiles[userId].items.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (itemIndex === -1) {
        return { success: false, message: 'Item não encontrado!' };
    }
    
    profiles[userId].items[itemIndex].quantity += quantity;
    profiles[userId].items[itemIndex].obtainedAt = new Date().toISOString();
    
    if (saveProfiles(profiles)) {
        return { 
            success: true, 
            message: `Quantidade de "${profiles[userId].items[itemIndex].name}" aumentada!`,
            newQuantity: profiles[userId].items[itemIndex].quantity
        };
    } else {
        return { success: false, message: 'Erro ao atualizar quantidade!' };
    }
}

// Subtrair quantidade de um item existente
function subtractQuantity(userId, itemName, quantity) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    if (!profiles[userId].items) {
        return { success: false, message: 'Você não possui itens!' };
    }
    
    const itemIndex = profiles[userId].items.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (itemIndex === -1) {
        return { success: false, message: 'Item não encontrado!' };
    }
    
    const currentQuantity = profiles[userId].items[itemIndex].quantity;
    
    if (currentQuantity < quantity) {
        return { success: false, message: `Você só tem ${currentQuantity} "${profiles[userId].items[itemIndex].name}"!` };
    }
    
    profiles[userId].items[itemIndex].quantity -= quantity;
    profiles[userId].items[itemIndex].obtainedAt = new Date().toISOString();
    
    // Se a quantidade ficou 0, deletar o item
    if (profiles[userId].items[itemIndex].quantity <= 0) {
        const deletedItem = profiles[userId].items.splice(itemIndex, 1)[0];
        if (saveProfiles(profiles)) {
            return { 
                success: true, 
                message: `Item "${deletedItem.name}" foi removido completamente!`,
                deleted: true,
                deletedItem: deletedItem
            };
        }
    }
    
    if (saveProfiles(profiles)) {
        return { 
            success: true, 
            message: `Quantidade de "${profiles[userId].items[itemIndex].name}" reduzida!`,
            newQuantity: profiles[userId].items[itemIndex].quantity
        };
    } else {
        return { success: false, message: 'Erro ao atualizar quantidade!' };
    }
}

// Editar item existente
function editItem(userId, itemName, newName, newDescription) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    if (!profiles[userId].items) {
        return { success: false, message: 'Você não possui itens!' };
    }
    
    const itemIndex = profiles[userId].items.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (itemIndex === -1) {
        return { success: false, message: 'Item não encontrado!' };
    }
    
    const oldName = profiles[userId].items[itemIndex].name;
    const oldDescription = profiles[userId].items[itemIndex].description;
    
    profiles[userId].items[itemIndex].name = newName;
    profiles[userId].items[itemIndex].description = newDescription;
    profiles[userId].items[itemIndex].obtainedAt = new Date().toISOString();
    
    if (saveProfiles(profiles)) {
        return { 
            success: true, 
            message: `Item "${oldName}" foi editado com sucesso!`,
            oldName: oldName,
            oldDescription: oldDescription,
            newName: newName,
            newDescription: newDescription
        };
    } else {
        return { success: false, message: 'Erro ao editar item!' };
    }
}

// Resetar perfil (limpar todos os itens)
function resetProfile(userId) {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
        return { success: false, message: 'Você precisa criar um perfil primeiro!' };
    }
    
    const itemsRemoved = profiles[userId].items ? profiles[userId].items.length : 0;
    profiles[userId].items = [];
    
    if (saveProfiles(profiles)) {
        return { 
            success: true, 
            message: 'Perfil resetado com sucesso! Todos os itens foram removidos.',
            itemsRemoved: itemsRemoved
        };
    } else {
        return { success: false, message: 'Erro ao resetar perfil!' };
    }
}

module.exports = {
    createProfile,
    getProfile,
    deleteProfile,
    addItem,
    deleteItem,
    addQuantity,
    subtractQuantity,
    editItem,
    resetProfile,
    loadProfiles
}; 