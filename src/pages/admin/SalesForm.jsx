import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../../lib/base44';
import { DollarSign, Save, User, Calendar, Phone, CreditCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SalesForm() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        nome_comprador: '',
        data_compra: new Date().toISOString().split('T')[0],
        celular: '',
        cpf: '',
        produto_id: '',
        quantidade: 1,
        tipo_pagamento: 'pix',
        valor_total: 0
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => base44.entities.Produto.list('nome_produto'),
    });

    // Auto-calculate total price when product or quantity changes
    useEffect(() => {
        if (formData.produto_id && products) {
            const product = products.find(p => p.id === formData.produto_id);
            if (product) {
                const price = product.preco || 0;
                const discount = product.desconto || 0;
                const finalPrice = price * (1 - discount / 100);
                setFormData(prev => ({
                    ...prev,
                    valor_total: finalPrice * prev.quantidade
                }));
            }
        }
    }, [formData.produto_id, formData.quantidade, products]);

    const createSaleMutation = useMutation({
        mutationFn: async (data) => {
            const product = products.find(p => p.id === data.produto_id);
            return base44.entities.Venda.create({
                ...data,
                nome_produto: product?.nome_produto || 'Produto Desconhecido'
            });
        },
        onSuccess: () => {
            alert('Venda registrada com sucesso!');
            setFormData({
                nome_comprador: '',
                data_compra: new Date().toISOString().split('T')[0],
                celular: '',
                cpf: '',
                produto_id: '',
                quantidade: 1,
                tipo_pagamento: 'pix',
                valor_total: 0
            });
            queryClient.invalidateQueries(['sales']);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createSaleMutation.mutate(formData);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <DollarSign className="text-emerald-600" size={32} />
                Registrar Venda
            </h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Comprador */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <User size={16} /> Nome do Comprador
                            </label>
                            <input
                                type="text"
                                value={formData.nome_comprador}
                                onChange={e => setFormData({ ...formData, nome_comprador: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                required
                            />
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Calendar size={16} /> Data da Compra
                            </label>
                            <input
                                type="date"
                                value={formData.data_compra}
                                onChange={e => setFormData({ ...formData, data_compra: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                required
                            />
                        </div>

                        {/* Celular */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} /> Celular
                            </label>
                            <input
                                type="tel"
                                value={formData.celular}
                                onChange={e => setFormData({ ...formData, celular: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                required
                            />
                        </div>

                        {/* CPF */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF (Opcional)</label>
                            <input
                                type="text"
                                value={formData.cpf}
                                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Produto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Package size={16} /> Produto
                                </label>
                                <select
                                    value={formData.produto_id}
                                    onChange={e => setFormData({ ...formData, produto_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                >
                                    <option value="">Selecione um produto...</option>
                                    {products?.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome_produto} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.preco)}
                                            {p.desconto > 0 ? ` (-${p.desconto}%)` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantidade */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantidade}
                                    onChange={e => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            {/* Pagamento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <CreditCard size={16} /> Pagamento
                                </label>
                                <select
                                    value={formData.tipo_pagamento}
                                    onChange={e => setFormData({ ...formData, tipo_pagamento: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                >
                                    <option value="pix">PIX</option>
                                    <option value="credito">Cartão de Crédito</option>
                                    <option value="debito">Cartão de Débito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Total Display */}
                    <div className="bg-emerald-50 p-6 rounded-xl flex justify-between items-center">
                        <span className="text-emerald-900 font-medium">Valor Total:</span>
                        <span className="text-3xl font-bold text-emerald-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.valor_total)}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={createSaleMutation.isPending}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        {createSaleMutation.isPending ? 'Registrando...' : (
                            <>
                                <Save size={20} /> Registrar Venda
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
