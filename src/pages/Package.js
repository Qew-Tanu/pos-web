import React, { useEffect, useState } from 'react'
import config from '../config';
import axios from 'axios'
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';


export default function Package() {
  const [packages, setPackages] = useState([]);
  const [packageChoose, setPackageChoose] = useState({})
  const [member, setMember] = useState({
    name: "",
    phone: "",
    password: "",
    packageid: ""
  })

  const navigate = useNavigate()

  useEffect(() => {
    fetchData()

  }, [])

  async function fetchData() {
    try {
      axios.get(config.api_path + '/package/list').then(res => {
        setPackages(res.data.results)
      }).catch(error => {
        throw error.response.data
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  const handlechange = (event) => {
    setMember(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const choosePackage = (item) => {
    setPackageChoose(item)
    setMember({
      name: "",
      phone: "",
      password: "",
      username: "",
      packageId: item.id
    })
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: `Confirm to continue`,
        text: `Confirm to join us as ${packageChoose.name} version`,
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      }).then(async (res) => {
        if (res.isConfirmed) {
          // console.log(res);
          await axios.post(config.api_path + '/package/memberRegister', member).then(res => {
            // console.log(res);
            if (res.data.message === "success") {
              Swal.fire({
                title: `Save your package register`,
                text: `Your package is ${packageChoose.name} version.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                document.getElementById('btnModalclose').click()
                navigate('/login')
              })
            }
          }).catch(error => {
            throw error
          })
        }
      }).catch(error => {
        console.log(error);
        if (error.response.status === 401) {
          Swal.fire({
            title: `Username`,
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
    <div>
      <div className='container mt-2'>
        <nav className="navbar navbar-expand navbar-white navbar-light mb-3">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/login" className='btn btn-primary'>Login</Link>
            </li>
          </ul>
        </nav>
        <div className='h2 text-secondary'>POS: Point of slae on cloud</div>
        <div className='h5'>Package for you</div>
        <div className='row'>
          {packages.map((item) => {
            return (
              <div className='col-4' key={item.id}>
                <div className="card">
                  <div className="card-body text-center">
                    <div className='h4 text-success'>{item.name}</div>
                    <div className='h5'>
                      {(parseInt(item.bill_amount)).toLocaleString('th-TH')} bills per month
                    </div>

                    <div className='h5'>{(parseInt(item.price)).toLocaleString('th-TH')} Baht</div>
                    <div className='mt-3'>
                      <button onClick={(e) => { choosePackage(item) }} data-bs-toggle="modal" data-bs-target="#modalRegister" className='btn btn-primary'>Sign up</button>
                    </div>
                  </div>
                </div>

              </div>

            )
          })}

        </div>
      </div>
      <Modal id='modalRegister' title="Join now">
        <form onSubmit={handleRegister}>
          <div>
            <label>Package</label>
            <div className='alert alert-info'>{packageChoose.name} - {packageChoose.price} Baht</div>
          </div>
          <div className='my-3'>
            <label>Shop Name</label>
            <input name='name' value={member.name} onChange={e => handlechange(e)} required className='form-control mt-3' />
          </div>
          <div className='my-3'>
            <label>Username</label>
            <input name='username' value={member.username} onChange={e => handlechange(e)} required className='form-control mt-3' />
          </div>
          <div className='my-3'>
            <label>Password</label>
            <input name='password' type='password' value={member.password} onChange={e => handlechange(e)} required className='form-control mt-3' />
          </div>
          <div>
            <label>Phone</label>
            <input name='phone' value={member.phone} onChange={e => handlechange(e)} required className='form-control mt-3' />
          </div>
          <div className='mt-3 d-flex justify-content-between'>
            <button className='btn btn-primary' type='submit'>Confirm <i className="fa-solid fa-arrow-right"></i></button>
            {/* <button className='btn btn-danger' data-bs-dismiss="modal" data-bs-target="#modalRegister">Cancle</button> */}
          </div>
        </form>
      </Modal>
    </div >
  )
}
