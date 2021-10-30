/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, provide, reactive, ref, toRefs } from '@vue/composition-api';
import { pagerProps, SortDirection, tableProps } from './types';
import { TABLE_TOKEN } from './common/const';
import { CTableHeader } from './components/Header';
import { CTableBody } from './components/Body';
import { CPager } from './components/Pager';
import { sortData } from './common/hooks';

import './common/table.less';

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  setup(props, { slots, emit }) {
    provide(TABLE_TOKEN, {
      slots
    });

    const { columns } = toRefs(props);

    const curPage = ref(1);
    const sortField = ref(columns.value.find(/* istanbul ignore next */ col => !!col.sortable && col.sortDirection !== SortDirection.none)?.key ?? '');

    const sortColumn = computed(() => {
      return columns.value.find(col => col.key === sortField.value);
    });

    const sortByField = (field: string) => {
      sortField.value = field;
      const dir = sortColumn.value?.sortDirection ?? SortDirection.none;
      emit('sort', field, dir);
      // log(`on sort in ${field} at ${dir}`);
    };
    const jumpPage = (page: number) => {
      const oldPage = curPage.value;
      curPage.value = page;
      emit('jump', page, oldPage);
      // log(`jump page to ${page} from ${oldPage}`);
    }

    return {
      // slots
      slots,

      // data
      curPage,

      // computed
      sortColumn,

      // methods
      sortByField,
      jumpPage
    };
  },

  render() {
    // 解构需要的数据出来
    const { columns, list, pagerOptions, border, curPage, sortColumn } = this;
    const { limit = pagerProps.limit.default } = pagerOptions ?? {};

    // 渲染表格头
    const header = <CTableHeader columns={columns} onSort={this.sortByField} />;

    // log(`render header with ${JSON.stringify(titleParams)}`);

    // 计算排序
    const recordList = computed(() => {
      return sortData(list, sortColumn);
    });

    // 计算翻页
    const curPageDataList = computed(() => {
      const lastIndex = curPage * limit;
      return !pagerOptions ? recordList.value : (recordList.value.slice(lastIndex - limit, lastIndex) ?? []);
    });

    // 渲染表格内容
    const body = <CTableBody columns={columns} list={curPageDataList.value} />;

    // log(`render table body with ${JSON.stringify(bodyParams)}`);

    // 计算翻页器参数
    const pagerParams = reactive({
      ...pagerOptions,
      total: pagerOptions?.total ?? list.length,
      page: curPage
    });

    // 渲染翻页器
    const pager = <CPager {...{ attrs: pagerParams }} onJump={this.jumpPage} />;

    if (pagerOptions) {
      // log(`render pager with ${JSON.stringify(pagerParams)}`)
    }

    return (
      <div class="c-table-wrapper">
        <table class="c-table" border={border}>
          {header}{body}
        </table>
        {pager}
      </div>
    );
  }
});
