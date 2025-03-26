import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}> */}
      {/* <Text style={styles.headerText}>Personal Info</Text> */}
      {/* </View> */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cms.rhinoshield.app/public/images/ip_page_bugcat_capoo_icon_ad572c7497.jpg",
          }}
        />
        <Text style={styles.name}>Nhat Lam</Text>
        <Text style={styles.job}>BE Developer</Text>
      </View>
      <View style={styles.formSection}>
        <Text style={styles.label}>Your Email</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={16} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="nhatlam2104@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={16} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="+84988xxxxxx"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Your Username</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={16} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="nhatlam214"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 5,
    backgroundColor: "#1E90FF",
    padding: 10,
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  job: {
    fontSize: 18,
    color: "#666666",
    marginTop: 5,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 140,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#999",
  },
  formSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#00A86B",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
