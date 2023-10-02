export declare enum Order {
    ASC = "asc",
    DESC = "desc"
}
export declare function compareValues(key: any, order?: Order): (a: any, b: any) => number;
