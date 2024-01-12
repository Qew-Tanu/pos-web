import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../config'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'


export default function Login() {
    const [memberLogin, setMemberLogin] = useState({
        username: "",
        password: "",
    })
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: `Sign In`,
                        text: `You login as ${res.data.name}.`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: true
                    }).then(() => {
                        navigate('/home')
                    })

                }
            }).catch(error => {
                throw error.response.data;
            })
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData()

    }, [])


    const handlechange = (event) => {
        setMemberLogin(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await axios.post(config.api_path + '/member/signin', memberLogin).then(res => {
                if (res.data.message === 'success') {
                    localStorage.setItem(config.token_name, res.data.token)
                    Swal.fire({
                        title: `Sign In`,
                        text: `You login as ${res.data.name}.`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: true
                    }).then(() => {
                        navigate('/home')
                    })



                } else {
                    Swal.fire({
                        title: `Sign In`,
                        text: res.message,
                        icon: 'warning',
                        showConfirmButton: true
                    })
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    Swal.fire({
                        title: `Sign In`,
                        text: error.response.data.message,
                        icon: 'warning',
                        showConfirmButton: true
                    })
                } else {
                    throw error.response.data
                }

            })
        } catch (error) {
            Swal.fire({
                title: "error",
                text: error.message,
                icon: "error"
            })
        }
    }



    return (
        <form onSubmit={handleSignIn}>
            <div className="card container mt-3">
                <div className="card-header">
                    <div className="card-title h2">Login to POS</div>
                </div>
                <div className="card-body">
                    <div className='mt-3'>
                        <label>Username</label>
                        <input name='username' value={memberLogin.username} onChange={e => handlechange(e)} required className='form-control mt-3' />
                    </div>
                    <div className='mt-3'>
                        <label>Password</label>
                        <input name='password' value={memberLogin.password} onChange={e => handlechange(e)} required type='password' className='form-control mt-3' />
                    </div>
                    <div className="mb-3 mt-3">
                        <button className='btn btn-primary' type='submit'><i className="fa-solid fa-check"></i> Sign in</button>
                    </div>
                </div>

            </div>

        </form>
    )
}



{/* <input name='name' value={member.name} onChange={e => handlechange(e)} required className='form-control mt-3' /> */ }