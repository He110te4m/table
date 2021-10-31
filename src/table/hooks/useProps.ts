import {
  PagerPublicProps,
  TablePublicProps,
  Column,
  SortDirection,
} from '../types';

import { computed, ComputedRef, Ref } from '@vue/composition-api';

/** 统一处理 props */
export function useProps(props: TablePublicProps) {
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
