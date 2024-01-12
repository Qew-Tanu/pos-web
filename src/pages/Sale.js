import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import config from '../config'
import axios from 'axios'
import ProductList from '../components/ProductList'


export default function Sale() {
    const [products, setProducts] = useState([])
    const [billSale, setBillSale] = useState({})
    const [billdetails, setbilldetails] = useState([])
    const [sum, setsum] = useState(0.00)
    const [recieve, setrecieve] = useState(0)

    useEffect(() => {
        fetchProductData()
        openBill()
        fetchDataSale()
    }, [])

    const handleOrder = (item) => {
        const i = billdetails.findIndex((e) => e.id === item.id)
        if (i > -1) {
            const billcheck = billdetails.map(items => {
                if (items.id === item.id) {
                    return { ...items, Qty: items.Qty + 1 }
                } else {
                    return items
                }
            })
            setbilldetails(billcheck)


        } else {
            const newItem = { ...item, Qty: 1 }
            setbilldetails((prev) => [...prev, newItem])
        }


    }

    const openBill = async () => {
        try {
            await axios.get(config.api_path + '/billsale/openBill', config.headers()).then((res) => {
                if (res.data.message === 'success') {
                    setBillSale(res.data.results)
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

    const handleSale = async (item) => {
        try {
            await axios.post(config.api_path + '/billsale/sale', item, config.headers()).then((res) => {
                if (res.data.message === 'success') {
                    fetchDataSale()
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

    const fetchDataSale = async () => {
        try {
            await axios.get(config.api_path + '/billsale/detaillist', config.headers()).then((res) => {
                if (res.data.results === null) {
                    setbilldetails([])
                    setsum(0)
                } else {
                    setbilldetails(res.data.results.billsaledetails)
                    let sum = 0
                    res.data.results.billsaledetails.map(item => {
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

    const handleDeleteSaleItem = async (item) => {
        try {
            await axios.delete(config.api_path + `/billsale/delete/${item.id}`, config.headers()).then((res) => {
                fetchDataSale()
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
                await axios.delete(config.api_path + `/billsale/delete/${item.id}`, config.headers()).then((res) => {
                    if (res.data.message === 'success') {
                        fetchDataSale()
                    }
                }).catch(error => {
                    throw error.response.data
                })
            } else {
                await axios.post(config.api_path + `/billsale/plusminus`, datainsert, config.headers()).then((res) => {
                    if (res.data.message === 'success') {
                        fetchDataSale()
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
                        ...billSale[0],
                        pricetotal: sum
                    }

                    await axios.post(config.api_path + '/billsale/finishorder', datainsert, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: "Finish payment",
                                text: "This order already finish payment",
                                timer: 2000
                            })
                            document.getElementById('btnPayClose').click()
                            fetchProductData()
                            openBill()
                            fetchDataSale()
                            setrecieve(0)
                        }
                    }).catch(error => {
                        throw error.response.data
                    })
                }


            } catch (error) {

            }
        })

    }
    const handleSaveBill = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Save Bill",
            text: `Save oder list and ${(sum).toLocaleString('th-TH')} Baht will pay later`,
            showCloseButton: true,
            showCancelButton: true,
            icon: "question",
        }).then(async (res) => {
            try {
                if (res.isConfirmed) {
                    const datainsert = {
                        ...billSale[0],
                        pricetotal: sum
                    }
                    await axios.post(config.api_path + '/billsale/saveorder', datainsert, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: "Save order",
                                text: "This order have been save and wait for payment",
                                timer: 2000
                            })
                            document.getElementById('btnPayClose').click()
                            fetchProductData()
                            openBill()
                            fetchDataSale()
                            setrecieve(0)
                        }
                    }).catch(error => {
                        throw error.response.data
                    })
                }


            } catch (error) {

            }
        })

    }



    useEffect(() => {
    }, [billSale])



    return (
        <div>
            <Template>
                <div className="card ">
                    <div className="card-header">
                        <div className="">
                            <div className='float-start'>
                                <h3>Make order</h3>
                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className='mb-3 d-flex justify-content-between'>
                            <div>
                                <button onClick={handleSaveBill} disabled={billdetails.length === 0 ? true : false} className='btn btn-info me-3'><i className='fa fa-save'></i> Save order</button>
                                <button onClick={() => setrecieve(0)} disabled={billdetails.length === 0 ? true : false} data-bs-toggle="modal" data-bs-target="#ModalPayBill" className='btn btn-success'><i className='fa fa-check'></i> Finish and pay</button>
                            </div>
                            <div className='d-flex align-middle'>
                                <div className='my-auto h3 me-2'>Total price :</div>
                                <div className='bg-dark text-success h3 px-3 my-auto'>
                                    {parseInt(sum).toLocaleString('th-TH')}

                                </div>
                            </div>

                        </div>


                        <div className="input-group">
                            <h3>Click to order</h3>
                        </div>

                        <div className='row mt-3'>
                            {products.length > 0 ?
                                products.map((item) => {
                                    return (
                                        <ProductList item={item} handle={handleSale} key={item.id} />
                                    )
                                })
                                : <div></div>}
                        </div>
                        <h4 className='mt-3'>Sale Item</h4>
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
                                    {billdetails.length > 0 ?
                                        billdetails.map((item, index) => {
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
                                        : <tr></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </Template >

            <Modal id="ModalPayBill" title="Pay bill" modalSize="modal-lg" mcid='btnPayClose'>
                <form onSubmit={handlePay}>
                    <div className="mb-3 row">
                        <label className="col-sm-4 col-form-label">Total price</label>
                        <div className="col-sm-8">
                            <div className="form-control input" type="text" aria-label="readonly input example" >
                                {(sum).toLocaleString('th-TH')} Baht
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
                            <button disabled={recieve === 0 ? true : false} type='submit' className='btn btn-primary'><i className='fa fa-check'></i> Pay</button>
                        </div>

                    </div>

                </form>
            </Modal>
        </div >

    )
}