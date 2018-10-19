// @flow strict
import _ from 'lodash';
import React from 'react';
import { makeStyles } from 'styles';

import { media, fonts } from 'styles';
import { hover, scroll } from 'styles/common';
import { operations, opList } from 'polyhedra/operations';
import connect from 'components/connect';
import {
  ApplyOperation,
  WithOperation,
  WithPolyhedron,
} from 'components/Viewer/context';
import OperationIcon from './OperationIcon';

const styles = makeStyles({
  opGrid: {
    [media.notMobile]: {
      display: 'grid',
      justifyContent: 'space-around',
      gridColumnGap: 5,
      gridRowGap: 20,
      // TODO encode the ordering in the actual operation types
      gridTemplateRows: 'repeat(4, 80px)',
      gridTemplateAreas: `
      "truncate rectify      sharpen dual"
      "expand   snub         contract twist"
      "elongate gyroelongate shorten  turn"
      "augment  augment      diminish gyrate"
    `,
    },
    [media.mobile]: {
      ...scroll('x'),
      height: 85,
      display: 'flex',
      width: '100%',
    },
  },

  operationButton: {
    fontFamily: fonts.verdana,
    fontSize: 12,
    width: 84,
    height: 84,
    border: '1px LightGray solid',
    color: 'DimGray',
    backgroundColor: 'white',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    ':disabled': {
      opacity: 0.3,
    },

    ...hover,

    [media.mobile]: {
      margin: '0 8px',
    },
  },

  isHighlighted: {
    border: '2px DarkSlateGray solid',
  },
});

function OpButton({ name, highlighted, ...btnProps }) {
  return (
    <button
      {...btnProps}
      className={styles('operationButton', highlighted && 'isHighlighted')}
      style={{ gridArea: name }}
    >
      <OperationIcon name={name} />
      {name}
    </button>
  );
}

function OpGrid({ isTransitioning, solidName, opName, selectOperation }) {
  return (
    <div className={styles('opGrid')}>
      {opList.map(({ name }) => (
        <OpButton
          key={name}
          name={name}
          highlighted={opName === name}
          onClick={() => selectOperation(name)}
          disabled={!operations[name].resultsFor(solidName) || isTransitioning}
        />
      ))}
    </div>
  );
}

export default _.flow([
  connect(
    WithPolyhedron,
    ['solidName', 'isTransitioning'],
  ),
  connect(
    ApplyOperation,
    ['selectOperation'],
  ),
  connect(
    WithOperation,
    ['opName'],
  ),
])(OpGrid);
