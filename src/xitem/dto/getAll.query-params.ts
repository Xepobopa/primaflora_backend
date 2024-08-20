export class GetAllQueryParmas {
    take: number;
    getProducts: boolean;
    getCategories: boolean;
    getActiveOnly: boolean; // set true to get also inactive items
    parentUid: string;
}