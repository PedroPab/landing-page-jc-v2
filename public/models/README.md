# Modelos 3D — STL

Coloca aquí los archivos STL de cada producto. El nombre del archivo debe coincidir con el `id` del producto en el contenido.

## Convención de nombres

| Archivo             | Producto                  |
|---------------------|---------------------------|
| `compresion.stl`    | Resortes de Compresión    |
| `tension.stl`       | Resortes de Tensión       |
| `torsion.stl`       | Resortes de Torsión       |
| `gran-escala.stl`   | Resortes de Gran Escala   |
| `default.stl`       | Modelo genérico (fallback)|

## Orden de fallback

El visor intenta cargar en este orden:
1. `/models/{productId}.stl` — modelo específico del producto
2. `/models/default.stl` — modelo genérico de fallback
3. Geometría procedural (resorte paramétrico) — siempre disponible sin archivos

## Orientación recomendada del modelo STL

- Eje Y hacia arriba (altura del resorte)
- Centrado en el origen
- Unidades: no importan (el visor normaliza el tamaño automáticamente)
