import React from "react";
import { useState, useEffect } from "react";
import { Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment, Button } from "@mui/material";

export default function AddProduct({ handleSubmitProductForm }: { handleSubmitProductForm: Function }) {
    const [formData, setFormData] = useState<FormData>(
        {
            name: "",
            calories: "",
            fats: "",
            carbs: "",
            proteins: "",
            portion_size: ""
        }
    )

    type FormData = {
        name: string
        calories: string
        fats: string,
        carbs: string,
        proteins: string
        portion_size: string
    }

    return (
        <>
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
                        <Button onClick={function () { handleSubmitProductForm(formData) }}>Add product</Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </>
    )
}