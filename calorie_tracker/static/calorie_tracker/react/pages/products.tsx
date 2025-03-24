import React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import ProductsList from '../components/ProductsList'
import SelectedProduct from '../components/SelectedProduct';
import { getProduct } from "../lib/api";

const root = createRoot(document.querySelector("#react-content"));

function ProductsPage() {
	const [selectedProduct, setSelectedProduct] = useState(function() {return window.history.state?.count ?? null});
    const [product, setProduct] = useState<Product|null>(null)

	useEffect(function() {
		const handlePopState = function(event: PopStateEvent) {
			const fromWindowState = event.state?.selectedProduct ?? null;
			setSelectedProduct(fromWindowState);
			if(fromWindowState === null){
				setProduct(null);
			}
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

	useEffect(function() {
		async function fetchData() {
			const receivedData = await getProduct(selectedProduct);
			setProduct(receivedData);
		};

		if(selectedProduct !== null)
		{
			fetchData();
		}
		
    },[selectedProduct])

	if(product !== null)
	{
		return (
			<>
				<SelectedProduct product={product} />
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
