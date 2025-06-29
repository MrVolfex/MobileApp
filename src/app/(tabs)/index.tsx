
import {View} from 'react-native';

import products from '@/assets/data/products';
import ProductListItem from '@/src/components/ProductListItem';



export default function ManuScreen() {
  return (
    <View>
      <ProductListItem product={products[5]}/>
      <ProductListItem product={products[1]}/>
    </View>
   
  );
}
