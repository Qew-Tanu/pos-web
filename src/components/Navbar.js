import React, { useState } from 'react'
import config from '../config'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import axios from 'axios'



export default function Navbar() {
    const navigate = useNavigate()
    const [member, setMember] = useState({
        name: "",
        phone: ""
    });

    const handleSignOut = () => {
        Swal.fire({
            title: `Sign out`,
            text: `Confirm to sign out`,
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.removeItem(config.token_name)
                navigate('/login')
            }
        })
    }

    const handleEditProfile = async () => {
        try {
            await axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    console.log(res.data.result);
                    setMember(res.data.result)
                }
            }).catch(error => {
                throw error.response.data;
            })
        } catch (error) {
            Swal.fire({
                title: "Load data error",
                text: error.message,
                icon: "error"
            })
        }
    }

    const handlechange = (event) => {
        setMember(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSaveChange = async () => {
        try {
            await axios.put(config.api_path + '/member/changeProfile', { name: member.name, phone: member.phone }, config.headers()).then(res => {
                console.log(res);
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: "Your profile changed",
                        text: "Your Profile change success",
                        icon: "success",
                        timer: 2000
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    }
    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                    </li>
                </ul>

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <button onClick={handleEditProfile} data-bs-toggle="modal" data-bs-target="#modalEditProfile" className='btn btn-info'><i className='fa fa-user'></i> Profile</button>
                    </li>
                    <li className="nav-item ms-2">
                        <button onClick={handleSignOut} className='btn btn-danger'><i className='fa fa-times'></i> Sign out</button>
                    </li>



                </ul>

            </nav>
            <Modal id='modalEditProfile' title="Your Profile">
                <div>

                    <div>
                        <label className='mt-3'>Shop Name</label>
                        <input className='form-control' name='name' value={member.name} onChange={e => handlechange(e)} />
                    </div>
                    <div>
                        <label className='mt-3'>Phone</label>
                        <input className='form-control' name='phone' value={member.phone} onChange={e => handlechange(e)} />
                    </div>
                    <div className='mt-3 d-flex justify-content-between'>
                        <button onClick={handleSaveChange} className='btn btn-primary' type='submit'><i className="fa fa-check"></i> Save</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

