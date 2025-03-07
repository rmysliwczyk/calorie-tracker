import React from 'react'
import { createRoot } from 'react-dom/client'
import List from '../components/List'
import { getProducts } from '../lib/api'
 
const root = createRoot(document.querySelector("#react-content"));

async function renderPage() {

	const products: Array<Product> = await getProducts();
	const listData: Array<ListItemData> = products.map(
		function(element) { 
			return {
				title: element.name,
				content: element.calories as unknown as string
			} 
		}
	);

	function handleClick(title) {
		alert(`Hello from ${title}`);
	}

	root.render(
		<>
			<List data={listData} handleClick={handleClick} />
		</>
	);
}

document.addEventListener('DOMContentLoaded', function() {
	renderPage();
});
