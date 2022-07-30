export type Group = {
    isGroup: boolean,
    columnId: string,
    label: string,
    visualizer?: object,
    showDetail: boolean,
    path?: string
}

export type GroupState = {
    group: object,
    showDetail: boolean
}

export type Column = {
    id: string,
    label?: string,
    field?: string,
    type: 'text' | 'number' | 'boolean' | 'date' | 'action',
    formatFunction?: Function,
    freeze?: boolean,
    sortable?: boolean,
    visualizer?: object,
    actionLabel?: string,
    actionFunction?: Function,
    groupable?: boolean,
    grouped?: boolean,
    groupVisualizer?: object,
    summary?: 'sum' | 'custom',
    summaryFunction?: Function,
    filterable?: boolean
}