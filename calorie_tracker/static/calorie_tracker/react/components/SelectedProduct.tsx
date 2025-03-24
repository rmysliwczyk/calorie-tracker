import React from "react";
import { useState, useEffect } from "react";
import { Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export default function SelectedProduct({product}:{product : Product}) {
    return (
        <>
           <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <Typography variant="h4" gutterBottom>
                    {product.name}
                </Typography>
            </Grid2>
            <Grid2 size={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Calories</TableCell>
                                <TableCell>Fat</TableCell>
                                <TableCell>Carbs</TableCell>
                                <TableCell>Protein</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{product.calories}kcal</TableCell>
                                <TableCell>{product.fats}g</TableCell>
                                <TableCell>{product.carbs}g</TableCell>
                                <TableCell>{product.proteins}g</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
           </Grid2>
        </>
    )
}