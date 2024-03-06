import React from 'react'
import  { apiUrl } from '../../config/constant';
import Data from './Data';

export default async function page({ params }) {
  const data = await getData(params.test_id)

  return (
    <div className="terms-conditions-section pt-50">
      <h1 className="text-center">{data.heading}</h1>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="pt-50" id="terms">
                <Data data={data.data} ></Data>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




async function getData(params) {
  const formData = new FormData();
  formData.append("slug", params);
  const res = await fetch(`${apiUrl}/hints.php`, {
    method: 'POST',
    body: formData,
    cache: 'no-store'
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}



export async function generateMetadata({ params }) {
  
  const data = await getData(params.test_id)

 
  return {
    title: "Hints - " + data.heading,
  }
}