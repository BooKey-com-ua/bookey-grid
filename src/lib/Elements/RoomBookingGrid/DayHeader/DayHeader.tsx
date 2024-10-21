// imports from vendors
import { FC, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';
import { Center, Flex } from '@chakra-ui/react';

// imports from constants
import { DAY_MONTH_NAMES, WEEK_DAY_NAMES, MONTHS_NAMES } from '../../../Constants/calendar';
import { m5 } from '../../../Constants/fonts';

// imports from types
import { BookedHoursStoreProps, LayoutsStoreProps } from '../../../Types/booking';
import { PluginStoreProps } from '../../../Types/plugin';

//import from utils
import { useMobxStore } from '../../../Utils/hooks';
import { addDictionary } from '../../../Utils/i18n';

type Props = {
  date: DateTime;
  short: boolean;
};

const DayHeader:FC<Props> = ({ date, short }) => {
  const { initLayouts, selected, layouts, setLayoutItem }: LayoutsStoreProps = useMobxStore('LayoutsStore');
  const { bookedHours, plugin }: BookedHoursStoreProps = useMobxStore('BookedHoursStore');
  const { pageConfig }: PluginStoreProps = useMobxStore('PluginStore');
  const { TranslateArr } = addDictionary(DAY_MONTH_NAMES);

  const [canBookDay, setCanBookDay] = useState(true);

  const weekEnd = (date.weekday === 6) || (date.weekday === 7);

  useEffect(() => {
    const layoutsId = `${plugin._id}-${date.toFormat('yyLdd')}`;
    const past = date.toMillis() < DateTime.now().toMillis();
    const forbidden = plugin?._id && layouts[layoutsId] && layouts[layoutsId][0]?.status === 'forbidden';

    setCanBookDay(!past && !forbidden && !bookedHours
      .some(({ from }) => from.toFormat('yyLdd') === date.toFormat('yyLdd')) &&
      !selected.some(({ from }) => from.toFormat('yyLdd') === date.toFormat('yyLdd')));
  }, [bookedHours.length, selected.length]);

  const handleDateClick = (date: DateTime) => {
    const { startTime, partsNumber, endTime } = pageConfig;
    const zero = { minute: 0, second: 0, millisecond: 0 };
    const from = date.set({ hour:startTime / partsNumber, ...zero });
    const to = date.set({ hour: endTime / partsNumber, ...zero });
    const id = from.toMillis().toString();
    setLayoutItem({
      from, to, _id: id, i: id, isSelected: true, y: 0, h: endTime - startTime, w: 1, x: 0,
      oldColor: 'bgSecondary', color: 'textSection',
    });
    initLayouts();
  };

  return (
    <Flex _hover={canBookDay ? { cursor: 'pointer', background: 'blue.50' } : { cursor: 'not-allowed' }}
      bg="bgTertiary" border="1px" borderColor="stroke" color={weekEnd && 'textSection'} justifyContent='center' 
      id="DayHeader" onClick={canBookDay ? () => handleDateClick(date) : null} suppressHydrationWarning w={short ? '70px' : 'auto'}>
      <Flex {...m5} flexDir={short ? 'column' : 'row'} mx={short ? 5 : 6} my={2}>
        <Center>{ TranslateArr(['day', WEEK_DAY_NAMES[date.weekday % 7]]) }</Center>
        <Center mx={2}>{ date.day }</Center>
        <Center>{ TranslateArr(['month', 'short', MONTHS_NAMES[date.month - 1]]) }</Center>
      </Flex>
    </Flex>
  );
};

export default observer(DayHeader);
