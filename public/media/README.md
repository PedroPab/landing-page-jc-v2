# Contenido Visual — JC Resortes

Carpeta de assets multimedia de la landing. Los archivos que se coloquen aquí
reemplazarán automáticamente los placeholders visibles durante desarrollo.

## Estructura

```
public/media/
├── hero/
│   └── taller-principal.jpg        ← Foto principal del taller (16:9, ≥1400px)
│
├── about/
│   ├── equipo-familia.jpg          ← Foto del equipo / familia (3:4 o 4:3)
│   └── equipo-trabajo.jpg          ← Personas trabajando en el taller
│
├── history/
│   └── taller-espacio.jpg          ← Espacio de trabajo / foto documental
│
├── services/
│   ├── resortes-medida.jpg         ← Resortes fabricados a la medida
│   ├── proceso-desarrollo.jpg      ← Proceso de análisis / desarrollo
│   ├── piezas-especiales.jpg       ← Piezas metalmecánicas especiales
│   └── materiales.jpg              ← Materiales y tipos de acero
│
├── workshop/
│   ├── maquinaria-01.jpg           ← Maquinaria principal del taller
│   ├── herramientas-01.jpg         ← Herramientas y equipos especializados
│   ├── horno-tratamiento.jpg       ← Horno para tratamiento térmico
│   ├── proceso-fabricacion.mp4     ← Video del proceso de fabricación
│   └── proceso-poster.jpg          ← Poster frame del video
│
├── cases/
│   ├── mineria-resorte-principal.jpg  ← Resorte grande para minería
│   ├── mineria-horno.jpg              ← Horno especializado construido
│   ├── mineria-proceso.jpg            ← Proceso de fabricación
│   ├── mineria-proceso.mp4            ← Video del proceso (opcional)
│   └── mineria-poster.jpg             ← Poster frame del video
│
└── contact/
    └── taller-fondo.jpg            ← Foto de fondo para sección CTA (difuminada)
```

## Recomendaciones técnicas

### Imágenes
- Formato: JPG para fotos (calidad 80-85), WebP si es posible
- Tamaño: máximo 400-600KB por imagen después de optimizar
- Hero: mínimo 1400×788px (16:9)
- Retratos: mínimo 800×1067px (3:4)
- Cards: mínimo 800×600px (4:3)
- Herramienta recomendada: [Squoosh](https://squoosh.app) o imagemin

### Videos
- Formato: MP4 (H.264) — máximo 5-10MB
- Para loops ambientales: sin audio, `autoplay muted loop`
- Siempre incluir un poster JPG del primer frame

### Sustitución de placeholders
Al agregar un archivo real, el componente lo usará automáticamente
siempre que la ruta coincida con lo definido en los archivos de contenido:
- `src/content/pages/home.json`
- `src/content/sections/contact.json`
- `src/content/case-studies/mineria.mdx`
- `src/content/stories/history.md`
