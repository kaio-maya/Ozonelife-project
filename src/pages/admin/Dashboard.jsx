import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '../../lib/base44';
import { Briefcase, Package, Calendar, ArrowRight, Clock, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => base44.entities.Servico.list() });
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => base44.entities.Produto.list() });
    const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => base44.entities.Agendamento.list('-data_hora') });
    const { data: sales } = useQuery({ queryKey: ['sales'], queryFn: () => base44.entities.Venda.list('data_compra') });

    // Calculate Sales KPIs
    const totalRevenue = sales?.reduce((acc, sale) => acc + Number(sale.valor_total), 0) || 0;
    const totalSales = sales?.length || 0;

    // Prepare Chart Data
    const salesByDate = sales?.reduce((acc, sale) => {
        const date = sale.data_compra;
        acc[date] = (acc[date] || 0) + Number(sale.valor_total);
        return acc;
    }, {});

    const chartData = Object.entries(salesByDate || {})
        .map(([date, total]) => ({
            date,
            formattedDate: format(new Date(date), 'dd/MM'),
            total
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const stats = [
        {
            title: 'Faturamento Total',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue),
            icon: <DollarSign className="text-white" size={24} />,
            gradient: "from-emerald-400 to-green-500"
        },
        {
            title: 'Vendas Realizadas',
            value: totalSales,
            icon: <TrendingUp className="text-white" size={24} />,
            gradient: "from-blue-400 to-indigo-500"
        },
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
            gradient: "from-purple-400 to-pink-500"
        },
        {
            title: "Agendamentos",
            value: appointments?.length || 0,
            icon: <Calendar className="text-white" size={24} />,
            gradient: "from-orange-400 to-red-500"
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium mb-1">{stat.title}</p>
                            <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Historical Sales Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico de Vendas</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="formattedDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => `R$ ${value}`}
                                />
                                <Tooltip
                                    formatter={(value) => [`R$ ${value}`, 'Total']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        {chartData.length === 0 && (
                            <p className="text-center text-gray-400 text-sm mt-4">Nenhum dado de venda disponível.</p>
                        )}
                    </div>
                </div>

                {/* Recent Sales List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas Vendas</h2>
                    <div className="space-y-4">
                        {sales?.slice(0, 5).map((sale) => (
                            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-900">{sale.nome_comprador}</p>
                                    <p className="text-sm text-gray-500">{sale.nome_produto} (x{sale.quantidade})</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valor_total)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {format(new Date(sale.data_compra), "dd 'de' MMMM", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!sales || sales.length === 0) && (
                            <p className="text-gray-500 text-center py-4">Nenhuma venda registrada ainda.</p>
                        )}
                    </div>
                </div>
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
