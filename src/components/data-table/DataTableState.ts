import type { Column, Group, GroupState } from './DataTableTypes.js';

type SelectionMode = 'none' | 'single' | 'multiple';

export class DataTableState {
    private groupMap: Map<string, GroupState> = new Map<string, GroupState>();
    private stateUpdated?: Function | null = null;
    public rows?: Array<object> = [];
    public columns?: Array<Column> = [];
    public groupOrder?: Array<string> = [];
    public groups: Array<any> = [];
    public openGroups: Array<any> = [];
    public groupBy: Array<Group> = [];
    public maxLevel: number = 0;
    public supportGrouping: boolean = false;
    public openGroup?: string = '';
    public selectionMode?: SelectionMode = 'none';
    public selectionState: 'none' | 'some' | 'all' = 'none';
    public sortBy: string = '';
    public sortDesc: boolean = true;
    public hasSummary: boolean = false;
    public filterVisible: boolean = false;
    public filterAll?: boolean = false;
    public hideFilter?: boolean = true;

    constructor(columns?: Array<Column>, rows?: Array<object>, groupOrder?: Array<string>, openGroup?: string, selectionMode?: SelectionMode, stateUpdated?: Function, 
                filterAll?: boolean, hideFilter?: boolean) {
        this.init(columns, rows, groupOrder, openGroup, selectionMode, stateUpdated, filterAll, hideFilter);
    }

    private init(columns?: Array<Column>, rows?: Array<object>, groupOrder?: Array<string>, openGroup?: string, selectionMode?: SelectionMode, stateUpdated?: Function, 
                filterAll?: boolean, hideFilter?: boolean) {
        this.columns = columns;
        this.rows = rows;
        this.groupOrder = groupOrder;
        this.openGroup = openGroup;
        this.selectionMode = selectionMode;
        this.stateUpdated = stateUpdated;
        this.filterAll = filterAll;
        this.hideFilter = hideFilter;

        this.updateFilterVisible();
        this.updateHasSummary();
        this.updateGroupBy();
        this.updateOpenGroups();
        this.updatesSupportGrouping();
        this.updateGroups();
        this.updateSelectionState();
    }

    /* PUBLIC */
    public sort(columnId?: string) {
        if (!columnId) {
            this.internalStateUpdated();
        } else {
            const column = this.getColumn(columnId);

            if (column && column.sortable) {
                this.sortDesc = !this.sortDesc;
                this.sortBy = columnId;
                this.sortData(this.groups, column);
                this.internalStateUpdated();
            }
        }
    }

    public selectAllRows(selected: boolean) {
        this.rows?.forEach((row: any) => row.selected = selected);
        this.updateSelectionState();
        this.internalStateUpdated();
    }

    public selectSingleRow(selected: boolean, id: string) {
        const row: any = this.getRow(id);

        if (row) {
            row.selected = selected;
            this.updateSelectionState();
            this.internalStateUpdated();
        }
    }

    public toggleRowDetail(id: string) {
        const row: any = this.getRow(id);

        if (row) {
            row._showDetail = !row._showDetail;
            this.internalStateUpdated();
        }
    }

    public toggleGroupDetail(group: any) {
        if (group) {
            group.showDetail = !group.showDetail;
            this.groupMap.set(group.path, { group: group, showDetail: group.showDetail });
            this.internalStateUpdated();
        }
    }

    public addGroup(columnId: string, index: number) {
        const column = this.getColumn(columnId);

        if (column && column.groupable) {
            if (!column.grouped) {
                // Column isn't grouped.
                column.grouped = true;

                if (!this.groupOrder?.includes(columnId)) {
                    this.groupOrder?.push(columnId);
                }
            } 

            // Update the group order.
            const currentIndex = this.groupOrder?.indexOf(columnId) || 0;

            if ((currentIndex !== index) && (currentIndex + 1 !== index)) {
                // Remove and add at index-1;
                this.groupOrder?.splice(currentIndex, 1);
                this.groupOrder?.splice(index, 0, columnId);
            }

            //this.groupMap = new Map<string, GroupState>();
            this.updateGroupBy();
            this.updateGroups();
        }
    }

    public removeGroup(columnId: string) {
        const column = this.getColumn(columnId);

        if (column && column.groupable && column.grouped) {
            column.grouped = false;

            //this.groupMap = new Map<string, GroupState>();

            this.updateGroupBy();
            this.updateGroups();
        }
    }

    public getRow(id: string) {
        return this.rows?.find((row: any) => row.id === id);
    }

    public getColumn(id: string) {
        return this.columns?.find((columns: any) => columns.id === id);
    }

    /* FILTER */
    private updateFilterVisible() {
        if (this.hideFilter) {
            this.filterVisible = false;
        } else if (this.filterAll) {
            this.filterVisible = true;
        } else {
            this.filterVisible = this.columns?.find((c: Column) => c.filterable) ? true : false;
        }
    }

