// imports from vendors
import { FC, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react';

// imports from components
import RoomBookingDayGrid from './RoomBookingDayGrid/RoomBookingDayGrid';

// imports from types
import { LayoutsStoreProps } from '../../Types/booking';
import { MainConfigStoreProps } from '../../Types/mainConfig';

//import from utils
import { useMobxStore } from '../../Utils/hooks';
import { formDatesArray } from '../../Utils/layoutsAndDate';

// dynamic imports from local components
import DayHeader from './DayHeader/DayHeader';

type Props = {
  cells: string;
  days: number;
  firstDayDate: Date,
  isOwner: boolean;
};

const RoomBookingGrid: FC<Props> = ({ cells, firstDayDate, days, isOwner }) => {
  const { initLayouts, setDaysNumber, setStartDate }: LayoutsStoreProps = useMobxStore('LayoutsStore');
  const { isMobile }: MainConfigStoreProps = useMobxStore('MainConfigStore');

  useEffect(() => {
    setDaysNumber(days);
    setStartDate(firstDayDate);
    initLayouts();
  }, [days, firstDayDate]);

  const DAYS = formDatesArray(firstDayDate, days);
  const short = days > 7 || (isMobile && !isOwner);

  return (
    <Flex border="1px" borderColor="stroke" flexDir="row" id="RoomBookingGrid"
      overflow="auto" overflowY="hidden" rounded={!isMobile && 6} >
      { DAYS.map((day) => (
        <Flex flexDir="column" key={day.toString()} minW={short ? 70 : [125, 125, 154]} >
          <DayHeader date={day} short={short}/>
          <RoomBookingDayGrid cells={cells} date={day} short={short}/>
        </Flex>
      )) }
    </Flex>
  );
};

export default observer(RoomBookingGrid);
