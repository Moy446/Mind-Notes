import { View, Text } from 'react-native'
import React from 'react'
import { Link, LinkProps } from 'expo-router'

interface Props extends LinkProps {}

const ThemedLink = ({style, ...rest}: Props) => {
    return (
        <Link
            style={[{
                color: '#007AFF',
                },
                style,
            ]}
            {...rest}
        />
    );
};

export default ThemedLink