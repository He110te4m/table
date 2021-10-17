/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, provide, ref } from '@vue/composition-api'
import { pagerProps, SortDirection, tableProps } from './types'
import { TABLE_TOKEN } from './const';
import { CTableHeader } from './components/Header';
import { CTableBody } from './components/Row';
import { CPager } from './components/Pager';
import './table.less';

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  setup(props, { slots }) {
    provide(TABLE_TOKEN, {
      slots
    });

    const curPage = ref(1);

    return {
      curPage,
      sortField: ''
    }
  },

  render() {
    // 渲染表格头
    const { columns, list, pagerOptions = {}, border, defaultWidth, defaultHeight, curPage, sortField } = this;
    const { limit = pagerProps.limit.default } = pagerOptions;
    const onSort = (field: string) => {
      this.sortField = field;
    }
    const header = <CTableHeader columns={columns} onSort={onSort} />;

    // 渲染表格内容
    const sortColumn = computed(() => {
      return columns.find(col => col.key === sortField);
    });
    const recordList = computed(() => {
      if (!sortColumn.value || sortColumn.value.sortDirection === SortDirection.none || !sortColumn.value.sortable) {
        return list ?? [];
      }
      const bit = sortColumn.value.sortDirection === SortDirection.asc ? 1 : -1;

      return list?.slice().sort((a, b) => bit * (String(a[sortField]).localeCompare(String(b[sortField])))) ?? [];
    });
    const curPageDataList = computed(() => {
      return (recordList.value.slice((curPage - 1) * limit, limit) ?? []);
    });
    const body = <CTableBody columns={columns} list={curPageDataList.value} />;

    // 渲染翻页器
    const pager = <CPager {...{ attrs: pagerOptions }} page={curPage} onJump={(page: number) => {
      this.curPage = page;
    }} />

    return (
      <div class="c-table">
        <table border={border ?? true} style={`width: ${defaultWidth}; height: ${defaultHeight}`}>
          {header}{body}
        </table>
        {pager}
      </div>
    );
  }
})
