import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../../lib/base44';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageServices() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const queryClient = useQueryClient();

    const { data: services, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => base44.entities.Servico.filter({ ativo: true }, 'ordem'),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Servico.create({ ...data, ativo: true }),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            setIsModalOpen(false);
            toast.success('Serviço criado com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao criar serviço: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Servico.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            setIsModalOpen(false);
            setEditingItem(null);
            toast.success('Serviço atualizado com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar serviço: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Servico.update(id, { ativo: false }),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            toast.success('Serviço excluído com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao excluir serviço: ${error.message}`);
        },
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Serviço
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services?.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={service.imagem_servico || 'https://via.placeholder.com/400x300'}
                                    alt={service.nome_servico}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 bg-white rounded-full text-gray-900 hover:text-cyan-600 transition-colors"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 bg-white rounded-full text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 text-gray-900">{service.nome_servico}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3">{service.descricao_servico}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <ServiceModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    initialData={editingItem}
                    onSubmit={(data) => {
                        if (editingItem) {
                            updateMutation.mutate({ id: editingItem.id, data });
                        } else {
                            createMutation.mutate(data);
                        }
                    }}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </div>
    );
}

function ServiceModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        nome_servico: initialData?.nome_servico || '',
        descricao_servico: initialData?.descricao_servico || '',
        imagem_servico: initialData?.imagem_servico || '',
        preco: initialData?.preco || 0,
        desconto: initialData?.desconto || 0,
        ordem: initialData?.ordem || 0,
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                setFormData({ ...formData, imagem_servico: file_url });
            } catch (error) {
                toast.error('Erro ao fazer upload da imagem');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Serviço' : 'Novo Serviço'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(formData);
                    }}
                    className="p-6 space-y-4 overflow-y-auto"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
                        <input
                            type="text"
                            value={formData.nome_servico}
                            onChange={(e) => setFormData({ ...formData, nome_servico: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            value={formData.descricao_servico}
                            onChange={(e) => setFormData({ ...formData, descricao_servico: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {formData.imagem_servico ? (
                                <div className="relative h-40 w-full">
                                    <img
                                        src={formData.imagem_servico}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                        Trocar Imagem
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
                                    <span>📷</span>
                                    <span>Clique para fazer upload</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.preco}
                                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.desconto}
                                onChange={(e) => setFormData({ ...formData, desconto: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
                        <input
                            type="number"
                            value={formData.ordem}
                            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
