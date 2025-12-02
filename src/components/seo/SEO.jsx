import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical }) {
    const siteTitle = 'Ozonelife - Clínica de Ozonoterapia';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Clínica especializada em Ozonoterapia e terapias integrativas para sua saúde e bem-estar.'} />
            {canonical && <link rel="canonical" href={canonical} />}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || 'Clínica especializada em Ozonoterapia e terapias integrativas para sua saúde e bem-estar.'} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || 'Clínica especializada em Ozonoterapia e terapias integrativas para sua saúde e bem-estar.'} />
        </Helmet>
    );
}
