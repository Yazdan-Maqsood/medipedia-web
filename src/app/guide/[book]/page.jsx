import Link from "next/link";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { apiUrl } from '../../config/constant';
import Data from "./Data";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// export const metadata = {
//   title: "Book",
// };

export default async function Page({ params }) {
  const datas = await getServerSession(authOptions);
  const data = await getData(params.book, datas.user.id)

 

  return (
    <>
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">
          Medipedia Guide <i className="fas fa-arrow-right"></i> {data.heading}
        </h1>
        {data.type === "all-books" && data.msgbar != "" ? (
          <>
            <p style={{ textAlign: 'center', backgroundColor: '#ecf2fc', color: '#19b2ee', padding: '4px' }}>
              To get all books code at once just pay {data.price} <Link href={`/apply-code/all-books`} > Get All Code</Link>
            </p>
          </>
        ) : data.type === "all-mock" && data.msgbar != "" ? (
          <>
            <p style={{ textAlign: 'center', backgroundColor: '#ecf2fc', color: '#19b2ee', padding: '4px' }}>
              To get all books code at once just pay {data.price} <Link href={`/apply-code/all-mock`} > Get All Code</Link>
            </p>
          </>
        ) : (
          <>
          </>
        )}

        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row">
            <Data preparams={params.book} type={data.type} value={data.data}></Data>
          </div>
        </div>
      </section>

    </>
  );
}

async function getData(params, user_id) {
  const formData = new FormData();
  formData.append("slug", params);
  formData.append("user_id", user_id);
  const res = await fetch(`${apiUrl}/books.php`, {
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


// export async function generateMetadata({ params}) {
 
//   const datas = await getServerSession(authOptions);
//   const data = await getData(params.book, datas.user.id)

//   return {
//     title: "Book - " + data.heading,
    
//   }
// }