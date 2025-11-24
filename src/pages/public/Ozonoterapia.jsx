import { motion } from 'framer-motion';
import { Zap, Shield, Check, RefreshCw, Activity, Heart } from 'lucide-react';

export default function Ozonoterapia() {
    const benefits = [
        { icon: <Activity />, title: "Oxigenação Celular", desc: "Melhora significativamente a oxigenação dos tecidos e órgãos." },
        { icon: <Shield />, title: "Imunidade", desc: "Modula e fortalece o sistema imunológico contra infecções." },
        { icon: <Zap />, title: "Anti-inflamatório", desc: "Potente ação contra processos inflamatórios crônicos e agudos." },
        { icon: <RefreshCw />, title: "Regeneração", desc: "Estimula a regeneração tecidual e cicatrização de feridas." },
        { icon: <Heart />, title: "Circulação", desc: "Melhora a circulação sanguínea e saúde cardiovascular." },
        { icon: <Check />, title: "Antioxidante", desc: "Combate radicais livres e estresse oxidativo no organismo." },
    ];

    const indications = [
        "Doenças autoimunes",
        "Processos inflamatórios crônicos",
        "Recuperação pós-cirúrgica",
        "Fadiga crônica e fibromialgia",
        "Problemas circulatórios",
        "Estética e rejuvenescimento",
    ];

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-cyan-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        O Que é Ozônioterapia?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Uma terapia integrativa revolucionária que utiliza uma mistura de oxigênio e ozônio medicinal para tratar diversas patologias e promover saúde.
                    </motion.p>
                </div>
            </div>

            {/* How it works */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Como Funciona</h2>
                        <div className="space-y-4 text-gray-600 text-lg">
                            <p>
                                O ozônio medicinal (O3) é uma forma ativa do oxigênio. Quando aplicado no organismo, ele desencadeia uma cascata de reações bioquímicas benéficas.
                            </p>
                            <p>
                                Ele atua melhorando a oxigenação dos tecidos, aumentando a resposta do sistema imunológico e combatendo infecções por vírus, bactérias e fungos.
                            </p>
                            <p>
                                Além disso, é um poderoso anti-inflamatório natural, ajudando no alívio de dores crônicas e na recuperação acelerada de lesões.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-3xl p-8 h-80 flex items-center justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
                            alt="Ozonioterapia Ilustração"
                            className="rounded-2xl shadow-lg w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Principais Benefícios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600 mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Indications */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-3xl p-8 md:p-12 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Indicações Clínicas</h2>
                            <p className="text-cyan-50 text-lg mb-8">
                                A ozônioterapia é indicada como tratamento complementar para diversas condições de saúde, sempre realizada por profissionais qualificados.
                            </p>
                            <ul className="space-y-4">
                                {indications.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="bg-white/20 p-1 rounded-full">
                                            <Check size={16} />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold mb-4">Segurança em Primeiro Lugar</h3>
                            <p className="mb-4 text-cyan-50">
                                Nossa clínica segue rigorosamente os protocolos internacionais de segurança (Madrid Declaration).
                            </p>
                            <ul className="space-y-2 text-sm text-cyan-50">
                                <li>• Equipamentos certificados pela ANVISA</li>
                                <li>• Materiais descartáveis e estéreis</li>
                                <li>• Profissionais habilitados e experientes</li>
                                <li>• Dosagens precisas e personalizadas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
