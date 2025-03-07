type User = {
    username: string,
    calorie_goal: number,
    error_message: string
}

type ListItemData = {
    title: string,
    content: string
}

type Product = {
	name: string,
	calories: number,
	fats: number,
	carbs: number,
	proteins: number,
	portion_size: number,
	is_locked: boolean,
	barcode: string,
	error_message: string
}
