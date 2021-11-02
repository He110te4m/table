import { defineComponent, inject } from '@vue/composition-api';
import { TABLE_TOKEN } from '../common/const';
import { Column, pick, Slots, tableProps } from '../types';

/** 表格单元格内容渲染函数 */
function getRowHTML(column: Required<Column>, slots: Slots, data: Record<string, any>) {
  /** 取出单元格内容 */
  const val = data[column.key] ?? '';
  /** 插槽的 slot-scope */
  const params = {
    value: data[column.key],
    record: data,
  };

  /** 生成渲染内容 */
  const content =
    slots[column.slot]
      ? slots[column.slot]!(params)
      : val;
  return <td class='c-table-body__row__cell'>{content}</td>;
}

export const CTableBody = defineComponent({
  name: 'CTableBody',
  props: {
    ...pick(tableProps, ['list']),
    columns: {
      type: Array as () => Required<Column>[],
      required: true as const
    }
  },
  setup() {
    const { slots } = inject(TABLE_TOKEN)!;

    return {
      slots,
    };
  },
  render() {
    return (
      <tbody class='c-table-body'>
        {this.list.map((data) => (
          <tr class='c-table-body__row'>
            {this.columns.map((column) => getRowHTML(column, this.slots, data))}
          </tr>
        ))}
      </tbody>
    );
  },
});
