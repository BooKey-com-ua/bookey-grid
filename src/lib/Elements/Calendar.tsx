// import from vendors
import React, { FC, MouseEvent } from 'react';
import { Flex, Button, Box, IconButton } from '@chakra-ui/react';
import { useDayzed } from 'dayzed';

// imports from constants
import { DAY_MONTH_NAMES, WEEK_DAY_NAMES, MONTHS_NAMES } from '../Constants/calendar';

// import from icons
import { ChevronLeft, ChevronRight } from '../Constants/icons';

type NewDateProps = {
  date: Date,
  selectable: boolean,
  selected: boolean,
};

type Props = {
  blockDaysClick?: boolean,
  disabled?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  lang: string,
  minDate?: Date,
  onDateSelected?: (newDate: NewDateProps, e: MouseEvent) => void,
  onOffsetChanged?: (offset: number) => void,
  selected?: Date,
  selectedDates?: Date[],
  showOutsideDays?: boolean,
};

export const Calendar: FC<Props> = ({
  blockDaysClick,
  disabled,
  firstDayOfWeek,
  lang = 'en',
  minDate,
  onDateSelected = () => null,
  onOffsetChanged = () => null,
  selected,
  selectedDates = null,
  showOutsideDays = true,
}) => {
  const { calendars, getBackProps, getForwardProps, getDateProps } =
    useDayzed({
      firstDayOfWeek, minDate, onDateSelected, onOffsetChanged, selected, showOutsideDays,
    });

  const renderDayNames = () => {
    const newWeek = WEEK_DAY_NAMES.map((_, index) => WEEK_DAY_NAMES[(index + firstDayOfWeek) % 7]);
    return newWeek.map((weekday) => (
      <Box display="inline-block" fontSize={['xs', 'xs', 'sm']} fontWeight={500} key={weekday}
        mb={[2, 2, 6]} textAlign="center" w="calc(100% / 7)">
        { DAY_MONTH_NAMES[lang].day[weekday] }
      </Box>
    ));
  };

  return (
    <Flex alignItems="center" bg="bgSecondary" border="1px" borderColor="stroke" flexDir="column" id="Calendar"
      justifyContent="space-around" maxW={[208, 208, 288]} minW={[208, 208, 288]} p={[3, 3, 6]} rounded={4} >
      { calendars.map((calendar) => (
        <Flex display="inline-block" key={`${calendar.month}${calendar.year}`} >
          <Flex alignItems="center" fontSize={['sm', 'sm', 'md']} fontWeight={500} mb={[2, 2, 6]} justifyContent="space-between" >
            <Flex ml={1}> { DAY_MONTH_NAMES[lang].month.longer[MONTHS_NAMES[calendar.month]] } { calendar.year } </Flex>
            {!disabled && (
              <Flex>
                <IconButton aria-label="month-back" icon={<ChevronLeft />}
                  size={['xs', 'xs', 'sm']} variant="link" {...getBackProps({ calendars })} />
                <IconButton aria-label="month-fwd" icon={<ChevronRight />}
                  size={['xs', 'xs', 'sm']} variant="link" {...getForwardProps({ calendars })}/>
              </Flex>
            )}
          </Flex>
          { renderDayNames() }
          { calendar.weeks.map((week, weekIndex) =>
            week.map((dateObj, index) => {
              const key = `${calendar.month}${calendar.year}${weekIndex}${index}`;

              if (!dateObj) return <Box display="inline-block" key={key} textAlign="center" w="calc(100% / 7)" />;

              const { date, selected, today } = dateObj;

              const isSelected = selectedDates?.some((_date) => _date.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0));

              const otherMonth = date.getMonth() != calendar.month;

              const color = (selected || isSelected) ? 'bgPrimary' : otherMonth && 'textPlaceholder';

              return (
                <Button {...getDateProps({ dateObj })} bg={(selected || isSelected) && 'textSection'}
                  border={today && '1px solid grey'} color={color} key={key} m="1px" rounded={8} size={['xs', 'xs', 'sm']}
                  variant={blockDaysClick ? 'none' : 'ghost'} w="calc(100%/7 - 2px)" p="1px">
                  { date.getDate() }
                </Button>
              );
            })) }
        </Flex>
      )) }
    </Flex>
  );
};

export default Calendar;
