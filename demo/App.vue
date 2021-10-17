<template>
  <div>
    <TestTable :columns="columns" :list="list" :pager-options="pagerOpts">
      <span slot="nameSlot">nameSlot</span>
      <span slot="name" slot-scope="{ value }">Name is {{ value }}</span>
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, reactive } from '@vue/composition-api'
import { Column } from '../src/table/types';

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
        titleSlot: 'nameSlot',
        sortable: true
      },
      {
        title: 'age',
        key: 'age'
      }
    ]);

    const list = reactive([
      {
        name: '张三',
        age: 14
      },
      {
        name: '李四',
        age: 16
      }
    ]);

    const pagerOpts = reactive({
      total: 100 // list.length
    });

    return {
      columns,
      list,
      pagerOpts
     }
  },
})
</script>
