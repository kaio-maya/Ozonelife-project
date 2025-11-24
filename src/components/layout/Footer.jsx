import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Branding */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            Ozonelife
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            Ozônioterapia Integrativa para sua Saúde e Bem-estar.
                            Tratamentos naturais e cientificamente comprovados.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white">Navegação</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Início', path: '/' },
                                { name: 'Ozônioterapia', path: '/ozonoterapia' },
                                { name: 'Serviços', path: '/servicos' },
                                { name: 'Produtos', path: '/produtos' },
                                { name: 'Contato', path: '/contato' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white">Contato</h3>
                        <address className="not-italic text-gray-400 space-y-3">
                            <p>Lo 11, Arso 41, Quadra 32 Lote 32</p>
                            <p>Plano Diretor Sul, Palmas - TO</p>
                            <p>CEP: 77015-577</p>
                            <p className="pt-2">
                                <a href="tel:+5563992550112" className="hover:text-cyan-400 transition-colors">
                                    (63) 99255-0112
                                </a>
                            </p>
                            <p>
                                <a href="mailto:marciacostamaya@gmail.com" className="hover:text-cyan-400 transition-colors">
                                    marciacostamaya@gmail.com
                                </a>
                            </p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 Ozonelife. Todos os direitos reservados.
                    </p>
                    <Link
                        to="/dashboard"
                        className="text-gray-700 text-xs hover:text-gray-500 transition-colors"
                    >
                        Acesso Administrativo
                    </Link>
                </div>
            </div>
        </footer>
    );
}
