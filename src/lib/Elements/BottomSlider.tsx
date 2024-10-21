//import from vendors
import { FC, ReactNode, useEffect } from 'react';
import { IconButton, Box, Slide, useDisclosure } from '@chakra-ui/react';

// imports from constants
import { ChevronDown, ChevronUp } from '../Constants/icons';
import { COLOR_SCHEME } from '../Constants/colors';

type Props = {
  children: ReactNode;
  hideCloseButton?: boolean;
  hideOpenButton?: boolean;
  isOpen?: boolean;
  left?: string;
  onToggle?: (state: boolean) => void;
};

const BottomSlider:FC<Props> = ({
  children, hideCloseButton, hideOpenButton, isOpen: doOpen, left = '50%', onToggle,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (doOpen) onOpen();
    if (!doOpen) onClose();
  }, [doOpen]);

  useEffect(() => {
    if (onToggle) onToggle(isOpen);
  }, [isOpen]);

  return (
    <>
      { !isOpen && !hideOpenButton && (
        <IconButton aria-label="bottom-slider-show" bottom={-1} bg="bgSecondary" colorScheme={COLOR_SCHEME}
          icon={<ChevronUp boxSize={6} />} pb={1} shadow="0 0 2px black" left={left} onClick={onOpen} pos="fixed"
          transform="translate(-50%, 0%)" variant="link" zIndex={1} />
      ) }
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }} unmountOnExit>
        <Box bg="bgSecondary" shadow="0 0 2px black">
          { ! hideCloseButton && (
            <IconButton aria-label="bottom-slider-hide" top={-13} bg="bgSecondary" icon={<ChevronDown boxSize={6} />}
              colorScheme={COLOR_SCHEME} variant="link" left={left} onClick={onClose} pos="relative"
              shadow="0 -2px 1px black" transform="translate(-50%, 0%)" zIndex={1} />
          ) }
          { children }
        </Box>
      </Slide>
    </>
  );
};

export default BottomSlider;
