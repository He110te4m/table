import { defineComponent, inject } from "@vue/composition-api";
import { TABLE_TOKEN } from "../common/const";
import { Column, pick, Slots, tableProps } from "../types";

function getRowHTML(column: Column, slots: Slots, data: Record<string, any>) {
  const val = data[column.key] ?? "";
  const params = {
    value: data[column.key],
    record: data,
  };

  const content =
    column.slot && slots[column.slot]
      ? slots[column.slot]!(params)
      : slots[column.key]
        ? slots[column.key]!(params)
        : val;
  return <td class="c-table-body__row__cell">{content}</td>;
}

export const CTableBody = defineComponent({
  name: "CTableBody",
  props: pick(tableProps, ["columns", "list"]),
  setup() {
    const { slots } = inject(TABLE_TOKEN) ?? {};

    return {
      slots,
    };
  },
  render() {
    return (
      <tbody class="c-table-body">
        {this.list.map((data) => (
          <tr class="c-table-body__row">
            {this.columns.map((column) => getRowHTML(column, this.slots, data))}
          </tr>
        ))}
      </tbody>
    );
  },
});
