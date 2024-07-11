import { StyleSheet, Image, Text, View } from 'react-native';
import products from '@assets/data/products';
import ProductListItem from '@components/ProductListItem';


export default function TabOneScreen() {
  return (
    <View>
      <ProductListItem product={products[5]} />
      <ProductListItem product={products[0]} />
    </View>
  );
}

