import { type Column, type Group, type GroupState, type ColumnFilter, unsortableTypes } from './DataTableTypes.js';

type SelectionMode = 'none' | 'single' | 'multiple';

export class DataTableState {
    private initialized: boolean = false;
    private displayFrame: any = null;
    private newDisplayItemData: any = null;
    public displayItemData = { groups: 0, rows: 0, summaries: 0, total: 0, visibleCount: 0, visibleTotal: 0, startIndex: 0, endIndex: 0, trailing: 0, leading: 0, visible: 0, workingIndex: 0 }
    private groupMap: Map<string, GroupState> = new Map<string, GroupState>();
    private allRows?: Array<object> = [];
    private stateUpdated?: Function | null = null;
    public rows?: Array<object> = [];
    public columns?: Array<Column> = [];
    public groupOrder?: Array<string> = [];
    public groups: Array<any> = [];
    public visibleGroups: Array<any> = [];
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
    public filters?: Map<string, ColumnFilter> = new Map<string, ColumnFilter>();

    public initialize(columns?: Array<Column>, rows?: Array<object>, groupOrder?: Array<string>, openGroup?: string, selectionMode?: SelectionMode, stateUpdated?: Function, 
                filterAll?: boolean, hideFilter?: boolean) {
        this.columns = columns;
        this.allRows = Array.from(rows as any);
        this.rows = rows;
        this.groupOrder = groupOrder;
        this.openGroup = openGroup;
        this.selectionMode = selectionMode;
        this.stateUpdated = stateUpdated;
        this.filterAll = filterAll;
        this.hideFilter = hideFilter;

        this.updateFilters();
        this.updateFilterVisible();
        this.updateHasSummary();
        this.updateGroupBy();
        this.updateOpenGroups();
        this.updatesSupportGrouping();
        this.updateGroups();
        this.updateSelectionState();

        this.initialized = true;
        this.internalStateUpdated();
    }

    /* PUBLIC */
    public filter(columnId: string, value: any, operator: string) {
        const filter = this.filters?.get(columnId);

        if (filter) {
            filter.value = this.getFilterValue(value, filter.column.type);
            filter.operator = operator;
            this.filterRows(); 
        }
    }

