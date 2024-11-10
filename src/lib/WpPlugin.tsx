//import from vendors
import { FC, useEffect, useState } from 'react';
import { 
  Button, Flex, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Text 
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { DateTime } from 'luxon';

//import from components
import BottomSlider from './Elements/BottomSlider';
import Label from './Elements/Label';
import RequestWidget from './Elements/RequestWidget/RequestWidget';
import { Calendar } from './Elements/Calendar';
import RoomBookingGrid from './Elements/RoomBookingGrid/RoomBookingGrid';

// imports from constants
import { RESULT_MESSAGE } from './Constants/messages';
import { CalendarIcon, ChevronDown, PlusIcon } from './Constants/icons';
import { n4, n5 } from './Constants/fonts';

// imports from types
import { DEFAULT_PLUGIN, Plugin, PluginStoreProps } from './Types/plugin';
import { BookedHoursStoreProps, LayoutsStoreProps } from './Types/booking';
import { MainConfigStoreProps } from './Types/mainConfig';
import { DEFAULT_USER, User, UserStoreProps } from './Types/user';

// imports from utils
import { useAlerts, useDebounce, useMobxStore, useWindowDimensions } from './Utils/hooks';
import { getRequests } from './Utils/endpoints';
import { StringTimeRangeToDateTime } from './Utils/layoutsAndDate';

import dictionary from './dictionary';

const PERIOD = [
  { value: 7, label: 'week' },
  { value: 14, label: 'twoWeeks' },
  { value: 31, label: 'month' },
];

const LEGEND = [
  { value: 'selected', color: 'textSection' },
  { value: 'request', color: 'requested' },
  { value: 'approved', color: 'approved' },
  { value: 'occupied', color: 'funcGray' },
];

const COLOR_SCHEME = 'teal';

type Props = {
  error?: boolean,
  language?: string;
  plugin?: Plugin,
  user?: User,
};

const WpPlugin: FC<Props> = ({ error, language = 'en', plugin = DEFAULT_PLUGIN, user = DEFAULT_USER } ) => {
  const { setBookedHours, setPlugin } : BookedHoursStoreProps = useMobxStore('BookedHoursStore');
  const { endDate, startDate, setDates, setPageConfig }: PluginStoreProps = useMobxStore('PluginStore');
  const { isMobile, setIsMobile, setLanguage }: MainConfigStoreProps = useMobxStore('MainConfigStore');
  const { selected, initLayouts, setSelected }: LayoutsStoreProps = useMobxStore('LayoutsStore');
  const { setUser }: UserStoreProps = useMobxStore('UserStore');
  const { errorAlert, defaultErrorAlert } = useAlerts();

  const [range, setRange] = useState(7);
  const [init, setInit] = useState(false);
  const [ssEvent, setSsEvent] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [rangeLabel, setRangeLabel] = useState('week');
  const [date, setDate] = useState(new Date(startDate));
  const [hideCalendar, setHideCalendar] = useState(true);

  const [cellsLabel, setCellsLabel] = useState(user.admin ? 'names' : 'time');

  const dimensions = useWindowDimensions();
  const debWidth = useDebounce(dimensions.width, 50);

  const isLimited = plugin.subscription !== 'book';
  const withCalendar = plugin.calendar !== 'false';

  useEffect(() => {
    setPlugin(plugin);
    const interval = setInterval(() => {
      setSsEvent((previous) => !previous);
    }, 15000);
    setPageConfig({
      startTime: plugin.workingHours[0] * 60 / plugin.minimalBookingPeriod,
      endTime: plugin.workingHours[1] * 60 / plugin.minimalBookingPeriod,
      partValue: plugin.minimalBookingPeriod,
      partsNumber: 60 / plugin.minimalBookingPeriod,
    });
    setUser(user);
    setLanguage(language);
    setTimeout(() => { 
      setSsEvent((previous) => !previous);
      setInit(true); 
    }, 200);
    initLayouts();
    setSelected([]);
    setCellsLabel(user.admin ? 'names' : 'time');
    if (!withCalendar && !isLimited) setRange(parseInt(plugin.days) || 7);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    selected.length === 0 && setShowSlider(false);
  }, [selected]);

  useEffect(() => {
    const isLocMobile = debWidth < 688;
    setIsMobile(isLocMobile);
  }, [debWidth]);

  useEffect(() => {
    init && getRequests({ from: startDate, to: endDate, user })
      .then((json) => {
        if (json.result) {
          setBookedHours(StringTimeRangeToDateTime(json.bookings, 'Etc/GMT'));
        } else errorAlert(RESULT_MESSAGE[language][json.message]);
        return json.result;
      })
      .then(initLayouts)
      .catch(defaultErrorAlert);
  }, [user._id, startDate, endDate, ssEvent]);


  const onDaysChange = (newDays: number) => {
    setRange(newDays);
    setRangeLabel(PERIOD.find(({ value }) => value === newDays).label);
    setDates(DateTime.fromJSDate(date), DateTime.fromJSDate(date).plus({ days: newDays }));
  };

  const handleDateChange = ({ date }) => {
    if (isLimited) return;
    setDates(DateTime.fromJSDate(date), DateTime.fromJSDate(date).plus({ days: range }));
    setDate(date);
    setHideCalendar(true);
  };

  const toggleBottomSlider = () => setShowSlider(!showSlider);

  const renderLegendHour = (type: { value: string, color: string }) => (
    <Flex {...n5} alignItems="center" bg={type.color} color="black" h={[7, 10]} justifyContent="center"
      key={type.value} mb={[0, 2]} mx={[1, 0]} pos="relative" px={1} rounded={3} userSelect="none" w="100%" >
      { dictionary[language].legend[type.value] }
    </Flex>
  );

  return (
    <Flex flexDir="column" id="BooKeyWpPlugin" pos="relative" p={[0, 8, 10]} py={[4, 8, 10]}>
      <Flex flexDir={['column', 'row']} justifyContent='center'>
        {withCalendar && (
          <Flex flexDir="column" float="left" mr={[0, 8]} minW="fit-content">
            <Flex display={[hideCalendar ? 'none' : 'flex', 'flex']} justifyContent={['center', 'flex-start']} mb={[4, 0]}>
              <Calendar disabled={isLimited} firstDayOfWeek={1} lang={language} onDateSelected={handleDateChange} selected={date} />
            </Flex>
            { !isLimited && (
              <>
                <Text {...n5} display={['none', 'flex']} mt={4}> { dictionary[language].interval } </Text>
                <Flex justifyContent="space-between" mx={[2, 0]}>
                  <Menu isLazy >
                    <MenuButton {...n4} as={Button} bg="bgSecondary" border="1px" borderColor="stroke" px={2} 
                      rightIcon={<ChevronDown boxSize={5}/>} textAlign="left" w={['auto', '100%']}>
                      { dictionary[language][rangeLabel] }
                    </MenuButton>
                    <MenuList >
                      <MenuOptionGroup defaultValue={`${range}`} type="radio">
                        { PERIOD.map(({ value, label }) =>
                          <MenuItemOption key={value} value={`${value}`} onClick={() => onDaysChange(value)}>
                            { dictionary[language][label] }
                          </MenuItemOption>) }
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                  { hideCalendar && (
                    <Button {...n4} bg="bgSecondary" display={['flex', 'none']} leftIcon={<CalendarIcon />} ml={[0, 2]}
                      onClick={() => setHideCalendar(false)} px={2} variant="outline" w="auto">
                      { DateTime.fromJSDate(date).toFormat('dd.LL.yyyy') }
                    </Button>
                  ) }
                </Flex>
              </>
            )}
            <Flex flexDir={['row', 'column']} justifyContent="space-between" my={[4, 6]} mx={[1, 0]}>
              { LEGEND.map(renderLegendHour) }
            </Flex>
          </Flex>
        )}
        <Flex flexDir="column" float="none" overflow="hidden" pos="relative">
          { init && <RoomBookingGrid cells={cellsLabel} days={range} firstDayDate={date} isOwner={user.admin} /> }
          <Flex />
        </Flex>
      </Flex>
      
      { isMobile
        ? (<>
          { selected.length > 0 && (
            <Flex bottom={6} pos="fixed" right={6}>
              <Label label={`${selected.length}`} show sx={{
                alignItems: 'center', bg: 'funcRed', color: 'textInverse', display: 'flex', fontWeight: 400, h: 5,
                justifyContent: 'center', right: -2, rounded: 10, shadow: '0 0 3px black', top: -1, w: 5, zIndex: 2,
              }} />
              <IconButton aria-label="open-request-widget" colorScheme={COLOR_SCHEME} icon={<PlusIcon boxSize={6}/>}
                onClick={toggleBottomSlider} rounded={25} shadow="base" size="lg" />
            </Flex>
          ) }
          {!error && (
            <BottomSlider hideOpenButton isOpen={showSlider} onToggle={setShowSlider}>
              <Flex bg="bgSecondary" py={4} w="100%">
                <Flex maxH="80vh" overflow={selected.length > 5 ? 'auto' : 'unset'} w="100%">
                  <RequestWidget onUpdate={() => setSsEvent((previous) => !previous)}/>
                </Flex>
              </Flex>
            </BottomSlider>
          )}
        </>
        )
        : (
          <Flex pos="fixed" right={10} rounded={6} top={20} zIndex={3}>
            {!error && <RequestWidget onUpdate={() => setSsEvent((previous) => !previous)}/>}
          </Flex>
        ) }
    </Flex>
  );
};

export default observer(WpPlugin);
