import React from "react";
import { useState, useEffect } from "react";
import { Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment, Button} from "@mui/material";

export default function AddProduct() {
    const [formData, setFormData] = useState<FormData>(
        {
            name: "",
            calories: ""
        }
    )

    type FormData = {
        name: string
        calories: string
    }

    function handleSubmit() {
        console.log(formData);
    }

    return (
        <>
            <Paper elevation={3} sx={{"padding": "20px"}}>
                <Grid2 container component="form" spacing={2}>
                    <Grid2 size={12}>
                        <TextField 
                            id="name"
                            label="Name"
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => {setFormData({...formData, name: e.target.value})}}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField 
                            id="name"
                            label="Calories"
                            variant="outlined"
                            value={formData.calories}
                            onChange={(e) => {setFormData({...formData, calories: e.target.value})}}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>
                                }
                            }}
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField 
                            id="name"
                            label="Fat"
                            variant="outlined"
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
                            label="Carbs (g)"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            id="protein"
                            label="Protein (g)"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <Button onClick={function() {handleSubmit()}}>Add product</Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </>
    )
}