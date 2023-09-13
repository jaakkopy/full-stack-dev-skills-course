export interface NewShoppingListItem {
    name: string;
    quantity: number;
    price: number | null | undefined;
    category: string | null | undefined;
    comment: string | null | undefined;
}
