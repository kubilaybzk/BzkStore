import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function OrderScreen() {
  // order/:id
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Sipariş numarası :  ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
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
              {isDelivered ? (
                <div className="alert-success">TElim Edildi: {deliveredAt}</div>
              ) : (
                <div className="alert-error">Teslim edilmedi.</div>
              )}
            </div>

            {/* Ödeme yöntemi */}
            <div className="card  p-5">
              <h2 className="mb-2 text-lg font-extrabold">Ödeme yöntemi</h2>
              <span className="text-xl ">{paymentMethod}</span>
              {isPaid ? (
                <div className="alert-success">Ödenme yapıldı : {paidAt}</div>
              ) : (
                <div className="alert-error">Ödeme yapılmadı</div>
              )}
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
                  {orderItems.map((item) => (
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
            </div>



          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{" "}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
