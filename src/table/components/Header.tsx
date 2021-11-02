import { Column, Slots, SortDirection } from '../types';

import { defineComponent, inject } from '@vue/composition-api';
import { TABLE_TOKEN } from '../common/const';

const sortArrowCls = 'table-sort-arrow';

/** 渲染表头标题内容 */
function getTitle(column: Required<Column>, slots: Slots) {
  const { title: val, titleSlot } = column;
  const header = slots[titleSlot]
    ? slots[titleSlot]!()
    : val;

  return <span class="c-table-header__item__text">{header}</span>;
}

/** 渲染表头排序图标 */
function getSort(key: string, sortColumn?: Required<Column> | null) {
  // 不是需要渲染的列，或者无需要排序列，直接返回
  if (key !== sortColumn?.key) {
    return '';
  }

  /** 原始顺序不显示排序图标，判断是否为原始顺序 */
  const isShowArrow = sortColumn.sortDirection !== SortDirection.none;
  /** 排序图标样式 */
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
      /** 表头单元格渲染函数 */
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
