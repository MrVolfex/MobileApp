import { createContext,PropsWithChildren,useContext, useState } from "react";
import { CartItem} from "../types";
import{randomUUID} from 'expo-crypto';
import { Tables } from "../database.types";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";
import CartListItem from "../components/CartListItem";


type Product= Tables<'products'>; // Using Tables type to ensure type safety

type CartType= {
    items: CartItem[];
    addItem:(product: Product, size: CartItem['size'])=> void;
    updateQuantity:(ItemId:string, amount: -1 |1)=> void;
    total:number;
    checkout: () => void;

}


export const CartContext= createContext<CartType>({
    items: [],
    addItem: () => {}, 
    updateQuantity: () => {}, 
    total: 0, 
    checkout: () => {}, 
});

const CartProvider= ({children} : PropsWithChildren)=> {
    const [items, setItems] = useState<CartItem[]>([]);

    const {mutate: insertOrder}=useInsertOrder();
    const router =  useRouter();
    const {mutate : insertOrderItems}=useInsertOrderItems();

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
      

    const clearCart= ()=> {
        setItems([]);
    }

    const checkout=  ()=> {
        console.warn('Checkout');
        insertOrder({total}, {onSuccess: saveOrderItems}); 
    }


    const saveOrderItems = (order: Tables<'orders'>)=> {
        
        const orderItems=items.map(cartItem => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size,
        }));

        insertOrderItems(orderItems,
            {onSuccess: () => {
                console.log(order);
                clearCart(); 
                router.push(`/(user)/orders/${order.id}`);
        }});
       
    }


    
    const total=items.reduce((sum, item) => (sum += item.product.price*item.quantity),0);

    return (
        <CartContext.Provider value={{items, addItem,updateQuantity,total,checkout}}>
            {children}
        </CartContext.Provider>
    );
}


export default CartProvider;

export const useCart= ()=> useContext(CartContext);  // objedinjujemo CartContext i useContext u jednu funkciju koja vraca CartContext, 
                                                        // tako da mozemo da koristimo useCart u drugim komponentama