/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SetupContext } from '@vue/composition-api';

export type Slots = SetupContext['slots'];

type CSSLength =
  | number
  | 'auto'
  | `${number}${'%' | 'px' | 'em' | 'rem' | 'vw' | 'vh'}`;

export enum SortDirection {
  /** 从小到大排序 */
  asc = 'ASC',
  /** 从大到小排序 */
  desc = 'DESC',
  /** 不参与排序 */
  none = 'NONE'
};

export type Column = {
  /** 显示的标题文本 */
  title: string;
  /** 映射到数据源内的 key */
  key: string;
  /** 内容插槽名，默认为 key 的值 */
  slot?: string;
  /** 标题插槽名，默认不使用插槽 */
  titleSlot?: string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 当前的排序方向 */
  sortDirection?: SortDirection;
  /** 当前列宽 */
  width?: CSSLength;
};

export type TableDataType = Record<string, unknown>;

/** 提取部分 prop */
export function pick<TData extends TableDataType, TKey extends keyof TData>(
  data: TData,
  keys: TKey[]
): Pick<TData, TKey> {
    return ((Object.keys(data) as (keyof TData)[])
        .filter(key => (keys as (keyof TData)[]).includes(key)) as TKey[])
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {} as Pick<TData, TKey>);
};

/** 表格的 prop */
export const tableProps = {
  /** 显示表格边框 */
  border: {
    type: Boolean,
    default: true,
  },
  /** 数据源 */
  list: {
    type: Array as () => TableDataType[],
    default: () => [],
  },
  /** 列配置 */
  columns: {
    type: Array as () => Column[],
    required: true as const,
  },
  /** 分页配置 */
  pagerOptions: {
    type: Object as () => PagerPublicProps & { hidePager?: boolean },
  },
};

/** 翻页组件的 prop */
export const pagerProps = {
  /** 每页显示的数量 */
  limit: {
    type: Number,
    default: 20,
  },
  /** 总条数 */
  total: {
    type: Number,
    default: 0,
  },
  /** 当前页码 */
  page: {
    type: Number,
    default: 1,
  },
  /** 页码数量过多时，最多显示的页码数量 */
  maxShowPage: {
    type: Number,
    default: 7,
  },
};

/** 表格的 prop 类型 */
export type TablePublicProps = IxPublicPropTypes<typeof tableProps>;
/** 翻页组件的 prop 类型 */
export type PagerPublicProps = IxPublicPropTypes<typeof pagerProps>;
