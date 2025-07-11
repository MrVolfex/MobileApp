import { View, Text , StyleSheet,TextInput,Image,Alert} from 'react-native'
import React, { useEffect } from 'react'
import Button from '@/src/components/Button';
import { useState } from 'react';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer'; 
const CreateProductScreen = () => {

    const [name,setName] = useState('');
    const [price,setPrice] = useState('');
    const [error,setError] = useState('');

    const [image, setImage] = useState<string | null>(null);



    const {id:idString} = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]); // Convert id to a number or null if not present
    const isUpdating = !!id; // Check if we are updating an existing product  




    const{mutate: insertProduct}=useInsertProduct();
    const {mutate: updateProduct} = useUpdateProduct();
    const {data: updatingProduct}=useProduct(id)
    const {mutate: deleteProduct} = useDeleteProduct(); 

    const router= useRouter();


    useEffect(() => {
      if(updatingProduct){
        setName(updatingProduct.name);
        setPrice(updatingProduct.price.toString());
        setImage(updatingProduct.image || null); // Set image if available
      }
    }, [updatingProduct]);



    const resetFields = () => {
        setName('');
        setPrice('');
    }

    const validateInput = () => {
        setError(''); // Reset error message
        if(!name ){
            setError('Name is required');
            return false;
        }
        if(!price){
            setError('Price is required');
            return false;
        }
        if(isNaN(Number(price)) ){
            setError('Price must be a number');
            return false;
        }
            
        return true;

    }

    const onUpdateCreate = async() => {

        if(!validateInput()){
            return;
        }

        const imagePath = await uploadImage();

        updateProduct({
          id,
          name,
          price: parseFloat(price),
          image : imagePath
        },{
          onSuccess: () => {
            resetFields();
            router.back();
          }
        });


    }
    const onCreate = async() => {

        if(!validateInput()){
            return;
        }
        const imagePath = await uploadImage();

        
        insertProduct({
            name,
            price: parseFloat(price),
            image: imagePath,
        },{
          onSuccess: () => {
            resetFields();
            router.back();
          }
        });


        
        resetFields();
    }
    const pickImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const onSubmit= () => {
    if(isUpdating){
        onUpdateCreate();
    }else{
      onCreate();
    }
  }

  const onDelete = () => {
    deleteProduct(id,{onSuccess: () => {
      resetFields();
      router.replace('/(admin)/menu');
    }});
    
  }

  const confirmDelete = () => {
    Alert.alert("Confirm","Are you sure you want to delete this product?",[{
      text: "Cancel",
    },{
      text:'Delete',
      style: 'destructive',
      onPress: onDelete, 
    }
    ])
  }

  const uploadImage = async () => {
      if (!image?.startsWith('file://')) {
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64',
      });
      const filePath = `${randomUUID()}.png`;
      const contentType = 'image/png';
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, decode(base64), { contentType });

      if (data) {
        return data.path;
      }
    };
    

  return (

    <View style={styles.container}>

      <Stack.Screen options={{title: isUpdating ? "Update Product" : 'Create product'}}/>

      <Image source={{uri:image || defaultPizzaImage }} style={styles.image}/>
      <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>

      <Text style={styles.label}  >Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder='Name' style={styles.input}/>

      <Text style={styles.label}  >Price $</Text>
      <TextInput value={price} onChangeText={setPrice}  placeholder='9.99' style={styles.input} keyboardType='numeric'/>

      <Text style={{color:'red'}}>{error}</Text>
      <Button onPress={onSubmit} text={isUpdating? 'Update':'Create'}/>
      { isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
    </View>

  )
}


const styles = StyleSheet.create({
  container: {  
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input : {
    backgroundColor: 'white',
    padding: 10,    
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  label: {
        color: 'gray',
        fontSize: 16,
  },
  image : {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
    
  },
    textButton: {
        color: Colors.light.tint,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 10,
    }
    

});



export default CreateProductScreen