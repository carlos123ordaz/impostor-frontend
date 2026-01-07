import { useEffect } from 'react';

/**
 * Componente SEOHead - Gestiona dinámicamente todos los meta tags
 * 
 * Uso:
 * <SEOHead 
 *   title="Crea tu sala - Impostor Game"
 *   description="Crea una sala privada y juega Impostor con tus amigos"
 *   keywords="crear sala, impostor game, juego multijugador"
 *   type="article"
 * />
 */
export const SEOHead = ({
    title = 'Impostor Game - Juego Multijugador Online Gratuito',
    description = 'Juega Impostor, un emocionante juego de deducción multijugador online. Descubre al impostor entre tus amigos. ¡Gratis y sin descargas!',
    keywords = 'impostor game, juego multijugador, juego de deducción, juego online gratis',
    image = '/og-image.png',
    url = typeof window !== 'undefined' ? window.location.href : 'https://tudominio.com',
    type = 'website',
    author = 'Impostor Game',
    locale = 'es_ES',
    twitterHandle = '@impostorgame'
}) => {
    useEffect(() => {
        // 1. TITLE
        document.title = `${title} | Impostor Game`;

        // 2. META TAGS BÁSICOS
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);
        updateMetaTag('author', author);
        updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

        // 3. OPEN GRAPH (Para compartir en redes)
        updateMetaTag('og:title', title, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:image', image, 'property');
        updateMetaTag('og:url', url, 'property');
        updateMetaTag('og:type', type, 'property');
        updateMetaTag('og:locale', locale, 'property');
        updateMetaTag('og:site_name', 'Impostor Game', 'property');

        // 4. TWITTER CARD
        updateMetaTag('twitter:card', 'summary_large_image', 'name');
        updateMetaTag('twitter:title', title, 'name');
        updateMetaTag('twitter:description', description, 'name');
        updateMetaTag('twitter:image', image, 'name');
        updateMetaTag('twitter:creator', twitterHandle, 'name');

        // 5. CANONICAL URL (evita contenido duplicado)
        updateCanonicalTag(url);

        // 6. STRUCTURED DATA
        updateStructuredData({
            title,
            description,
            image,
            url,
            type
        });

    }, [title, description, keywords, image, url, type, author, locale, twitterHandle]);

    return null;
};

/**
 * Actualiza o crea un meta tag
 */
function updateMetaTag(name, content, attribute = 'name') {
    const selector = attribute === 'property'
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;

    let tag = document.querySelector(selector);

    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
}

/**
 * Actualiza el canonical link
 */
function updateCanonicalTag(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', url);
}

/**
 * Actualiza JSON-LD structured data
 */
function updateStructuredData({ title, description, image, url, type }) {
    let script = document.querySelector('script[type="application/ld+json"][data-seo="true"]');

    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', 'true');
        document.head.appendChild(script);
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Impostor Game',
        'description': description,
        'url': url,
        'image': image,
        'applicationCategory': 'Game',
        'inLanguage': 'es',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '500',
            'bestRating': '5',
            'worstRating': '1'
        }
    };

    script.textContent = JSON.stringify(structuredData);
}

export default SEOHead;