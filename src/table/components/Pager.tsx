import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';
import { pagerProps } from '../types';

/** 渲染列表项 */
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

    /** 获取总页数 */
    const pageCount = computed(() => Math.ceil(total.value / limit.value));

    /** 获取当前页码 */
    const curPage = ref((page.value > 0 && page.value <= pageCount.value) ? Math.floor(page.value) : 1);

    /** 同时显示最多能显示多少项，会自动处理为奇数 */
    const maxPage = computed(() => maxShowPage.value % 2 === 1 ? maxShowPage.value : maxShowPage.value + 1);

    /** 页码显示时从哪一页开始显示 */
    const pageStart = computed(() => Math.max(
      // 最小不能小于 1
      1,
      Math.min(
        // 最大不能超过最后一页，+1 是为了显示自身
        pageCount.value - maxPage.value + 1,
        // 正常情况以当前页码为中位数，向两端取值
        curPage.value - Math.floor(maxPage.value / 2),
      )
    ));

    /** 生成需要渲染的页码列表，便于后面去循环 */
    const pageList = computed(() => Array.from({ length: Math.min(pageCount.value, maxPage.value) }, (_, idx) => idx + pageStart.value));

    /** 页码跳转函数 */
    const changePage = (page: number) => {
      curPage.value = page;
      emit('jump', page);
    };

    return {
      // data
      curPage,

      // computed
      pageCount,
      pageList,

      // methods
      changePage,
      goFirstPage: () => {
        emit('go-first-page');
        changePage(1);
      },
      goLastPage: () => {
        emit('go-last-page');
        changePage(pageCount.value);
      }
    };
  },
  render() {
    const hasPage = !!this.pageList.length;

    return (
      <dl class="c-pager">
        {
          hasPage && this.curPage !== 1
            ? <dd class="c-pager__item c-pager__go-first" onClick={this.goFirstPage}>
              <a class="c-pager__item__no">{'<<'}</a>
            </dd>
            : ''
        }
        {renderPage(this.pageList, this.curPage, this.changePage)}
        {
          hasPage && this.curPage < this.pageCount
            ? <dd class="c-pager__item c-pager__go-end" onClick={this.goLastPage}>
              <a class="c-pager__item__no">{'>>'}</a>
            </dd>
            : ''
        }
      </dl>
    );
  }
});
