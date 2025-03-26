"use client"

import { useState, useEffect, useContext } from "react"
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native"
import { router } from "expo-router"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { AuthContext } from "../context/AuthContext"
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function ProductListScreen() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const { logout } = useContext(AuthContext)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter((product) => product.loaisp.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const productsCollection = collection(db, "products")
      const productsSnapshot = await getDocs(productsCollection)

      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setProducts(productsList)
      setFilteredProducts(productsList)
    } catch (error) {
      console.error("Error fetching products:", error)
      Alert.alert("Error", "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = (productId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "products", productId))
            // Update the local state
            const updatedProducts = products.filter((product) => product.id !== productId)
            setProducts(updatedProducts)
            setFilteredProducts(updatedProducts)
            Alert.alert("Success", "Product deleted successfully")
          } catch (error) {
            console.error("Error deleting product:", error)
            Alert.alert("Error", "Failed to delete product")
          }
        },
      },
    ])
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      router.replace("/login")
    } else {
      Alert.alert("Error", result.error || "Failed to logout")
    }
  }

  // COMPLETELY REDESIGNED PRODUCT ITEM RENDERER - NOW A CARD IN A GRID
  const renderProductItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? 0 : 8, marginRight: index % 2 === 0 ? 8 : 0 }]}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Product Image with Price Overlay */}
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: item.hinhanh || "https://via.placeholder.com/100" }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.gia}</Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.cardContent}>
        <Text style={styles.productType} numberOfLines={1}>
          {item.loaisp}
        </Text>
        <Text style={styles.productId} numberOfLines={1}>
          ID: {item.id.substring(0, 10)}...
        </Text>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={(e) => {
              e.stopPropagation()
              router.push(`/product/edit/${item.id}`)
            }}
          >
            <MaterialIcons name="edit" size={16} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation()
              handleDeleteProduct(item.id)
            }}
          >
            <MaterialIcons name="delete" size={16} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006241" />

      {/* COMPLETELY REDESIGNED HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Catalog</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={fetchProducts}>
            <Feather name="refresh-cw" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      {/* COMPLETELY REDESIGNED SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product type..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/product/add")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        // IMPROVED LOADING STATE
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006241" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        // COMPLETELY REDESIGNED LIST - NOW A GRID
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
          numColumns={2}
          ListEmptyComponent={
            // IMPROVED EMPTY STATE
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={70} color="#ccc" />
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? "Try a different search term" : "Add your first product to get started"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/product/add")}>
                  <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.emptyButtonText}>Add Product</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </SafeAreaView>
  )
}

// COMPLETELY REDESIGNED STYLES
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#006241",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 12,
  },
  searchContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  addButton: {
    backgroundColor: "#006241",
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  productList: {
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    maxWidth: (width - 36) / 2, // Account for padding and gap
  },
  cardImageContainer: {
    position: "relative",
    height: 180.,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,98,65,0.85)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardContent: {
    padding: 12,
  },
  productType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productId: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#006241",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#006241",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

