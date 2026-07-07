import { createElement } from 'react';

function GlowText({ as = 'span', children, ...rest }) {
  if (typeof children !== 'string') {
    return createElement(as, rest, children);
  }

  const chars = children.split('').map((char, i) => (
    <span key={i} className="glow-char">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return createElement(as, rest, chars);
}

export default GlowText;
