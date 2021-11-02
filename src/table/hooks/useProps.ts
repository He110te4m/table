import {
  PagerPublicProps,
  TablePublicProps,
  Column,
  SortDirection,
} from '../types';

import { computed, ComputedRef, Ref } from '@vue/composition-api';

/** 统一处理 props */
export function useProps(props: TablePublicProps) {
  /** 返回具有完整字段的 column 数组，避免后面需要响应式丢失问题 */
  const cols: ComputedRef<Required<Column>[]> = computed(() =>
    props.columns.map((col): Required<Column> => {
      return {
        title: col.title,
        key: col.key,
        slot: col.slot ?? col.key,
        titleSlot: col.titleSlot ?? col.key,
        sortable: !!col.sortable,
        sortDirection: col.sortDirection ?? SortDirection.none,
        width:
          typeof col.width === 'number'
            ? `${col.width}px`
            : col.width ?? 'auto',
      };
    })
  );

  /** 返回具有全部字段的翻页属性，避免后续出现响应式问题 */
  const pagerOpts = computed(() =>
    Object.assign(
      {
        hidePager: !props.pagerOptions,
        total: 0,
        page: 1,
        limit: 20,
        maxShowPage: 7,
      },
      props.pagerOptions
    )
  );

  /** 处理数据，至少为空数组，后面好处理响应式问题 */
  const data = computed(() => {
    return !props.list ? [] : props.list;
  });

  return {
    cols,
    list: data,
    pagerOpts: pagerOpts as Ref<
      Required<PagerPublicProps> & { hidePager: boolean }
    >,
  };
}
