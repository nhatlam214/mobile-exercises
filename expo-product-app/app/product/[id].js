"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, "products", id))
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() })
      } else {
        Alert.alert("Error", "Product not found")
        router.back()
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      Alert.alert("Error", "Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006241" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006241" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/product/edit/${product.id}`)}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Image and Price */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: product.hinhanh || "https://via.placeholder.com/300" }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.productPrice}>${product.gia}</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          {/* Product Type Card */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="cube-outline" size={22} color="#006241" />
              <Text style={styles.cardTitle}>Product Type</Text>
            </View>
            <Text style={styles.productType}>{product.loaisp}</Text>
          </View>

          {/* Product ID Card */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="key-outline" size={22} color="#006241" />
              <Text style={styles.cardTitle}>Product ID</Text>
            </View>
            <Text style={styles.productId}>{product.id}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/product/edit/${product.id}`)}>
              <MaterialIcons name="edit" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Edit Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Back to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#006241",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  backBtn: {
    padding: 5,
  },
  editBtn: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  heroSection: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 370,
  },
  priceContainer: {
    position: "absolute",
    bottom: -30,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    minWidth: 90,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#006241",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006241",
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 40,
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  productType: {
    fontSize: 18,
    color: "#333",
  },
  productId: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#006241",
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#006241",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    backgroundColor: "#69A892",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})

