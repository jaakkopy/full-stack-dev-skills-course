export interface NewShoppingListItem {
    name: String;
    quantity: Number;
    price: Number | null | undefined;
    category: String | null | undefined;
    comment: String | null | undefined;
}
