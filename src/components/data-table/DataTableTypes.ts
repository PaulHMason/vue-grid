export type Group = {
    isGroup: boolean,
    columnId: string,
    label: string,
    visualizer?: object,
    showDetail: boolean,
    path?: string,
    visible: boolean
}

export type GroupState = {
    group: object,
    showDetail: boolean
}

export type Column = {
    id: string,
    label?: string,
    field?: string,
    type: 'text' | 'number' | 'boolean' | 'date' | 'list' | 'action',
    hide?: boolean,
    formatFunction?: Function,
    freeze?: boolean,
    sortable?: boolean,
    sortFunction?: Function,
    visualizer?: object,
    actionLabel?: string,
    actionFunction?: Function,
    groupable?: boolean,
    grouped?: boolean,
    groupVisualizer?: object,
    summary?: 'sum' | 'custom',
    summaryFunction?: Function,
    filterable?: boolean,
    width?: string
}

export type ColumnFilter = {
    id: string,
    column: Column,
    value?: any,
    operator?: string
}

export type ColumnSizing = 'auto' | 'fixed' | 'resizable';

export const unsortableTypes = ['action', 'list', 'custom'];