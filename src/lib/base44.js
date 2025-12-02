import { supabase } from './supabase';

// Helper to map Supabase errors to simple messages
const handleError = (error) => {
    console.error('Supabase Error:', error);
    throw new Error(error.message || 'Ocorreu um erro na operação.');
};

// Generic Entity CRUD using Supabase
const createEntity = (tableName) => ({
    list: async (orderBy, limit) => {
        let query = supabase.from(tableName).select('*');

        if (orderBy) {
            const desc = orderBy.startsWith('-');
            const field = desc ? orderBy.slice(1) : orderBy;
            query = query.order(field, { ascending: !desc });
        }

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) handleError(error);
        return data;
    },

    create: async (data) => {
        const { data: newItem, error } = await supabase
            .from(tableName)
            .insert([data])
            .select()
            .single();

        if (error) handleError(error);
        return newItem;
    },

    update: async (id, data) => {
        const { data: updatedItem, error } = await supabase
            .from(tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) handleError(error);
        return updatedItem;
    },

    delete: async (id) => {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) handleError(error);
        return true;
    },

    filter: async (filters, orderBy, limit) => {
        let query = supabase.from(tableName).select('*');

        // Simple equality filters
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });

        if (orderBy) {
            const desc = orderBy.startsWith('-');
            const field = desc ? orderBy.slice(1) : orderBy;
            query = query.order(field, { ascending: !desc });
        }

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) handleError(error);
        return data;
    }
});

export const base44 = {
    entities: {
        Servico: createEntity('servicos'),
        Produto: createEntity('produtos'),
        Agendamento: createEntity('agendamentos'),
        Venda: createEntity('vendas'),
        Paciente: createEntity('pacientes'),
    },
    auth: {
        login: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data.user;
        },
        logout: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) handleError(error);
            window.location.href = '/login';
        },
        me: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        },
        isAuthenticated: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            return !!session;
        },
        redirectToLogin: () => {
            window.location.href = '/login';
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (uploadError) handleError(uploadError);

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                return { file_url: publicUrl };
            }
        }
    }
};
