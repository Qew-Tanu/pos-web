import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import config from '../config'
import axios from 'axios'


const emptyuser = {
    name: "",
    level: "user",
    username: "",
    password: "",
    confirmPassword: "",
}

const condition = [" ", "@", "/", "*"];


export default function User() {
    const [user, setUser] = useState(emptyuser)
    const [userEdit, setUserEdit] = useState({})
    const [users, setUsers] = useState([])
    const [btnaction, setbtnaction] = useState(true)

    const handleuserchange = (event) => {
        setUser(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleuserEditchange = (event) => {
        setUserEdit(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(config.api_path + `/user/insert`, user, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: "Save Product",
                        text: "Product have been save",
                        icon: "success",
                        timer: 2000,
                    }).then(res => {
                        setUser(emptyuser)
                        fetchUserList()
                    }).then(() => {
                        document.getElementById('btnUserClose').click()
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
                throw error.response.data
            })
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    }

    const handleSaveEditUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(config.api_path + `/user/update`, userEdit, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: "Save Product",
                        text: "Product have been save",
                        icon: "success",
                        timer: 2000,
                    }).then(res => {
                        setUser(emptyuser)
                        fetchUserList()
                    }).then(() => {
                        document.getElementById('btnUserEditClose').click()
                    })
                }
            }).catch(error => {
                throw error.response.data
            })
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    }
    const fetchUserList = async () => {
        try {
            await axios.get(config.api_path + `/user/list`, config.headers()).then((res) => {
                setUsers(res.data.results)
            })
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    }

    const disableBtn = () => {
        if (user.password !== user.confirmPassword) {
            return true
        }
        if (user.name === "" || user.username === "" || user.password === "" || user.confirmPassword === "") {
            return true
        }
        if (condition.some(item => user.username.includes(item))) {
            return true
        }

        return false

    }

    const deleteUser = (item) => {
        try {
            Swal.fire({
                title: `Confirm to continue`,
                text: `Confirm to delete user : ${item.username}`,
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + `/user/delete/${item.id}`, config.headers()).then(res => {
                        if (res.data.message === "success") {
                            Swal.fire({
                                title: `Delete user`,
                                text: `your user already delete`,
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(res => {
                                fetchUserList()
                            })
                        }
                    }).catch(error => {
                        throw error.response.data
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

    useEffect(() => {
        setbtnaction(disableBtn())
    }, [user])

    useEffect(() => {
    }, [userEdit])

    useEffect(() => {
        fetchUserList()


        const testname = "Hello"



    }, [])



    // useEffect(() => {
    // }, [btnaction])





    return (
        <div>
            <Template>
                <div className="card ">
                    <div className="card-header">
                        <div className="card-title">
                            <h3>User</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <button onClick={() => setUser(emptyuser)} data-bs-toggle="modal" data-bs-target="#ModalUser" className='btn btn-primary'>
                            <i className='fa fa-plus'></i> Add user
                        </button>
                        <h4 className='mt-3'>All Users</h4>
                        <div className="table-responsive">
                            <table
                                className="table table-striped table-bordered align-middle text-center"
                            >
                                <thead className="align-middle">
                                    <tr>
                                        <th className='align-middle'>Name</th>
                                        <th className='align-middle'>Username</th>
                                        <th className='align-middle'>Level</th>
                                        <th className='align-middle' width='200px'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((item => {
                                        return (<tr className='align-middle' key={item.id}>
                                            <th className='align-middle'>{item.name}</th>
                                            <td className='align-middle'>{item.username}</td>
                                            <td className='align-middle'>{item.level}</td>
                                            <td className='align-middle'>
                                                <button
                                                    onClick={() => setUserEdit(item)}
                                                    data-bs-toggle="modal" data-bs-target="#ModalEditUser" className='btn btn-info mr-2'><i className='fa fa-pencil'></i></button>
                                                <button
                                                    onClick={() => deleteUser(item)}
                                                    className='btn btn-danger'><i className='fa fa-times'></i></button>
                                            </td>
                                        </tr>
                                        )
                                    }))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </Template>

            <Modal id="ModalUser" title="Add new user" modalSize="modal-lg" mcid='btnUserClose'>
                <form onSubmit={handleSaveUser}>
                    <div className="row">
                        <div className="mt-3 col-8 ">
                            <label >Name</label>
                            <input name='name' value={user.name} onChange={handleuserchange} className='form-control' />
                            <div className={user.name !== "" ? "invisible text-danger" : "text-danger"}>Please fill your name</div>
                        </div>
                        <div className="mt-3 col-4">
                            <label>Level</label>
                            <select name='level' value={user.level} onChange={handleuserchange} className='form-select ' >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="mt-3 col-12">
                            <label>Username</label>
                            <input name='username' value={user.username} onChange={handleuserchange} className='form-control' />
                            {user.username === "" ?
                                <div className="text-danger">Can't be empty</div> :
                                (condition.some(item => user.username.includes(item)) ?
                                    <div className="text-danger">Can't include space, @, /, *</div> :
                                    <div className='invisible text-danger'>....</div>)
                            }

                        </div>
                        <div className="mt-3 col-6">
                            <label>Password</label>
                            <input type='password' name='password' value={user.password} onChange={handleuserchange} className='form-control' />
                            <div className={user.password !== "" ? "invisible text-danger" : "text-danger"}>Can't be empty</div>
                        </div>
                        <div className="mt-3 col-6">
                            <label className=''>Confirm password</label>
                            <input type='password' name='confirmPassword' value={user.confirmPassword} onChange={handleuserchange} className='form-control' />
                            <div className={user.password === user.confirmPassword || user.confirmPassword === "" ? "invisible text-danger" : "text-danger"}>Must be same with password</div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" disabled={btnaction} className='btn btn-primary'><i className='fa fa-check'> Save</i></button>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal id="ModalEditUser" title="Add new user" modalSize="modal-lg" mcid='btnUserEditClose'>
                <form onSubmit={handleSaveEditUser}>
                    <div className="row">
                        <div className="mt-3 col-8 ">
                            <label >Name</label>
                            <input name='name' value={userEdit.name} onChange={handleuserEditchange} className='form-control' />
                            <div className={userEdit.name !== "" ? "invisible text-danger" : "text-danger"}>Please fill your name</div>
                        </div>
                        <div className="mt-3 col-4">
                            <label>Level</label>
                            <select name='level' value={userEdit.level} onChange={handleuserEditchange} className='form-select ' >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="mt-3 col-12">
                            <label>Username</label>
                            <input name='username' value={userEdit.username} onChange={handleuserEditchange} className='form-control' />
                            <div className={userEdit.username !== "" ? "invisible text-danger" : "text-danger"}>Can't be empty</div>

                        </div>
                        <div className="mt-3">
                            <button type="submit" className='btn btn-primary'><i className='fa fa-check'> Save</i></button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}


