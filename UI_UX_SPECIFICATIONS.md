# Especificaciones de UI/UX para la Plataforma de Presentaciones

Este documento define las directrices de interfaz de usuario y experiencia de usuario para la plataforma de presentaciones interactivas, asegurando que el diseño final mantenga la alta calidad visual y experiencia fluida del proyecto original.

## Principios de Diseño

### 1. Inmersión Visual
- Utilizar fondos con gradientes y elementos sutiles para crear profundidad
- Mantener contraste óptimo entre elementos y fondos
- Emplear glassmorphism para elementos de interfaz

### 2. Claridad Funcional
- Diferenciar claramente los roles de presentador y audiencia
- Señalizar estados activos/inactivos con cambios visuales evidentes
- Proporcionar retroalimentación inmediata para acciones del usuario

### 3. Fluidez y Movimiento
- Incorporar animaciones sutiles pero significativas
- Utilizar transiciones para guiar la atención del usuario
- Mantener coherencia en el lenguaje de movimiento

### 4. Accesibilidad
- Cumplir con WCAG 2.1 AA como mínimo
- Asegurar contraste de color suficiente
- Proporcionar etiquetas y descripciones adecuadas

## Paleta de Colores

### Colores Primarios
- **Gris Oscuro:** `#121212` - Fondo base
- **Ámbar:** `#F59E0B` - Color de acento principal
- **Pizarra:** `#1E293B` - Fondos secundarios

### Gradientes Clave
- **Gradiente Principal:** `from-slate-900 to-amber-900`
- **Gradiente Acento:** `from-amber-500/20 to-red-500/20`
- **Gradiente Neutro:** `from-slate-900 to-slate-800`

### Transparencias
- **Elementos flotantes:** `bg-white/5 backdrop-blur-md`
- **Tarjetas y contenedores:** `bg-white/10 backdrop-blur-sm`
- **Elementos destacados:** `bg-amber-500/20`

## Tipografía

### Fuentes
- **Principal:** Inter (sans-serif)
- **Alternativa:** System font stack

### Jerarquía
- **Títulos Principales:** 2rem/32px, 700 weight
- **Subtítulos:** 1.25rem/20px, 600 weight
- **Texto Principal:** 1rem/16px, 400 weight
- **Texto Secundario:** 0.875rem/14px, 400 weight
- **Anotaciones:** 0.75rem/12px, 400 weight

## Sistema de Componentes

### Componentes Globales

#### 1. Navegación
- Barra lateral con secciones colapsables
- Iconos con etiquetas para acciones principales
- Indicadores visuales para navegación actual

#### 2. Tarjetas
```jsx
<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
  {/* Contenido de tarjeta */}
</div>
```

#### 3. Botones
- **Primario:** Fondo sólido con color de acento
```jsx
<button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
  Acción Principal
</button>
```

- **Secundario:** Estilo glassmórfico
```jsx
<button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors">
  Acción Secundaria
</button>
```

- **Terciario:** Fantasma/Minimal
```jsx
<button className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-colors">
  Acción Terciaria
</button>
```

#### 4. Campos de Formulario
```jsx
<div className="space-y-2">
  <label className="text-sm text-white/70">Etiqueta</label>
  <input 
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
    placeholder="Placeholder"
  />
</div>
```

#### 5. Tooltips y Popovers
```jsx
<div className="absolute bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2 text-xs text-white shadow-lg">
  Texto informativo
</div>
```

### Componentes Específicos de la Aplicación

#### 1. Panel de Control del Presentador
- Panel colapsable en el lado izquierdo
- Secciones para:
  - Estado de conexión de la audiencia
  - Control de seguimiento
  - Vista previa de diapositivas
  - Temporizador/cronómetro

**Estado visual:**
```jsx
<div className="flex items-center gap-2 text-xs">
  <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
  <span className="text-white/70">{status}</span>
</div>
```

#### 2. Editor de Diapositivas
- Interfaz dividida: Vista previa a la derecha, configuración a la izquierda
- Campos dinámicos según tipo de diapositiva
- Previsualización en tiempo real
- Guardado automático

#### 3. Gestor de Presentaciones
- Diseño de tarjetas en grid
- Visualización de:
  - Miniatura de diapositiva de título
  - Nombre de presentación
  - Conteo de diapositivas
  - Última edición
  - Acciones rápidas (editar, duplicar, eliminar)

#### 4. Navegador de Diapositivas
- Barra horizontal o vertical con miniaturas
- Indicador de diapositiva actual
- Funcionalidad de arrastrar y soltar para reordenar

## Diseños de Pantallas Principales

### 1. Dashboard Principal

