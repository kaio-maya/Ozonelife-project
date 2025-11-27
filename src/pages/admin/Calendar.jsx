import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../../lib/base44';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, Clock, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: appointments } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => base44.entities.Agendamento.list(),
    });

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getAppointmentsForDay = (date) => {
        return appointments?.filter(apt =>
            isSameDay(new Date(apt.data_hora), date)
        ) || [];
    };

    const handleDayClick = (date) => {
        const dayAppointments = getAppointmentsForDay(date);
        if (dayAppointments.length > 0) {
            setSelectedDate(date);
            setIsModalOpen(true);
        }
    };

    const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Calendário de Agendamentos</h1>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-bold min-w-[160px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Week days header */}
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="py-4 text-center font-bold text-gray-500 text-sm uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {calendarDays.map((day, idx) => {
                        const dayAppointments = getAppointmentsForDay(day);
                        const hasAppointments = dayAppointments.length > 0;
                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDayClick(day)}
                                className={`
                  border-b border-r border-gray-100 p-2 transition-colors relative
                  ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white'}
                  ${hasAppointments ? 'cursor-pointer hover:bg-cyan-50' : ''}
                  ${isToday(day) ? 'bg-blue-50/30' : ''}
                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                    ${isToday(day) ? 'bg-cyan-600 text-white' : ''}
                  `}>
                                        {format(day, 'd')}
                                    </span>
                                    {hasAppointments && (
                                        <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                            {dayAppointments.length}
                                        </span>
                                    )}
                                </div>

                                {/* Appointment Dots */}
                                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                    {dayAppointments.slice(0, 4).map((apt, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${apt.status === 'confirmado' ? 'bg-green-500' :
                                                    apt.status === 'cancelado' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                }`}
                                            title={`${apt.nome_paciente} - ${apt.servico}`}
                                        />
                                    ))}
                                    {dayAppointments.length > 4 && (
                                        <span className="text-[10px] text-gray-400 leading-none">+</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Day Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-xl font-bold text-gray-900 capitalize">
                                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {selectedDayAppointments.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">Nenhum agendamento para este dia.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedDayAppointments.map((apt) => (
                                            <div
                                                key={apt.id}
                                                className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${apt.status === 'confirmado' ? 'bg-green-100 text-green-600' :
                                                                apt.status === 'cancelado' ? 'bg-red-100 text-red-600' :
                                                                    'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {apt.nome_paciente?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{apt.nome_paciente}</h3>
                                                            <p className="text-sm text-gray-500">{apt.servico}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                                                            apt.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {apt.status || 'Pendente'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-cyan-500" />
                                                        {format(new Date(apt.data_hora), 'HH:mm')}
                                                    </div>
                                                    {apt.contato && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={14} className="text-emerald-500" />
                                                            {apt.contato}
                                                        </div>
                                                    )}
                                                </div>

                                                {apt.observacoes && (
                                                    <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                                                        "{apt.observacoes}"
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
