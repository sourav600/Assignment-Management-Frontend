import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksById, updateTask } from '../../../ReduxToolkit/TaskSlice';
import { useLocation } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const tags = ["C", "C++", "JAVA", "Python", "php", "mySQL"]

export default function EditTaskForm({ item, handleClose, open }) {

    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams=new URLSearchParams(location.search);
    const taskId=queryParams.get("taskId");
    const { task } = useSelector(store => store);
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        description: "",
        tag: [],
        deadline: new Date(),
    });

    const [selectedTags, setSelectedTags] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleTagsChange = (event, value) => {
        setSelectedTags(value);
    }

    const handleDeadlineChange = (date) => {
        setFormData({
            ...formData,
            deadline: date
        })
    }

    const formateDate = (input) => {
        let {
            $y: year,
            $M: month,
            $D: day,
            $H: hours,
            $m: minutes,
            $s: seconds,
            $ms: miliseconds,
        } = input;

        const date = new Date(year, month, day, hours, minutes, seconds, miliseconds);

        const formatedDate = date.toISOString();
        return formatedDate;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { deadline } = formData;
        formData.deadline = formateDate(deadline);
        formData.tag = selectedTags;
        console.log("formData", formData, "deadline : ", formData.deadline);
        dispatch(updateTask({id:taskId, updatedTaskData:formData}));
        handleClose()
    }

    useEffect(() => {
        dispatch(fetchTasksById(taskId));
    }, [taskId]);

    useEffect(() => {
        if (task.taskDetails) setFormData(task.taskDetails)
    }, [task.taskDetails])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Image"
                                    fullWidth
                                    name='image'
                                    value={formData.image}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id='multiple-limit-tags'
                                    options={tags}
                                    onChange={handleTagsChange}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) =>
                                        <TextField
                                            label="Tags"
                                            fullWidth
                                            {...params}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        onChange={handleDeadlineChange}
                                        className='w-full'
                                        label="Deadline"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth
                                    className='customButton'
                                    type='submit'
                                    sx={{ padding: ".9rem" }}>
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
