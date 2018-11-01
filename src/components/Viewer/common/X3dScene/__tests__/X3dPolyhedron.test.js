import _ from 'lodash';
import React from 'react';
import X3dPolyhedron from '../X3dPolyhedron';

import { mount } from 'enzyme';
import { defaultConfig } from 'components/configOptions';
import { Polyhedron } from 'math/polyhedra';

jest.mock('../useHitOptions');
const { applyWithHitOption } = require('../useHitOptions');

let wrapper;

function setup() {
  wrapper = mount(<X3dPolyhedron />);
}

describe('X3dPolyhedron', () => {
  beforeEach(() => {
    setup();
  });

  it('renders', () => {
    expect(wrapper.find('Edges')).toHaveLength(1);
  });

  it("doesn't fire a click if the mouse has been moved", () => {
    const onClick = jest.fn();
    setup({ onClick });
    const shape = wrapper
      .find('shape')
      .filterWhere(n => !!n.prop('onMouseMove'));

    shape.simulate('mousedown', { hitPnt: [0, 0, 0] });
    shape.simulate('mouseup', { hitPnt: [0, 0, 1] });
    expect(applyWithHitOption).not.toHaveBeenCalled();

    shape.simulate('mousedown', { hitPnt: [0, 0, 0] });
    shape.simulate('mousemove', { hitPnt: [0, 0, 1] });
    shape.simulate('mouseup', { hitPnt: [0, 0, 0] });
    expect(applyWithHitOption).not.toHaveBeenCalled();

    shape.simulate('mousedown', { hitPnt: [0, 0, 0] });
    shape.simulate('mouseup', { hitPnt: [0, 0, 0] });
    expect(applyWithHitOption).toHaveBeenCalled();
  });
});
