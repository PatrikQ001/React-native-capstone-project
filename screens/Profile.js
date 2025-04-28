import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation,CommonActions } from "@react-navigation/native"; // Import navigation hook

const Profile = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Load data from AsyncStorage
  useEffect(() => {
    const loadProfileData = async () => {
      const storedName = await AsyncStorage.getItem("name");
      const storedEmail = await AsyncStorage.getItem("email");

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    };

    loadProfileData();
  }, []);

  // Save changes to AsyncStorage
  const saveChanges = async () => {
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("phone", phone);
    await AsyncStorage.setItem("avatar", avatar || "");
    await AsyncStorage.setItem("emailNotifications", JSON.stringify(emailNotifications));
    Alert.alert("Success", "Changes have been saved!");
  };

  // Logout and clear AsyncStorage
  const logout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all data
      Alert.alert("Logged Out", "You have been logged out.");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        })
      );
      
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // Handle image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.uri);
    }
  };

  // Validate phone number (US format)
  const isPhoneValid = /^\d{10}$/.test(phone);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarEmpty}>
            <Text style={styles.avatarEmptyText}>
              {name ? name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <View style={styles.avatarButtons}>
          <Pressable style={styles.changeBtn} onPress={pickImage}>
            <Text style={styles.saveBtnText}>Change</Text>
          </Pressable>
        </View>
      </View>

      {/* Input Fields */}
      <Text style={styles.text}>Name</Text>
      <TextInput
        style={styles.inputBox}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.text}>Email</Text>
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.text}>Phone</Text>
      <TextInput
        style={[styles.inputBox, !isPhoneValid && phone.length > 0 && styles.errorInput]}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      {!isPhoneValid && phone.length > 0 && (
        <Text style={styles.error}>Invalid phone number</Text>
      )}

      {/* Email Notifications */}
      <View style={styles.section}>
        <Text style={styles.paragraph}>Email Notifications</Text>
        <Pressable
          style={styles.checkbox}
          onPress={() => setEmailNotifications(!emailNotifications)}
        >
          <Text>{emailNotifications ? "☑" : "☐"}</Text>
        </Pressable>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable style={styles.saveBtn} onPress={saveChanges}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
        <Pressable style={styles.discardBtn} onPress={logout}>
          <Text style={styles.discardBtnText}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  avatarButtons: {
    flexDirection: "row",
    marginLeft: 10,
  },
  changeBtn: {
    backgroundColor: "#495e57",
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#dfdfe5",
    borderRadius: 9,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "#d14747",
  },
  error: {
    color: "#d14747",
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    marginLeft: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#495e57",
    borderRadius: 9,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  discardBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  discardBtnText: {
    fontSize: 18,
    color: "#3e524b",
    textAlign: "center",
  },
});

export default Profile;