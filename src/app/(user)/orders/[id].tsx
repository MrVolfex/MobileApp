
import { useOrderDetails } from '@/src/api/orders';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrderListItem from '@/src/components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, FlatList, View, ActivityIndicator } from 'react-native';

 
 export default function OrdersDetailsScreen() {

    
    const { id:idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

    const {data:order,isLoading,error}= useOrderDetails(id);


    if(isLoading) {
        return <ActivityIndicator/>
      }
      if (error) {
        return <Text>Fail to fetch products</Text>
    }
    


   return (
    <View style={{ padding: 10, gap: 20}}>
        <Stack.Screen options={{title: `Order #${id}`}}/>
        

        <FlatList 
            data={order.order_items}
            renderItem={({item}) => <OrderItemListItem item={item}/>}
            contentContainerStyle={{gap: 10}}
            ListHeaderComponent={() => <OrderListItem order={order}/>}
        />


    </View>
     
   );
 }