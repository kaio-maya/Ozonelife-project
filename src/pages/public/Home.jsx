import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Activity, Heart, CheckCircle } from 'lucide-react';
import { base44 } from '../../lib/base44';

export default function Home() {
    const { data: services, isLoading: loadingServices } = useQuery({
        queryKey: ['featured-services'],
        queryFn: () => base44.entities.Servico.list('ordem', 3),
    });

    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => base44.entities.Produto.list('ordem', 3),
    });

    const differentials = [
        { icon: <Heart className="w-8 h-8 text-cyan-500" />, title: "Natural", desc: "Tratamento 100% natural sem efeitos colaterais nocivos." },
        { icon: <Activity className="w-8 h-8 text-emerald-500" />, title: "Integral", desc: "Abordagem que trata o corpo como um todo, não apenas sintomas." },
        { icon: <CheckCircle className="w-8 h-8 text-cyan-500" />, title: "Comprovado", desc: "Eficácia validada por diversos estudos científicos internacionais." },
        { icon: <Shield className="w-8 h-8 text-emerald-500" />, title: "Seguro", desc: "Protocolos rigorosos e equipamentos de última geração." },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
                    >
                        Sua Saúde em Equilíbrio
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
                    >
                        Descubra o poder da Ozônioterapia Integrativa para revitalizar seu corpo e fortalecer sua imunidade.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/contato"
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
                        >
                            Agendar Consulta
                        </Link>
                        <Link
                            to="/servicos"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            Conheça Nossos Serviços
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Differentials */}
            <section className="container mx-auto px-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {differentials.map((diff, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl w-fit">{diff.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{diff.title}</h3>
                            <p className="text-gray-600">{diff.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Featured Services */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Serviços em Destaque</h2>
                        <p className="text-gray-600">Tratamentos personalizados para sua necessidade</p>
                    </div>
                    <Link to="/servicos" className="hidden md:flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700">
                        Ver todos <ArrowRight size={20} />
                    </Link>
                </div>

                {loadingServices ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services?.map((service) => (
                            <Link key={service.id} to="/servicos" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={service.imagem_servico || 'https://via.placeholder.com/400x300'}
                                            alt={service.nome_servico}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-cyan-600 transition-colors">
                                            {service.nome_servico}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3">
                                            {service.descricao_servico}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <Link to="/servicos" className="md:hidden mt-8 flex items-center justify-center gap-2 text-cyan-600 font-medium">
                    Ver todos os serviços <ArrowRight size={20} />
                </Link>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Produtos Selecionados</h2>
                        <p className="text-gray-600">Qualidade garantida para seu bem-estar</p>
                    </div>
                    <Link to="/produtos" className="hidden md:flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
                        Ver todos <ArrowRight size={20} />
                    </Link>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products?.map((product) => (
                            <Link key={product.id} to="/produtos" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={product.imagem_produto || 'https://via.placeholder.com/400x300'}
                                            alt={product.nome_produto}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
                                            {product.nome_produto}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3">
                                            {product.descricao_produto}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <Link to="/produtos" className="md:hidden mt-8 flex items-center justify-center gap-2 text-emerald-600 font-medium">
                    Ver todos os produtos <ArrowRight size={20} />
                </Link>
            </section>
        </div>
    );
}