    public sort(columnId?: string) {
        if (!columnId) {
            this.internalStateUpdated();
        } else {
            const column = this.getColumn(columnId);

            if (column && column.sortable && (!unsortableTypes.includes(column.type) || column.sortFunction)) {
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
            this.updateDisplayItemData();
            this.internalStateUpdated();
        }
    }

    public toggleGroupDetail(group: any) {
        if (group) {
            if (group.__originalGroup) group = group.__originalGroup;
            console.log('TOGGLE GROUP 2');
            console.log(group);
            group.showDetail = !group.showDetail;
            this.groupMap.set(group.path, { group: group, showDetail: group.showDetail });
            this.updateDisplayItemData();
            this.internalStateUpdated();
        }
    }

    public shiftGroup(columnId: string, direction: 'left' | 'right') {
        const currentIndex: any = this.groupOrder?.indexOf(columnId);
        const groupCount: any  = this.groupOrder?.length;
        if (currentIndex === -1) return;

        const newIndex: any = (direction === 'left') ? currentIndex - 1 : currentIndex + 1

        if ((newIndex >= 0) && (newIndex < groupCount)) {
            this.groupOrder?.splice(currentIndex, 1);
            this.groupOrder?.splice(newIndex, 0, columnId);
            this.updateGroupBy();
            this.updateGroups();
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

            index = (index === -1) ? (this.groupOrder as any).length : index;

            // Update the group order.
            const currentIndex = this.groupOrder?.indexOf(columnId) || 0;

            if ((currentIndex !== index) && (currentIndex + 1 !== index)) {
                // Remove and add at index-1;
                this.groupOrder?.splice(currentIndex, 1);
                this.groupOrder?.splice(index, 0, columnId);
            }

            this.updateGroupBy();
            this.updateGroups();
        }
    }

    public removeGroup(columnId: string) {
        const column = this.getColumn(columnId);

        if (column && column.groupable && column.grouped) {
            column.grouped = false;
            this.updateGroupBy();
            this.updateGroups();
        }
    }
    
    public moveColumn(srcColumnId: string, destColumnId: string) {
        if ((srcColumnId !== destColumnId) && (this.columns)) {
            const srcColumn: any = this.getColumn(srcColumnId);
            const destColumn: any = this.getColumn(destColumnId);

            if (srcColumn.freeze || (destColumn && destColumn.freeze)) return;

            const srcIndex: number = this.columns.indexOf(srcColumn);
            const destIndex: number = this.columns.indexOf(destColumn);

            this.columns.splice(srcIndex, 1);

            if (destIndex !== -1) {
                this.columns.splice(destIndex, 0, srcColumn);
            } else {
                this.columns.push(srcColumn);
            }

            this.internalStateUpdated();
        }
    }

    public getRow(id: string) {
        return this.rows?.find((row: any) => row.id === id);
    }

    public getColumn(id: string) {
        return this.columns?.find((columns: any) => columns.id === id);
    }

    public getColumnIndex(id: string): number {
        const column = this.getColumn(id);

        if (column && this.columns) {
            return this.columns.indexOf(column);
        }
        
        return -1;
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

    private updateFilters() {
        const filteredColumns = this.columns?.filter((column: Column) => (column.filterable || this.filterAll) && column.type !== 'action');
        this.filters = new Map<string, ColumnFilter>();

        filteredColumns?.forEach((column: Column) => {
            (this.filters as any)?.set(column.id, {
                id: column.id,
                column: column
            });
        });
    }

    private getFilterValue(value: any, type: string): any {
        if ((value === '') || (value === undefined)|| (value === null)) return undefined;

        switch (type) {
            case 'number': {
                return Number(value);
            }

            case 'boolean': {
                return Boolean(value);
            }

            case 'date': {
                return new Date(value);
            }

            default: {
                return value;
            }
        }  
    }
 
    private filterRows() {
        const filters = [...(this.filters as any)?.values()].filter((f: any) => f.operator !== undefined && f.value !== undefined);

        const filteredRows = this.allRows?.filter((row: any) => {
            let keep = true;
            
            for (var i = 0; i < filters.length; i++) {
                const filter: ColumnFilter = filters[i];
                const column = filter.column;
                const value = row[column.field as any];

                if (!this.keepFilteredValue(filter.value, value, column.type, filter.operator as any)) {
                    keep = false;
                    break;
                }
            }

            return keep;
        });

        this.rows = Array.from(filteredRows as any);
        this.updateGroups();
    }

    private keepFilteredValue(filterValue: any, rowValue: any, type: string, operator: string): boolean {
        switch (type) {
            case 'text': {
                return rowValue.toLowerCase().includes(filterValue.toLowerCase());
            }

            case 'number': {
                return rowValue === filterValue;
            }

            case 'boolean': {
                
            }

            case 'date': {
                
            }

            default: {
                return true;
            }
        }  
    }

    /* SUMMARY */ 
    private updateHasSummary() {
        this.hasSummary = this.columns?.find((column: Column) => column.summary) !== undefined;
    }

    /* STATE */
    private internalStateUpdated(reason?: string) {
        if (this.initialized && this.stateUpdated) {
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
        this.updateDisplayItemData();
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
            if (!rowSortFunc) rowSortFunc = by.sortFunction || this.createSortFunction(by.field);
            if (!groupSortFunc) groupSortFunc = by.sortFunction || this.createSortFunction('value');

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

    /* DISPLAY */
    public setDisplayFrame(frame: any) {
        this.displayFrame = frame;
        this.updateDisplayItemData();
    }

    private updateDisplayItemData() {
        if (!this.displayFrame) return;

        const frameSize = 2;
        this.newDisplayItemData = { groups: 0, rows: 0, summaries: 0, total: 0, visibleCount: 0, visibleTotal: 0, startIndex: 0, endIndex: 0, trailing: 0, leading: 0, visible: 0, workingIndex: 0 };
        const newData = this.newDisplayItemData;
        const itemHeight = this.displayFrame.itemHeight;
        const visibleSize = this.displayFrame.clientHeight;

        newData.visible = visibleSize * frameSize;
        newData.leading = Math.max(this.displayFrame.scrollTop - (visibleSize * (frameSize - 1) / 2), 0);
        newData.visibleTotal = Math.ceil(newData.visible / itemHeight);
        newData.startIndex = Math.max(Math.floor(newData.leading / itemHeight), 0);

        this.rows?.forEach((row: any) => row.__display = false);

        if (this.groups && this.groups.length > 0) {
            if (!this.groups[0].isGroup) {
                newData.rows = this.groups.length;

                if (this.hasSummary) {
                    newData.summaries = 1;
                }

                this.groups.forEach((item, index) => {
                    item.__display = (index >= newData.startIndex) && (newData.visibleCount < newData.visibleTotal);
                    newData.workingIndex += 1;
                    if (item.__display) newData.visibleCount += 1;
                });
            } else {
                
                this.groups.forEach((item: any) => this.processDisplayGroup(item));
            }
        }

        newData.total = newData.rows + newData.groups + newData.summaries;
        const totalSize = newData.total * itemHeight;
        newData.visibleTotal = newData.visibleCount;
        newData.trailing = Math.max(totalSize - newData.leading - newData.visible, 0);
        newData.endIndex = Math.min(newData.startIndex + newData.visibleTotal - 1, newData.total);
        this.displayItemData = newData;
        //this.visibleGroups = this.groups.filter(g => g.__display);

        console.clear();
        //console.log(`*** START: ${this.newDisplayItemData.startIndex}: ${this.newDisplayItemData.groups}, ${this.newDisplayItemData.rows}, ${this.newDisplayItemData.summaries}, ${this.newDisplayItemData.total} ***`);
        const dest: any = [];
        this.flatten(this.groups, dest);
        //console.log(dest);
        this.visibleGroups = dest;
        
        this.tempDisplay(this.groups);
        //console.log(`*** END: ${this.newDisplayItemData.groups}, ${this.newDisplayItemData.rows}, ${this.newDisplayItemData.summaries}, ${this.newDisplayItemData.total} ***`);
    }

    private flatten(src: any, dest: any) {
        src.forEach((item: any) => {
            if (item.isGroup) {
                if (item.__display) {
                    //console.log(item);
                    dest.push(this.cloneGroup(item));

                    if (item.__items && item.__items.length > 0) {
                        this.flatten(item.__items, dest);
                    }
                }
            } else {
                if (item.__display) {
                    //console.log(item);
                    dest.push(item);
                }
            }
        });
    }

    private cloneGroup(group: any) {
        return {
            column: group.column,
            isGroup: group.isGroup,
            level: group.level,
            path: group.path,
            showDetail: group.showDetail,
            value: group.value,
            visualizer: group.visualizer,
            __items: group.__items,
            __display: group.__display,
            __originalGroup: group
        }
    }

    private tempDisplay(items: any) {
        items.forEach((item: any) => {
            if (item.isGroup) {
                if (item.__display) {
                    console.log(`${item.column.label}: ${item.value}`);

                    if (item.__items && item.__items.length > 0) {
                        this.tempDisplay(item.__items);
                    }
                }
            } else {
                if (item.__display) {
                    console.log(item);
                }
            }
        });
    }

    private processDisplayGroup(group: any) {
        this.newDisplayItemData.groups += 1;
        this.newDisplayItemData.workingIndex += 1;

        if ((this.newDisplayItemData.workingIndex >= this.newDisplayItemData.startIndex) && (this.newDisplayItemData.visibleCount <= this.newDisplayItemData.visibleTotal)) {
            group.__display = true;
            this.newDisplayItemData.visibleCount += 1;
        } else {
            group.__display = false;
        }

        if (group.showDetail && group.__items && group.__items.length > 0) {
            if (!group.__items[0].isGroup) {
                this.newDisplayItemData.rows += group.__items.length;

                group.__items.forEach((item: any) => {
                    item.__display = ((this.newDisplayItemData.workingIndex >= this.newDisplayItemData.startIndex) && (this.newDisplayItemData.visibleCount <= this.newDisplayItemData.visibleTotal))
                    this.newDisplayItemData.workingIndex += 1;
                    if (item.__display) this.newDisplayItemData.visibleCount += 1;
                });

                if (this.hasSummary) {
                    this.newDisplayItemData.summaries += 1;
                }
            } else {
                group.__items.forEach((item: any) => this.processDisplayGroup(item));
            }
        }
    }
}
