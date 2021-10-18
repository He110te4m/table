import { mount, ThisTypedMountOptions } from '@vue/test-utils';
import { SortDirection } from '../table/types';
import Vue from 'vue';
import { TestTable } from '../table';

const columns = [
    {
        title: 'name',
        key: 'name',
        slot: 'nameContent',
        titleSlot: 'nameSlot',
        sortable: true
    },
    {
        title: 'age',
        key: 'age'
    }
];

describe('Table', () => {
    const TableMount = (options?: ThisTypedMountOptions<Vue>) => mount(TestTable, options);

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
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
        });
        expect(wrapper.html()).toMatchSnapshot();
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 18
                },
                {
                    name: '李四',
                    age: 20
                }
            ]
        });
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('showPager', async () => {
        const wrapper = TableMount();
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns,
            pagerOptions: {}
        });
        expect(wrapper.html()).toMatchSnapshot();

        await wrapper.setProps({
            pagerOptions: {
                total: 100,
                limit: 25,
                page: 1
            }
        });
        expect(wrapper.html()).toMatchSnapshot();

        const allPageItem = wrapper.findAll('.c-pager__item__no');
        expect(allPageItem).toBeTruthy();

        const [, secondItem] = allPageItem.wrappers;
        expect(secondItem).toBeTruthy();

        await secondItem.trigger('click');
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('sort', async () => {
        const wrapper = TableMount();
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
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
        expect(nameHeader.html()).toContain('table-sort-arrow');
        expect(nameHeader.html()).toMatchSnapshot();

        await nameHeader.trigger('click');
        expect(nameHeader.html()).not.toContain('table-sort-arrow');
        expect(nameHeader.html()).toMatchSnapshot();

        await nameHeader.trigger('click');
        expect(nameHeader.html()).toContain('table-sort-arrow');
        expect(nameHeader.html()).toMatchSnapshot();
    });

    test('default sort', async () => {
        const wrapper = TableMount();
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns: [
                {
                    title: 'name',
                    key: 'name',
                    slot: 'nameContent',
                    titleSlot: 'nameSlot',
                    sortable: true,
                    sortDirection: SortDirection.asc
                },
                {
                    title: 'age',
                    key: 'age'
                }
            ]
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
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
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

    test('title slot', async () => {
        const nameSlot = 'nameSlot';

        const wrapper = TableMount({
            slots: {
                nameSlot: nameSlot
            }
        });
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
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
                name: 'Name is {{ props.value }}'
            }
        });
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
        });
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('custom cell slot name', async () => {
        const wrapper = TableMount({
            scopedSlots: {
                nameContent: 'Name is {{ props.value }}'
            }
        });
        await wrapper.setProps({
            list: [
                {
                    name: '张三',
                    age: 14
                },
                {
                    name: '李四',
                    age: 16
                }
            ],
            columns
        });
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('data missing', async () => {
        const wrapper = TableMount({
            scopedSlots: {
                nameContent: 'Name is {{ props.value }}'
            }
        });
        await wrapper.setProps({
            list: [
                {
                    age: 14
                },
                {
                    name: '李四'
                }
            ],
            columns
        });
        expect(wrapper.html()).toMatchSnapshot();
    });
});
