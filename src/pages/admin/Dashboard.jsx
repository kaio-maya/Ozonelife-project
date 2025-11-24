import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '../../lib/base44';
import { Briefcase, Package, Calendar, ArrowRight, Clock } from 'lucide-react';

export default function Dashboard() {
    const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => base44.entities.Servico.list() });
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => base44.entities.Produto.list() });
    const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => base44.entities.Agendamento.list('-data_hora') });

    const stats = [
        {
            title: "Serviços",
            value: services?.length || 0,
            icon: <Briefcase className="text-white" size={24} />,
            gradient: "from-cyan-400 to-blue-500"
        },
        {
            title: "Produtos",
            value: products?.length || 0,
            icon: <Package className="text-white" size={24} />,
            gradient: "from-emerald-400 to-green-500"
        },
        {
            title: "Agendamentos",
            value: appointments?.length || 0,
            icon: <Calendar className="text-white" size={24} />,
            gradient: "from-purple-400 to-pink-500"
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium mb-1">{stat.title}</p>
                            <h2 className="text-4xl font-bold text-gray-900">{stat.value}</h2>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link to="/gerenciarservicos" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">Gerenciar Serviços</h3>
                    <p className="text-gray-500 text-sm mb-4">Adicionar, editar ou remover serviços do site.</p>
                    <span className="text-cyan-600 font-medium text-sm flex items-center gap-1">Acessar <ArrowRight size={16} /></span>
                </Link>
                <Link to="/gerenciarprodutos" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">Gerenciar Produtos</h3>
                    <p className="text-gray-500 text-sm mb-4">Adicionar, editar ou remover produtos do catálogo.</p>
                    <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">Acessar <ArrowRight size={16} /></span>
                </Link>
                <Link to="/agendamentos" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Ver Agendamentos</h3>
                    <p className="text-gray-500 text-sm mb-4">Gerenciar consultas e status dos agendamentos.</p>
                    <span className="text-purple-600 font-medium text-sm flex items-center gap-1">Acessar <ArrowRight size={16} /></span>
                </Link>
            </div>

            {/* Recent Appointments */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Próximos Agendamentos</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {appointments?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhum agendamento encontrado.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {appointments?.slice(0, 5).map((apt) => (
                            <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                        {apt.nome_paciente?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{apt.nome_paciente}</h4>
                                        <p className="text-sm text-gray-500">{apt.servico}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{new Date(apt.data_hora).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500 flex items-center justify-end gap-1">
                                            <Clock size={12} />
                                            {new Date(apt.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {apt.status || 'Pendente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
