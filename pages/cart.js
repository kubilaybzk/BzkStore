import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { Store } from "../Contexts/Store";
import dynamic from "next/dynamic";
import axios from "axios";
import { notification } from "antd";
/* 
Şimdi server tarafında olşan datalar ile client tarafonda oluşan datalar arasında sıkıntılar oluyor .
Hydration hatasu. 
Bunu engellemek için bu sayfayı client side rendering olarak geliştirmemiz lazım öncelikle yapmamız gerken ilk işlem bu sayfayı dinamik olarak geliştirmek.
Dinamik olarakg geliştirmek için next dynamic entegre edilmeli.
*/

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = async (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    console.log("quantity", quantity);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return notification.open({
        message: 'Malesef bu kadar stoğumuz mevcut değil.',
      });
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    notification.open({
      message: 'Ürün sepetinize başarı ile eklendi.',
    });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Sepetim</h1>
      {cartItems.length === 0 ? (
        <div>
          Sepetiniz boş. <Link href="/">Hemen Alışverişe başla</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Ürün</th>
                  <th className="p-5 text-right">Adet</th>
                  <th className="p-5 text-right">Fiyat</th>
                  <th className="p-5">Sil</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
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
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(Number(item.countInStock))].map((y, x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <span className="border rounded">x</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Toplam ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}TL
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Ödeme Yap
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
