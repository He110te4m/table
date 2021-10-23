import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';
import { pagerProps } from '../types';

function renderPage(pageList: number[], curPage: number, jumpFn: (page: number) => void) {
  return pageList.map(page => {
    const isCurPage = page === curPage;
    const cls = ['c-pager__item', isCurPage ? 'c-pager__item--current' : ''].join(' ');
    return (
      <dd class={cls}>
        {
          isCurPage
            ? <span class="c-pager__item__no">{page}</span>
            : <a class="c-pager__item__no" onClick={() => jumpFn(page)}>{page}</a>
        }
      </dd>
    );
  });
}

export const CPager = defineComponent({
  name: 'CPager',
  props: pagerProps,
  emits: [
    'jump'
  ],
  setup(props, { emit }) {
    const { total, limit, page, maxShowPage } = toRefs(props);
    const pageCount = computed(() => Math.ceil(total.value / limit.value));
    const curPage = ref((page.value > 0 && page.value <= pageCount.value) ? Math.floor(page.value) : 1);

    const maxPage = computed(() => maxShowPage.value % 2 === 1 ? maxShowPage.value : maxShowPage.value + 1);
    const pageStart = computed(() => Math.max(curPage.value - Math.floor(maxPage.value / 2), 1));
    const pageList = computed(() => Array.from({ length: Math.min(pageCount.value, maxPage.value) }, (_, idx) => idx + pageStart.value));

    const changePage = (page: number) => {
      curPage.value = page;
      emit('jump', page);
    };

    return {
      // data
      curPage,

      // computed
      pageList,

      // methods
      changePage,
      goFirstPage: () => {
        emit('go-first-page');
        if (curPage.value !== 1) {
          changePage(1);
        }
      },
      goLastPage: () => {
        emit('go-last-page');
        if (curPage.value !== pageCount.value) {
          changePage(pageCount.value);
        }
      }
    };
  },
  render() {
    return (
      <dl class="c-pager">
        <dd class="c-pager__item c-pager__go-first" onClick={this.goFirstPage}>
          <a class="c-pager__item__no">{'<<'}</a>
        </dd>
        {renderPage(this.pageList, this.curPage, this.changePage)}
        <dd class="c-pager__item c-pager__go-end" onClick={this.goLastPage}>
          <a class="c-pager__item__no">{'>>'}</a>
        </dd>
      </dl>
    );
  }
});
