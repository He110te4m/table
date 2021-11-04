import { mount, ThisTypedMountOptions } from '@vue/test-utils';
import { Column, SortDirection } from '../table/types';
import Vue from 'vue';
import { CTable } from '../table';

const columns: Column[] = [
  {
    title: 'name',
    key: 'name',
    slot: 'nameContent',
    titleSlot: 'nameSlot',
    sortable: true,
    width: 200
  },
  {
    title: 'age',
    key: 'age',
  },
];

const dataLength = 100;
const dataLimit = 25;
const expectPage = Math.ceil(dataLength / dataLimit);
const list = Array.from({ length: dataLength }).map((_, idx) => ({
  name: `test ${(idx % 2 - 1) * idx}`,
  age: idx
}));

const shortList = [
  {
    name: '张三',
    age: 14,
  },
  {
    name: '李四',
    age: 16,
  },
];

const TableMount = (options?: ThisTypedMountOptions<Vue>) => {
  const { propsData = {}, ...rest } = options || {};
  return mount(CTable, { propsData: { columns, ...propsData }, ...rest });
};

describe('Table', () => {
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
      list: shortList,
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

  test('emptyData', async () => {
    const wrapper = TableMount();
    expect(wrapper).toMatchSnapshot();

    const emptyText = 'The data of table is empty';
    const emptySlotWrapper = TableMount({
      scopedSlots: {
        emptyData: () => <span>{emptyText}</span>
      },
    });
    expect(emptySlotWrapper.html()).toContain(emptyText);
  });

  test('data missing', async () => {
    const wrapper = TableMount({
      scopedSlots: {
        nameContent: ({ value }: { value: string; }) => <span>Name is {value}</span>,
      },
    });
    await wrapper.setProps({
      list: [
        {
          age: 14,
        },
        {
          name: '李四',
        },
      ],
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('slot', () => {
  test('title slot', async () => {
    const nameSlot = 'nameSlot';

    const wrapper = TableMount({
      slots: {
        nameSlot: nameSlot,
      },
    });
    await wrapper.setProps({
      list: shortList,
    });
    expect(wrapper.html()).toMatchSnapshot();

    const headerItems = wrapper.findAll('.c-table-header__item');
    expect(headerItems).toBeTruthy();
    const [nameHeader] = headerItems.wrappers;
    expect(nameHeader).toBeTruthy();

    expect(nameHeader.text()).toEqual(nameSlot);
  });

  test('cell slot', async () => {
    const wrapper = TableMount({
      scopedSlots: {
        name: ({ value }: { value: string; }) => <span>Name is {value}</span>
      },
    });
    await wrapper.setProps({
      list: shortList,
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('custom cell slot name', async () => {
    const wrapper = TableMount({
      scopedSlots: {
        nameContent: ({ value }: { value: string; }) => <span>Name is {value}</span>
      },
    });
    await wrapper.setProps({
      list: shortList,
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('sort', () => {
  test('sort', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list,
    });
    expect(wrapper.html()).toMatchSnapshot();

    const headerItems = wrapper.findAll('.c-table-header__item');
    expect(headerItems).toBeTruthy();
    const [nameHeader] = headerItems.wrappers;
    expect(nameHeader).toBeTruthy();

    await nameHeader.trigger('click');
    await wrapper.vm.$nextTick();
    expect(nameHeader.html()).toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();
    expect((wrapper.vm as unknown as { dataList: typeof list; }).dataList).not.toEqual(list);

    await nameHeader.trigger('click');
    await wrapper.vm.$nextTick();
    expect(nameHeader.html()).toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();
    expect((wrapper.vm as unknown as { dataList: typeof list; }).dataList).not.toEqual(list);

    await nameHeader.trigger('click');
    await wrapper.vm.$nextTick();
    expect(nameHeader.html()).not.toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();
    expect((wrapper.vm as unknown as { dataList: typeof list; }).dataList).toEqual(list);

    await nameHeader.trigger('click');
    expect(nameHeader.html()).toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();
  });

  test('default sort', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list: shortList,
      columns: [
        {
          title: 'name',
          key: 'name',
          slot: 'nameContent',
          titleSlot: 'nameSlot',
          sortable: true,
          sortDirection: SortDirection.asc,
        },
        {
          title: 'age',
          key: 'age',
        },
      ],
    });
    expect(wrapper.html()).toMatchSnapshot();

    const headerItems = wrapper.findAll('.c-table-header__item');
    expect(headerItems).toBeTruthy();
    const [nameHeader] = headerItems.wrappers;
    expect(nameHeader).toBeTruthy();

    await nameHeader.trigger('click');
    expect(nameHeader.html()).toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();

    await nameHeader.trigger('click');
    expect(nameHeader.html()).not.toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();

    await nameHeader.trigger('click');
    expect(nameHeader.html()).toContain('table-sort-arrow');
    expect(nameHeader.html()).toMatchSnapshot();
  });

  test('sort not sortable column', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list: shortList,
    });
    expect(wrapper.html()).toMatchSnapshot();

    const headerItems = wrapper.findAll('.c-table-header__item');
    expect(headerItems).toBeTruthy();
    const [, ageHeader] = headerItems.wrappers;
    expect(ageHeader).toBeTruthy();

    await ageHeader.trigger('click');
    expect(ageHeader.html()).not.toContain('table-sort-arrow');
    expect(ageHeader.html()).toMatchSnapshot();
  });
});

describe('hooks', () => {
  test('hooks: data store', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list,
      pagerOptions: {
        limit: -1,
        page: -1
      }
    });

    const store = (wrapper.vm as Record<string, any>).dataStore;

    expect(store.getLimit()).toBe(20);
    expect(store.getCurrentPage()).toBe(1);
    expect(store.getAllData()).toEqual(list);
    const curData = store.getData();
    store.jump(100);
    expect(store.getData()).toEqual(curData);
    expect(store.getData(100)).toEqual([]);
    expect(store.getData(-1)).toEqual([]);
    expect(store.getData(1.1)).toEqual([]);
    const newData = list.slice(2, 12);
    store.setData(newData);
    expect(store.getAllData()).toEqual(newData);
  });

  test('hooks: sortable', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list,
      pagerOptions: {
        limit: 10
      }
    });

    const vm: Record<string, any> = wrapper.vm;

    vm.sortByField('none');
    expect(vm.dataStore.getData()).toEqual(list.slice(0, 10));
    vm.sortByField('age');
    expect(vm.dataStore.getData()).toEqual(list.slice(0, 10));
  });
});

describe('pager', () => {
  test('render', async () => {
    const wrapper = TableMount();
    let allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(0);

    await wrapper.setProps({
      list,
      pagerOptions: {
        limit: dataLimit
      }
    });
    expect(wrapper.html()).toMatchSnapshot();

    // 处于第一页时，没有回到首页，所以这时候显示的翻页按钮数量为总页码 + 1
    allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(expectPage + 1);

    // 跳到第二页，此时就有回到首页按钮，所以显示的翻页按钮数量为总页码 + 2
    const [_1, secondPageButton] = allPageItem.wrappers;
    await secondPageButton.trigger('click');
    allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(expectPage + 2);

    // 取出到首页和到尾页按钮
    const [goFirstPageButton, __1, _2, _3, _4, goLastPageButton] = allPageItem.wrappers;
    expect(wrapper.html()).toMatchSnapshot();

    // 测试跳转到首页功能
    await goFirstPageButton.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
    allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(expectPage + 1);

    // 测试跳转到尾页功能
    await goLastPageButton.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
    allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(expectPage + 1);
  });

  test('pager\'s over limit options', async () => {
    const wrapper = TableMount();
    await wrapper.setProps({
      list,
      pagerOptions: {
        page: expectPage + 1,
        limit: dataLimit,
        maxShowPage: 6
      }
    });

    expect(wrapper.html()).toMatchSnapshot();
    const allPageItem = wrapper.findAll('.c-pager__item__no');
    expect(allPageItem.wrappers).toHaveLength(expectPage + 1);
  });
});
