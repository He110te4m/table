import { computed, defineComponent, ref } from '@vue/composition-api';
import { pagerProps } from '../types';

function renderPage(pageList: number[], curPage: number, jumpFn: (page: number) => void) {
  return pageList.map(page => (
    <dd class="pager-no">
      {
        page === curPage
          ? <span class="pager-cur">{page}</span>
          : <a onClick={() => jumpFn(page)}>{page}</a>
      }
    </dd>
  ));
}

export const CPager = defineComponent({
  name: 'CPager',
  props: pagerProps,
  emits: [
    'jump'
  ],
  setup({ total, limit, page }, { emit }) {
    const pageCount = computed(() => Math.ceil(total / limit));
    const curPage = ref((page > 0 && page <= pageCount.value) ? Math.floor(page) : 1);
    const pageList = computed(() => Array.from({ length: pageCount.value }, (_, idx) => idx + 1));
    return {
      curPage,
      pageList,
      onPageChange: (page: number) => {
        curPage.value = page;
        emit('jump', page);
      }
    };
  },
  render() {
    return <dl class="pager">{renderPage(this.pageList, this.curPage, this.onPageChange)}</dl>;
  }
});
