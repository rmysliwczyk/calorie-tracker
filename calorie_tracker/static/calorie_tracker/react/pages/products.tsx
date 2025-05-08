import React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import ProductsList from '../components/ProductsList'
import SelectedProduct from '../components/SelectedProduct';
import { addProduct, getProduct, updateProduct } from "../lib/api";
import AddProduct from '../components/AddProduct';

const root = createRoot(document.querySelector("#react-content"));

function ProductsPage() {
	enum PageAction {
		Selected = 0,
		List = 1,
		Add = 2
	}

	const [selectedProduct, setSelectedProduct] = useState(function () { return window.history.state?.count ?? null });
	const [productPageAction, setProductPageAction] = useState<PageAction>(PageAction.List)
	const [product, setProduct] = useState<Product | null>(null)

	useEffect(function () {
		const handlePopState = function (event: PopStateEvent) {
			console.log(event.state)
			const productFromWindowState = event.state?.selectedProduct ?? null;
			setSelectedProduct(productFromWindowState);
			if (productFromWindowState === null) {
				setProduct(null);
			}

			setProductPageAction(event.state?.productPageAction as PageAction);
		}

		window.addEventListener("popstate", handlePopState);
		window.history.pushState({ selectedProduct, productPageAction }, "", window.location.href)
		return () => window.removeEventListener("popstate", handlePopState);
	}, [])

	useEffect(function () {
		if (selectedProduct != null) {
			console.log(`Selected product ${selectedProduct}`);
			sessionStorage.setItem("selectedProduct", selectedProduct);
		}
	}, [selectedProduct]);

	async function handleSelectProduct(productId) {
		setSelectedProduct(productId)
		window.history.pushState({ selectedProduct, productPageAction }, "", window.location.href)
		setProductPageAction(PageAction.Selected)
	}

	async function handleAddProduct() {
		window.history.pushState({ selectedProduct, productPageAction }, "", window.location.href)
		setProductPageAction(PageAction.Add)
	}

	async function handleSubmitAddProductForm(formData) {
		addProduct(formData, sessionStorage.getItem("csrftoken"));
	}

	async function handleSubmitEditProductForm(formData) {
		return updateProduct(formData, sessionStorage.getItem("csrftoken"));
	}

	async function handleScanProduct() {
		alert("scan product");
	}

	useEffect(function () {
		async function fetchData() {
			const receivedData = await getProduct(selectedProduct);
			setProduct(receivedData);
		};

		if (selectedProduct !== null) {
			fetchData();
		}

	}, [selectedProduct])

	if (productPageAction == PageAction.Selected && product !== null) {
		return (
			<>
				<SelectedProduct product={product} handleSubmitEditProductForm={handleSubmitEditProductForm} />
			</>
		)
	} else if (productPageAction == PageAction.List) {
		return (
			<>
				<ProductsList handleSelectProduct={handleSelectProduct} onAdd={handleAddProduct} onScan={handleScanProduct} />
			</>
		);
	} else if (productPageAction == PageAction.Add) {
		return (
			<>
				<AddProduct handleSubmitAddProductForm={handleSubmitAddProductForm} />
			</>
		)
	}
}

document.addEventListener('DOMContentLoaded', function () {
	root.render(<><ProductsPage /></>);
});
