import React from 'react'
import config from '../config'



export default function ProductList({ item, handle }) {

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
                            <img src={config.api_path + '/uploads/' + item.productImages[0].imageName} className="card-img-top object-fit-contain" style={{ height: '20vw' }} alt="..." />

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
