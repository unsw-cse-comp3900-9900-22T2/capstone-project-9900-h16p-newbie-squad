import React, { useState, useEffect } from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import './BillingPage.css'

// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function BillingHistoryPage() {
    const [nameoncard, setNameoncard] = useState('')
    const [cardnumber, setCardnumber] = useState('')
    const [expirydate, setExpirydate] = useState('')
    const [cvv, setCvv] = useState('')
    const [accountname, setAccountname] = useState('')
    const [bsb, setBsb] = useState('')
    const [accountnumber, setAccountnumber] = useState('')
    
    const [customerbillings, setCustomerbillings] = useState([])
    const [providerbillings, setProviderbillings] = useState([])


    const updateNameoncard = (e) => {
        setNameoncard(e.target.value)
    }

    const updateCardnumber = (e) => {
        setCardnumber(e.target.value)
    }

    const updateExpirydate = (e) => {
        setExpirydate(e.target.value)
    }

    const updateCvv = (e) => {
        setCvv(e.target.value)
    }

    const updateAccountname = (e) => {
        setAccountname(e.target.value)
    }

    const updateBsb = (e) => {
        setBsb(e.target.value)
    }

    const updateAccountnumber = (e) => {
        setAccountnumber(e.target.value)
    }

    const bankChange = () => {
        console.log(accountname,accountnumber,bsb)
        if(accountname && accountnumber && bsb)
        {
            if(accountnumber.length == 8)
            {
                updateBank()
            }
            else
            {
                alert('Bank account details is error')
            }
        }
        else
        {
            alert('Bank account details is error')
        }
    }

    const updateBank = () => {
        const data = {
            "account_id": accountnumber,
            "account_name": accountname,
            "bsb": bsb
        }
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://localhost:5000/profile/bank_account',
          {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(data)
          })
          .then(res => res.json())
          .catch(error => {
              console.error('Error:', error)
          })
          .then(response => {
              console.log(response)
              alert(response.message)
          })
      }

    const cardChange = () => {
        console.log(cardnumber,nameoncard,expirydate,cvv)
        if(cardnumber && nameoncard && expirydate && cvv)
        {
            if(cardnumber.length == 16 &&  cvv.length == 3)
            {
                updateCard()
            }
            else
            {
                alert('Payment details is error')
            }
        }
        else
        {
            alert('Payment details is error')
        }
    }

    const updateCard = () => {
        const data = {
            "card_number": cardnumber,
            "card_name": nameoncard,
            "expiry_date": expirydate,
            "cvv": cvv
        }
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://localhost:5000//profile/credit_card',
          {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(data)
          })
          .then(res => res.json())
          .catch(error => {
              console.error('Error:', error)
          })
          .then(response => {
              console.log(response)
              alert(response.message)
          })
      }

    const initList = () => {
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://127.0.0.1:5000//billing/mybillings',
          {
              method: 'GET',
              headers: headers,
          })
          .then(res => res.json())
          .catch(error => {
              console.error('Error:', error)
          })
          .then(response => {
              console.log(response)
              setCustomerbillings([...response.customer_billings])
              setProviderbillings([...response.provider_billings])
          })
      }

      const BankMain = () => {
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://127.0.0.1:5000//profile/bank_account',
          {
              method: 'GET',
              headers: headers,
          })
          .then(res => res.json())
          .catch(error => {
              console.error('Error:', error)
          })
          .then(response => {
              console.log(response)
              var listingData=response
              setAccountname(listingData.account_name)
              setAccountnumber(listingData.account_id)
              setBsb(listingData.bsb)
          })
      }


      const CardMain = () => {
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://127.0.0.1:5000//profile/credit_card',
          {
              method: 'GET',
              headers: headers,
          })
          .then(res => res.json())
          .catch(error => {
              console.error('Error:', error)
          })
          .then(response => {
            var listingData=response
            setCardnumber(listingData.card_number)
            setNameoncard(listingData.card_name)
            setExpirydate(listingData.expiry_date)
            setCvv(listingData.cvv)
          })
      }

    useEffect(() => {     //  模拟componentDidMount  首次渲染
        console.log('use effect')
        initList()
        BankMain()
        CardMain()
    },[])    // 空数组必须写
  
  return (
    <div className='billingMain'>
        <div className='billingLeft'>
            <div className='billingLeftTop'>
            <h3>Payment details</h3>
                <div className='billingLeftTopItems'>
                    <span>Name on card</span>
                    <input  value={nameoncard} onChange={updateNameoncard} />
                </div>
                <div className='billingLeftTopItems'>
                    <span>Card number</span>
                    <input value={cardnumber} onChange={updateCardnumber} />
                </div>
                <div className='billingLeftTopItems'>
                    <span>Expiry Date(MM/YY)</span>
                    <input value={expirydate} onChange={updateExpirydate}  />
                </div>
                <div className='billingLeftTopItems'>
                    <span>CVV</span>
                    <input value={cvv} onChange={updateCvv} type="number"/>
                </div>
                <div className='billingLeftTopItems'>
                    <button className='billingLeftButton' onClick={cardChange}>Save Changes</button>
                </div>
            </div>
            <div className='billingLeftBottom'>
                <h3>Bank account details</h3>
                <div className='billingLeftTopItems'>
                    <span>Account name</span>
                    <input value={accountname} onChange={updateAccountname}  />
                </div>
                <div className='billingLeftTopItems'>
                    <span>BSB</span>
                    <input value={bsb} onChange={updateBsb}  />
                </div>
                <div className='billingLeftTopItems'>
                    <span>Account number</span>
                    <input value={accountnumber} onChange={updateAccountnumber}  type="number"/>
                </div>
                <div className='billingLeftTopItems'>
                    <button className='billingLeftButton' onClick={bankChange}>Save Changes</button>
                </div>
            </div>
        </div>
        <div className='billingRight'>
            <h3>List</h3>
            <div className='billingRightListing'>
                {customerbillings.map((billing, index) => (
                        <Link to={`/billing-page/${billing.id}`}  key={index}>
                        <div className='billingRightListingItems'>
                            <span>{billing.payment_time}</span>
                            <span className='Payment'>Payment</span>
                            <span>${billing.total_price}</span>
                        </div>
                        </Link>
                    ))}
                {providerbillings.map((billing, index) => (
                    <Link to={`/billing-page/${billing.id}`}  key={index}>
                    <div className='billingRightListingItems'>
                        <span>{billing.payment_time}</span>
                        <span className='Earning'>Earning</span>
                        <span>${billing.total_price}</span>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}
