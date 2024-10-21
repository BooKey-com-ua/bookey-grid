//import from vendors
import { FC, ReactNode, useState } from 'react';
import { Button, Flex, Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';

//import from constants
import { n4 } from '../../Constants/fonts';
import { COLOR_SCHEME } from '../../Constants/colors';

//import from types
import { StyleType } from '../../Types/mainConfig';

//import from utils
import { addDictionary } from '../../Utils/i18n';

import dictionary from './dictionary';

type Props = {
  bodyColor?: string;
  bodyText: string;
  cancelButton?: ReactNode;
  cancelText?: string;
  children: ReactNode;
  delay?: number;
  header: string;
  headerColor?: string;
  onCancel?: () => void;
  onSubmit: () => void;
  submitButton?: ReactNode;
  submitColor?: string;
  submitText?: string;
  sx?: StyleType;
};

const SubmitModal:FC<Props> = ({
  bodyColor, bodyText, cancelButton, cancelText, delay, header, headerColor,
  onCancel, onSubmit, children, submitButton, submitColor, submitText, sx,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { Translate } = addDictionary(dictionary);

  const [disabled, setDisabled] = useState(false);

  const handleCancel = () => {
    onClose();
    onCancel && onCancel();
  };

  const handleSubmit = () => {
    onClose();
    onSubmit();
  };

  const onExtOpen = () => {
    onOpen();
    if (delay) {
      setDisabled(true);
      setTimeout(() => setDisabled(false), delay);
    }
  };

  return (
    <>
      <Flex onClick={onExtOpen} sx={sx}>
        { children }
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" >
        <ModalOverlay />
        <ModalContent bg="bgSecondary" mx={2}>
          <ModalHeader color={headerColor} textAlign="center">{ header }</ModalHeader>
          <ModalBody px={[2, 6]}>
            <Text {...n4} color={bodyColor} w="100%" > { bodyText } </Text>
          </ModalBody>
          <ModalFooter justifyContent="flex-end" p={[2, 4]} py={[3, 5]}>
            { cancelButton
              ? <Flex onClick={handleCancel} > { cancelButton } </Flex>
              : <Button colorScheme={COLOR_SCHEME} mr={3} onClick={onClose} variant="outline">
                { cancelText || Translate('cancel') }
              </Button>
            }
            { submitButton
              ? <Flex onClick={handleSubmit} > { submitButton } </Flex>
              : <Button colorScheme={submitColor || COLOR_SCHEME} isLoading={disabled} onClick={handleSubmit} >
                { submitText || Translate('yes') }
              </Button>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmitModal;
