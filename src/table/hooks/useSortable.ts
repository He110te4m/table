import { getCurrentInstance, ref, Ref, set, watch } from '@vue/composition-api';
import { error } from '../common/utils';
import { Column, SortDirection, TableDataType } from '../types';

export function useSortable(columns: Ref<Required<Column>[]>) {
  const vm = getCurrentInstance();

  /** 定义当前要排序的列 */
  const sortColumn = ref<Required<Column> | null>(null);

  /** 更新当前要排序的列 */
  const updateSortColumn = (key: string) => {
    sortColumn.value = columns.value.find((col) => col.key === key) ?? null;
  };

  const updateColumnSortState = () => {
    if (!sortColumn.value?.key) {
      return;
    }
    if (!sortColumn.value.sortable) {
      error(
        `Sorting function is not turned on for the ${sortColumn.value.title} column`
      );
      return;
    }

    set(sortColumn.value, 'sortDirection', getNextSortStatus(
      sortColumn.value.sortDirection
    ));

    vm?.emit('sort', sortColumn.value.key);
  };

  watch(sortColumn, () => {
    updateColumnSortState();
  });

  /** 排序时触发，对列头部做处理 */
  const sortByField = (key: string) => {
    const isSameKey = key === sortColumn.value?.key;
    if (isSameKey) {
      // 浅拷贝触发响应式更新
      sortColumn.value = sortColumn.value ? { ...sortColumn.value } : sortColumn.value;
    } else {
      updateSortColumn(key);
    }
  };

  return {
    sortColumn,
    sortByField,
  };
}

/** 数据排序 */
export function sortData<TRecord extends TableDataType>(
  list: TRecord[],
  sortColumn?: Ref<Column | null>
) {
  if (
    !sortColumn?.value?.key ||
    sortColumn.value.sortDirection === SortDirection.none ||
    !sortColumn.value.sortable
  ) {
    return list;
  }

  const { key: sortField } = sortColumn.value;
  const bit = sortColumn.value.sortDirection === SortDirection.asc ? 1 : -1;

  return (
    list
      .slice()
      .sort(
        (a, b) =>
          bit *
          String(a[sortField]).localeCompare(
            String(b[sortField]),
            'en',
            { numeric: true }
          )
      )
  );
}

/** 获取下一个排序状态 */
function getNextSortStatus(dir: SortDirection) {
  let nextDir = SortDirection.asc;
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

    /* istanbul ignore next */
    default:
      const n: never = dir;
      break;
  }
  return nextDir;
}
