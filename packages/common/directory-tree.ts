export interface DirectoryTreeEvent {
    path: string;
    type: 'create' | 'update' | 'delete';
    data: string;
}

export interface Directory {
    path: string;
    name: string;
    children?: Directory[];
}    

