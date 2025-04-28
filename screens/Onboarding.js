import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Onboarding = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Validation functions
  const isNameValid = name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleNext = async () => {
    try {
      await AsyncStorage.setItem("name", name); // Save name
      await AsyncStorage.setItem("email", email); // Save email
      props.onComplete(); // Call the onComplete function
    } catch (error) {
      console.error("Error saving data", error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
          accessible={true}
          accessibilityLabel="Little Lemon Logo"
        />
      </View>

      <Text style={styles.welcomeText}>Let us get to know you</Text>

      <View style={styles.pageContainer}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your name"
          onChangeText={setName}
          value={name}
          accessibilityLabel="Name input field"
        />
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          accessibilityLabel="Email input field"
        />
      </View>
      <Pressable
        style={[styles.btn, !(isNameValid && isEmailValid) && styles.btnDisabled]}
        disabled={!(isNameValid && isEmailValid)}
        onPress={handleNext}
        accessibilityLabel="Next button"
      >
        <Text style={styles.btntext}>Next</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dee3e9",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#495E57",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40,
    paddingVertical: 20,
    color: "#495E57",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    color: "#495E57",
  },
  inputBox: {
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginHorizontal: 18,
    marginBottom: 60,
    padding: 10,
    borderWidth: 1,
  },
  btnDisabled: {
    backgroundColor: "#f1f4f7",
  },
  btntext: {
    fontSize: 22,
    color: "#333",
    alignSelf: "center",
    textAlign: "center",
  },
});

export default Onboarding;