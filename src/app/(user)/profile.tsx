import { View, Text,Button } from 'react-native'
import React from 'react'
import { supabase } from '@/src/lib/supabase'



const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
        
        <Button title='Sign out' onPress={()=>console.warn("sign otu")}/>
        

    </View>
  )
}

export default ProfileScreen