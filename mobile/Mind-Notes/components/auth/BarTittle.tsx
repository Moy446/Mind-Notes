import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme';

interface Props {
    title : string;
    align?: 'left' | 'center' | 'right';
    textSize?: number;
    backgroundColor?: string;
}

const alignStyle={
    left: { alignSelf: 'flex-start' as const, borderTopEndRadius: 15, borderBottomEndRadius: 15,  },
    center: { alignSelf: 'center' as const, borderRadius: 15 },
    right: { alignSelf: 'flex-end' as const, borderTopStartRadius: 15, borderBottomStartRadius: 15, },
}


const BarTittle = ({ title, align = 'left', textSize = 30, backgroundColor = Colors.secondaryButton }: Props) => {
  return (
    <View style={{
        ...alignStyle[align], 
        width: '90%',
        padding: 10, 
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: backgroundColor,
        }}>
      <Text style={{ fontSize: textSize, fontFamily: 'SairaMedium' }}>{title}</Text>
    </View>
  )
}

export default BarTittle