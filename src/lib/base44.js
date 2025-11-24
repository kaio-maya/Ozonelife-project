// Mock Base44 SDK implementation using localStorage
const STORAGE_KEYS = {
    SERVICOS: 'base44_servicos',
    PRODUTOS: 'base44_produtos',
    AGENDAMENTOS: 'base44_agendamentos',
    USER: 'base44_user',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const getStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const setStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Generic Entity CRUD
const createEntity = (key) => ({
    list: async (orderBy, limit) => {
        await delay(500);
        let items = getStorage(key);

        if (orderBy) {
            const desc = orderBy.startsWith('-');
            const field = desc ? orderBy.slice(1) : orderBy;

            items.sort((a, b) => {
                if (a[field] < b[field]) return desc ? 1 : -1;
                if (a[field] > b[field]) return desc ? -1 : 1;
                return 0;
            });
        }

        if (limit) {
            items = items.slice(0, limit);
        }

        return items;
    },

    create: async (data) => {
        await delay(500);
        const items = getStorage(key);
        const newItem = { id: generateId(), ...data, created_at: new Date().toISOString() };
        items.push(newItem);
        setStorage(key, items);
        return newItem;
    },

    update: async (id, data) => {
        await delay(500);
        const items = getStorage(key);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');

        items[index] = { ...items[index], ...data };
        setStorage(key, items);
        return items[index];
    },

    delete: async (id) => {
        await delay(500);
        const items = getStorage(key);
        const newItems = items.filter(item => item.id !== id);
        setStorage(key, newItems);
        return true;
    },

    filter: async (filters, orderBy, limit) => {
        await delay(500);
        let items = getStorage(key);

        // Apply filters
        items = items.filter(item => {
            return Object.entries(filters).every(([k, v]) => item[k] === v);
        });

        if (orderBy) {
            const desc = orderBy.startsWith('-');
            const field = desc ? orderBy.slice(1) : orderBy;
            items.sort((a, b) => {
                if (a[field] < b[field]) return desc ? 1 : -1;
                if (a[field] > b[field]) return desc ? -1 : 1;
                return 0;
            });
        }

        if (limit) {
            items = items.slice(0, limit);
        }

        return items;
    }
});

export const base44 = {
    entities: {
        Servico: createEntity(STORAGE_KEYS.SERVICOS),
        Produto: createEntity(STORAGE_KEYS.PRODUTOS),
        Agendamento: createEntity(STORAGE_KEYS.AGENDAMENTOS),
    },
    auth: {
        login: async (email, password) => {
            await delay(800);
            if (email === 'admin@ozonelife.com' && password === 'admin') {
                const user = { id: 'admin', name: 'Admin', email };
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                return user;
            }
            throw new Error('Credenciais inválidas');
        },
        logout: async () => {
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.location.href = '/dashboard'; // Simple redirect
        },
        me: async () => {
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        },
        isAuthenticated: async () => {
            return !!localStorage.getItem(STORAGE_KEYS.USER);
        },
        redirectToLogin: (path) => {
            window.location.href = '/login';
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                await delay(1500);
                // In a real app this would upload. Here we just return a fake URL or a blob URL if possible.
                // For simplicity, we'll return a placeholder or create a blob URL.
                const url = URL.createObjectURL(file);
                return { file_url: url };
            }
        }
    }
};

// Seed initial data if empty
const seedData = () => {
    if (getStorage(STORAGE_KEYS.SERVICOS).length === 0) {
        setStorage(STORAGE_KEYS.SERVICOS, [
            { id: '1', nome_servico: 'Ozônioterapia Sistêmica', descricao_servico: 'Tratamento completo que melhora oxigenação e imunidade.', ordem: 0, imagem_servico: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
            { id: '2', nome_servico: 'Ozônio Local', descricao_servico: 'Aplicação localizada para dores e inflamações.', ordem: 1, imagem_servico: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' },
            { id: '3', nome_servico: 'Auto-hemoterapia', descricao_servico: 'Potencializa o sistema imunológico.', ordem: 2, imagem_servico: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800' },
        ]);
    }
    if (getStorage(STORAGE_KEYS.PRODUTOS).length === 0) {
        setStorage(STORAGE_KEYS.PRODUTOS, [
            { id: '1', nome_produto: 'Óleo Ozonizado', descricao_produto: 'Para uso tópico em feridas e inflamações.', ordem: 0, imagem_produto: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=800' },
            { id: '2', nome_produto: 'Creme Facial', descricao_produto: 'Rejuvenescimento e hidratação profunda.', ordem: 1, imagem_produto: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=800' },
        ]);
    }
};

seedData();
