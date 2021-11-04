import {
  Column,
  PagerPublicProps,
  SortDirection,
  TableDataType,
} from '../types';

import {
  computed,
  getCurrentInstance,
  ref,
  Ref,
  watch,
  watchEffect,
} from '@vue/composition-api';
import { error } from '../common/utils';
import { sortData } from './useSortable';

interface DataStoreContext {
  sortColumn: Ref<Column | null>;
  data: Ref<TableDataType[]>;
  pagerOptions: Ref<Required<PagerPublicProps> & { hidePager: boolean }>;
}

/** 分页数据管理 */
export function useDataStore({
  sortColumn,
  pagerOptions,
  data,
}: DataStoreContext) {
  /** 保存表格数据 */
  let storeData = ref<TableDataType[]>(data.value);

  /** 计算排序后的表格数据 */
  const currentData = computed(() =>
    sortColumn.value?.sortDirection === SortDirection.none
      ? storeData.value
      : sortData(storeData.value, sortColumn)
  );

  /** 每页显示多少条记录 */
  let storeLimit = ref(pagerOptions.value.limit || 20);

  /** 总共有多少记录 */
  const storeTotal = computed(
    () => pagerOptions.value.total || storeData.value.length
  );

  /** 总页数 */
  const totalPage = computed(() =>
    Math.ceil(storeTotal.value / storeLimit.value)
  );

  /** 检查数字是否为正整数 */
  const checkNumber = (num: number): num is number => {
    if (num <= 0 || String(num).includes('.')) {
      error(
        `${num} is invalid! `,
        'Please modify the num value to be a positive integer'
      );
      return false;
    }
    return true;
  };

  /** 检查页码，必须为正整数，并且小于总页数 */
  const checkPage = (page: number): page is number => {
    if (!checkNumber(page)) {
      return false;
    }

    if (totalPage.value && page > totalPage.value) {
      error(
        'The page number exceeds the maximum number of pages.',
        'Please check the page number'
      );
      return false;
    }

    return true;
  };

  /** 当前页码 */
  let storePage = ref(
    checkPage(pagerOptions.value.page) ? pagerOptions.value.page : 1
  );

  /** vue 实例，用于 emit */
  const vm = getCurrentInstance();

  /** 动态更新 limit */
  watchEffect(() => {
    if (pagerOptions.value.limit && checkNumber(pagerOptions.value.limit)) {
      storeLimit.value = pagerOptions.value.limit;
    }
  });

  /** 动态更新 data */
  watch(data, () => {
    storeData.value = data.value;
  });

  return {
    /** 更新表格数据 */
    setData: (data: TableDataType[]) => {
      storeData.value = data;
    },

    /** 更新表格每页显示的数量 */
    getLimit: () => {
      return storeLimit.value;
    },

    /** 获取表格总页数 */
    getTotal: () => {
      return storeTotal.value;
    },

    /** 获取当前页码 */
    getCurrentPage: () => {
      return storePage.value;
    },

    /** 获取表格全部数据 */
    getAllData: () => {
      return currentData.value;
    },

    /** 数据翻页 */
    jump: (page: number) => {
      if (!checkPage(page)) {
        return;
      }
      const oldPage = storePage.value;
      storePage.value = page;
      vm?.emit('jump', page, oldPage);
    },

    /** 获取指定页码的数据，默认获取当前页数据 */
    getData: (page = storePage.value) => {
      if (pagerOptions.value.hidePager) {
        return currentData.value;
      }

      if (!checkPage(page)) {
        return [];
      }

      const start = (page - 1) * storeLimit.value;
      const end = start + storeLimit.value;

      return currentData.value.slice(start, end);
    },
  };
}
