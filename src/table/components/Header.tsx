import { Column, Slots, SortDirection } from '../types';

import { defineComponent, inject } from '@vue/composition-api';
import { TABLE_TOKEN } from '../common/const';

const sortArrowCls = 'table-sort-arrow';

function getTitle(column: Required<Column>, slots: Slots) {
  const { title: val, titleSlot } = column;
  const header = slots[titleSlot]
    ? slots[titleSlot]!()
    : val;

  return <span class="c-table-header__item__text">{header}</span>;
}

function getSort(key: string, sortColumn?: Required<Column> | null) {
  if (!sortColumn || key !== sortColumn.key) {
    return '';
  }

  const isShowArrow = sortColumn.sortDirection !== SortDirection.none;
  const sortCls = [SortDirection.asc, SortDirection.desc].includes(sortColumn.sortDirection)
    ? sortColumn.sortDirection === SortDirection.asc
      ? `${sortArrowCls} asc`
      : `${sortArrowCls} desc`
    : '';

  return isShowArrow ? <span class={`${sortCls} c-table-header__item__icon`}></span> : '';
}

export const CTableHeader = defineComponent({
  name: 'CTableHeader',
  props: {
    columns: {
      type: Array as () => Required<Column>[],
      required: true as const
    },
    sortByField: {
      type: Function as unknown as () => ((key: string) => void),
      required: true as const
    },
    sortColumn: {
      type: Object as () => Required<Column> | null,
    }
  },
  setup(props) {
    const { slots } = inject(TABLE_TOKEN)!;

    return {
      renderColumnHTML: (column: Required<Column>) => {
        const header = getTitle(column, slots);
        const sort = getSort(column.key, props.sortColumn);
        const style = `width: ${column.width}`;
        const onSort = () => column.sortable && props.sortByField(column.key);
        return <th class="c-table-header__item" style={style} onClick={onSort}>{header}{sort}</th>;
      }
    };
  },
  render() {
    return <tr class="c-table-header">{this.columns.map(this.renderColumnHTML)}</tr>;
  }
});
