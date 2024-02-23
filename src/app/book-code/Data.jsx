import React from 'react'
export default function Data(props) {
    return (
        <div className="row">

            {props.code.length === 0 && props.mockcode.length === 0 && props.bookcode.length === 0 && (
                <center><h4>You have not applied for any book code!</h4></center>
            )}

            {props.code.length > 0 && (
                <div className="col-xl-4">
                    <div className="event-details-content">
                        <ul className="mb-0 list-unstyled event-list">
                            <h2 className="text-center">Seprate Book Code</h2>
                            {props.code
                                .filter(item => item.user_code !== 0) // Filter items where user_code is not 0
                                .map((item, index) => (
                                    <li className="d-flex" key={index}>
                                        <div className="flex-shrink-0 pr-b-4">
                                            <img src="/assets/images/icon/check-2.svg" alt="check-2" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <span>
                                                {item.book_name}
                                                <span className="fees-a" style={{ marginLeft: '5px' }}>
                                                    <div style={{ float: 'right' }}>
                                                        {item.user_code == 0 ? (
                                                            <><b>pending</b></>
                                                        ) : (
                                                            <><b>{item.user_code}</b></>
                                                        )}
                                                    </div>
                                                </span>
                                            </span>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            )}


            {props.bookcode.length > 0 && (
                <div className="col-xl-4">
                    <div className="event-details-content">
                        <ul className="mb-0 list-unstyled event-list">
                            <h2 className="text-center">All Book Code</h2>
                            {props.bookcode.map((item, index) => (
                                <li className="d-flex">
                                    <div className="flex-shrink-0 pr-b-4">
                                        <img src="/assets/images/icon/check-2.svg" alt="check-2" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <span>{item.book_name}<span className="fees-a" style={{ marginLeft: '5px' }}>
                                            <div style={{ float: 'right' }}>
                                                {item.user_code == 0 ? (
                                                    <><b>pending</b></>
                                                ) : (
                                                    <><b>{item.user_code}</b></>
                                                )}
                                            </div>
                                        </span></span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {props.mockcode.length > 0 && (
                <div className="col-xl-4">
                    <div className="event-details-content">
                        <ul className="mb-0 list-unstyled event-list">
                            <h2 className="text-center">Mock Code</h2>
                            {props.mockcode.map((item, index) => (
                                <li className="d-flex">
                                    <div className="flex-shrink-0 pr-b-4">
                                        <img src="/assets/images/icon/check-2.svg" alt="check-2" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <span>{item.book_name}<span className="fees-a" style={{ marginLeft: '5px' }}>
                                            <div style={{ float: 'right' }}>
                                                {item.user_code == 0 ? (
                                                    <><b>pending</b></>
                                                ) : (
                                                    <><b>{item.user_code}</b></>
                                                )}
                                            </div>
                                        </span></span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
