import React from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import ListItem from './ListItem';

export default function List({ data, handleSelectItem, loading }: { data: Array<ListItemData>, handleSelectItem: any, loading: boolean }) {
    if (loading) {
        return (
            <>
                <Box sx={{
                    "margin": "20px"
                }}>
                    <CircularProgress />
                </Box>
            </>
        )

    } else {
        return (
            <>
                <ul className="list-group list-group-flush">
                    {data.map(function (element, index) {
                        return <li className="list-group-item list-group-item-action" key={index}><ListItem data={element} handleClick={handleSelectItem} /></li>
                    })}
                </ul>
            </>
        )
    }
}
