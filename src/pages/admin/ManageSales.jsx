import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { base44 } from '../../lib/base44';
import { DollarSign, User, Calendar, Phone, CreditCard, Package, Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Schema de validação com Zod
const salesSchema = z.object({
    nome_comprador: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    data_compra: z.string(),
    celular: z.string().min(10, 'Celular inválido'),
    cpf: z.string().optional(),
    produto_id: z.string().min(1, 'Selecione um produto'),
    quantidade: z.number().min(1, 'Quantidade mínima é 1'),
    tipo_pagamento: z.enum(['pix', 'credito', 'debito']),
    valor_total: z.number(),
});

export default function ManageSales() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const queryClient = useQueryClient();

    const { data: sales, isLoading } = useQuery({
        queryKey: ['sales'],
        queryFn: () => base44.entities.Venda.list('-data_compra'),
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => base44.entities.Produto.filter({ ativo: true }, 'nome_produto'),
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            const product = products.find(p => p.id === data.produto_id);
            return base44.entities.Venda.create({
                ...data,
                nome_produto: product?.nome_produto || 'Produto Desconhecido'
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
            queryClient.invalidateQueries(['dashboard_stats']);
            setIsModalOpen(false);
            toast.success('Venda registrada com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao registrar venda: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const product = products.find(p => p.id === data.produto_id);
            return base44.entities.Venda.update(id, {
                ...data,
                nome_produto: product?.nome_produto || data.nome_produto
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
            setIsModalOpen(false);
            toast.success('Venda atualizada com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar venda: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Venda.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
            toast.success('Venda excluída com sucesso!');
        },
        onError: (error) => {
            toast.error(`Erro ao excluir venda: ${error.message}`);
        },
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta venda? Isso não pode ser desfeito.')) {
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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <DollarSign className="text-emerald-600" size={32} />
                    Gerenciar Vendas
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={20} />
                    Nova Venda
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Comprador</th>
                                    <th className="p-4 font-semibold text-gray-600">Produto</th>
                                    <th className="p-4 font-semibold text-gray-600">Data</th>
                                    <th className="p-4 font-semibold text-gray-600">Valor</th>
                                    <th className="p-4 font-semibold text-gray-600">Pagamento</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sales?.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{sale.nome_comprador}</div>
                                            <div className="text-sm text-gray-500">{sale.celular}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-900">{sale.nome_produto}</div>
                                            <div className="text-sm text-gray-500">Qtd: {sale.quantidade}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {format(new Date(sale.data_compra), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="p-4 font-medium text-emerald-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valor_total)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${sale.tipo_pagamento === 'pix' ? 'bg-green-100 text-green-700' :
                                                sale.tipo_pagamento === 'credito' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {sale.tipo_pagamento}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(sale)}
                                                    className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sale.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sales?.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            Nenhuma venda registrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <SalesModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        initialData={editingItem}
                        products={products}
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
            </AnimatePresence>
        </div>
    );
}

function SalesModal({ isOpen, onClose, initialData, products, onSubmit, isSubmitting }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(salesSchema),
        defaultValues: {
            nome_comprador: initialData?.nome_comprador || '',
            data_compra: initialData?.data_compra ? initialData.data_compra.split('T')[0] : new Date().toISOString().split('T')[0],
            celular: initialData?.celular || '',
            cpf: initialData?.cpf || '',
            produto_id: initialData?.produto_id || '',
            quantidade: initialData?.quantidade || 1,
            tipo_pagamento: initialData?.tipo_pagamento || 'pix',
            valor_total: initialData?.valor_total || 0
        }
    });

    const selectedProductId = watch('produto_id');
    const quantity = watch('quantidade');
    const totalValue = watch('valor_total');

    // Auto-calculate total price when product or quantity changes
    useEffect(() => {
        if (selectedProductId && products) {
            const product = products.find(p => p.id === selectedProductId);
            if (product) {
                const price = product.preco || 0;
                const discount = product.desconto || 0;
                const finalPrice = price * (1 - discount / 100);
                const newTotal = finalPrice * (quantity || 1);

                setValue('valor_total', newTotal);
            }
        }
    }, [selectedProductId, quantity, products, setValue]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Venda' : 'Nova Venda'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Comprador */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <User size={16} /> Nome do Comprador
                            </label>
                            <input
                                {...register('nome_comprador')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            {errors.nome_comprador && <span className="text-red-500 text-xs">{errors.nome_comprador.message}</span>}
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Calendar size={16} /> Data da Compra
                            </label>
                            <input
                                type="date"
                                {...register('data_compra')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            {errors.data_compra && <span className="text-red-500 text-xs">{errors.data_compra.message}</span>}
                        </div>

                        {/* Celular */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} /> Celular
                            </label>
                            <input
                                type="tel"
                                {...register('celular')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            {errors.celular && <span className="text-red-500 text-xs">{errors.celular.message}</span>}
                        </div>

                        {/* CPF */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF (Opcional)</label>
                            <input
                                {...register('cpf')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Produto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Package size={16} /> Produto
                                </label>
                                <select
                                    {...register('produto_id')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="">Selecione um produto...</option>
                                    {products?.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome_produto} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.preco)}
                                            {p.desconto > 0 ? ` (-${p.desconto}%)` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.produto_id && <span className="text-red-500 text-xs">{errors.produto_id.message}</span>}
                            </div>

                            {/* Quantidade */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    min="1"
                                    {...register('quantidade', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                                {errors.quantidade && <span className="text-red-500 text-xs">{errors.quantidade.message}</span>}
                            </div>

                            {/* Pagamento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <CreditCard size={16} /> Pagamento
                                </label>
                                <select
                                    {...register('tipo_pagamento')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="pix">PIX</option>
                                    <option value="credito">Cartão de Crédito</option>
                                    <option value="debito">Cartão de Débito</option>
                                </select>
                                {errors.tipo_pagamento && <span className="text-red-500 text-xs">{errors.tipo_pagamento.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Total Display */}
                    <div className="bg-emerald-50 p-6 rounded-xl flex justify-between items-center">
                        <span className="text-emerald-900 font-medium">Valor Total:</span>
                        <span className="text-3xl font-bold text-emerald-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue || 0)}
                        </span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
