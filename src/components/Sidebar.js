import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import config from '../config';
import { Link } from 'react-router-dom';



export default function Sidebar() {
    const [memberName, setMemberName] = useState(null);
    const [packageName, setPackageName] = useState();
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name)
                    setPackageName(res.data.result.package.name)
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

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <a href="index3.html" className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: .8 }} />
                    <span className="brand-text font-weight-light">POS on Cloud</span>
                </a>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info text-white">
                            <div>{memberName === null ? "Hello" : memberName}</div>
                            <div>Package : {packageName}</div>
                        </div>
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link to="/sale" className="nav-link">
                                    <i className="nav-icon fas fa-barcode"></i>
                                    <p>
                                        Order
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/savebill" className="nav-link">
                                    <i className="nav-icon fas fa-save"></i>
                                    <p>
                                        Save bills
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/allpaybill" className="nav-link">
                                    <i className="nav-icon fas fa-save"></i>
                                    <p>
                                        All pay bills
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/product" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p>
                                        Products
                                    </p>
                                </Link>
                            </li>



                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    )
}
