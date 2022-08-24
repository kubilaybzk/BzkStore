import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';

import { useRouter } from 'next/router';
import { Store } from '../Contexts/Store';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store); // Context yapımızdan dataları çekiyoruz.
  const { cart } = state; //Context-state içinde bulunan state yapımızı kullanıyoruz.
  const { shippingAddress } = cart; //Cart içinde bulunan shipping adres bizim için önemli.
  const router = useRouter();

  //Bütün input değerlerini state içinde tutuyoruz.
  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    //Cookies içine dataları tutuyoruz.
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Teslimat Adresi</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Adınız-Soy Adınız</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Lütfen Adınızı ve soy adınızı yazın.',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Adresiniz</label>
          <input
            className="w-full"
            id="address"
            {...register('address', {
              required: 'Adres kısmı boş bırakılamaz',
              minLength: { value: 3, message: 'Addres 2 karakterden fazla olamalı' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">Şehir</label>
          <input
            className="w-full"
            id="city"
            {...register('city', {
              required: 'Lütfen bir şehir belirtin',
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Posta Kodu</label>
          <input
            className="w-full"
            id="postalCode"
            {...register('postalCode', {
              required: 'Bir posta kodu girin',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Ülke</label>
          <input
            className="w-full"
            id="country"
            {...register('country', {
              required: 'Bir ülke girin',
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Devam et</button>
        </div>
      </form>
    </Layout>
  );
}
//Sadece giriş yapan kullancıların burayı görmesini istiyoruz.
ShippingScreen.auth = true;