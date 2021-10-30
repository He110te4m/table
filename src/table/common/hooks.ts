import { Column, SortDirection } from '../types';

export function sortData<TRecord extends Record<string, unknown>>(list: TRecord[], sortColumn?: Column) {
    if (!sortColumn || sortColumn.sortDirection === SortDirection.none || !sortColumn.sortable) {
      return list ?? [];
    }

    const { key: sortField } = sortColumn;
    const bit = sortColumn.sortDirection === SortDirection.asc ? 1 : -1;

    return list?.slice().sort((a, b) => bit * (String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? '')))) ?? [];
}
