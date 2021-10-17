import { Column, pick, Slots, SortDirection, tableProps } from '../types';

import { defineComponent, inject, set } from '@vue/composition-api';
import { TABLE_TOKEN } from '../const';

const sortArrowCls = 'table-sort-arrow';

function getTitle(column: Column, slots: Slots) {
  const { title: val, titleSlot } = column;
  const header = titleSlot && slots[titleSlot]
    ? slots[titleSlot]?.() ?? val
    : val;

  return <span>{header}</span>;
}

function getSort({ sortable, sortDirection }: Column) {
  const isShowArrow = !!sortable && !!sortDirection && sortDirection !== SortDirection.none;
  const sortCls = [SortDirection.asc, SortDirection.desc].includes(sortDirection!)
    ? sortDirection === SortDirection.asc
      ? `${sortArrowCls} asc`
      : `${sortArrowCls} desc`
    : '';

  return isShowArrow ? <span class={sortCls}></span> : '';
}

function getNextSortStatus(dir: SortDirection) {
  let nextDir = SortDirection.asc;;
  switch (dir) {
    case SortDirection.none:
      nextDir = SortDirection.asc;
      break;
    case SortDirection.asc:
      nextDir = SortDirection.desc;
      break;
    case SortDirection.desc:
      nextDir = SortDirection.none;
      break;

    default:
      const n: never = dir;
      break;
  }
  return nextDir;
}

function getColumnHTML(column: Column, slots: Slots, sortCallback: (field: string, dir: SortDirection) => void) {
  const header = getTitle(column, slots);
  const sort = getSort(column);
  const onClick = () => {
    if (!column.sortable) {
      return;
    }

    sortCallback(column.key, column.sortDirection!);
  }

  return <th onClick={onClick}>{header}{sort}</th>
}

export const CTableHeader = defineComponent({
    name: 'CTableHeader',
    props: pick(tableProps, ['columns']),
    setup(props, { emit }) {
      const { slots = {} } = inject(TABLE_TOKEN) ?? {};

      return {
        renderColumnHTML: (column: Column) => getColumnHTML(column, slots, (dir, field) => {
          set(column, 'sortDirection', getNextSortStatus(column.sortDirection!));
          emit('sort', dir, field);
        })
      }
    },
    render() {
      return <tr>{this.columns.map(this.renderColumnHTML)}</tr>
    }
});
