import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/gerenciar') ||
        location.pathname.startsWith('/agendamentos');

    const links = isAdmin
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Serviços', path: '/gerenciarservicos' },
            { name: 'Produtos', path: '/gerenciarprodutos' },
            { name: 'Agendamentos', path: '/agendamentos' },
        ]
        : [
            { name: 'Início', path: '/' },
            { name: 'Ozônioterapia', path: '/ozonoterapia' },
            { name: 'Serviços', path: '/servicos' },
            { name: 'Produtos', path: '/produtos' },
            { name: 'Contato', path: '/contato' },
        ];

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                    Ozonelife
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-cyan-500 ${location.pathname === link.path ? 'text-cyan-600' : 'text-gray-600'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAdmin && (
                        <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm">
                            <LogOut size={18} />
                            Sair
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-4">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-base font-medium p-2 rounded-lg transition-colors ${location.pathname === link.path
                                        ? 'bg-cyan-50 text-cyan-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAdmin && (
                                <button className="flex items-center gap-2 text-red-500 p-2 font-medium">
                                    <LogOut size={20} />
                                    Sair
                                </button>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
