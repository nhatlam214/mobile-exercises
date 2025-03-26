import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Button } from 'react-native';
// import { db } from '../config/firebaseConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const subscriber = db.collection('products')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      });

    return () => subscriber();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await db.collection('products').doc(id).delete();
      alert('Sản phẩm đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name} - ${item.price}</Text>
      <Text>{item.description}</Text>
      <Button title="Xóa" onPress={() => deleteProduct(item.id)} />
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default ProductList;