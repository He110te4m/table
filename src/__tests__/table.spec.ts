import { mount, ThisTypedMountOptions } from '@vue/test-utils';
import Vue from 'vue';
import { TestTable } from '../table';

describe('Table', () => {
  const TableMount = (options?: ThisTypedMountOptions<Vue>) =>
    mount(TestTable, options);

  test('render', () => {
    const wrapper = TableMount();
    expect(wrapper.html()).toMatchSnapshot();
    expect(() => {
      wrapper.vm.$forceUpdate();
      wrapper.vm.$destroy();
    }).not.toThrow();
  });

  test('loadData', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list: [
        {
          name: '张三',
          age: 14,
        },
        {
          name: '李四',
          age: 16,
        },
      ],
      columns: [
        {
          title: 'name',
          key: 'name',
          titleSlot: 'nameSlot',
          sortable: true,
        },
        {
          title: 'age',
          key: 'age',
        },
      ],
    });
    expect(wrapper.html()).toMatchSnapshot();
    await wrapper.setProps({
      list: [
        {
          name: '张三',
          age: 18,
        },
        {
          name: '李四',
          age: 20,
        },
      ],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('usePager', async () => {})
});
