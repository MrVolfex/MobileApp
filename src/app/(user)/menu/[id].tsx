import { View, Text,Image,StyleSheet,Pressable, ActivityIndicator} from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { defaultPizzaImage } from '@/src/components/ProductListItem'

import { useState } from 'react'

import Button from '@/src/components/Button'
import { useCart } from '@/src/providers/CartProvider'
import { PizzaSize } from '@/src/types'
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
      <Stack.Screen options={{title:product.name}}/>
      <RemoteImage path={product?.image} fallback={defaultPizzaImage} style={styles.image}/>
      <View style={styles.sizes}>
        <Text>Select Size</Text>
        {sizes.map((size) => (
          <Pressable onPress={() => setSelectedSize(size)}
             style={[styles.size, {backgroundColor: selectedSize === size ? 'gainsboro' : 'white' }]} key={size}>
            <Text style={[styles.sizeText,{color: selectedSize === size ? 'black' : 'gray' } ]} >{size}</Text>
          </Pressable>
        ))}

      </View>


      <Text style={styles.price}>${product.price}</Text>

        <Button onPress={addToCart} text="Add to cart"/>

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
    marginTop:'auto'
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,

  },
  size: {
    backgroundColor: 'gainsboro',
    borderRadius: 25,
    width: 50,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontWeight: '500',
    fontSize: 20,
  },
});

export default ProductDetailsScreen