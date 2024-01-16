import React, { useState } from 'react'
import config from '../config'
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../utility/firebase';



export default function ProductList({ item, handle }) {
    const [url, seturl] = useState("")
    // console.log(item);
    const testimageListRef = ref(storage, `image/${item.id}/${item.productImages[0].imageName}`)
    getDownloadURL(testimageListRef).then(urltest => {
        seturl(urltest)
    })
    return (
        <div className='col-3 mb-3'>



            <div className="card text-center  ">
                <div className="btn"
                    onClick={() => handle(item)}
                >
                    <div className="card-header "
                    // style={{ height: 'auto' }}
                    >
                        <div className="" >
                            <img src={url} className="card-img-top object-fit-contain" style={{ height: '20vw' }} alt="..." />

                        </div>

                    </div>
                    <div className="card-body">
                        <h5 className="card-text">{item.name}</h5>
                        <p className="card-text">{item.price} Baht</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
