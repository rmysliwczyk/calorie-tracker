type User = {
    username: string,
    calorie_goal: number,
    error_message: string
}

type ListItemData = {
	id: number,
    title: string,
    content: string
}

type Product = {
	id: number,
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
