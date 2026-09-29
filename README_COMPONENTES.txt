TORNEO INFANTIL — BASE VISUAL COMPONENTIZADA

Página principal oficial del prototipo: index.html (basada en indez2.html).

OBJETIVO
- Mantener una sola identidad visual para los cinco integrantes.
- El HTML es referencia estática; después se convierte a vistas Yii2.
- No copiar estilos dentro de cada vista. Todo estilo común vive en assets/css/.
- La interacción está organizada con clases JavaScript en assets/js/components.js.

ESTRUCTURA
assets/css/tokens.css      -> colores, radios, sombras, tamaños base
assets/css/components.css  -> layout y componentes reutilizables
assets/css/pages.css       -> excepciones puntuales de páginas
assets/css/torneo.css      -> entrada única de estilos
assets/js/components.js    -> componentes interactivos orientados a objetos
assets/js/app.js           -> inicialización
componentes.html           -> guía visual rápida

REGLAS
1. No crear un botón, input, modal, card o badge nuevo si ya existe una variante equivalente.
2. Los formularios usan grilla de 12 columnas y el ancho responde al dato esperado.
3. Los archivos usan el componente visual de carga; nunca mostrar el Choose File nativo.
4. Crear/Editar: modal -> Revisar y guardar -> confirmación -> mensaje de éxito.
5. El color de equipo es visual y se asignará automáticamente en Yii a partir del id_equipo; no se guarda como campo editable.
6. Se usa Font Awesome, no emojis, para mantener una estética infantil/chibi limpia.
7. Las microinteracciones deben ser suaves: elevación, rebote, partículas y foco; no dificultan lectura ni navegación.
8. En Yii2, sidebar/layout y componentes comunes deben quedar centralizados.

IMPORTANTE
Este paquete sigue siendo un prototipo HTML. Los datos son demostrativos. No sustituye modelos, controladores, validaciones ni persistencia Yii2.


VERSIÓN INTERACTIVA V2
- JavaScript POO visible mediante AnimatedCounter, GlobalSearchComponent, FilterChipComponent, GoalStepper, DisclosureComponent, TeamRosterDrawer, ParticipantPickerComponent y CoachComponent.
- Cada módulo recibe un acento visual propio sin romper el sistema común.
- Jornadas permite expandir partidos en la misma vista.
- Equipos abre plantilla rápida en un drawer lateral.
- Partidos incluye selector demostrativo de participantes.
- Goles utiliza stepper + / -.
- Incidencias incluye chips de filtro y la regla roja/suspensión sigue siendo dinámica.
- La ayuda flotante tipo chibi/kawaii da tips contextuales sin usar emojis.


V3 — ajustes visuales e interacción:
- El index conserva la paleta original por módulo: Jugadores verde, Equipos azul, Jornadas amarillo, Partidos azul/gris, Goles coral, Incidencias morado y Reportes verde.
- Cursor de fútbol animado para equipos con mouse; se desactiva automáticamente en formularios, pantallas táctiles y usuarios con reducción de movimiento.
- Pelota flotante que rebota en el área de la aplicación y puede patearse con clic.
- Tarjetas del dashboard con micro-inclinación al seguir el mouse.
