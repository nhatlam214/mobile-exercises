import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
// import { db } from '../config/firebaseConfig';

const EditProduct = ({ route }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);

  const updateProduct = async () => {
    try {
      await db.collection('products').doc(product.id).update({
        name,
        price: parseFloat(price),
        description,
      });
      alert('Sản phẩm đã được cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
    }
  };

  return (
    <View>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput value={description} onChangeText={setDescription} />
      <Button title="Cập nhật sản phẩm" onPress={updateProduct} />
    </View>
  );
};

export default EditProduct;