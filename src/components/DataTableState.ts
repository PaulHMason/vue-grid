import type { Column, Group } from './DataTableTypes.js';

type SelectionMode = 'none' | 'single' | 'multiple';

export class DataTableState {
    private stateUpdated: Function | null = null;
    public rows: Array<object> = [];
    public columns: Array<Column> = [];
    public groupOrder: Array<string> = [];
    public groups: Array<any> = [];
    public openGroups: Array<any> = [];
    public groupBy: Array<Group> = [];
    public maxLevel: number = 0;
    public supportGrouping: boolean = false;
    public openGroup: string = '';
    public selectionMode: SelectionMode = 'none';
    public selectionState: 'none' | 'some' | 'all' = 'none';

    constructor(columns: Array<Column>, rows: Array<object>, groupOrder: Array<string>, openGroup: string, selectionMode: SelectionMode, stateUpdated: Function) {
        this.columns = columns;
        this.rows = rows;
        this.groupOrder = groupOrder;
        this.openGroup = openGroup;
        this.selectionMode = selectionMode;
        this.stateUpdated = stateUpdated;

        this.updateGroupBy();
        this.updateOpenGroups();
        this.updatesSupportGrouping();
        this.updateGroups();
        this.updateSelectionState();
    }

    /* PUBLIC */
    public sort(columnId: string) {
        const column = this.getColumn(columnId);

        if (column && column.sortable) {
            if (column.sort) {
                column.sort = (column.sort === 'asc') ? 'desc' : 'asc';
            } else {
                column.sort = 'asc';
            }
            this.sortData(this.rows, column);
            this.updateGroups();
            this.internalStateUpdated();
        }
        
    }

    public toggleAllRows(selected: boolean) {
        this.rows.forEach((row: any) => row.selected = selected);
        this.updateSelectionState();
        this.internalStateUpdated();
    }

    public toggleSingleRow(selected: boolean, id: string) {
        const row: any = this.getRow(id);

        if (row) {
            row.selected = selected;
            this.updateSelectionState();
            this.internalStateUpdated();
        }
    }

    public addGroup(columnId: string, index: number) {
        const column = this.getColumn(columnId);

        if (column && column.groupable) {
            if (!column.grouped) {
                // Column isn't grouped.
                column.grouped = true;
                this.groupOrder.push(columnId);
                this.updateGroupBy();
            } 

            // Update the group order.
            const currentIndex = this.groupOrder.indexOf(columnId);

            if ((currentIndex !== index) && (currentIndex + 1 !== index)) {
                // Remove and add at index-1;
                this.groupOrder.splice(currentIndex, 1);
                this.groupOrder.splice(index, 0, columnId);
            }

            this.internalStateUpdated();
        }
    }

    public removeGroup(columnId: string) {
        const column = this.getColumn(columnId);

        if (column && column.groupable && column.grouped) {
            column.grouped = false;
            this.updateGroupBy();
            this.internalStateUpdated();
        }
    }

    public getRow(id: string) {
        return this.rows.find((row: any) => row.id === id);
    }

    public getColumn(id: string) {
        return this.columns.find((columns: any) => columns.id === id);
    }

    /* STATE */
    private internalStateUpdated(reason?: string) {
        if (this.stateUpdated) {
            this.stateUpdated(reason);
        }
    }

    /* SELECTION */
    private updateSelectionState() {
        const rowCount = this.rows.length;
        const selectedRowCount = this.rows.filter((row: any) => row.selected).length;

        if (selectedRowCount === 0) {
            this.selectionState = 'none';
        } else if (selectedRowCount === rowCount) {
            this.selectionState = 'all';
        } else {
            this.selectionState = 'some';
        }
    }

    /* GROUPING */
    private updateOpenGroups() {
        if (!this.openGroup) this.openGroups = [];

        const allGroups = this.groupBy.map((group: any) => group.columnId);
        const i = allGroups.indexOf(this.openGroup);
        this.openGroups = i > -1 ? allGroups.slice(0, i + 1) : [];
    }

    private updatesSupportGrouping() {
        this.supportGrouping = this.columns.find((column: Column) => column.groupable) ? true : false;
    }

    private updateGroups() {
        this.maxLevel = 0;

        let groupedData = [
            {
                level: 0,
                __items: [...this.rows],
            },
        ];

        if (this.groupBy && this.groupBy.length > 0) {
            this.groupData([...this.groupBy], groupedData, this.columns, 1);
        }


        this.groups = groupedData[0].__items;
        this.internalStateUpdated();
    }

    private groupData(groups: Array<Group>, data: any, columns: any, level: number) {
        if (groups && groups.length > 0) {
            this.maxLevel = level;
            const group = groups[0];
            const column = columns.find((c: any) => c.id === group.columnId);
            const visualizer = group.visualizer;
            const sortOrder = group.sortable ? column.sort : 'none';

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

    private updateGroupBy() {
        const groupableColumns = this.columns.filter((column: Column) => column.groupable && column.grouped);

        const result: Array<any> = groupableColumns.map((column: Column) => {
            return {
                columnId: column.id,
                column: column,
                label: column.label,
                visualizer: column.groupVisualizer
            }
        });

        if (this.groupOrder && this.groupOrder.length > 0) {
            this.groupBy = result.sort((a, b) => this.groupOrder.indexOf(a.columnId) - this.groupOrder.indexOf(b.columnId));
        } else {
            this.groupBy = result;
        }
    }

    /* SORTING */
    private sortData(data: Array<any>, by: Column) {
        const direction = by.sort;
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

    private createSortFunction(field: any, direction: 'none' | 'asc' | 'desc') {
        switch (direction) {
            case 'asc': {
                return (a: any, b: any) => {
                    if (a[field] < b[field]) return -1;
                    if (a[field] > b[field]) return 1;
                    return 0;
                }
            }

            case 'desc': {
                return (a: any, b: any) => {
                    if (a[field] > b[field]) return -1;
                    if (a[field] < b[field]) return 1;
                    return 0;
                }
            }
        }

        return (a: any, b: any) => 0;
    }
}
