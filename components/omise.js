
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Script from 'react-load-script'
import { API } from '../service/apiService'
import CircularProgress from '@mui/material/CircularProgress';

let OmiseCard

const CheckoutWithCreditCard = ({ order, publicKey, onSuccess }) => {

  const [loading, setLoading] = useState(false)

  const amount = order.total * 100

  const router = useRouter();

  const handleLoadScript = () => {
    OmiseCard = window.OmiseCard
    OmiseCard.configure({
      publicKey: publicKey,
      currency: 'thb',
      frameLabel: order?.product?.fullname ? `Thai Merit - ${order.product.fullname}` : 'Thai Merit',
      submitLabel: 'ชำระเงิน',
      buttonLabel: 'ชำระด้วย Omise'
    })
  }

  const creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: 'credit_card',
      otherPaymentMethods: []
    })
    OmiseCard.configureButton('#credit-card')
    OmiseCard.attach()
  }

  const omiseCardHandler = async () => {
    let thumbnailImage = "https://thaimerit.com/images/logo.png";

    if (order?.product?.coverImages) {
      let items = order.product.coverImages.filter(o => o.type = "pc").map(o => {
          return API.assetUrl(o.image.url);
      })

      if (items.length > 0) {
          thumbnailImage = items[0]
      }
  }

    OmiseCard.open({
      image: thumbnailImage,
      frameDescription: 'คำสั่งซื้อ #' + order.id,
      amount,
      onCreateTokenSuccess: async (token) => {
        setLoading(true)
        try {
          let res = await API.orderPaymentOmise(order.id, token)
          if (onSuccess) onSuccess(null, res)
        } catch (error) {
          if (onSuccess) onSuccess(error, null)
          setLoading(false)
        }
        // setLoading(false)
        
        // console.log(token);

        // let result = createCreditChange(data, amount, token);
        // console.log(result);

        // router.push("/e-merit/pending");
      },
      onFormClosed: () => { }
    })
  }

  const createCreditChange = async (data, amount, token) => {
    try {
      let email = data.email;
      let name = data.name;
      let res = await API.paymentWithOmise({ email, name, amount, token })
      console.log();
      return result;

    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = () => {
    creditCardConfigure()
    omiseCardHandler()
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
      }}
    >
      <Script url='https://cdn.omise.co/omise.js' onLoad={handleLoadScript} />
      {!loading && <form>
        <button
          style={{
            padding: '5px 10px',
            cursor: 'pointer',
            background: 'blue',
            border: 'none',
            fontSize: '18px',
            color: 'white'
          }}
          id='credit-card'
          type='button'
          disabled={!amount}
          onClick={handleClick}
        >
          ชำระเงินด้วยบัตรเครดิต หรือบัตรเดบิต
        </button>
      </form>}
      {loading && <div className='text-center mt-8'>
        <CircularProgress sx={{ fontSize: "80px", color: "#61CC7F" }} />
        <div className='text-center' style={{ color: "#61CC7F", fontSize: "30px" }}>กำลังกำเนินการชำระเงิน...</div>
      </div>}
    </div>
  )
}

export default CheckoutWithCreditCard
