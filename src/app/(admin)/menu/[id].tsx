import { View, Text,Image,StyleSheet,Pressable, ActivityIndicator} from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'

import products from '@/assets/data/products'
import { defaultPizzaImage } from '@/src/components/ProductListItem'

import { useState } from 'react'

import Button from '@/src/components/Button'
import { useCart } from '@/src/providers/CartProvider'
import { PizzaSize } from '@/src/types'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/src/constants/Colors'
import { useProduct } from '@/src/api/products'
import RemoteImage from '@/src/components/RemoteImage'

const sizes: PizzaSize[]=['S', 'M', 'L', 'XL']


const ProductDetailsScreen = () => {
  const { id:idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  
    const { data: product, error, isLoading } = useProduct(id);

  const { addItem } = useCart();

  const router= useRouter();


  const [selectedSize,setSelectedSize]= useState<PizzaSize>('L');

  

    if (!product) {
    return(
      <Text>Product not found</Text>
    )
  }

  const addToCart = () => {
    if (!product) {
      return;
    }

    addItem(product, selectedSize);
    router.push('/cart'); // Redirect to cart after adding item
}
  if(isLoading) {
      return <ActivityIndicator/>
    }
    if (error) {
      return <Text>Fail to fetch products</Text>
    }

  return (
    <View style={styles.container}>

        <Stack.Screen  options={{title: 'Menu',
          headerRight: () => (
              <Link href={`(admin)/menu/create?id=${id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="pencil"
                      size={25}
                      color={Colors.light.tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            )}}/> 



      <Stack.Screen options={{title:product.name}}/>
      <RemoteImage path={product?.image} fallback={defaultPizzaImage} style={styles.image}/>
      

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>

       

    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  container:{
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  price:{
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  title:{
    fontSize:20,
    fontWeight: '600',
  }
  
});

export default ProductDetailsScreen