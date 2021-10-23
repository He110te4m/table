<template>
  <div>
    <h2>加载数据</h2>
    <TestTable :columns="columns" :list="list.slice(0, 10)">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </TestTable>
    <h2>显示翻页</h2>
    <TestTable :columns="columns" :list="list" :pager-options="pagerOpts">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </TestTable>
    <h2>部分列可排序，点击表头切换正序/逆序/恢复不排序状态</h2>
    <TestTable :columns="sortColumns" :list="list" :pager-options="pagerOpts">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, reactive } from '@vue/composition-api'
import { Column, SortDirection } from '../src/table/types';

const data = Array.from({ length: 1000 }).map((_, idx) => ({
  name: `user${idx}`,
  age: Math.ceil(Math.random() * 100)
}));

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const columns: Column[] = reactive([
      {
        title: 'name',
        key: 'name',
        titleSlot: 'nameSlot'
      },
      {
        title: 'age',
        key: 'age'
      }
    ]);
    const sortColumns: Column[] = reactive([
      {
        title: 'name',
        key: 'name',
        titleSlot: 'nameSlot'
      },
      {
        title: 'age',
        key: 'age',
        sortable: true,
        sortDirection: SortDirection.asc

      }
    ]);
    const list = reactive(data);
    const pagerOpts = reactive({
      limit: 15
    });

    return {
      columns,
      list,
      sortColumns,
      pagerOpts
     }
  },
})
</script>
