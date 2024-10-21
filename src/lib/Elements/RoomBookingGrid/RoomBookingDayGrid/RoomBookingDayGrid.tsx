// imports from vendors
import { FC, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Flex, Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { DateTime } from 'luxon';

// imports from constants
import { STATUS } from '../../../Constants/bookings';
import { n5 } from '../../../Constants/fonts';

// imports from styles
import 'react-grid-layout/css/styles.css';

// imports from types
import { BookedHoursStoreProps, LayoutsStoreProps, LayoutItem } from '../../../Types/booking';
import { PluginStoreProps } from '../../../Types/plugin';
import { UserStoreProps } from '../../../Types/user';

//import from utils
import { useMobxStore } from '../../../Utils/hooks';

const ReactGridLayout = WidthProvider(RGL);

type Props = {
  cells: string;
  date: DateTime;
  short?: boolean;
};

const PluginBookingDayGrid: FC<Props> = ({ cells, date, short }) => {
  const { layouts, orderLayouts, removeSelectedById, setLayoutItem }: LayoutsStoreProps = useMobxStore('LayoutsStore');
  const { plugin, sortedBookedLayouts }: BookedHoursStoreProps = useMobxStore('BookedHoursStore');
  const { pageConfig }: PluginStoreProps = useMobxStore('PluginStore');
  const { user }: UserStoreProps = useMobxStore('UserStore');

  const [clickable, setClickable] = useState(true);

  const layoutsId = `${plugin._id}-${date.toFormat('yyLdd')}`;
  const initLayouts = layouts ? layouts[layoutsId] : [];

  const isItemOwner = (item: LayoutItem) => item?.requestedById === user._id || user.admin;

  const bgColor = (item: LayoutItem) => {
    if (item.isSelected) return item.color;
    return item.status === STATUS.approved && isItemOwner(item) ? STATUS.approved : item.color;
  };

  const forbidSelect = (item: LayoutItem) => item.status === 'forbidden' || !isItemOwner(item) &&
    (item.status === STATUS.approved || item.past);

  const gridProps = {
    allowOverlap: true,
    cols: 1,
    compactType: null,
    isBounded: true,
    isDraggable: false,
    isResizable: false,
    margin: [0, 0],
    maxRows: pageConfig.endTime - pageConfig.startTime,
    preventCollision: true,
    resizeHandles: ['s'],
    rowHeight: 40 / pageConfig.partsNumber,
    useCSSTransforms: false,
  };

  const { startTime, endTime, partsNumber } = pageConfig;
  const maxRows = endTime - startTime;

  const isTime = cells === 'time';

  const itemColor = (item: LayoutItem) => {
    let color = 'textSecondary';
    if (item.isSelected) color = 'textInverse';
    if (item.static) color = 'gray.800';
    if (item.past) color = 'bgTertiary';
    return color;
  };

  const getResizeMaxH = (inY: number) => sortedBookedLayouts
    .find((item) => item.from.toFormat('yyLdd') === date.toFormat('yyLdd') && item.y > inY)?.y - inY || maxRows - inY;

  const handleChangeStop = (_, oldPos, newPos) => {
    const result = initLayouts.map((item) => (item.i === newPos.i
      ? { ...item, ...newPos, maxH: getResizeMaxH(newPos.y) }
      : item));
    orderLayouts(layoutsId, result, newPos, oldPos);
    setClickable(false); setTimeout(() => setClickable(true), 200);
  };

  const onItemClick = (cellItem : LayoutItem) => {
    if (!clickable || forbidSelect(cellItem)) return;
    setClickable(false); setTimeout(() => setClickable(true), 200);
    if (cellItem.isSelected) {
      const newItem = {
        ...cellItem, isSelected: false, isResizable: false,
        h: cellItem.status === STATUS.request || cellItem.status === STATUS.approved ? cellItem.h : partsNumber,
        isDraggable: false, color: cellItem.oldColor || 'requested',
      };
      const result = initLayouts.map((item) => (item.i === newItem.i ? { ...item, ...newItem } : item));
      removeSelectedById(cellItem._id);
      return orderLayouts(layoutsId, result, newItem);
    }

    if (cellItem.status === STATUS.approved || cellItem.status === STATUS.request)
      return setLayoutItem(
        {
          ...cellItem, isSelected: true, oldColor: cellItem.color, color: 'textSection',
        }
      );

    return setLayoutItem(
      {
        ...cellItem, isResizable: !cellItem.past && true, isSelected: true, oldColor: cellItem.color,
        maxH: getResizeMaxH(cellItem.y), isDraggable: !cellItem.past && true, color: 'textSection',
      }
    );
  };

  const onItemTouch = (cellItem : LayoutItem) => {
    if (!clickable || !cellItem.isDraggable) return;
    setClickable(false); setTimeout(() => setClickable(true), 200);
    const newItem = {
      ...cellItem, isSelected: false, isResizable: false,
      h: (cellItem.status === STATUS.request || cellItem.status === STATUS.approved) ? cellItem.h : partsNumber,
      isDraggable: false, color: cellItem.oldColor || 'requested',
    };
    const result = initLayouts.map((item) => (item.i === newItem.i ? { ...item, ...newItem } : item));
    return orderLayouts(layoutsId, result, newItem);
  };

  return (
    <Box bg="bgSecondary" id="PluginBookingDayGrid" w="100%" >
      <ReactGridLayout {...gridProps} layout={initLayouts} onDragStop={handleChangeStop} onResizeStop={handleChangeStop} >
        { initLayouts?.map((item) => (
          <Flex _last={{ borderBottom: 'none' }} alignItems="center" bg={bgColor(item)} border="1px"
            borderColor="stroke" cursor={forbidSelect(item) ? 'not-allowed' : 'pointer'} data-grid={item} justifyContent="center"
            key={item.i} onClick={() => onItemClick(item)} onTouchEndCapture={() => onItemTouch(item)} >
            <Text {...n5} color={itemColor(item)} m="0 !important" overflow="hidden" px={short ? 3 : !isTime ? 1 : [4, 4, 6]}
              textOverflow="ellipsis" userSelect="none" whiteSpace="nowrap">
              { isTime ? item.label : item?.requestedBy || item.label }
            </Text>
          </Flex>
        )) }
      </ReactGridLayout>
    </Box>
  );
};

export default observer(PluginBookingDayGrid);
