"use client"

import { useState } from "react"
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
} from "react-native"
import { router } from "expo-router"
import { collection, addDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../firebase/config"
import * as ImagePicker from "expo-image-picker"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"

export default function ProductAddScreen() {
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to upload images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const uploadImage = async () => {
    if (!image) return null

    try {
      const response = await fetch(image)
      const blob = await response.blob()

      const storageRef = ref(storage, `products/${Date.now()}`)
      await uploadBytes(storageRef, blob)

      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleAddProduct = async () => {
    if (!productType || !price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      let imageUrl = null

      if (image) {
        imageUrl = await uploadImage()
      }

      // First add the document to get an ID
      const docRef = await addDoc(collection(db, "products"), {
        idsanpham: "", // Temporary empty value
        loaisp: productType,
        gia: Number.parseFloat(price),
        // description: description,
        hinhanh: imageUrl,
      })

      // Then update the document to set productNameId equal to the document ID
      await updateDoc(docRef, {
        idsanpham: docRef.id,
      })

      Alert.alert("Success", "Product added successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Error adding product:", error)
      Alert.alert("Error", "Failed to add product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.placeholder} />
      </View> */}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.imageSection}>
              {image ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.productImage} />
                  <TouchableOpacity style={styles.imagePickerFloatingButton} onPress={pickImage}>
                    <Ionicons name="camera" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                  <Ionicons name="image-outline" size={60} color="#ccc" />
                  <Text style={styles.placeholderText}>Tap to select an image</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formSection}>
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddProduct} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <MaterialIcons name="add-circle" size={22} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Add Product</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={isLoading}>
                  <Ionicons name="close-circle" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#006241",
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  backBtn: {
    padding: 5,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    height: 320,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#999",
    marginTop: 10,
  },
  imagePickerFloatingButton: {
    position: "absolute",
    bottom: 15,
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
  formSection: {
    padding: 20,
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
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  addButton: {
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
})

