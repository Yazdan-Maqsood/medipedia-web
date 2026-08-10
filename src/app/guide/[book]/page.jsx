import Link from "next/link";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { apiUrl } from '../../config/constant';
import Data from "./Data";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  let datas;
  let sessionFailed = false;
  try {
    datas = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error fetching session data:', error);
    sessionFailed = true;
  }

  if (!sessionFailed && !datas?.user?.id) {
    redirect('/login');
  }

  if (sessionFailed) {
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center"> Something Went wrong. Please try again</h1>
        <br />
        <div className="container mw-1470"></div>
      </section>
    );
  }

  let data;
  try {
    data = await getData(params.book, datas.user.id);
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">Something went wrong. Please try again</h1>
        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row">
            Oops, there was an issue fetching the data. ({error.message})
          </div>
        </div>
      </section>
    );
  }

  // ✅ Agar API fail hui toh asal error display hoga
  if (!data || data.errorFlag) {
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center text-danger">API Error Detected!</h1>
        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row text-center">
            <p>Oops, there was an issue fetching the data from <b>books.php</b>.</p>
            {data?.message && <p className="text-danger"><b>Reason:</b> {data.message}</p>}
            {data?.raw && (
              <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px', textAlign: 'left', overflowX: 'auto', border: '1px solid #f5c6cb' }}>
                <strong>Raw PHP Response:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{data.raw}</pre>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">
          Medipedia Guide <i className="fas fa-arrow-right"></i> {data.heading}
        </h1>
        <br />
        {data.type === "all-books" ? (
          <>
            <div className="container mw-1470">
              <div className="col col-lg-12 row">
                <div className="col-lg-6">
                  <Link href={`/guide/book-bundle/1`} className="courses-category-single-item text-center box-shadow">
                    <h3 style={{ cursor: 'pointer' }}>
                      Book Bundle 1
                    </h3>
                  </Link>
                </div>
                <div className="col-lg-6">
                  <Link href={`/guide/book-bundle/2`} className="courses-category-single-item text-center box-shadow">
                    <h3 style={{ cursor: 'pointer' }}>
                      Book Bundle 2
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          </>

        ) : data.type == "all-mock" ? (
          <>
          <div className="container mw-1470">
            <div className="col col-lg-12 row">
              <div className="col-lg-6">
                <Link href={`/guide/mock-bundle/1`} className="courses-category-single-item text-center box-shadow">
                  <h3 style={{ cursor: 'pointer' }}>
                    Mock Bundle 1
                  </h3>
                </Link>
              </div>
              <div className="col-lg-6">
                <Link href={`/guide/mock-bundle/2`} className="courses-category-single-item text-center box-shadow">
                  <h3 style={{ cursor: 'pointer' }}>
                   Mock Bundle 2
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </>
        ) : data.type === "indiviuals" && data.msgbar != "" ? (
          <>
            <br />
            <div className="container mw-1470">
              <div className="col col-lg-12 row">
                <Data preparams={params.book} type={data.type} value={data.data}></Data>
              </div>
            </div>
          </>
        ) : (
          <>
            <br />
            <div className="container mw-1470">
              <div className="col col-lg-12 row">
                <Data preparams={params.book} type={data.type} value={data.data}></Data>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

// ✅ Updated getData to catch Raw Text Errors
async function getData(params, user_id) {
  try {
    const formData = new FormData();
    formData.append("slug", params);
    formData.append("user_id", user_id);
    const res = await fetch(`${apiUrl}/books.php`, {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });
    
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('API Response (books.php) was not JSON:', text);
      return { errorFlag: true, raw: text, message: 'Invalid JSON returned from books.php' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { errorFlag: true, raw: '', message: error.message };
  }
}

export async function generateMetadata({ params }) {
  let datas;
  try {
    datas = await getServerSession(authOptions);
  } catch (error) {
    return { title: "Error - Medipedia Guide" };
  }

  if (!datas?.user?.id) {
    return { title: "Medipedia Guide" };
  }

  let data;
  try {
    data = await getData(params.book, datas.user.id);
    if (data?.errorFlag) return { title: "Error Loading Data" };
  } catch (error) {
    return { title: "Something went wrong" };
  }

  return {
    title: "Book - " + (data?.heading || "Medipedia Guide"),
  };
}