import React from 'react';
import { Route, NavLink, NavLinkProps } from 'react-router-dom';
import { useStyle } from 'styles';
import Icon from '@mdi/react';

import { resetLink } from 'styles/common';
import { media, fonts } from 'styles';
import { SrOnly } from 'components/common';

interface Props extends NavLinkProps {
  iconName: string;
  iconOnly?: boolean;
  title: string;
}

function LinkText({ text, hidden }: { text: string; hidden: boolean }) {
  const css = useStyle({
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.verdana,

    [media.mobilePortrait]: {
      fontSize: 9,
    },
    [media.mobileLandscape]: {
      marginTop: 0,
      paddingLeft: 5,
    },
  });
  return hidden ? <SrOnly>{text}</SrOnly> : <div {...css()}>{text}</div>;
}

export default function IconLink({
  iconName,
  title,
  to,
  replace,
  exact,
  onClick,
  iconOnly = false,
}: Props) {
  const css = useStyle({
    ...resetLink,
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
    color: 'DimGray',
    fill: 'DimGray',
    padding: 10,
    [media.mobileLandscape]: {
      padding: 0,
      flexDirection: 'row',
    },
  });

  const activeCss = useStyle({
    color: 'DarkSlateGray',
    fill: 'DarkSlateGray',
  });

  return (
    <Route>
      <NavLink
        to={to}
        replace={replace}
        exact={exact}
        {...css()}
        {...activeCss('activeClassName')}
        onClick={onClick}
      >
        <Icon path={iconName} size="36px" />
        <LinkText text={title} hidden={iconOnly} />
      </NavLink>
    </Route>
  );
}