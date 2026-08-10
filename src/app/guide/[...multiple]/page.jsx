import Link from "next/link";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { SlugToTitle, apiUrl } from '../../config/constant';
import Data from "./Data";
import Test from "./Test";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


export default async function Page({ params }) {
  const datas = await getServerSession(authOptions);

  if (!datas?.user?.id) {
    redirect('/login');
  }

  try {
    if (params.multiple.length == 2) {
      const data = await getData(params.multiple[1])
      
      // ✅ Agar API fail hui ya JSON error aaya, toh ab screen par saaf likha aayega
      if (!data || data.errorFlag) {
        return (
          <section className="courses-category-area ptb-50">
            <h1 className="text-center text-danger">API Error Detected!</h1>
            <br />
            <div className="container mw-1470">
              <div className="col col-lg-12 row text-center">
                <p>Oops, there was an issue fetching the data from <b>papers.php</b>.</p>
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
      
      // ✅ Same Error Catcher for test.php
      if (!data || data.errorFlag) {
        return (
          <section className="courses-category-area ptb-50">
            <h1 className="text-center text-danger">API Error Detected!</h1>
            <br />
            <div className="container mw-1470">
              <div className="col col-lg-12 row text-center">
                <p>Oops, there was an issue fetching the data from <b>test.php</b>.</p>
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
            <div className="container mw-1470">
              <div className="col col-lg-12 row">
                <Test preparama={params.multiple[0]} preparamb={params.multiple[1]} preparamc={params.multiple[2]} value={data.data}></Test>
              </div>
            </div>
          </section>
        </>
      );
    }
  } catch (error) {
    console.error('Error rendering guide page:', error);
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">Medipedia Guide</h1>
        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row">
            Something went wrong rendering the page. Please try again.
          </div>
        </div>
      </section>
    );
  }
}

// ✅ Updated getData to catch Raw Text Errors
async function getData(params) {
  try {
    const formData = new FormData();
    formData.append("slug", params);
    const res = await fetch(`${apiUrl}/papers.php`, {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('API Response (papers.php) was not JSON:', text);
      return { errorFlag: true, raw: text, message: 'Invalid JSON returned from papers.php' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { errorFlag: true, raw: '', message: error.message };
  }
}

// ✅ Updated getData2 to catch Raw Text Errors
async function getData2(params, user_id) {
  try {
    const formData = new FormData();
    formData.append("slug", params);
    formData.append("user_id", user_id);
    const res = await fetch(`${apiUrl}/test.php`, {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('API Response (test.php) was not JSON:', text);
      return { errorFlag: true, raw: text, message: 'Invalid JSON returned from test.php' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { errorFlag: true, raw: '', message: error.message };
  }
}

export async function generateMetadata({ params }) {
  try {
    const datas = await getServerSession(authOptions);
    if (params.multiple.length == 2) {
      const data = await getData(params.multiple[1])
      if (data?.errorFlag) return { title: "Error Loading Data" };
      return { title: "Paper - " + data.heading }
    } else {
      const data = await getData2(params.multiple[2], datas?.user?.id)
      if (data?.errorFlag) return { title: "Error Loading Data" };
      return { title: "Test - " + data.heading }
    }
  } catch (error) {
    return { title: "Something went wrong" }
  }
}