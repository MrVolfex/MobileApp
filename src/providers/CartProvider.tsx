import { createContext,PropsWithChildren,useContext, useState } from "react";
import { CartItem} from "../types";
import{randomUUID} from 'expo-crypto';
import { Tables } from "../database.types";


type Product= Tables<'products'>; // Using Tables type to ensure type safety

type CartType= {
    items: CartItem[];
    addItem:(product: Product, size: CartItem['size'])=> void;
    updateQuantity:(ItemId:string, amount: -1 |1)=> void;
    total:number;

}


export const CartContext= createContext<CartType>({
    items: [],
    addItem: () => {}, 
    updateQuantity: () => {}, // Prazna funkcija koja ce biti zamenjena u CartProvider
    total: 0, 
});

const CartProvider= ({children} : PropsWithChildren)=> {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem= (product: Product, size: CartItem['size'])=> {
        
        const existingItem= items.find(item =>
            item.product === product && item.size === size
        );
        if (existingItem) {
            updateQuantity(existingItem.id, 1); // Ako postoji item, povecavamo kolicinu
            return; // Ne dodajemo novi item, vec samo povecavamo kolicinu
        }

        const newCartitem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        };
        setItems([newCartitem, ...items]); // Dodajemo novi item na pocetak niza

        
    };
     const updateQuantity=( itemId:string, amount: -1 |1)=> {
        setItems(items.map(item => 
            item.id !== itemId ? item : 
            { ...item, quantity: item.quantity + amount }).filter((item)=>item.quantity > 0) // filtriramo da ne bi imali iteme sa kolicinom 0
        );
     };
      

    
    const total=items.reduce((sum, item) => (sum += item.product.price*item.quantity),0);

    return (
        <CartContext.Provider value={{items, addItem,updateQuantity,total}}>
            {children}
        </CartContext.Provider>
    );
}
export default CartProvider;

export const useCart= ()=> useContext(CartContext);  // objedinjujemo CartContext i useContext u jednu funkciju koja vraca CartContext, 
                                                        // tako da mozemo da koristimo useCart u drugim komponentama