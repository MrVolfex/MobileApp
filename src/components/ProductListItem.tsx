import { StyleSheet } from 'react-native';

import { Text, View, Image } from 'react-native';
import Colors from '@/src/constants/Colors';
import { Product } from '@/src/types';


export const defaultPizzaImage='https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png'


type ProductListItemProps = {
  product: Product;
};

const ProductListItem= ({product}: ProductListItemProps)=> {
  
  return (
     <View style={styles.container}>

      <Image source={{uri: product.image || defaultPizzaImage }} 
      style={styles.image}
      resizeMode='contain' // Ukoliko se velicina containera i sline ne ne poklapaju, slika ce biti smanjena da stane u container zato koristimo ovo
      />


      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      
    </View>
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
