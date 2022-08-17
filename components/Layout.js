import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Contexts/Store';

import { useSession } from 'next-auth/react';


export default function Layout({ title, children }) {
  const { state } = useContext(Store);
  const { cart } = state;
  const { status, data: session } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + ' - BzkStore' : 'BzkStore'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">BzkStore</a>
            </Link>
            <div>
              <Link href="/cart">
              <a className="p-2">
                  Sepet
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href="/login">
                  <a className="p-2">Giriş Yap</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 BzkStore</p>
        </footer>
      </div>
    </>
  );
}