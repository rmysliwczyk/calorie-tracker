import React from "react";
import { useState, useEffect } from "react";
import { Button, Grid2, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function SelectedProduct({ product, handleSubmitEditProductForm }: { product: Product, handleSubmitEditProductForm: Function }) {
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [formData, setFormData] = useState<FormData>(
        {
            id: product.id,
            name: product.name,
            calories: String(product.calories),
            fats: String(product.fats),
            carbs: String(product.carbs),
            proteins: String(product.proteins),
            portion_size: String(product.portion_size)
        }
    )

    type FormData = {
        id: number,
        name: string,
        calories: string,
        fats: string,
        carbs: string,
        proteins: string,
        portion_size: string
    }

    function editModeToggle() {
        if (editMode == false) {
            setEditMode(true);
        }
        else {
            setEditMode(false);
        }
    }

    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Typography variant="h4" gutterBottom>
                        {formData.name}
                        <ModeEditOutlineOutlinedIcon onClick={editModeToggle} />
                    </Typography>
                </Grid2>
                {
                    editMode ?
                        <Paper elevation={3} sx={{ "padding": "20px" }}>
                            <Grid2 container component="form" spacing={2}>
                                <Grid2 size={12}>
                                    <TextField
                                        id="name"
                                        label="Name"
                                        variant="outlined"
                                        value={formData.name}
                                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        id="calories"
                                        label="Calories"
                                        variant="outlined"
                                        value={formData.calories}
                                        onChange={(e) => { setFormData({ ...formData, calories: e.target.value }) }}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">kcal</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        id="portion-size"
                                        label="Portion size"
                                        variant="outlined"
                                        value={formData.portion_size}
                                        onChange={(e) => { setFormData({ ...formData, portion_size: e.target.value }) }}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">g</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={4}>
                                    <TextField
                                        id="fats"
                                        label="Fat"
                                        variant="outlined"
                                        value={formData.fats}
                                        onChange={(e) => { setFormData({ ...formData, fats: e.target.value }) }}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">g</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={4}>
                                    <TextField
                                        id="carbs"
                                        label="Carbs"
                                        variant="outlined"
                                        value={formData.carbs}
                                        onChange={(e) => { setFormData({ ...formData, carbs: e.target.value }) }}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">g</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={4}>
                                    <TextField
                                        id="proteins"
                                        label="Protein"
                                        variant="outlined"
                                        value={formData.proteins}
                                        onChange={(e) => { setFormData({ ...formData, proteins: e.target.value }) }}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">g</InputAdornment>
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={12}>
                                    <Button onClick={async function () { await handleSubmitEditProductForm(formData) ? function () { editModeToggle(); setFormData(formData) }() : console.log("Couldn't edit") }}>Update product</Button>
                                </Grid2>
                            </Grid2>
                        </Paper>
                        :
                        <Grid2 size={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">Calories</TableCell>
                                            <TableCell colSpan={1} align="center">Portion size</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">{formData.calories}g</TableCell>
                                            <TableCell colSpan={1} align="center">{formData.portion_size}g</TableCell>
                                        </TableRow>
                                    </TableBody>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Fat</TableCell>
                                            <TableCell align="center">Carbs</TableCell>
                                            <TableCell align="right">Protein</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="left">{formData.fats}g</TableCell>
                                            <TableCell align="center">{formData.carbs}g</TableCell>
                                            <TableCell align="right">{formData.proteins}g</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid2>
                }
            </Grid2>
        </>
    )
}