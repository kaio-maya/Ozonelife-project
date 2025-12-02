
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, X, Check, Clock, AlertCircle, UserPlus, User } from 'lucide-react';
import { base44 } from '../../lib/base44';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Appointments() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const queryClient = useQueryClient();

    // Fetch appointments
    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => base44.entities.Agendamento.list('data_hora'),
    });

    // Fetch services for dropdown
    const { data: services } = useQuery({
        queryKey: ['services-list'],
        queryFn: () => base44.entities.Servico.list('nome_servico'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Agendamento.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            toast.success('Agendamento excluído com sucesso!');
        },
        onError: () => toast.error('Erro ao excluir agendamento.')
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => base44.entities.Agendamento.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            toast.success('Status atualizado!');
        },
        onError: () => toast.error('Erro ao atualizar status.')
    });

    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    // Auto-update status for past appointments
    useEffect(() => {
        if (appointments) {
            const now = new Date();
            appointments.forEach(app => {
                const appDate = new Date(app.data_hora);
                // If appointment is in the past (more than 2 hours ago) and still 'pendente', mark as 'nao_concluido'
                // This is a simple client-side check. Ideally, a backend cron job would handle this.
                if (app.status === 'pendente' && (now - appDate) > 2 * 60 * 60 * 1000) {
                    // We won't auto-update here to avoid spamming API on every load, 
                    // but in a real app this would be server-side.
                    // For now, let's just visually indicate or leave it to manual update.
                }
            });
        }
    }, [appointments]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'concluido': return 'bg-green-100 text-green-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            case 'faltante': return 'bg-orange-100 text-orange-800';
            case 'nao_concluido': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'concluido': return 'Concluído';
            case 'cancelado': return 'Cancelado';
            case 'faltante': return 'Faltante';
            case 'nao_concluido': return 'Não Concluído';
            default: return 'Pendente';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Agendamentos</h1>
                <button
                    onClick={() => { setSelectedAppointment(null); setIsModalOpen(true); }}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Agendamento
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Paciente</th>
                                    <th className="p-4 font-semibold text-gray-600">Serviço</th>
                                    <th className="p-4 font-semibold text-gray-600">Data e Hora</th>
                                    <th className="p-4 font-semibold text-gray-600">Contato</th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                    <th className="p-4 font-semibold text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments?.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{appointment.nome_paciente}</td>
                                        <td className="p-4 text-gray-600">{appointment.servico}</td>
                                        <td className="p-4 text-gray-600">
                                            {format(new Date(appointment.data_hora), 'dd/MM/yyyy HH:mm')}
                                        </td>
                                        <td className="p-4 text-gray-600">{appointment.contato}</td>
                                        <td className="p-4">
                                            <div className="relative group">
                                                <span className={`px - 3 py - 1 rounded - full text - sm font - medium cursor - pointer ${getStatusColor(appointment.status)} `}>
                                                    {getStatusLabel(appointment.status)}
                                                </span>
                                                {/* Status Dropdown */}
                                                <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block z-10">
                                                    {['pendente', 'concluido', 'faltante', 'nao_concluido', 'cancelado'].map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleStatusChange(appointment.id, s)}
                                                            className={`w - full text - left px - 4 py - 2 text - sm hover: bg - gray - 50 ${s === appointment.status ? 'font-bold text-cyan-600' : 'text-gray-700'} `}
                                                        >
                                                            {getStatusLabel(s)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(appointment)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <AppointmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={selectedAppointment}
                    services={services || []}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        queryClient.invalidateQueries(['appointments']);
                    }}
                />
            )}
        </div>
    );
}

