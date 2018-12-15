import React from 'react';
import { useStyle } from 'styles';

import { NavMenu, Panels, useHiddenHeading } from '../common';
import { scroll } from 'styles/common';

import OperationsPanel from './OperationsPanel';

interface Props {
  panel: string;
  solid: string;
  compact?: boolean;
}

const menuH = 75;

export default function Sidebar({ panel, solid, compact }: Props) {
  const [header, focusOnHeader] = useHiddenHeading(panel);

  const css = useStyle(
    {
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'grid',
      gridTemplateRows: `${menuH}px 1fr`,
      gridTemplateAreas: '"menu" "content"',
      boxShadow: compact ? undefined : 'inset 1px -1px 4px LightGray',
    },
    [compact],
  );

  const menuCss = useStyle({
    gridArea: 'menu',
    height: menuH,
    padding: '0 10px',
    borderBottom: compact ? undefined : '1px solid LightGray',
  });

  const contentCss = useStyle({
    ...scroll('y'),
    gridArea: 'content',
    position: 'relative',
  });
  return (
    <section {...css()}>
      <div {...menuCss()}>
        <NavMenu solid={solid} compact={compact} onClick={focusOnHeader} />
      </div>
      {!compact && (
        <div {...contentCss()}>
          {header}
          <Panels panel={panel} operationsPanel={OperationsPanel} />
        </div>
      )}
    </section>
  );
}