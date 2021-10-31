/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, provide, ref, watchEffect } from '@vue/composition-api';
import { TableDataType, tableProps } from './types';
import { TABLE_TOKEN } from './common/const';
import { CTableHeader } from './components/Header';
import { CTableBody } from './components/Body';
import { CPager } from './components/Pager';

import './common/table.less';
import { useProps } from './hooks/useProps';
import { useSortable } from './hooks/useSortable';
import { useDataStore } from './hooks/useDataStore';

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  setup(props, { slots }) {
    const { cols, list, pagerOpts } = useProps(props);
    const { sortColumn, sortByField } = useSortable(cols);
    const dataStoreContext = useDataStore({
      sortColumn,
      data: list,
      pagerOptions: pagerOpts,
    });

    const dataList = ref<TableDataType[]>([]);
    watchEffect(() => {
      dataList.value = dataStoreContext.getData();
    });

    const total = computed(() => dataStoreContext.getTotal());

    const jump = dataStoreContext.jump;

    provide(TABLE_TOKEN, {
      slots
    });

    return {
      // slots
      slots,

      // data
      cols,
      dataList,
      dataStore: dataStoreContext,

      // computed
      pagerOpts,
      sortColumn,
      total,

      // methods
      sortByField,
      jump
    };
  },

  render() {
    // 渲染表格头
    const header = <CTableHeader columns={this.cols} sortByField={this.sortByField} onSort={this.sortByField} sortColumn={this.sortColumn} />;

    // 渲染表格内容
    const body = <CTableBody columns={this.cols} list={this.dataList} />;

    // 渲染翻页器
    const pager = !this.pagerOpts?.hidePager ? <CPager {...{ attrs: this.pagerOpts }} total={this.total} onJump={this.jump} /> : '';

    return (
      <div class="c-table-wrapper">
        <table class="c-table" border={this.border}>
          {header}{body}
        </table>
        {pager}
      </div>
    );
  }
});
