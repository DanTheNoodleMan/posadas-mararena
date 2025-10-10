// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://posadasmararena.com'; 
  
  // Fecha de última modificación (actualizar manualmente cuando cambies contenido importante)
  const lastModified = new Date();

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    
    // Página comparativa de posadas
    {
      url: `${baseUrl}/posadas`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Vista al Mar
    {
      url: `${baseUrl}/posadas/vista-al-mar`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Inmarcesible
    {
      url: `${baseUrl}/posadas/inmarcesible`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Sistema de reservas
    {
      url: `${baseUrl}/reservas`,
      lastModified: lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Consultar reserva
    {
      url: `${baseUrl}/consultar-reserva`,
      lastModified: lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    },

    // Páginas adicionales (si existen)
    // {
    //   url: `${baseUrl}/contacto`,
    //   lastModified: lastModified,
    //   changeFrequency: 'yearly',
    //   priority: 0.5,
    // },
  ];
}
