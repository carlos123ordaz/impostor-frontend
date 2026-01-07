// src/components/SEO.jsx
import { useEffect } from 'react';

export const SEO = ({
    title = "Impostor Game",
    description = "Juega Impostor, un emocionante juego de deducción multijugador",
    image = "/og-image.png",
    url = "https://tudominio.com",
    type = "website"
}) => {
    useEffect(() => {
        // Actualizar título
        document.title = `${title} | Impostor Game`;

        // Actualizar meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Actualizar Open Graph
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', description);
        updateMetaTag('og:image', image);
        updateMetaTag('og:url', url);
        updateMetaTag('og:type', type);

        // Actualizar Twitter Card
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', image);
    }, [title, description, image, url, type]);

    return null;
};

function updateMetaTag(property, content) {
    let tag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        const isProperty = property.startsWith('og:') || property.startsWith('twitter:');
        if (isProperty) {
            tag.setAttribute('property', property);
        } else {
            tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

export default SEO;