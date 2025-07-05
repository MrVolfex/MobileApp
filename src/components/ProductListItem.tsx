import { StyleSheet } from 'react-native';

import { Text, View, Image , Pressable} from 'react-native';
import Colors from '@/src/constants/Colors';

import {Link, useSegments } from 'expo-router';
import { Tables } from '../database.types';

export const defaultPizzaImage='https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png'


type ProductListItemProps = {
  product: Tables<'products'>; // Using Tables type to ensure type safety
};

const ProductListItem= ({product}: ProductListItemProps)=> {
  const segments=useSegments();
  


  return (
    // Ako se ovaj href ne resi <Link href={`/${product.id}` as any} asChild> probaj da dodas as any
    <Link href ={`/menu/${product.id}` } asChild> 
        <Pressable  style={styles.container} >

            <Image source={{uri: product.image || defaultPizzaImage }} 
            style={styles.image}
            resizeMode='contain' // Ukoliko se velicina containera i sline ne ne poklapaju, slika ce biti smanjena da stane u container zato koristimo ovo
            />


            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
        
        </Pressable>
    </Link>
  );
}
export default ProductListItem;

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   padding: 10,
   borderRadius: 20,
   flex: 1,
   maxWidth: '50%',

  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  price : {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});
