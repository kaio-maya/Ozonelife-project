import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '../../lib/base44';

export default function Services() {
    const { data: services, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => base44.entities.Servico.list('ordem'),
    });

    return (
        <div className="pb-20">
            <div className="bg-cyan-50 py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nossos Serviços</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Conheça todos os tratamentos disponíveis para sua saúde e bem-estar.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : services?.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Nenhum serviço cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services?.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={service.imagem_servico || 'https://via.placeholder.com/400x300'}
                                        alt={service.nome_servico}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {service.preco > 0 && service.desconto > 0 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                            {service.desconto}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">
                                        {service.nome_servico}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {service.descricao_servico}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {service.preco > 0 && (
                                            <>
                                                {service.desconto > 0 ? (
                                                    <>
                                                        <span className="text-gray-400 line-through text-sm">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.preco)}
                                                        </span>
                                                        <span className="text-cyan-600 font-bold text-xl">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.preco * (1 - service.desconto / 100))}
                                                        </span>
                                                        <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-1 rounded-full">
                                                            -{service.desconto}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-cyan-600 font-bold text-xl">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.preco)}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
