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
  sortable?: boolean;
  sortDirection?: SortDirection;
};

export function pick<TData extends object, TKey extends keyof TData>(
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

export const tableProps = {
  /** 显示表格边框 */
  border: {
    type: Boolean,
    default: true
  },
  /** 数据源 */
  list: {
    type: Array as () => Record<string, any>[],
    default: () => [],
  },
  /** 列配置 */
  columns: {
    type: Array as () => Column[],
    default: () => [],
  },
  /** 表格宽度 */
  defaultWidth: {
    type: [String, Number] as (() => CSSLength)[],
    default: 'auto',
  },
  /** 表格高度 */
  defaultHeight: {
    type: [String, Number] as (() => CSSLength)[],
    default: 'auto',
  },
  /** 分页配置 */
  pagerOptions: {
    type: Object as () => PagerPublicProps,
    default: () => ({}),
  },
};

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
    default: 1
  }
};

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>;
export type PagerPublicProps = IxPublicPropTypes<typeof pagerProps>;
