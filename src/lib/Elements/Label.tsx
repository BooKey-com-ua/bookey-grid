// import from vendors
import { FC } from 'react';
import { Badge } from '@chakra-ui/react';

//import from types
import { StyleType } from '../Types/mainConfig';

type Props = {
  color?: string;
  isDot?: boolean;
  label?: string;
  show?: boolean;
  sx?: StyleType;
  variant?: string;
};

const Label:FC<Props> = ({
  color, isDot, label, show = true, sx, variant,
}) => {
  const intSx = Object.assign({}, isDot && {
    bg: 'red', border: '4px solid', borderColor: 'bgSecondary', h: 5, right: 0, rounded: 10, w: 5, zIndex: 2,
  }, sx);

  return show && <Badge colorScheme={color} pos="absolute" sx={intSx} variant={variant} >{ label }</Badge>;
};

export default Label;
