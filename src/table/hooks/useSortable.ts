import { getCurrentInstance, ref, Ref, watch } from '@vue/composition-api';
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

  /** 更新排序列的状态 */
  const updateColumnSortState = () => {
    // 排序列不存在则直接结束
    if (!sortColumn.value?.key) {
      return;
    }
    // 排序列不可排序，报错并结束
    if (!sortColumn.value.sortable) {
      error(
        `Sorting function is not turned on for the ${sortColumn.value.title} column`
      );
      return;
    }

    // 更新排序列的排序状态
    sortColumn.value.sortDirection = getNextSortStatus(
      sortColumn.value.sortDirection
    );

    // 冒出排序事件
    vm?.emit('sort', sortColumn.value.key);
  };

  // 排序列变化时，更新排序状态
  watch(sortColumn, () => {
    updateColumnSortState();
  });

  /** 排序时触发，对列头部做处理 */
  const sortByField = (key: string) => {
    const isSameKey = key === sortColumn.value?.key;
    if (isSameKey) {
      // 浅拷贝触发响应式更新
      sortColumn.value = sortColumn.value
        ? { ...sortColumn.value }
        : sortColumn.value;
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
  // 没有排序列，或者排序方式为原始排序，或者排序列不可排序，则返回原数据
  if (
    !sortColumn?.value?.key ||
    sortColumn.value.sortDirection === SortDirection.none ||
    !sortColumn.value.sortable
  ) {
    return list;
  }

  const { key: sortField } = sortColumn.value;
  /** 根据正序与逆序算出排序方式，正序为 1，逆序为 -1 */
  const bit = sortColumn.value.sortDirection === SortDirection.asc ? 1 : -1;

  return list
    .slice()
    .sort(
      (a, b) =>
        bit *
        String(a[sortField]).localeCompare(String(b[sortField]), 'en', {
          numeric: true,
        })
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

    // 此处仅作为排序状态新增时的报错，如后续枚举内新增自定义排序，此处会报错，提示此处需要修改，故排除单测覆盖
    /* istanbul ignore next */
    default:
      const n: never = dir;
      break;
  }
  return nextDir;
}
