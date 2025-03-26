import React from 'react';
import { View, Text } from 'react-native';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';

const App = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Quản lý sản phẩm</Text>
      <AddProduct />
      <ProductList />
    </View>
  );
};

export default App;