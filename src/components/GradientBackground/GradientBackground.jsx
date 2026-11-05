import './GradientBackground.css';

/**
 * Tema de fondo "Gradiente Animado".
 *
 * Fondo ambiental 100% CSS: tres auroras radiales que se desplazan lentamente
 * (solo `transform`, compuesto en GPU) sobre una base oscura, más una viñeta
 * estática que concentra la atención en el contenido.
 *
 * - El color se deriva de `--accent-color` (inyectado en :root por
 *   applyGlobalColorTokens), por lo que reacciona al selector de acento sin
 *   re-renderizar este componente.
 * - Solo se monta cuando el tema está activo (Layout renderiza únicamente el
 *   componente del tema seleccionado), así que no hay animaciones en segundo plano.
 */
function GradientBackground() {
  return (
    <div className="gradient-background" aria-hidden="true">
      <div className="gradient-background__aurora gradient-background__aurora--1" />
      <div className="gradient-background__aurora gradient-background__aurora--2" />
      <div className="gradient-background__aurora gradient-background__aurora--3" />
      <div className="gradient-background__vignette" />
    </div>
  );
}

export default GradientBackground;

