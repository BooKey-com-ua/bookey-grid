// import from vendors
import { FC, useState } from 'react';
import { Button, CloseButton, Flex, Link, Text, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { DateTime } from 'luxon';

// import from components
import SubmitModal from '../SubmitModal/SubmitModal';

// imports from constants
import { RESULT_MESSAGE } from '../../Constants/messages';
import { DAY_MONTH_NAMES, MONTHS_NAMES } from '../../Constants/calendar';
import { COLOR_SCHEME } from '../../Constants/colors';
import { m2, m3, m4, mm5, n5 } from '../../Constants/fonts';
import { STATUS } from '../../Constants/bookings';

//import from types
import { BookedHoursStoreProps, LayoutItem, LayoutsStoreProps } from '../../Types/booking';
import { MainConfigStoreProps } from '../../Types/mainConfig';
import { UserStoreProps } from '../../Types/user';

//import from utils
import { approveRequest, bookingRequest, rejectRequest } from '../../Utils/endpoints';
import { useAlerts, useMobxStore } from '../../Utils/hooks';
import { addDictionary } from '../../Utils/i18n';

import dictionary from './dictionary';

type Props = {
  onUpdate: () => void;
};

const RequestWidget: FC<Props> = ({ onUpdate =  () => null }) => {
  const { plugin, removeBookedHourById }: BookedHoursStoreProps = useMobxStore('BookedHoursStore');
  const {
    selected, acceptSelectedById, clearSelected, initLayouts, removeSelectedParentById, setSelected, setLayoutItem,
  }: LayoutsStoreProps = useMobxStore('LayoutsStore');
  const { isMobile, language }: MainConfigStoreProps = useMobxStore('MainConfigStore');
  const { chakraAlert, defaultErrorAlert, errorAlert, networkErrorAlert } = useAlerts();
  const { user }: UserStoreProps = useMobxStore('UserStore');
  const toast = useToast();

  const [freeForRequest, setFreeForRequest] = useState(true);

  if (selected.length === 0) return null;

  const selectedWithDates = [];
  for (const book of selected) {
    if (selectedWithDates[selectedWithDates.length - 1]?.from.day != book.from.day)
      selectedWithDates.push({ status: 'date', date: book.from });
    selectedWithDates.push(book);
  }

  const allowMassApprove = selected.some((hour: LayoutItem) => !hour.status) ? true : false;

  const { TranslateArr } = addDictionary(DAY_MONTH_NAMES);
  const { Translate } = addDictionary(dictionary);

  const isPast = (item: LayoutItem) => item.from.toMillis() < DateTime.now().toMillis();

  const handleRejectRequest = (requestId: string) => {
    rejectRequest({ bookings: [requestId], user })
      .then((json) => {
        if (json.result) {
          removeBookedHourById(requestId);
          removeSelectedParentById(requestId);
          initLayouts();
        } else if (json?.code) errorAlert(json?.message); 
            else errorAlert(RESULT_MESSAGE[language][json.message]);
      })
      .catch(defaultErrorAlert);
  };

  const handleApproveRequest = (booking: string) => {
    approveRequest({ booking, user })
      .then((json) => {
        if (json.result) {
          acceptSelectedById(booking);
          onUpdate();
        }
        else json.status === 500 ? networkErrorAlert() : errorAlert(RESULT_MESSAGE[language][json.message]);
      })
      .catch(defaultErrorAlert);
  };

  const onTariffs = () => {
    toast.closeAll();
    window.open('https://bookey.ltd/plugin?tab=tariff', '_blank');
  };

  const onLoginPage = () => {
    toast.closeAll();
    window.open(plugin.loginPage, '_self');
  };

  const renderProposal = (text: string) => <Flex bg="bgTertiary" flexDir="column" mt={10} mx={2} p={3}
    pos="relative" rounded={6} shadow="0 0 2px black" textAlign="center" w={['95vw', 400]} >
    <Text {...m2} mb={1}> { Translate('attentionMinor') } </Text>
    { text }
    <Flex justifyContent="flex-end" mt={3} w="100%">
      { user.admin && (
        <Button colorScheme={COLOR_SCHEME} mx={2} onClick={onTariffs} variant="outline" > { Translate('toTariffs') }</Button>
      ) }
      <Button colorScheme={COLOR_SCHEME} onClick={() => toast.closeAll()}> { Translate('cancel') }</Button>
    </Flex>
  </Flex>;

  const renderToLoginPage = (text: string) => <Flex bg="bgTertiary" flexDir="column" mt={10} mx={2} p={[3, '18px']}
    pos="relative" rounded={6} shadow="0 0 2px black" textAlign="center" w={['95vw', 'auto']} >
    <Text {...m2} mb={1}> { text } </Text>
    <Flex justifyContent="flex-end" mt={3} w="100%">
      <Button colorScheme={COLOR_SCHEME} mx={2} onClick={onLoginPage} variant="outline"> { Translate('toLoginPage') }</Button>
      <Button colorScheme={COLOR_SCHEME} onClick={() => toast.closeAll()}> { Translate('cancel') }</Button>
    </Flex>
  </Flex>;

  const handleRequestClick = () => {
    if (user?._id === '') {
      clearSelected();
      chakraAlert({
        duration: null, position: isMobile ? 'bottom' : 'top',
        render: () => renderToLoginPage(RESULT_MESSAGE[language].NO_AUTH),
      });
    }
    else {
      setFreeForRequest(false);
      freeForRequest && bookingRequest({
        request: selected.filter(({ status }) => !status), 
        user,
      })
        .then((json) => {
          if (json.result) {
            setSelected(selected.filter(({ status }) => Boolean(status)));
            selected.forEach((cellItem) => {
              if (!cellItem?.status)
                setLayoutItem({ ...cellItem, isSelected: false, isResizable: false, isDraggable: false, color: 'requested' });
            });
            onUpdate();
          } else {
            if (json.status === 500) networkErrorAlert();
            else {
              if (json.type) {
                chakraAlert({
                  duration: null, position: isMobile ? 'bottom' : 'top',
                  render: () => renderProposal(RESULT_MESSAGE[language][json.message]),
                });
              } else if (json?.code) errorAlert(json?.message);
                else errorAlert(RESULT_MESSAGE[language][json.message]);
            }
          }
        })
        .catch(defaultErrorAlert);
      setTimeout(() => setFreeForRequest(true), 500);
    }
  };

  const handleCancel = () => {
    clearSelected();
    initLayouts();
  };


  const isNoWarning = (item: LayoutItem) => {
    const cancelWarning = item.pluginId?.office?.cancelWarning || 0;
    return item.from.diff(DateTime.now(), ['hours']).hours > cancelWarning;
  };

  const getModalHeader = (item: LayoutItem) => item.paymentId
    ? 'warningPaidHeader'
    : (isNoWarning(item) ? 'warningHeader' : 'attention');

  const warningText = (item: LayoutItem) => {
    const cancelWarning = item.pluginId?.office?.cancelWarning || 0;
    return isNoWarning(item) ? Translate('warningBody')
      : Translate('cancelWarningA') + ` ${cancelWarning} ` + Translate('cancelWarningB');
  };

  const cancelButton = <Button colorScheme={COLOR_SCHEME} mr={[2, 4]} variant="outline">{ Translate('no') }</Button>;

  const selectedItem = (item: LayoutItem) => (
    <Flex _first={{ border: 'none', pt: 0 }} borderTop={item.date && '1px'}
      flexDir="column" key={item.from?.toMillis() || item.date.day} pt={item.date && 3} w="100%" >
      { item.date && ( //* date marker
        <Text {...m3} h={8} >
          { `${item.date.toFormat('d')} ${TranslateArr(['month', 'long', MONTHS_NAMES[item.date.month - 1]])}` }
        </Text>
      ) }
      { !item.status && ( //* selected for booking
        <Flex alignItems="center" borderTop="1px" borderColor="stroke" justifyContent="space-between" key={item._id} w="100%">
          <Flex alignItems="center" justifyContent="space-between" h={10} pr={2} w="100%">
            <Text {...n5} minW={['90px', 100]}>
              { item.from.toFormat('HH:mm') }-{ item.to.toFormat('HH:mm') }
            </Text>
          </Flex>
          <CloseButton mr={1} onClick={() => { removeSelectedParentById(item._id); initLayouts(); }} />
        </Flex>
      ) }
      { item.status === STATUS.approved && ( //* previously approved bookings
        <Flex alignItems="center" borderTop="1px" borderColor="stroke"
          justifyContent="space-between" key={item._id} py={2} w="100%">
          <Flex flexDir="column">
            <Text {...n5}>
              { item.from.toFormat('HH:mm') }-{ item.to.toFormat('HH:mm') }
            </Text>
            { user.admin && (
              <Link href={`/wordpress/wp-admin/user-edit.php?user_id=${item.requestedById}`}>
                <Text {...m4} color={COLOR_SCHEME} mt={2} textDecor='underline' > { item.item  } </Text>
              </Link>
            ) }
          </Flex>
          <SubmitModal bodyText={warningText(item)} cancelButton={cancelButton} delay={!isNoWarning(item) && 6000}
            header={Translate(getModalHeader(item))} headerColor={!isNoWarning(item) && 'red'}
            onCancel={() => null} onSubmit={() => handleRejectRequest(item._id)}
            submitColor="red" submitText={Translate('yesCancel')}>
            <Button colorScheme="red" isDisabled={isPast(item)} minW={90} rounded='5px !important' size={'xs'}>
              { Translate('cancelRequest') }
            </Button>
          </SubmitModal>
        </Flex>
      ) }
      { item.bookings?.map(({ from, to, _id }) => ( //* bookings waiting for approve
        <Flex borderTop="1px" borderColor="stroke" justifyContent="space-between" key={_id} py={2} w="100%" >
          <Flex flexDir="column">
            <Text {...n5}>
              { `${from.toFormat('HH:mm')}-${to.toFormat('HH:mm')} (${to.hour - from.hour} ` }
              { Translate('hour') })
            </Text>
            { user.admin && (
              <Link href={`/wordpress/wp-admin/user-edit.php?user_id=${item.requestedById}`}>
                <Text {...m4} color={COLOR_SCHEME} mt={2} textDecor='underline'> { item.requestedBy  } </Text>
              </Link>
            ) }
          </Flex>
          <Flex flexDir="column" justifyContent="space-evenly">
            { user.admin &&
            <Button colorScheme="green" isDisabled={isPast(item)} minW={90} onClick={() => handleApproveRequest(_id)} rounded='5px !important' size="xs" >
              { Translate('approve') }
            </Button>
            }
            <Button colorScheme="yellow" isDisabled={isPast(item)} minW={90} mt={user.admin && 2} onClick={() => handleRejectRequest(_id)} rounded='5px !important' size="xs" >
              { Translate('reject') }
            </Button>
          </Flex>
        </Flex>
      ))
      }
    </Flex>
  );

  return (
    <Flex bg="bgSecondary" border={!isMobile && '1px'} borderColor="stroke" flexDir="column" id="RequestWidget" maxH="80vh"
      overflow={selected.length > 5 ? 'auto' : 'unset'} pos="relative" pb={isMobile && 16} pt={[4, 4, 8]}
      px={[4, 4, 8]} rounded={6} w={['100%', 380, 427]} >
      { selectedWithDates.map((hour) => selectedItem(hour)) }
      <Flex bg="bgSecondary" borderTop="1px" bottom={isMobile && 4} justifyContent="flex-end" pos={isMobile ? 'fixed' : 'sticky'}
        pb={[1, 4, 8]} pt={[4, 4, 8]} right={4} w={isMobile && 'calc(100vw - 32px)'} >
        <Button colorScheme="red" onClick={handleCancel} rounded='5px !important' variant="outline">
          { Translate('cancel') }
        </Button>
        { allowMassApprove && (
          <>
            <Flex w={4} />
            <Button colorScheme={COLOR_SCHEME} onClick={handleRequestClick} rounded='5px !important' isDisabled={!freeForRequest}>
              { Translate('book') }
            </Button>
          </>
        ) }
      </Flex>
      <Link {...mm5} color={COLOR_SCHEME} pos='absolute' right={3} top={[-4, 2]} href='https://bookey.ltd/docs/terms' target='_blank'>
        { Translate('terms') }
      </Link>
    </Flex>
  );
};

export default observer(RequestWidget);
