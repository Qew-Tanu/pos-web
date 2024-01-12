

export default function Modal(props) {

    let modalSize = 'modal-dialog';

    if (props.modalSize) {
        modalSize = modalSize + ' ' + props.modalSize;
    }
    return (
        <div>
            <div className="modal fade" id={props.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={modalSize}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{props.title}</h1>
                            <button type="button" id={props.mcid ? props.mcid : "btnModalclose"} className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
