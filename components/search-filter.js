import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React, { useEffect } from 'react';

export function SearchFilter({ filterable, onChange }) {

    const [formData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        setLoading(false)
    }, [])

    useEffect(() => {
        if(onChange) onChange(formData)
    }, [formData])

    const handleChange = (event) => {
        setFormData(old => ({
            ...old,
            [event.target.name]: event.target.value
        }))
    };

    if (loading) return <></>

    return <>
        <div>
            {Object.keys(filterable).map(key => {
                let value = filterable[key]
                let name = value.slug
                if (value.type == "sort") {
                    name = "sort"
                }
                return <FormControl key={key} sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id={value.slug}>{value.name}</InputLabel>
                    <Select
                        labelId={value.slug}
                        name={name}
                        value={formData[value.slug]}
                        label={value.name}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {value.items.map((o, key) => <MenuItem key={key} value={o.value}>{o.text}</MenuItem>)}
                    </Select>
                </FormControl>
            })}
        </div>
    </>
}