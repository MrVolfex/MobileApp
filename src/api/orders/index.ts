import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { InsertTables, UpdateTables } from "@/src/types";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";





export const useAdminOrderList = ({archived = false }) => {
   const statuses= archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];


    return useQuery({
      queryKey: ['orders',{archived}],
      queryFn: async () => {
        const{data,error}= await supabase.from('orders').select('*').in('status', statuses).order('created_at', {ascending: false});
        if (error) {
          throw new Error(error.message);
        }
        return data;
      }
  });
};

export const useMyOrderList = () => {

    const{session }= useAuth();
    const id = session?.user.id;
    

    return useQuery({
      queryKey: ['orders', {userId: id}],
      queryFn: async () => {

        if(!id) return null;

        const{data,error}= await supabase.from('orders').select('*').eq('user_id', id).order('created_at', {ascending: false});
        if (error) {
          throw new Error(error.message);
        }
        return data;
      }
  });
};

export const useOrderDetails = (id: number) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
        const{data,error}= await supabase.from('orders').select('*, order_items(*,products(*))').eq('id', id).single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      }
  });

}

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data:any){
      const {error,data : newProduct}=await supabase.from('products').insert({
        name: data.name,
        image: data.image,
        price: data.price,
      }).single();
      if (error) {
          throw new Error(error.message);
        }
        return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    
  })
}

export const useInsertOrder = () => {
  const queryClient = useQueryClient();

  const{session}= useAuth(); 
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>){
      const {error,data : newProduct}=await supabase.from('orders').insert({...data, user_id : userId }).select().single();
      if (error) {
          throw new Error(error.message);
        }
        return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    
  })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({id,updatedField}: {id: number, updatedField: UpdateTables<'orders'>}){
      const {error,data : updatedOrder}=await supabase.from('orders').update(updatedField).eq('id',id).select().single();
      if (error) {
          throw new Error(error.message);
        }
        return updatedOrder;
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
    
  })
}



