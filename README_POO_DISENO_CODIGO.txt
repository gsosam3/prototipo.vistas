TORNEO INFANTIL — PROTOTIPO FINAL HTML

ESTADO
- Base visual final para convertir posteriormente a Yii 2.
- El prototipo es estático: los datos visibles son demostrativos.
- Se conserva el cursor de pelota.
- Se eliminó la pelota flotante/rebotadora.
- Las microanimaciones se muestran solo en Jugadores, Equipos, Jornadas, Partidos, Goles e Incidencias.
- Reportes y consultas se mantienen visualmente tranquilos.

POO DE DISEÑO
1. assets/css/tokens.css
   Variables visuales comunes: colores, radios, sombras, medidas y transiciones.
2. assets/css/components.css
   Componentes reutilizables: botones, tarjetas, sidebar, formularios, modales, filtros, uploader, etc.
3. assets/css/pages.css
   Ajustes específicos por tipo de vista.
4. assets/css/animations.css
   Microanimaciones temáticas aisladas del resto del diseño.

POO DE CÓDIGO
- assets/js/components.js contiene componentes de UI encapsulados en clases.
- assets/js/page-animations.js implementa herencia:
    BasePageAnimation
      -> PlayerPageAnimation
      -> TeamsPageAnimation
      -> JornadaPageAnimation
      -> MatchPageAnimation
      -> GoalPageAnimation
      -> IncidentPageAnimation
- PageAnimationFactory decide qué animación crear según body[data-page].
- assets/js/app.js actúa como bootstrap: instancia componentes y no contiene lógica visual específica de cada página.

PRINCIPIOS
- Encapsulación: cada componente controla su propio DOM/eventos.
- Herencia: las animaciones reutilizan ciclo de vida común.
- Polimorfismo: cada animación redefine template()/afterMount() cuando lo necesita.
- Abstracción: la página solo declara data-page; no conoce cómo se implementa la animación.
- Reutilización: la misma base de CSS/JS se usa en todos los módulos.

PÁGINAS CON MICROANIMACIÓN
- jugadores.html: jugador corriendo con balón.
- equipos.html: escudos entrando.
- jornadas.html: calendario y fechas.
- partidos.html: dos escudos + VS + balón.
- goles.html: pelota cruzando + GOL + confeti.
- incidencias.html: tarjetas amarilla/roja.

IMPORTANTE PARA YII
Al migrar este prototipo a Yii 2, no copiar estilos por vista. Los assets comunes deben registrarse una sola vez mediante el AssetBundle y cada vista debe reutilizar los componentes/clases existentes.
