import { partial } from 'underscore';
import Handlebars from 'handlebars/runtime';
import '@fortawesome/fontawesome-svg-core/styles.css';

function faHelper(prefix, iconName, { hash = {} }) {
  const svgId = `${ prefix }-fa-${ iconName }`;
  const svgClass = `fa-${ iconName }`;
  const svgClasses = hash.classes || '';
  const svg = `<svg class="icon svg-inline--fa ${ svgClass } ${ svgClasses }"><use xlink:href="#${ svgId }"></use></svg>`;

  return new Handlebars.SafeString(svg);
}

// {{far "acorn"}} -> <svg ...>
Handlebars.registerHelper({
  far: partial(faHelper, 'far'),
  fas: partial(faHelper, 'fas'),
  fal: partial(faHelper, 'fal'),
  fa: faHelper,
});
