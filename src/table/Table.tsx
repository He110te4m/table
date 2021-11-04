/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, provide, ref, watchEffect } from '@vue/composition-api';
import { TableDataType, tableProps } from './types';
import { TABLE_TOKEN } from './common/const';

import { CTableHeader } from './components/Header';
import { CTableBody } from './components/Body';
import { CPager } from './components/Pager';

import { useProps } from './composables/useProps';
import { useSortable } from './composables/useSortable';
import { useDataStore } from './composables/useDataStore';

import './common/table.less';

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  setup(props, { slots }) {
    // 取出属性值
    const { cols, list, pagerOpts } = useProps(props);
    // 排序
    const { sortColumn, sortByField } = useSortable(cols);
    // 数据加载
    const dataStoreContext = useDataStore({
      sortColumn,
      data: list,
      pagerOptions: pagerOpts,
    });

    /** 表格数据内容 */
    const dataList = ref<TableDataType[]>([]);
    watchEffect(() => {
      dataList.value = dataStoreContext.getData();
    });

    /** 数据总条数 */
    const total = computed(() => dataStoreContext.getTotal());

    /** 翻页功能 */
    const jump = dataStoreContext.jump;

    /** 传递插槽给子组件 */
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
    const body = this.dataList.length
      ? <CTableBody columns={this.cols} list={this.dataList} />
      : this.slots?.emptyData
        ? this.slots.emptyData()
        : <div class="c-table-empty"><div id="c-table-empty__text">空数据</div></div>;

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
