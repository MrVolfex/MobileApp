import { View, Text,Button } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
        
        <Button title='Sign out' onPress={()=>console.warn("sign otu")}/>

    </View>
  )
}

export default ProfileScreen