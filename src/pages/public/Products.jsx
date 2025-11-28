import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '../../lib/base44';

export default function Products() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => base44.entities.Produto.list('ordem'),
    });

    return (
        <div className="pb-20">
            <div className="bg-emerald-50 py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nossos Produtos</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Produtos selecionados com a qualidade do ozônio para você.
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
                ) : products?.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Nenhum produto cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products?.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={product.imagem_produto || 'https://via.placeholder.com/400x300'}
                                        alt={product.nome_produto}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.preco > 0 && product.desconto > 0 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                            {product.desconto}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">
                                        {product.nome_produto}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {product.descricao_produto}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {product.preco > 0 && (
                                            <>
                                                {product.desconto > 0 ? (
                                                    <>
                                                        <span className="text-gray-400 line-through text-sm">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                                                        </span>
                                                        <span className="text-emerald-600 font-bold text-xl">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco * (1 - product.desconto / 100))}
                                                        </span>
                                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                                            -{product.desconto}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-emerald-600 font-bold text-xl">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
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
