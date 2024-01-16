import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import Swal from 'sweetalert2'
import config from '../config'
import axios from 'axios'
import Modal from '../components/Modal'
import { storage } from '../utility/firebase'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'



const emptyproduct = {
    barcode: "",
    name: "",
    cost: "",
    price: "",
    detail: "",
}
export default function Product() {
    const [product, setProduct] = useState(emptyproduct)
    const [products, setProducts] = useState([])
    const [productImage, setProductImage] = useState(null)
    const [uploadValue, setUploadValue] = useState("")
    const [productImages, setProductImages] = useState([])
    const [productImageList, setProductImageList] = useState([])

    const handlechange = (event) => {
        setProduct(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const fetchProductData = async () => {
        try {
            axios.get(config.api_path + '/product/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results)
                }
            }).catch(error => {
                throw error.response.data
            })
        } catch (error) {

        }
    }

    useEffect(() => {
    }, [productImage])

    // const testimageListRef = ref(storage, `image/13/2024-1-15-16-55-50-494-87981.jpg`)
    useEffect(() => {
        fetchProductData()
        // getDownloadURL(testimageListRef).then((url) => {
        // })


    }, [])

    useEffect(() => {
    }, [product])




    const deleteProduct = (item) => {
        try {
            Swal.fire({
                title: `Confirm to continue`,
                text: `Confirm to delete ${item.name}`,
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + `/product/delete/${item.id}`, config.headers()).then(res => {
                        if (res.data.message === "success") {
                            Swal.fire({
                                title: `Delete product`,
                                text: `your product already delete`,
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(res => {
                                fetchProductData()
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
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let url = config.api_path + '/product/insert';

            if (product.id !== undefined) {
                url = config.api_path + '/product/update';
            }
            await axios.post(url, product, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: "Save Product",
                        text: "Product have been save",
                        icon: "success",
                        timer: 2000,
                    }).then(res => {
                        setProduct(emptyproduct)
                        fetchProductData()
                    }).then(() => {
                        document.getElementById('btnProductClose').click()
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



    const handleChangeFile = (e) => {
        setProductImage(e.target.files[0])
        setUploadValue(e.target.value)
    }

    const uploadImage = (imagename) => {
        if (productImage === null) return;
        const productImageName = imagename
        const imageRef = ref(storage, `/image/${product.id}/${productImageName}`)
        uploadBytes(imageRef, productImage).then(() => {
            // alert("Image already upload")
        })
    }

    const handleUploadFile = async () => {
        try {
            const newConfig = {
                headers: {
                    ...config.headers().headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
            const formData = new FormData();
            const myDate = new Date();
            const nameArray = [
                myDate.getFullYear(),
                myDate.getMonth() + 1,
                myDate.getDate(),
                myDate.getHours(),
                myDate.getMinutes(),
                myDate.getSeconds(),
                myDate.getMilliseconds(),
                parseInt(Math.random() * 100000)
            ]
            const re = /(?:\.([^.]+))?$/;
            const ext = re.exec(productImage.name)[1];
            const productImageName = nameArray.join("-") + "." + ext

            formData.append("productImage", productImage)
            formData.append("productImageName", productImageName)
            formData.append("productId", product.id)
            await axios.post(config.api_path + `/productImage/insert`, formData, newConfig).then(res => {
                if (res.data.message === 'success') {
                    uploadImage(productImageName)
                    Swal.fire({
                        title: "Save Product image",
                        text: "Product image have been upload",
                        icon: "success",
                        timer: 2000,
                    }).then(() => {
                        setProductImage({})
                        fetchProductImages(product)
                        setUploadValue("")
                    }).then(() => {
                        // document.getElementById('btnProductImageClose').click()
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

    const fetchProductImages = async (item) => {
        setProductImages([])
        try {
            await axios.get(config.api_path + `/productImage/list/${item.id}`, config.headers()).then(async (res) => {
                if (res.data.message === "success") {
                    const datafetch = res.data.results
                    const testttt = []
                    datafetch.map(async (itemlist) => {
                        const testimageListRef = ref(storage, `image/${item.id}/${itemlist.imageName}`)
                        await getDownloadURL(testimageListRef).then(urltest => {
                            testttt.push({ ...itemlist, url: urltest })
                            setProductImages(prev => [...prev, { ...itemlist, url: urltest }])
                        })
                    })
                    // return setProductImages(testttt)

                    // const imageListRef = ref(storage, `image/${item.id}/`)
                    // await listAll(imageListRef).then(res => {
                    //     const imagelistAll = res
                    //     let datacheck = []
                    //     datafetch.map(async (item) => {
                    //         const findUrl = imagelistAll.items.find((image) => image.name === item.imageName)
                    //         let finalUrl = ""
                    //         await getDownloadURL(findUrl).then(url => {
                    //             finalUrl = url
                    //             datacheck.push({ ...item, url: finalUrl })
                    //             setProductImages(datacheck)
                    //         })
                    //     })
                    // })
                    // const datacheck = datafetch.map(async (item) => {
                    //     const findUrl = imagelistAll.items.find((image) => image.name === item.imageName)
                    //     let finalUrl = ""
                    //     await getDownloadURL(findUrl).then(url => {
                    //         finalUrl = url
                    //     })
                    //     return { ...item, url: finalUrl }
                    // })
                    // listAll(imageListRef).then(res => {
                    //     res.items.forEach((item) => {
                    //         getDownloadURL(item).then((url) => {
                    //         })
                    //     })
                    // })
                    // setProductImages(datacheck)
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

    const handleChooseMainImage = (item) => {
        Swal.fire({
            title: `Confirm to continue`,
            text: `Confirm to set this image to main image`,
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            try {
                if (res.isConfirmed) {
                    await axios.get(config.api_path + `/productImage/choosemainimage/${item.id}/${product.id}`, config.headers()).then((res) => {
                        if (res.data.message === "success") {
                            fetchProductImages(product)
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

        })
    }

    const handleDeleteImage = async (item) => {
        try {
            Swal.fire({
                title: `Confirm to continue`,
                text: `Confirm to delete this image`,
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async (res) => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + `/productImage/delete/${item.id}`, config.headers()).then(res => {
                        if (res.data.message === "success") {
                            Swal.fire({
                                title: `Delete product`,
                                text: `your product already delete`,
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(res => {
                                fetchProductImages(product)
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


    return (
        <div>
            <Template>
                <div className="card ">
                    <div className="card-header">
                        <div className="card-title">
                            <h3>Products</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <button onClick={() => setProduct(emptyproduct)} data-bs-toggle="modal" data-bs-target="#ModalProduct" className='btn btn-primary'>
                            <i className='fa fa-plus'></i> Add product
                        </button>
                        <h4 className='mt-3'>All Products</h4>
                        <div className="table-responsive">
                            <table
                                className="table table-striped table-bordered align-middle text-center"
                            >
                                <thead className="align-middle">
                                    <tr>
                                        <th className='align-middle'>Barcode</th>
                                        <th className='align-middle'>Product Name</th>
                                        <th className='align-middle'>Sell Price</th>
                                        <th className='align-middle'>Cost</th>
                                        <th className='align-middle'>Detail</th>
                                        <th className='align-middle' width='200px'>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item => {
                                        return (<tr className='align-middle' key={item.id}>
                                            <th className='align-middle'>{item.barcode}</th>
                                            <td className='align-middle'>{item.name}</td>
                                            <td className='align-middle'>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                            <td className='align-middle'>{parseInt(item.cost).toLocaleString('th-TH')}</td>
                                            <td className='align-middle'>{item.detail}</td>
                                            <td className='align-middle'>
                                                <button onClick={() => {
                                                    setProduct(item)
                                                    setProductImage({})
                                                    setUploadValue("")
                                                    fetchProductImages(item)
                                                }} data-bs-toggle="modal" data-bs-target="#ModalProductImage" className='btn btn-primary mr-2'><i className='fa fa-image'></i></button>
                                                <button onClick={() => setProduct(item)} data-bs-toggle="modal" data-bs-target="#ModalProduct" className='btn btn-info mr-2'><i className='fa fa-pencil'></i></button>
                                                <button onClick={() => deleteProduct(item)} className='btn btn-danger'><i className='fa fa-times'></i></button>
                                            </td>
                                        </tr>
                                        )
                                    }))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </Template >

            <Modal id="ModalProduct" title="Add new product" modalSize="modal-lg" mcid='btnProductClose'>
                <form onSubmit={handleSave}>
                    <div className="row">
                        <div className="mt-3 col-2">
                            <label>barcode</label>
                            <input name='barcode' value={product.barcode} onChange={handlechange} className='form-control' />
                        </div>
                        <div className="mt-3 col-10">
                            <label>Product name</label>
                            <input name='name' value={product.name} onChange={handlechange} className='form-control' />
                        </div>
                        <div className="mt-3 col-2">
                            <label>Sell price</label>
                            <input type='number' name='price' value={product.price} onChange={handlechange} className='form-control' />
                        </div>
                        <div className="mt-3 col-2">
                            <label>ฺCost</label>
                            <input type='number' name='cost' value={product.cost} onChange={handlechange} className='form-control' />
                        </div>
                        <div className="mt-3 col-8">
                            <label>Detail</label>
                            <input name='detail' value={product.detail} onChange={handlechange} className='form-control' />
                        </div>
                        <div className="mt-3">
                            <button type="submit" className='btn btn-primary'><i className='fa fa-check'> Save</i></button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal id="ModalProductImage" title="Add product image" modalSize="modal-xl" mcid='btnProductImageClose'>
                <div className="container">
                    <div className="row">
                        <div className="mt-3 col-2">
                            <label>barcode</label>
                            <input value={product.barcode} disabled className='form-control' />
                        </div>
                        <div className="mt-3 col-10">
                            <label>Product name</label>
                            <input value={product.name} disabled className='form-control' />
                        </div>
                        <div className="mt-3 col-2">
                            <label>Sell price</label>
                            <input value={product.price} disabled className='form-control' />
                        </div>
                        <div className="mt-3 col-2">
                            <label>ฺCost</label>
                            <input value={product.cost} disabled className='form-control' />
                        </div>
                        <div className="mt-3 col-8">
                            <label>Detail</label>
                            <input value={product.detail} disabled className='form-control' />
                        </div>
                        <div className="mt-3 col-12">
                            <label>Choose Product image</label>
                            <input value={uploadValue} onChange={handleChangeFile} accept="image/*" type="file" name="imageName" className='form-control' />
                        </div>

                    </div>
                    <div className="mt-3">
                        {productImage !== null ? (productImage.name !== undefined ?
                            <button
                                onClick={() => {
                                    handleUploadFile()
                                    // uploadImage()
                                }

                                } className='btn btn-primary'>
                                <i className='fa fa-check'></i> Upload image
                            </button>
                            : "") : ""}

                    </div>
                    <div className="mt-3 h5">Product image</div>
                    <div className='row mt-3' >
                        {productImages.length > 0 ? productImages.map((item) => {
                            return (
                                <div className="col-3 justify-content-center mt-3" key={item.id} >
                                    <div className="card text-center " style={{ 'maxHeight': '400px' }}>
                                        <div className='d-flex flex-column' style={{ 'height': '400px' }}>
                                            <div style={{ height: '100%', overflow: 'hidden' }}>
                                                <img className='img-thumbnail' src={item.url} alt="" />
                                            </div>
                                            <div className="card-body d-flex flex-column justify-content-end">
                                                <div className='d-flex justify-content-evenly'>
                                                    {item.isMain ? (

                                                        <button disabled className='btn btn-info mr-1'>Set main image</button>

                                                    ) : (

                                                        <button onClick={() => handleChooseMainImage(item)} className='btn btn-primary mr-1'>Set main image</button>

                                                    )}
                                                    <button onClick={() => handleDeleteImage(item)} className='btn btn-danger ml-1'><i className='fa fa-times'></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })

                            : ""}
                    </div>
                </div>

            </Modal>
        </div >
    )
}




