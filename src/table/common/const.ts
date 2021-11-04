import type { InjectionKey } from '@vue/composition-api';
import type { Slots } from '../types';

export const TABLE_TOKEN: InjectionKey<{ slots: Slots }> = Symbol('CTable');
