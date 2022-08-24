import { notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { set } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../Contexts/Store";
import { getError } from '../utils/error';
export default function PlaceOrderScreen() {

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2=(num)=>(Math.round(num)*100+Number.EPSILON)/100;
  //Toplam ücret vs hesaplama.
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  //Butona yükleniyor efekti verme.



  //ÖDeme yöntemi seçili değilse kullanıcının işlem yapamsını engellememz lazım
  //Bundan dolayı burayı kontrol etmemiz gerekiyor eğer tanımlı değilse kullanıcı bu sayfayı görmemeli.

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);


  const [loading, setLoading] = useState(false);
  
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      notification.open({
        placement:"top",
        message: "Hata ! ",
        description: getError(err),
      })
    }
  };


  return (
    <Layout title={"Sipariş detayı"}>
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Sipariş detayları</h1>
      {cartItems.length === 0 ? (
        <div>
          Sepetiniz boş. <Link href="/">Alışverişe Başla !! </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            {/* Teslimat adresi*/}
            <div className="card  p-5">
              <h2 className="mb-2 text-lg font-extrabold">Teslimat Adresi</h2>
              <div className="grid grid-cols-2 gap-y-4">
                <span>
                  <b>Adınız-Soyadınız:</b> {shippingAddress.fullName}
                </span>
                <span>
                  <b>Adresiniz:</b> {shippingAddress.address}
                </span>
                <span>
                  <b>Şehir:</b> {shippingAddress.city}
                </span>
                <span>
                  <b>Posta Kodu:</b> {shippingAddress.postalCode}
                </span>
                <span>
                  <b>Ülke:</b> {shippingAddress.country}
                </span>
              </div>
              <div className="mt-4">
                <Link href="/shipping">Düzenle</Link>
              </div>
            </div>
             {/* Ödeme yöntemi */}
            <div className="card  p-5">
              <h2 className="mb-2 text-lg font-extrabold">Ödeme yöntemi</h2>
              <span className="text-xl ">{paymentMethod}</span>
              <div className="mt-4">
                <Link href="/payment">Düzenle</Link>
              </div>
            </div>
            {/* Sepetiniz */}
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg font-extrabold">Sepetiniz</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Ürün</th>
                    <th className="    p-5 text-right">Adet</th>
                    <th className="  p-5 text-right">Birim fiyatı</th>
                    <th className="p-5 text-right">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/{item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Link href="/cart">Düzenle</Link>
              </div>
            </div>
            
          </div>
          <div className="card  p-5">
              <h2 className="mb-2 text-lg">Sipariş Özeti</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Toplam Tutar</div>
                    <div>{itemsPrice} TL</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>KDV</div>
                    <div>{taxPrice} TL</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Kargo</div>
                    <div>{shippingPrice} TL</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Toplam</div>
                    <div>{totalPrice} TL</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full font-extrabold text-white"
                  >
                    {loading ? 'Yükleniyor...' : 'Sipariş Ver ! '}
                  </button>
                </li>
              </ul>
            </div>
        </div>
      )}
    </Layout>
  );
}
PlaceOrderScreen.auth = true;