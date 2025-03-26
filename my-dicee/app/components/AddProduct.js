import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
// import { db } from '../config/firebaseConfig';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const addProduct = async () => {
    try {
      await db.collection('products').add({
        name,
        price: parseFloat(price),
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert('Sản phẩm đã được thêm thành công!');
      setName('');
      setPrice('');
      setDescription('');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Tên sản phẩm" value={name} onChangeText={setName} />
      <TextInput placeholder="Giá" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Mô tả" value={description} onChangeText={setDescription} />
      <Button title="Thêm sản phẩm" onPress={addProduct} />
    </View>
  );
};

export default AddProduct;