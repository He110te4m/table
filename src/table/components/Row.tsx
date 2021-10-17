import { defineComponent, inject } from '@vue/composition-api';
import { TABLE_TOKEN } from '../const';
import { Column, pick, Slots, tableProps } from '../types';

function getRowHTML(column: Column, slots: Slots, data: Record<string, any>) {
  const val = data[column.key] ?? '';
  const params = {
      value: data[column.key],
      record: data
    };

  const content = column.slot && slots[column.slot]
    ? slots[column.slot]?.(params) ?? val
    : slots[column.key]
      ? slots[column.key]?.(params) ?? val
      :val;
  return <td>{content}</td>
}

export const CTableBody = defineComponent({
    name: 'CTableBody',
    props: pick(tableProps, ['columns', 'list']),
    setup() {
      const { slots = {} } = inject(TABLE_TOKEN) ?? {};

      return {
        slots
        // renderRowHTML: (column: Column, data: ValueOf<typeof list>) => getRowHTML(column, slots, data)
      };
    },
    render() {
      return <tbody>{this.list.map(data => <tr>{this.columns.map(column => getRowHTML(column, this.slots, data))}</tr>) ?? []}</tbody>;
    }
});
