import Link from "next/link";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { SlugToTitle, apiUrl } from '../../config/constant';
import Data from "./Data";
import Test from "./Test";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";


export default async function Page({ params }) {
  const datas = await getServerSession(authOptions);
  if (params.multiple.length == 2) {
    const data = await getData(params.multiple[1])
    return (
      <>
        <section className="courses-category-area ptb-50">
          <h1 className="text-center">
            Medipedia Guide <i className="fas fa-arrow-right"></i> {data.heading}
          </h1>
          <br />
          <div className="container mw-1470">
            <div className="col col-lg-12 row">
              <Data preparama={params.multiple[0]} preparamb={params.multiple[1]} preparamc={params.multiple[2]} value={data.data}></Data>
            </div>
          </div>
        </section>

      </>
    );
  } else {
    const data = await getData2(params.multiple[2], datas.user.id)
    return (
      <>
        <section className="courses-category-area ptb-50">
          <h1 className="text-center">
            Medipedia Guide <i className="fas fa-arrow-right"></i> {data.heading}
          </h1>
          <br />
          <div className="container mw-1470">
            <div className="col col-lg-12 row">
              <Test preparama={params.multiple[0]} preparamb={params.multiple[1]} preparamc={params.multiple[2]} value={data.data}></Test>
            </div>
          </div>
        </section>

      </>
    );



  }




}

async function getData(params) {
  const formData = new FormData();
  formData.append("slug", params);
  const res = await fetch(`${apiUrl}/papers.php`, {
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


async function getData2(params, user_id) {
  const formData = new FormData();
  formData.append("slug", params);
  formData.append("user_id", user_id);
  const res = await fetch(`${apiUrl}/test.php`, {
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

  const datas = await getServerSession(authOptions);
  if (params.multiple.length == 2) {
    const data = await getData(params.multiple[1])
    return {
      title: "Paper - " + data.heading,
  
    }
  } else {
    const data = await getData2(params.multiple[2], datas.user.id)
    return {
      title: "Test - " + data.heading,
  
    }

  }
}