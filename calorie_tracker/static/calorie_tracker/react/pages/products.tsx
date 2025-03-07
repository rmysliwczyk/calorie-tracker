import React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import List from '../components/List'
import SearchInput from '../components/SearchInput'
import { getProducts } from '../lib/api'
 
const root = createRoot(document.querySelector("#react-content"));

function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [searchValue, setSearchValue] = useState('');

	useEffect(function() {
		async function fetchData() {
			const receivedData = await getProducts();
			setProducts(receivedData);
		}

		fetchData();
	}, []);

	const listData: Array<ListItemData> = products.map(
		function(element: Product) { 
			return {
				id: element.id,
				title: element.name,
				content: `${element.calories} kcal/100g`
			} 
		}
	);

	async function handleSelectProduct(productId) {
		setSelectedProduct(productId);
	}

	useEffect(function() {
		if(selectedProduct != null) {
			alert(selectedProduct);
		}
	}, [selectedProduct]);

	async function handleSearchInputChange(enteredText) {
		setSearchValue(enteredText);
	}

	useEffect(function() {
		const timeOut = setTimeout(function() {alert(searchValue)}, 1000);

		return function() {clearTimeout(timeOut)}
	},[searchValue])


	return (
		<>
			<SearchInput placeholder='Enter product name' inputValue={searchValue} onSearch={handleSearchInputChange} />
			<List data={listData} handleSelectItem={handleSelectProduct} />
		</>
	);
}

document.addEventListener('DOMContentLoaded', function() {
	root.render(<><ProductsPage /></>);
});
