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
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={service.imagem_servico || 'https://via.placeholder.com/400x300'}
                                        alt={service.nome_servico}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">
                                        {service.nome_servico}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {service.descricao_servico}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
