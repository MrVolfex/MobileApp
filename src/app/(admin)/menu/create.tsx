import { View, Text , StyleSheet,TextInput,Image,Alert} from 'react-native'
import React from 'react'
import Button from '@/src/components/Button';
import { useState } from 'react';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';

const CreateProductScreen = () => {

    const [name,setName] = useState('');
    const [price,setPrice] = useState('');
    const [error,setError] = useState('');

    const [image, setImage] = useState<string | null>(null);

    const {id} = useLocalSearchParams();
    const isUpdating = !!id; // Check if we are updating an existing product  



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

    const onUpdateCreate = () => {

        if(!validateInput()){
            return;
        }

        console.warn('Updateing product ');


        
        resetFields();
    }
    const onCreate = () => {

        if(!validateInput()){
            return;
        }

        console.warn('Creating product ');


        
        resetFields();
    }
    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
        onUpdateCreate
    }else{
      onCreate();
    }

    console.warn('Submit clicked');
    
    // Here you would typically send the data to your backend or API
    // For now, we just reset the fields
    resetFields();
    
    // If updating, you might want to handle that logic here as well
    if(isUpdating){
        console.warn('Updating product with id:', id);
        // Update logic goes here
    } else {
        console.warn('Creating new product');
        // Create logic goes here
    }
  }

  const onDelete = () => {
    console.warn('Deleting product with id:', id);
    // Delete logic goes here
    // After deletion, you might want to navigate back or reset the form
    resetFields();
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