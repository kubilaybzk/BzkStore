import { createContext, useReducer, useState } from "react";

export const Store = createContext();

//Sepet içinde hiçbir eleman yok başlangıçta .
const initialState = {
  cart: { cartItems: [] },
};

//Action 2 tane değer alıyor .
//1 tanesi type => Add delete vs vs ..
//Payload ise o  anki action'ın değeri obje vs vs ..

function reducer(state, action) {
  switch (action.type) {
        //Burada sepete ekleme çıkarma gibi işlemleri yapacağız.
    case "CART_ADD_ITEM": { 
      //Şimdi bize gelen item yeni bir quantitiy değerine sahip bundan bunu yeni item olarak seçelim.
      const newItem = action.payload;
      // Eklenen item daha önce eklendi mi kontrol ediliyoruz eğer eklenmiş ise yeni gelen ile onu değiştireceğiz.
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]; // item daha önce eklenmemiş ise cartItems içine ekliyoruz

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  console.log(state.cart.cartItems);
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
