import { Avatar, Button } from '@mui/material'
import React, { useState } from 'react'
import "./Sidebar.css"
import CreateNewTaskForm from '../Task/CreateTask'
import { useLocation, useNavigate } from 'react-router-dom'

const menu = [
    { name: "Home", value: "Home", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "DONE", value: "DONE", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "ASSIGNED", value: "ASSIGNED", role: ["ROLE_ADMIN"] },
    { name: "NOT ASSIGNED", value: "PENDING", role: ["ROLE_ADMIN"] },
    { name: "Create New Task", value: "", role: ["ROLE_ADMIN"] },
    { name: "Notifications", value: "NOTIFICATION", role: ["ROLE_CUSTOMER"] }
]
const role = "ROLE_ADMIN"

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("Home")

    const [openCreateTaskForm, setOpenCreateTaskForm] = useState(false);
    const handleCloseCreateTaskForm=()=>{
        setOpenCreateTaskForm(false);
    }
    const handleOpenCreateTaskModel = () => {
        setOpenCreateTaskForm(true);
    };

    //Form YT
    const handleMenuChange = (item) => {
        const updatedParams = new URLSearchParams(location.search);

        if(item.name==="Create New Task"){
            handleOpenCreateTaskModel();
        }
        else if(item.name === "Home"){
            updatedParams.delete("filter")
            const queryString = updatedParams.toString();
            const updatedPath = queryString?`${location.pathname}?${queryString}`
            :location.pathname;
            navigate(updatedPath);
        }
        else{
            updatedParams.set("filter",item.value);
            navigate(`${location.pathname}?${updatedParams.toString()}`)
        }
        setActiveMenu(item.name)
    }

    // From ChatGPT
    // const handleMenuChange = (item) => {
    //     const updatedParams = new URLSearchParams(location.search);
    //     const itemName = item.name.trim();  // Trim any whitespace from item name
    //     const itemValue = item.value ? item.value.trim() : '';  // Trim any whitespace from item value, if it exists

    //     if (itemName === "Create New Task") {
    //         handleOpenCreateTaskModel();
    //     } else if (itemName === "Home") {
    //         updatedParams.delete("filter");
    //         navigate(location.pathname);
    //     } else {
    //         updatedParams.set("filter", itemValue);
    //         navigate(`${location.pathname}?${updatedParams.toString()}`);
    //     }

    //     setActiveMenu(item.name);
    // };
    const handleLogout = () => {
        console.log("Handle logout")
    }
    return (
        <>
            <div className='card min-h-[85vh] flex flex-col justify-center fixed w-[20vw]'>
                <div className='space-y-5 h-full'>
                    <div className='flex justify-center'>
                        <Avatar
                            sx={{ width: "8rem", height: "8rem" }}
                            className='border-2 border-[#159189]'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwqRQUcxrL6WYZeeluHrWVGHXtIZx0VWCc8w&s' />
                    </div>
                    {
                        menu.filter((item) => item.role.includes(role))
                            .map((item) => <p onClick={() => handleMenuChange(item)} className={`py-3 px-5 rounded-full text-center
                cursor-pointer ${activeMenu === item.name ?
                                    "activeMenuItem" : "menuItem"}`}>
                                {item.name}
                            </p>)
                    }
                    <Button onClick={handleLogout} sx={{ padding: ".7rem", borderRadius: "2rem" }} fullWidth
                        className='logoutButton'>
                        logout
                    </Button>
                </div>
            </div>
            <CreateNewTaskForm open={openCreateTaskForm} handleClose={handleCloseCreateTaskForm}/>
        </>

    )
}

export default Sidebar