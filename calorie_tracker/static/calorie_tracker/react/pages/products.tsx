import React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import ProductsList from '../components/ProductsList'

const root = createRoot(document.querySelector("#react-content"));

function ProductsPage() {
	const [selectedProduct, setSelectedProduct] = useState(function() {return window.history.state?.count ?? null});

	useEffect(function() {
		const handlePopState = function(event: PopStateEvent) {
			setSelectedProduct(event.state?.selectedProduct ?? null);
		}

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	},[])

	useEffect(function() {
		if(selectedProduct != null) {
			console.log(`Selected product ${selectedProduct}`);
			sessionStorage.setItem("selectedProduct", selectedProduct);
		}
	}, [selectedProduct]);

	async function handleSelectProduct(productId) {
        setSelectedProduct(productId)
		window.history.pushState({selectedProduct}, "", window.location.href)
    }

	if(selectedProduct !== null)
	{
		return (
			<>
				Selected product with id {selectedProduct}
			</>
		)
	} else {
		return (
			<>
				<ProductsList handleSelectProduct={handleSelectProduct} />
			</>
		);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	root.render(<><ProductsPage /></>);
});
