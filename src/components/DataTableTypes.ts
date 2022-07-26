
export type Group = {
    columnId: string,
    label: string,
    sortable?: boolean,
    sort?: 'none' | 'asc' | 'desc',
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
    groupVisualizer?: object,
    groupSortable?: boolean,
    groupSort?: 'none' | 'asc' | 'desc',
}

export class DataGrouper {
    public maxLevel: number = 0;

    private createSortFunction(field: any, direction: 'none' | 'asc' | 'desc') {
        switch (direction) {
            case 'asc': {
                return (a: any, b: any) => {
                    if (a[field] < b[field]) {
                        return -1;
                    }

                    if (a[field] > b[field]) {
                        return 1;
                    }

                    return 0;
                }
            }

            case 'desc': {
                return (a: any, b: any) => {
                    if (a[field] > b[field]) {
                        return -1;
                    }

                    if (a[field] < b[field]) {
                        return 1;
                    }

                    return 0;
                }
            }

            default: {
                return (a: any, b: any) => {
                    return 0;
                }
            }
        }
    }

    public sortData(data: Array<Group>, by: Column, direction: 'none' | 'asc' | 'desc') {
        if (direction === 'none') return;

        if (data && data.length > 0) {
            if ((data[0] as any).__items) {
                data.forEach((item: any) => {
                    this.sortData(item.__items, by, direction);
                });
            } else {
                
                data = data.sort(this.createSortFunction(by.field, direction));
            }
        }
    }

    public groupData(groups: Array<Group>, data: any, columns: any, level: number) {
        if (groups && groups.length > 0) {
            this.maxLevel = level;
            const group = groups[0];
            const column = columns.find((c: any) => c.id === group.columnId);
            const visualizer = group.visualizer;
            const sortOrder = group.sortable ? group.sort : 'none';

            if (column) {
                const field = column.field;

                data.forEach((item: any) => {
                    let newItems: Array<any> = [];

                    if (item.__items && item.__items.length > 0) {
                        const unique = [...new Set(item.__items.map((i: any) => i[field]))];

                        unique.forEach((i: any) => {
                            newItems.push({
                                level: level,
                                value: i,
                                column: column,
                                visualizer: visualizer,
                                __items: item.__items.filter((f: any) => f[field] === i),
                            });
                        });
                    }

                    newItems = newItems.sort(this.createSortFunction('value', (sortOrder as any)));

                    if (groups.shift()) {
                        this.groupData([...groups], newItems, columns, level + 1);
                    }

                    item.__items = newItems;
                });
            }
        }
    }
}