function AppointmentModal({ isOpen, onClose, initialData, services, onSuccess }) {
    const [formData, setFormData] = useState({
        nome_paciente: initialData?.nome_paciente || '',
        paciente_id: initialData?.paciente_id || null,
        servico: initialData?.servico || '',
        data: initialData?.data_hora ? initialData.data_hora.split('T')[0] : '',
        hora: initialData?.data_hora ? new Date(initialData.data_hora).toTimeString().slice(0, 5) : '',
        contato: initialData?.contato || '',
        observacoes: initialData?.observacoes || '',
        status: initialData?.status || 'pendente'
    });

    // Patient Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isCreatingPatient, setIsCreatingPatient] = useState(false);
    const [newPatientData, setNewPatientData] = useState({
        cpf: '',
        email: '',
        endereco: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Patients Query
    const { data: patients } = useQuery({
        queryKey: ['patients', searchTerm],
        queryFn: async () => {
            if (!searchTerm || searchTerm.length < 2) return [];
            // Assuming base44.entities.Paciente.filter or list supports simple filtering
            // For now, fetching all and filtering client side if API doesn't support search
            // In a real app, use ILIKE or similar
            const all = await base44.entities.Paciente.list('nome');
            return all.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        },
        enabled: searchTerm.length >= 2 && !isCreatingPatient
    });

    const handlePatientSelect = (patient) => {
        setFormData(prev => ({
            ...prev,
            nome_paciente: patient.nome,
            paciente_id: patient.id,
            contato: patient.celular || prev.contato
        }));
        setSearchTerm(patient.nome);
        setShowResults(false);
    };

    const handleCreatePatientToggle = () => {
        setIsCreatingPatient(!isCreatingPatient);
        setShowResults(false);
        if (!isCreatingPatient) {
            // Reset patient ID if creating new
            setFormData(prev => ({ ...prev, paciente_id: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalPacienteId = formData.paciente_id;

            // 1. Create Patient if needed
            if (isCreatingPatient) {
                const newPatient = await base44.entities.Paciente.create({
                    nome: formData.nome_paciente,
                    celular: formData.contato,
                    cpf: newPatientData.cpf,
                    email: newPatientData.email,
                    endereco: newPatientData.endereco
                });
                finalPacienteId = newPatient.id;
            }

            // 2. Create/Update Appointment
            const appointmentData = {
                nome_paciente: formData.nome_paciente,
                paciente_id: finalPacienteId,
                servico: formData.servico,
                data_hora: `${formData.data}T${formData.hora}:00`,
                contato: formData.contato,
                observacoes: formData.observacoes,
                status: formData.status
            };

            if (initialData?.id) {
                await base44.entities.Agendamento.update(initialData.id, appointmentData);
                toast.success('Agendamento atualizado!');
            } else {
                await base44.entities.Agendamento.create(appointmentData);
                toast.success('Agendamento criado!');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar agendamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Patient Search/Create Section */}
                    <div className="space-y-2 relative">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Paciente</label>
                            <button
                                type="button"
                                onClick={handleCreatePatientToggle}
                                className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                            >
                                {isCreatingPatient ? 'Buscar Existente' : '+ Novo Paciente'}
                            </button>
                        </div>

                        {!isCreatingPatient ? (
                            <div className="relative">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.nome_paciente}
                                        onChange={(e) => {
                                            setFormData({ ...formData, nome_paciente: e.target.value });
                                            setSearchTerm(e.target.value);
                                            setShowResults(true);
                                        }}
                                        onFocus={() => setShowResults(true)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                        placeholder="Buscar por nome..."
                                    />
                                </div>
                                {/* Search Results Dropdown */}
                                {showResults && searchTerm.length >= 2 && patients?.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                        {patients.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => handlePatientSelect(p)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col"
                                            >
                                                <span className="font-medium text-gray-800">{p.nome}</span>
                                                <span className="text-xs text-gray-500">{p.cpf} • {p.celular}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nome_paciente}
                                        onChange={(e) => setFormData({ ...formData, nome_paciente: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">CPF</label>
                                        <input
                                            type="text"
                                            value={newPatientData.cpf}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, cpf: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={newPatientData.email}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                        <select
                            required
                            value={formData.servico}
                            onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        >
                            <option value="">Selecione um serviço</option>
                            {services.map(s => (
                                <option key={s.id} value={s.nome_servico}>{s.nome_servico}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                required
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <input
                                type="time"
                                required
                                value={formData.hora}
                                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contato (WhatsApp)</label>
                        <input
                            type="tel"
                            required
                            value={formData.contato}
                            onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            rows="3"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                initialData ? 'Salvar Alterações' : 'Agendar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

