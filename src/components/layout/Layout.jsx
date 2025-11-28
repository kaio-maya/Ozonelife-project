import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <WhatsAppButton />
            <Footer />
        </div>
    );
}
