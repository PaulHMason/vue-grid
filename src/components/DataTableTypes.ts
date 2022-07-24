export type Column = {
    id: string,
    label?: string,
    field?: string,
    type: 'text' | 'number' | 'boolean' | 'action',
    freeze?: 'left' | 'right',
    visualizer?: object,
    actionLabel?: string,
    actionFunction?: Function
}

export class DataGrouper {
    public maxLevel: number = 0;

    groupData(groups: Array<string>, data: any, columns: any, level: number) {
        //console.log(data);
        if (groups && groups.length > 0) {
            this.maxLevel = level;
            const column = columns.find((c: any) => c.id === groups[0]);

            if (column) {
                const id = column.id;
                const label = column.label;
                const field = column.field;

                data.forEach((item: any) => {
                    // If it has items, group them and replace the array.
                    const newItems: Array<any> = [];

                    if (item.__items && item.__items.length > 0) {
                        const unique = [...new Set(item.__items.map((i: any) => i[field]))];

                        unique.forEach((i: any) => {
                            newItems.push({
                                level: level,
                                label: `${label}: ${i}`,
                                __items: item.__items.filter((f: any) => f[field] === i),
                            });
                        });
                    }

                    if (groups.shift()) {
                        this.groupData([...groups], newItems, columns, level + 1);
                        /*
                        newItems.forEach((i: any) => {
                            console.log(i);
                            this.groupData([...groups], i, columns);
                        });
                        */
                    }

                    item.__items = newItems;
                });
            }
        }
    }
}