    /* SUMMARY */ 
    private updateHasSummary() {
        this.hasSummary = this.columns?.find((column: Column) => column.summary) !== undefined;
    }

    /* STATE */
    private internalStateUpdated(reason?: string) {
        if (this.stateUpdated) {
            this.stateUpdated(reason);
        }
    }

    /* SELECTION */
    private updateSelectionState() {
        const rowCount = this.rows?.length;
        const selectedRowCount = this.rows?.filter((row: any) => row.selected).length;

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
        this.supportGrouping = this.columns?.find((column: Column) => column.groupable) ? true : false;
    }

    private updateGroups() {
        this.maxLevel = 0;

        let groupedData = [
            {
                level: 0,
                __items: this.rows ? [...this.rows] : [],
            },
        ];

        if (this.groupBy && this.groupBy.length > 0) {
            const map = new Map<string, GroupState>();
            this.groupData([...this.groupBy], groupedData, this.columns, 1, map);
            this.groupMap = map;
        }

        this.groups = groupedData[0].__items;
        this.resort();
        this.internalStateUpdated();
    }

    private groupData(groups: Array<Group>, data: any, columns: any, level: number, map: Map<string, GroupState>) {
        if (groups && groups.length > 0) {
            this.maxLevel = level;
            const group = groups[0];
            const column = columns.find((c: any) => c.id === group.columnId);
            const visualizer = group.visualizer;

            if (column) {
                const field = column.field;

                const newGroups = [...groups];
                newGroups.shift();

                data.forEach((item: any) => {
                    let newItems: Array<any> = [];

                    if (item.__items && item.__items.length > 0) {
                        const unique = [...new Set(item.__items.map((i: any) => {
                            const val = i[field];
                            return (val instanceof Date) ? val.valueOf() : val
                        }))];

                        unique.forEach((i: any) => {
                            const val = column.type === 'date' ? new Date(i) : i;
                            const newGroup = {
                                isGroup: true,
                                level: level,
                                value: val,
                                column: column,
                                visualizer: visualizer,
                                showDetail: false,
                                path: `${item.path ? item.path + '/' : ''}${column.id}:${i}`,
                                __items: item.__items.filter((f: any) => {
                                    let val = f[field];
                                    val = (val instanceof Date) ? val.valueOf() : val;
                                    return val === i;
                                }),
                            };

                            const state = this.groupMap.get(newGroup.path);

                            if (state) {
                                newGroup.showDetail = state.showDetail;
                            } else {
                                newGroup.showDetail = this.openGroups.includes(newGroup.column.id);
                            }

                            newItems.push(newGroup);
                            map.set(newGroup.path, { group: newGroup, showDetail: newGroup.showDetail });
                        });
                    }

                    if (newGroups.length > 0) {
                        this.groupData([...newGroups], newItems, columns, level + 1, map);
                    }

                    item.__items = newItems;
                });
            }
        }
    }

    private updateGroupBy() {
        const groupableColumns = this.columns?.filter((column: Column) => column.groupable && column.grouped);

        const result: any = groupableColumns?.map((column: Column) => {
            return {
                columnId: column.id,
                column: column,
                label: column.label,
                visualizer: column.groupVisualizer
            }
        });

        if (this.groupOrder && this.groupOrder.length > 0) {
            this.groupBy = result.sort(this.sortGroupOrder.bind(this));
        } else {
            this.groupBy = result;
        }
    }

    private sortGroupOrder(a: any, b: any) {
        if ((this.groupOrder?.indexOf(a.columnId) === -1) || (this.groupOrder?.indexOf(b.columnId) === -1)) {
            return -1;
        }

        if (this.groupOrder) {
            return this.groupOrder.indexOf(a.columnId) - this.groupOrder.indexOf(b.columnId);
        }
        
        return 0;
    }

    /* SORTING */
    private resort() {
        const column = this.getColumn(this.sortBy);

        if (column && column.sortable) {
            this.sortData(this.groups, column);
        }
    }

    private sortData(data: Array<any>, by: Column, rowSortFunc?: Function, groupSortFunc?: Function) {
        if (data && data.length > 0) {
            if (!rowSortFunc) rowSortFunc = this.createSortFunction(by.field);
            if (!groupSortFunc) groupSortFunc = this.createSortFunction('value');

            if ((data[0] as any).__items) {             
                if ((data[0] as any).column.id === by.id) {
                    data.sort(groupSortFunc as any);
                }

                data.forEach((item: any) => { 
                    this.sortData(item.__items, by, rowSortFunc, groupSortFunc);
                });
            } else {
                data.sort(rowSortFunc as any);
            }
        }
    }

    private createSortFunction(field: any) {
        if (this.sortDesc) {
            return (a: any, b: any) => {
                if (a[field] > b[field]) return -1;
                if (a[field] < b[field]) return 1;
                return 0;
            }
        } else {
            return (a: any, b: any) => {
                if (a[field] < b[field]) return -1;
                if (a[field] > b[field]) return 1;
                return 0;
            }
        }
    }
}
