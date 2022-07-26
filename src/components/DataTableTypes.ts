export type Group = {
    columnId: string,
    label: string,
    visualizer?: object
}

export type Column = {
    id: string,
    label?: string,
    field?: string,
    type: 'text' | 'number' | 'boolean' | 'action',
    freeze?: 'left' | 'right',
    sortable?: boolean,
    sort?: 'none' | 'asc' | 'desc',
    visualizer?: object,
    actionLabel?: string,
    actionFunction?: Function,
    groupable?: boolean,
    grouped?: boolean,
    groupVisualizer?: object
}