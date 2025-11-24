import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../../lib/base44';
import { Plus, Pencil, Trash2, X, Calendar, Clock, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Appointments() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const queryClient = useQueryClient();

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => base44.entities.Agendamento.list('-data_hora'),
    });

    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: () => base44.entities.Servico.list(),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Agendamento.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Agendamento.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Agendamento.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
        },
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
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
                <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Agendamento
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments?.map((apt) => (
                        <motion.div
                            key={apt.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${apt.status === 'confirmado' ? 'bg-green-100 text-green-600' :
                                        apt.status === 'cancelado' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {apt.nome_paciente?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{apt.nome_paciente}</h3>
                                    <p className="text-gray-500">{apt.servico}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(apt.data_hora).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    {new Date(apt.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {apt.contato && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        {apt.contato}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                                        apt.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {apt.status || 'Pendente'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(apt)}
                                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(apt.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <AppointmentModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        initialData={editingItem}
                        services={services}
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

function AppointmentModal({ isOpen, onClose, initialData, services, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        nome_paciente: initialData?.nome_paciente || '',
        data_hora: initialData?.data_hora || '',
        servico: initialData?.servico || '',
        contato: initialData?.contato || '',
        observacoes: initialData?.observacoes || '',
        status: initialData?.status || 'pendente',
    });

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
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
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
                    className="p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                        <input
                            type="text"
                            value={formData.nome_paciente}
                            onChange={(e) => setFormData({ ...formData, nome_paciente: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                            <input
                                type="datetime-local"
                                value={formData.data_hora}
                                onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="pendente">Pendente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                        <select
                            value={formData.servico}
                            onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        >
                            <option value="">Selecione um serviço</option>
                            {services?.map(s => (
                                <option key={s.id} value={s.nome_servico}>{s.nome_servico}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                        <input
                            type="text"
                            value={formData.contato}
                            onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="(63) 99999-9999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
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
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