```
┌───────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard                             [Usuario ▼]       │
├─────────┬─────────────────────────────────────────────────────┤
│         │                                                     │
│         │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│         │  │             │  │             │  │             │  │
│ Sidebar │  │ Presentación│  │ Presentación│  │ Presentación│  │
│         │  │     #1      │  │     #2      │  │     #3      │  │
│ - Inicio│  │             │  │             │  │             │  │
│ - Pres. │  └─────────────┘  └─────────────┘  └─────────────┘  │
│ - Plant.│                                                     │
│ - Config│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│         │  │             │  │             │  │             │  │
│         │  │ Presentación│  │ Presentación│  │    Nueva    │  │
│         │  │     #4      │  │     #5      │  │             │  │
│         │  │             │  │             │  │     [+]     │  │
│         │  └─────────────┘  └─────────────┘  └─────────────┘  │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

### 2. Editor de Presentaciones

```
┌───────────────────────────────────────────────────────────────┐
│ [←] Editar Presentación: [Título]           [Guardar] [Vista] │
├────────────────┬──────────────────────────────────────────────┤
│                │                                              │
│ Diapositivas   │                                              │
│ ┌──────────┐   │                                              │
│ │   [1]    │   │                                              │
│ └──────────┘   │                                              │
│ ┌──────────┐   │         Vista Previa de Diapositiva          │
│ │   [2]    │   │                                              │
│ └──────────┘   │                                              │
│ ┌──────────┐   │                                              │
│ │   [3]    │   │                                              │
│ └──────────┘   │                                              │
│                │                                              │
│ [+ Añadir]     │                                              │
│                │                                              │
├────────────────┴──────────────────────────────────────────────┤
│ Propiedades                                                   │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Tipo: [Dropdown ▼]  Transición: [Dropdown ▼]             │  │
│ │                                                          │  │
│ │ [Campos dinámicos según tipo de diapositiva]            │  │
│ │                                                          │  │
│ └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 3. Modo Presentador

```
┌───────────────────────────────────────────────────────────────┐
│ [Panel de Control]               [Contador] [Finalizar]        │
├───────────────────┬───────────────────────────────────────────┤
│                   │                                           │
│ Audiencia (5)     │                                           │
│ - Ana (Slide 2)   │                                           │
│ - Juan (Slide 3)  │                                           │
│ - ...             │                                           │
│                   │         Diapositiva Actual (3/10)         │
│ Seguimiento       │                                           │
│ [ON] Automático   │                                           │
│                   │                                           │
│ Forzar Slide      │                                           │
│ [5 ▼] [Aplicar]   │                                           │
│                   │                                           │
│ Vista Previa      │                                           │
│ [Miniatura de     │                                           │
│  siguiente slide] │                                           │
│                   │                                           │
└───────────────────┴───────────────────────────────────────────┘
```

### 4. Modo Audiencia

```
┌───────────────────────────────────────────────────────────────┐
│ [Nombre Audiencia]                   [Modo Navegación: Auto]   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
│                     Contenido de Diapositiva                  │
│                        (Slide 3 de 10)                        │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
└─────────────────────────┬─────────────────┬─────────────────┬─┘
                          │ [Anterior]  [Siguiente] [Pantalla] │
                          └─────────────────────────────────────┘
```

## Microinteracciones Clave

### 1. Transiciones entre Diapositivas
- Fade combinado con movimiento suave
- Duración: 0.4-0.6 segundos
- Curva de aceleración: ease-in-out

### 2. Indicadores de Carga
- Animación de pulso para elementos en carga
- Esqueletos de carga con gradiente animado
- Opacidad reducida durante estados de carga

### 3. Notificaciones y Alertas
- Entrada deslizante desde la esquina superior derecha
- Duración ajustable según importancia
- Código de colores: verde (éxito), ámbar (advertencia), rojo (error)

### 4. Retroalimentación en Formularios
- Validación en tiempo real con indicadores visuales
- Sacudida suave para entradas inválidas
- Animación de check para validación exitosa

## Responsividad y Adaptabilidad

### Puntos de Quiebre
- **Móvil:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Adaptaciones por Dispositivo

#### Móvil
- Menú colapsado accesible mediante hamburguesa
- Vista previa de diapositiva a pantalla completa
- Propiedades de edición en vista separada/modal
- Controles de presentador reorganizados verticalmente

#### Tablet
- Barra lateral reducida con iconos y tooltips
- Reducción de padding y márgenes
- Editor con diseño vertical (configuración debajo de la vista previa)

#### Desktop
- Experiencia completa como se describe en los diseños

## Recursos y Assets

### Iconografía
- Sistema de iconos: Lucide Icons
- Tamaños consistentes: 16px, 20px, 24px
- Stroke-width: 1.5-2px
- Colores adaptados a la paleta

### Ilustraciones
- Estilo minimalista con elementos abstractos
- Paleta coordinada con los colores de la aplicación
- Formato SVG para escalabilidad y bajo peso

### Animaciones
- Basadas en Framer Motion
- Ejemplos clave:
  ```jsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Contenido animado
  </motion.div>
  ```

## Pautas de Implementación

### Garantía de Calidad Visual
- Implementar sistema de component storybook
- Definir pruebas visuales de regresión
- Revisiones regulares de consistencia de UI

### Consideraciones de Rendimiento
- Optimizar animaciones para evitar jank visual
- Precargar recursos esenciales
- Implementar lazy loading para componentes pesados

### Prioridades de Desarrollo UI/UX
1. Flujo básico de creación y visualización de presentaciones
2. Experiencia del presentador y controles en tiempo real
3. Refinamiento del editor visual de diapositivas
4. Personalización avanzada y temas

---

Este documento debe evolucionar durante el desarrollo del proyecto. Se recomienda mantenerlo actualizado con decisiones de diseño, variaciones y componentes adicionales que surjan durante la implementación. 