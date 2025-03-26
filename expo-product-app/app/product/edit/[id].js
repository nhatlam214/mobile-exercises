"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProductEditScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        const productData = {
          id: productDoc.id,
          ...productDoc.data(),
          productNameId: productDoc.id, // Ensure productNameId is the document ID
        };
        setProduct(productData);
        setProductName(productData.productNameId);
        setProductType(productData.loaisp);
        setPrice(productData.gia.toString());
        setDescription(productData.description || "");
        setImage(productData.hinhanh || null);
      } else {
        Alert.alert("Error", "Product not found");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!newImage) return image;

    try {
      const response = await fetch(newImage);
      const blob = await response.blob();

      const storageRef = ref(storage, `products/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleUpdateProduct = async () => {
    if (!productType || !price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = image;

      if (newImage) {
        imageUrl = await uploadImage();
      }

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        idsanpham: id, // Always use the document ID
        loaisp: productType,
        gia: Number.parseFloat(price),
        // description: description,
        hinhanh: imageUrl,
        // updatedAt: new Date(),
      });

      Alert.alert("Success", "Product updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006241" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={styles.placeholder} />
      </View> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageSection}>
            <Image
              source={{
                uri: newImage || image || "https://via.placeholder.com/300",
              }}
              style={styles.productImage}
            />
            <View style={styles.imageOverlay}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Ionicons
                 name="camera" 
                 size={26}
                 color="#fff"
                 style={styles.cameraIcon} />
                <Text style={styles.imagePickerText}></Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="cube-outline" size={18} color="#006241" /> Product Type
              </Text>
              <TextInput
                style={styles.input}
                value={productType}
                onChangeText={setProductType}
                placeholder="Enter product type"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="dollar-sign" size={16} color="#006241" /> Price
              </Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>Product ID</Text>
              <Text style={styles.productId}>{id}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateProduct}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons
                      name="save-alt"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Update Product</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isSaving}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  // header: {
  //   backgroundColor: "#006241",
  //   paddingTop: Platform.OS === "ios" ? 20 : 10,
  //   paddingBottom: 15,
  //   paddingHorizontal: 15,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   elevation: 4,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 3,
  // },
  // headerTitle: {
  //   color: "#fff",
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  // backBtn: {
  //   padding: 5,
  // },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  loadingText: {
    marginTop: 10,
    color: "#006241",
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  imageSection: {
    position: "relative",
    height: 400,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    // backgroundColor: "rgba(189, 189, 189, 0.4)",
    padding: 15,
  },
  imagePickerButton: {
    position: "absolute",
    bottom: 40,
    right: 15,
    backgroundColor: "rgba(0,98,65,0.9)",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imagePickerText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 15,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    padding: 20,
    paddingTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  idContainer: {
    backgroundColor: "#f0f8f4",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#006241",
  },
  idLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  productId: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#006241",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 15,
  },
  updateButton: {
    backgroundColor: "#006241",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cameraIcon: {
    paddingTop: 13,
    alignItems: "center",
    justifyContent: "center",
  }
});
