import React from 'react'
import { useState, useEffect } from 'react'
import List from '../components/List'
import SearchInput from '../components/SearchInput'
import { getProducts } from '../lib/api'

export default function ProductsList({handleSelectProduct, onAdd, onScan}:{handleSelectProduct : Function, onAdd : Function, onScan : Function}) {
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchInProgress, setSearchInProgress] = useState(false);

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

    async function handleSearchInputChange(enteredText) {
        setSearchValue(enteredText);
    }

    useEffect(function() {
        setSearchInProgress(true);
        const timeOut = setTimeout(async function() {
            const receivedData = await getProducts(searchValue);
            setProducts(receivedData);
            setSearchInProgress(false);
        }, 1000);

        return function() {clearTimeout(timeOut)}
    },[searchValue])


    return (
        <>
            <SearchInput placeholder='Enter product name' inputValue={searchValue} onSearch={handleSearchInputChange} onAdd={onAdd} onScan={onScan} />
            <List data={listData} handleSelectItem={handleSelectProduct} loading={searchInProgress}/>
        </>
    );
}