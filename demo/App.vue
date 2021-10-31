<template>
  <div>
    <h2>加载数据</h2>
    <CTable :columns="columns" :list="list.slice(0, 10)">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </CTable>
    <h2>显示翻页</h2>
    <CTable :columns="columns" :list="list" :pager-options="pagerOpts">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </CTable>
    <h2>部分列可排序，点击表头切换正序/逆序/恢复不排序状态</h2>
    <CTable :columns="sortColumns" :list="list" :pager-options="pagerOpts">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </CTable>
  </div>
</template>

<script lang="ts">
import { CTable } from '../src/table'
import { defineComponent, onMounted, reactive, watch, ref } from '@vue/composition-api'
import { Column, SortDirection } from '../src/table/types';

const data = Array.from({ length: 1000 }).map((_, idx) => ({
  name: `user${idx}`,
  age: Math.ceil(Math.random() * 100)
}));

export default defineComponent({
  name: 'App',
  components: {
    CTable,
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
        // sortDirection: SortDirection.asc
      }
    ]);
    let list = ref<{ name: string; age: number }[]>([]);
    const pagerOpts = reactive({
      limit: 15
    });

    onMounted(() => {
      list.value = data;

      setTimeout(() => {
        list.value[0].age = 120;
      });
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
