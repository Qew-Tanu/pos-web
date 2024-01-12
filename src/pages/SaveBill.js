import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import config from '../config'
import axios from 'axios'
import ProductList from '../components/ProductList'


export default function SaveBill() {
    const [products, setProducts] = useState([])
    const [billSave, setBillSave] = useState([])
    const [billdetail, setbilldetail] = useState({})
    const [billdetails, setbilldetails] = useState([])
    const [sum, setsum] = useState(0.00)
    const [recieve, setrecieve] = useState(0)


    const fetchBills = async () => {
        try {
            await axios.get(config.api_path + '/billsale/savebill', config.headers()).then(res => {
                setBillSave(res.data.results)
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

    useEffect(() => {
        fetchProductData()
        fetchBills()
    }, [])



    const sumItemOrder = (item) => {
        let sum = 0
        item.map(bill => {
            sum = sum + parseInt(bill.qty)
        })
        return sum
    }


    const dateConvert = (date) => {
        const newDate = new Date(date)
        return newDate.toLocaleString('th-TH')
    }



    const handleEditBill = async (item) => {
        try {
            await axios.post(config.api_path + '/billsale/editbill', item, config.headers()).then(res => {
                if (res.data.results === null) {
                    setbilldetail({})
                    setsum(0)
                } else {
                    setbilldetail(res.data.results[0]);
                    let sum = 0
                    res.data.results[0].billsaledetails.map(item => {
                        sum = sum + (parseInt(item.qty) * parseInt(item.price));
                    });
                    setsum(sum)
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

    const fetchDetailData = async () => {
        try {
            await axios.post(config.api_path + '/billsale/editbill', billdetail, config.headers()).then(res => {
                if (res.data.results === null) {
                    setbilldetail({})
                    setsum(0)
                } else {
                    setbilldetail(res.data.results[0]);
                    let sum = 0
                    res.data.results[0].billsaledetails.map(item => {
                        sum = sum + (parseInt(item.qty) * parseInt(item.price));
                    });
                    setsum(sum)
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

    const handlePlusMinusQty = async (item, type) => {
        try {
            const datainsert = {
                id: item.id
            }
            if (type === 'plus') {
                datainsert.qty = parseInt(item.qty) + 1
            } else if (type === 'minus') {
                datainsert.qty = parseInt(item.qty) - 1
            }

            if (datainsert.qty <= 0) {
                await axios.delete(config.api_path + `/billsale//delete/${item.id}`, config.headers()).then((res) => {
                    if (res.data.message === 'success') {
                        fetchDetailData()
                    }
                }).catch(error => {
                    throw error.response.data
                })
            } else {
                await axios.post(config.api_path + `/billsale/plusminus`, datainsert, config.headers()).then((res) => {
                    if (res.data.message === 'success') {
                        fetchDetailData()
                    }
                }).catch(error => {
                    throw error.response.data
                })
            }

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            })
        }
    }
    const handleDeleteSaleItem = async (item) => {
        try {
            await axios.delete(config.api_path + `/billsale/delete/${item.id}`, config.headers()).then((res) => {
                fetchDetailData()
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

    const handleDeleteBill = async (item) => {
        Swal.fire({
            title: "Delete bills",
            icon: "question",
            text: " Do you need to delete bill?",
            showConfirmButton: true,
            showCancelButton: true
        }).then(async (res) => {
            try {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + `/billsale/billdelete/${item.id}`, config.headers()).then((res) => {
                        fetchBills()
                    }).catch(error => {
                        throw error.response.data
                    })
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                })
            }
        })

    }

    const fetchProductData = async () => {
        try {
            axios.get(config.api_path + '/product/listforsale', config.headers()).then((res) => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results)
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

    const handlePay = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Summary Bill",
            text: `Confirm payment and ${(recieve - sum).toLocaleString('th-TH')} Baht change to customer`,
            showCloseButton: true,
            showCancelButton: true,
            icon: "question",
        }).then(async (res) => {
            try {
                if (res.isConfirmed) {
                    const datainsert = {
                        ...billdetail,
                        pricetotal: sum
                    }

                    await axios.post(config.api_path + '/billsale/finishorder', datainsert, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: "Finish payment",
                                text: "This order already finish payment",
                                timer: 2000
                            })
                            document.getElementById('btnEditClose').click()
                            fetchProductData()
                            setrecieve(0)
                            fetchDetailData()
                            fetchBills()
                        }
                    }).catch(error => {
                        throw error.response.data
                    })
                }


            } catch (error) {

            }
        })
    }

    const handleSale = async (item) => {
        try {
            const datainsert = {
                ...item,
                billeditid: billdetail.id
            }
            await axios.post(config.api_path + '/billsale/editsaledetail', datainsert, config.headers()).then((res) => {
                if (res.data.message === 'success') {
                    fetchDetailData()
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


    return (
        <div>
            <Template>
                <div className="card ">
                    <div className="card-header">
                        <div className="">
                            <div className='float-start'>
                                <h3>Save bills</h3>
                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table
                                className="table table-striped table-bordered align-middle text-center"
                            >
                                <thead className="align-middle">
                                    <tr>
                                        <th className='align-middle'>#</th>
                                        <th className='align-middle'>Save Date</th>
                                        <th className='align-middle'>Total price</th>
                                        <th className='align-middle'>Items Q'ty</th>
                                        <th className='align-middle' width='200px'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billSave.length > 0 ?
                                        billSave.map((item, index) => {
                                            return (
                                                <tr className='align-middle' key={item.id}>
                                                    <th className='align-middle'>{index}</th>
                                                    <th className='align-middle'>{dateConvert(item.updatedAt)}</th>
                                                    <td className='align-middle'>{parseInt(item.pricetotal).toLocaleString('th-TH')}</td>
                                                    <td className='align-middle bg-light'>{sumItemOrder(item.billsaledetails)}</td>
                                                    <td className='align-middle'>
                                                        <button onClick={() => handleEditBill(item)} className='btn btn-primary mr-2'><i className='fa fa-edit' data-bs-toggle="modal" data-bs-target="#ModalEditBill"></i></button>
                                                        <button onClick={() => handleDeleteBill(item)} className='btn btn-danger'><i className='fa fa-times'></i></button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        : <tr></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </Template >
            <Modal id="ModalEditBill" title="Edit / Pay bill" modalSize="modal-xl" mcid='btnEditClose'>
                <div className='mb-3 d-flex justify-content-between'>
                    <div>
                        <button
                            disabled={
                                billdetail.billsaledetails !== undefined ?
                                    billdetail.billsaledetails.length > 0 ? false : true : false
                            }
                            className='btn btn-info me-3'><i className='fa fa-save'></i> Save order</button>
                    </div>
                    <div className='d-flex align-middle'>
                        <div className='my-auto h3 me-2'>Total price :</div>
                        <div className='bg-dark text-success h3 px-3 my-auto'>
                            {sum.toLocaleString('th-TH')}

                        </div>
                    </div>

                </div>
                <form onSubmit={handlePay}>
                    <div className="mb-3 row">
                        <label className="col-sm-4 col-form-label">Total price</label>
                        <div className="col-sm-8">
                            <div className="form-control input" type="text" aria-label="readonly input example" >
                                {sum.toLocaleString('th-TH')} Baht
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputRecieve" className="col-sm-4 col-form-label">Recieve money</label>
                        <div className="col-sm-8">
                            <input className="form-control" id="inputRecieve" value={recieve.toLocaleString('th-TH')} onChange={(e) => setrecieve(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-4 col-form-label">Change</label>
                        <div className="col-sm-8">
                            <div className="form-control input bg-secondary" type="text" aria-label="readonly input example" >
                                {(recieve - sum).toLocaleString('th-TH')} Baht
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div>
                            <button disabled={recieve === 0 || recieve < sum ? true : false} type='submit' className='btn btn-primary'><i className='fa fa-check'></i> Pay</button>
                        </div>

                    </div>

                </form>
                <div className="input-group">
                    <h3>Click to order</h3>
                </div>

                <div className='row mt-3'>
                    {products.length > 0 ?
                        products.map((item) => {
                            return (
                                <ProductList item={item} handle={handleSale} key={item.id} />
                                // <div className='col-3' key={item.id}>

                                //     <div className="card text-center">
                                //         <div className="btn"
                                //             // onClick={() => handleOrder(item)}
                                //             onClick={() => handleSale(item)}
                                //         >
                                //             <div className="card-header">
                                //                 <img src={config.api_path + '/uploads/' + item.productImages[0].imageName} className="card-img-top" alt="..." />

                                //             </div>
                                //             <div className="card-body">
                                //                 <h5 className="card-text">{item.name}</h5>
                                //                 <p className="card-text">{item.price} Baht</p>
                                //             </div>
                                //         </div>
                                //     </div>
                                // </div>


                            )
                        })
                        : <div></div>}
                </div>
                <div className="table-responsive">
                    <table
                        className="table table-striped table-bordered align-middle text-center"
                    >
                        <thead className="align-middle">
                            <tr>
                                <th className='align-middle'>#</th>
                                <th className='align-middle'>barcode</th>
                                <th className='align-middle'>Product Name</th>
                                <th className='align-middle'>Sell Price</th>
                                <th className='align-middle'>Q'ty</th>
                                <th className='align-middle'>Total price</th>
                                <th className='align-middle' width='200px'>Edit/Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billdetail.billsaledetails !== undefined ?
                                billdetail.billsaledetails.length > 0 ?
                                    billdetail.billsaledetails.map((item, index) => {
                                        return (
                                            <tr className='align-middle' key={item.id}>
                                                <th className='align-middle'>{index}</th>
                                                <th className='align-middle'>{item.product.barcode}</th>
                                                <td className='align-middle'>{item.product.name}</td>
                                                <td className='align-middle'>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                                <td className='align-middle bg-light'><h5>{item.qty}</h5></td>
                                                <td className='align-middle'>{parseInt(item.price * item.qty).toLocaleString('th-TH')}</td>
                                                <td className='align-middle'>
                                                    <button onClick={() => handlePlusMinusQty(item, "plus")} className='btn btn-primary mr-2'><i className='fa fa-plus'></i></button>
                                                    <button onClick={() => handlePlusMinusQty(item, "minus")} className='btn btn-info mr-2'><i className='fa fa-minus'></i></button>
                                                    <button onClick={() => handleDeleteSaleItem(item)} className='btn btn-danger'><i className='fa fa-times'></i></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : <tr></tr> : <tr></tr>}
                        </tbody>
                    </table>
                </div>
            </Modal>


        </div >

    )
}