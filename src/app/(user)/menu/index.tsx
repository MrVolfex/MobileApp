
import {View,FlatList, ActivityIndicator, Text} from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useProductList } from '@/src/api/products';


export default function ManuScreen() {

  const {data: products,error,isLoading} = useProductList();

  if(isLoading) {
    return <ActivityIndicator/>
  }
  if (error) {
    return <Text>Fail to fetch products</Text>
  }


  return (
      <FlatList
        data = {products}
        renderItem={({item})=> <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{gap: 10,padding: 10}}
        columnWrapperStyle={{gap: 10}}
        />
    
  );
}
