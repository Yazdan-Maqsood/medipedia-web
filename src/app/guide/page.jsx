'use client';

import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config/constant';
import Data from './Data';

export default function Page() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState(null);
  const [isVersion2Paid, setIsVersion2Paid] = useState(false);
  const [isVersion2Applied, setIsVersion2Applied] = useState(false);
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    user_email: '',
    user_no: '',
  });

  useEffect(() => {
    // Get user data from localStorage or session
    const getUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData({
          user_id: user.id || '8251',
          user_name: user.name || 'Yazdan',
          user_email: user.email || 'yazdanmaqsood2@gmail.com',
          user_no: user.phone || '03156464706',
        });
      } catch (e) {
        console.log('Using default user data');
      }
    };
    getUserData();
    checkVersion2Status();
  }, []);

  const checkVersion2Status = async () => {
    try {
      const userId = userData.user_id || '8251';
      const response = await fetch(`${apiUrl}/versionck.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          user_id: userId.toString(),
          version: '-5',
        }),
      });

      const result = await response.json();
      
      if (response.status === 200 && result && Array.isArray(result) && result.length > 0) {
        let isPaid = false;
        for (let item of result) {
          if (item.user_code && parseInt(item.user_code) > 0) {
            isPaid = true;
            break;
          }
        }
        setIsVersion2Applied(true);
        setIsVersion2Paid(isPaid);
        
        // Save to localStorage
        localStorage.setItem('isVersion2Paid', JSON.stringify(isPaid));
        localStorage.setItem('isVersion2Applied', JSON.stringify(true));
      }
    } catch (error) {
      console.error('Error checking version status:', error);
      // Check localStorage for cached status
      const cachedPaid = localStorage.getItem('isVersion2Paid');
      const cachedApplied = localStorage.getItem('isVersion2Applied');
      if (cachedPaid) setIsVersion2Paid(JSON.parse(cachedPaid));
      if (cachedApplied) setIsVersion2Applied(JSON.parse(cachedApplied));
    }
  };

  async function fetchData() {
    try {
      const res = await fetch(`${apiUrl}/speclization.php`, {
        cache: 'no-store'
      });
      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Something went wrong. Please try again');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="courses-category-area ptb-50">
        <div className="container mw-1470">
          <div className="text-center" style={{ padding: '50px 0' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #19B2EE',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#6c757d' }}>Loading...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">Something went wrong. Please try again</h1>
        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row">
            {error || 'Oops, there was an issue fetching the data.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-category-area ptb-50">
      <VersionSelector 
        selectedVersion={selectedVersion} 
        setSelectedVersion={setSelectedVersion} 
        data={data}
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        isApplying={isApplying}
        setIsApplying={setIsApplying}
        applyStatus={applyStatus}
        setApplyStatus={setApplyStatus}
        isVersion2Paid={isVersion2Paid}
        setIsVersion2Paid={setIsVersion2Paid}
        isVersion2Applied={isVersion2Applied}
        setIsVersion2Applied={setIsVersion2Applied}
        userData={userData}
        checkVersion2Status={checkVersion2Status}
      />
    </section>
  );
}

// Client Component for version selection and display
function VersionSelector({ 
  selectedVersion, 
  setSelectedVersion, 
  data, 
  showPaymentModal, 
  setShowPaymentModal,
  isApplying,
  setIsApplying,
  applyStatus,
  setApplyStatus,
  isVersion2Paid,
  setIsVersion2Paid,
  isVersion2Applied,
  setIsVersion2Applied,
  userData,
  checkVersion2Status
}) {

  const getVersion2ButtonLabel = () => {
    if (isVersion2Paid) return "Open Now";
    if (isVersion2Applied) return "Pay Now";
    return "Apply Now";
  };

  const handleVersion2Click = () => {
    setShowPaymentModal(true);
    setApplyStatus(null);
  };

  const handleApply = async () => {
    setIsApplying(true);
    setApplyStatus(null);

    try {
      const bookIds = Array.from({ length: 50 }, (_, i) => (i + 1).toString());
      const date = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });

      const formData = new FormData();
      formData.append('book_ids', JSON.stringify(bookIds));
      formData.append('user_id', userData.user_id);
      formData.append('user_name', userData.user_name);
      formData.append('user_email', userData.user_email);
      formData.append('user_no', userData.user_no);
      formData.append('user_mac', '');
      formData.append('type', '-5');
      formData.append('date', date);

      const response = await fetch('https://desired-techs.com/docapp/applyforall3.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.Success === 'true' || result.Success === 'already') {
        const isAlready = result.Success === 'already';
        setIsVersion2Applied(true);
        localStorage.setItem('isVersion2Applied', JSON.stringify(true));
        
        setApplyStatus({
          success: true,
          message: isAlready 
            ? "You've already applied for all books." 
            : "Applied successfully! Please complete payment.",
          missingBooks: result.missing_book_ids || []
        });
        
        if (!isAlready) {
          setTimeout(() => {
            setShowPaymentModal(false);
            setIsApplying(false);
          }, 2000);
        } else {
          setIsApplying(false);
        }
      } else {
        setApplyStatus({
          success: false,
          message: 'Failed to apply. Please try again.'
        });
        setIsApplying(false);
      }
    } catch (error) {
      console.error('Error applying for books:', error);
      setApplyStatus({
        success: false,
        message: 'An error occurred. Please check your connection and try again.'
      });
      setIsApplying(false);
    }
  };

  // If no version selected, show the two version cards
  if (!selectedVersion) {
    return (
      <>
        <h1 className="text-center" style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#0C7399',
          marginBottom: '10px'
        }}>
          Medipedia Guide
        </h1>
        <p className="text-center" style={{ 
          color: '#6c757d', 
          fontSize: '1.1rem',
          marginBottom: '40px'
        }}>
          Select a version to explore the complete guide
        </p>
        
        <br />
        <div className="container mw-1470">
          <div className="row" style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            
            {/* Version 1 Card */}
            <div className="col-lg-5 col-md-6" style={{
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(25, 178, 238, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '280px',
              flex: '1'
            }}
            onClick={() => setSelectedVersion('1')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #19B2EE, #0D8ECF, #19B2EE)',
                backgroundSize: '200% 100%',
                animation: 'gradientMove 3s ease infinite'
              }}></div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    margin: 0
                  }}>
                    Version 01
                  </h2>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(25, 178, 238, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                border: '1px solid rgba(25, 178, 238, 0.08)'
              }}>
                <p style={{
                  color: '#495057',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Basic Access
                </p>
                <p style={{
                  color: '#6c757d',
                  fontSize: '13px',
                  marginBottom: 0
                }}>
                  Standard Learning Path
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✓</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Purchase Book Individually</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✓</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Purchase Mock Tests Individually</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✓</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Purchase Bundles Individually</span>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✓</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Flexible Pay-as-you-need Model</span>
                </div>
              </div>
              
              <div style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #19B2EE, #0D8ECF)',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(25, 178, 238, 0.3)'
              }}>
                Click to View Version 01 
              </div>
            </div>
            
            {/* Version 2 Card */}
            <div className="col-lg-5 col-md-6" style={{
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(25, 178, 238, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '280px',
              flex: '1'
            }}
            onClick={handleVersion2Click}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #19B2EE, #0D8ECF, #19B2EE)',
                backgroundSize: '200% 100%',
                animation: 'gradientMove 3s ease infinite'
              }}></div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    margin: 0
                  }}>
                    Version 02
                  </h2>
                </div>
                {isVersion2Paid && (
                  <div style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    Active
                  </div>
                )}
              </div>
              
              <div style={{
                backgroundColor: 'rgba(25, 178, 238, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                border: '1px solid rgba(25, 178, 238, 0.08)'
              }}>
                <p style={{
                  color: '#495057',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                Premium Access
                </p>
                <p style={{
                  color: '#6c757d',
                  fontSize: '13px',
                  marginBottom: 0
                }}>
                  Premium Books Collection
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✦</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Full Access to All Books</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✦</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Full Access to all Mock Tests</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✦</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>Full Access to all Bundles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#19B2EE', fontSize: '18px' }}>✦</span>
                  <span style={{ color: '#495057', fontSize: '14px' }}>One-Time Purchase with Complete Access</span>
                </div>
              </div>
              
              <div style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #19B2EE, #0D8ECF)',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(25, 178, 238, 0.3)'
              }}>
                Click to View Version 02 
              </div>
            </div>
            
            <style jsx>{`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </div>
        </div>

        {/* Payment Modal - Shows when Version 2 is clicked */}
        {showPaymentModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {
            if (!isApplying) {
              setShowPaymentModal(false);
              setApplyStatus(null);
            }
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '30px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}>
              
              {!isApplying && (
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setApplyStatus(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6c757d',
                    padding: '5px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              )}

              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a2e',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Customer Support
              </h2>

              <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <span style={{ color: '#495057', fontWeight: '500' }}>Admin Contact:</span>
                  <span style={{ color: '#19B2EE', fontWeight: '600' }}>03066001671</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0'
                }}>
                  <span style={{ color: '#495057', fontWeight: '500' }}>IT Team Contact:</span>
                  <span style={{ color: '#19B2EE', fontWeight: '600' }}>03126566764</span>
                </div>
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a1a2e',
                marginBottom: '15px'
              }}>
                Payment Details
              </h3>

              <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#6c757d', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>ACCOUNT TITLE</p>
                  <p style={{ color: '#1a1a2e', fontWeight: '600', margin: 0 }}>DESIRED TECHNOLOGIES SOFTWARE HOUSE</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#6c757d', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>BANK NAME</p>
                  <p style={{ color: '#1a1a2e', fontWeight: '600', margin: 0 }}>Meezan Bank</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#6c757d', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>ACCOUNT NUMBER</p>
                  <p style={{ color: '#1a1a2e', fontWeight: '600', margin: 0 }}>21010105586859</p>
                </div>
                <div>
                  <p style={{ color: '#6c757d', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>IBAN</p>
                  <p style={{ color: '#1a1a2e', fontWeight: '600', margin: 0, wordBreak: 'break-all' }}>PK95MEZN0021010105586859</p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#e8f4f8',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                border: '2px solid #19B2EE',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#0C7399',
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '5px'
                }}>
                  Version 2 - Premium
                </p>
                <p style={{
                  color: '#19B2EE',
                  fontSize: '24px',
                  fontWeight: '800',
                  margin: 0
                }}>
                  Pay: Rs. 500
                </p>
              </div>

              <p style={{
                color: '#6c757d',
                fontSize: '13px',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Send a payment screenshot for confirmation, then we'll assign all books. By clicking apply, you're applying for all books. Please wait while they are being assigned.
              </p>

              {applyStatus && (
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  backgroundColor: applyStatus.success ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${applyStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
                  color: applyStatus.success ? '#155724' : '#721c24'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                    {applyStatus.message}
                  </p>
                  {applyStatus.success && applyStatus.missingBooks && applyStatus.missingBooks.length > 0 && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                      Missing books: {applyStatus.missingBooks.join(', ')}
                    </p>
                  )}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    if (!isApplying) {
                      setShowPaymentModal(false);
                      setApplyStatus(null);
                    }
                  }}
                  disabled={isApplying}
                  style={{
                    padding: '10px 40px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    background: 'transparent',
                    color: '#6c757d',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: isApplying ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isApplying ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isApplying) {
                      e.currentTarget.style.borderColor = '#dc3545';
                      e.currentTarget.style.color = '#dc3545';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isApplying) {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.color = '#6c757d';
                    }
                  }}
                >
                  Close
                </button>
                {!isVersion2Paid && (
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    style={{
                      padding: '10px 40px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isApplying ? '#6c757d' : 'linear-gradient(135deg, #19B2EE, #0D8ECF)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: isApplying ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isApplying ? 'none' : '0 4px 15px rgba(25, 178, 238, 0.3)',
                      position: 'relative',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isApplying) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(25, 178, 238, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isApplying) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 178, 238, 0.3)';
                      }
                    }}
                  >
                    {isApplying ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          border: '2px solid #fff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }}></span>
                        Applying...
                      </span>
                    ) : (
                      getVersion2ButtonLabel()
                    )}
                  </button>
                )}
                {isVersion2Paid && (
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedVersion('2');
                    }}
                    style={{
                      padding: '10px 40px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 25px rgba(40, 167, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                    }}
                  >
                    Open Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // If a version is selected, show the data with clickable header to go back
  return (
    <div className="container mw-1470">
      <div 
        onClick={() => setSelectedVersion(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          marginBottom: '30px',
          padding: '10px 0',
          borderBottom: '2px solid #f0f0f0',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderBottomColor = '#19B2EE';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderBottomColor = '#f0f0f0';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6c757d',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <span style={{
            display: 'inline-block',
            transform: 'rotate(180deg)',
            marginRight: '4px',
            fontSize: '18px'
          }}>→</span>
          All Versions
        </div>
        <div style={{
          color: '#6c757d',
          fontSize: '14px'
        }}>
          /
        </div>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px',
          background: 'linear-gradient(135deg, #19B2EE, #0D8ECF)',
          color: 'white',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 2px 10px rgba(25, 178, 238, 0.2)'
        }}>
          {selectedVersion === '1' ? 'Version 01' : 'Version 02'}
        </div>
      </div>
      
      <div className="col col-lg-12 row">
        <Data value={data} />
      </div>
    </div>
  );
}