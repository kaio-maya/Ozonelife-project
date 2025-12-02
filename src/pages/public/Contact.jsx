import { Mail, MessageCircle, Instagram, MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';

export default function Contact() {
    const contactMethods = [
        {
            icon: <Mail className="w-8 h-8" />,
            title: "Email",
            value: "marciacostamaya@gmail.com",
            action: "mailto:marciacostamaya@gmail.com",
            btnText: "Enviar Email",
            color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: "WhatsApp",
            value: "(63) 99255-0112",
            action: "https://wa.me/5563992550112",
            btnText: "Fale Conosco",
            color: "bg-green-50 text-green-600 hover:bg-green-100"
        },
        {
            icon: <Instagram className="w-8 h-8" />,
            title: "Instagram",
            value: "@ozone_life_integrativa",
            action: "https://instagram.com/ozone_life_integrativa",
            btnText: "Seguir Perfil",
            color: "bg-pink-50 text-pink-600 hover:bg-pink-100"
        }
    ];

    return (
        <div className="pb-20">
            <SEO
                title="Contato"
                description="Entre em contato com a Ozonelife. Agende sua consulta ou tire suas dúvidas sobre ozonoterapia e tratamentos integrativos."
                canonical="https://ozonelife.com.br/contato"
            />
            <div className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Entre em Contato
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Estamos prontos para atender você. Escolha a melhor forma de falar conosco ou venha nos visitar.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {contactMethods.map((method, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg text-center"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${method.color.split(' ')[0]} ${method.color.split(' ')[1]}`}>
                                {method.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                            <p className="text-gray-600 mb-6">{method.value}</p>
                            <a
                                href={method.action}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${method.color}`}
                            >
                                {method.btnText}
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Location Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <MapPin className="text-cyan-500" />
                            Localização
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
                                <p className="text-gray-600">Lo 11, Arso 41, Quadra 32 Lote 32</p>
                                <p className="text-gray-600">Plano Diretor Sul</p>
                                <p className="text-gray-600">Palmas - TO, CEP: 77015-577</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Contatos</h3>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Phone size={18} />
                                    <span>(63) 99255-0112</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail size={18} />
                                    <span>marciacostamaya@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <Clock className="text-emerald-500" />
                            Horário de Atendimento
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-900">Segunda a Sexta</span>
                                <div className="text-right text-gray-600">
                                    <p>08:00 - 11:00</p>
                                    <p>14:00 - 20:00</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-900">Sábado</span>
                                <div className="text-right text-gray-600">
                                    <p>08:30 - 11:00</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="font-medium">Domingo</span>
                                <span>Fechado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
