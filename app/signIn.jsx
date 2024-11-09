import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

import { images } from "../constants";
import { CustomButton, FormField } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const SignIn = () => {
  const { login } = useGlobalContext();  // Use login function from GlobalProvider
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      // Call login from GlobalProvider
      await login(form.username, form.password);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/"); // Redirect to home on success
    } catch (error) {
      Alert.alert("Error", error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>Log in</Text>

          <FormField
            title="User Name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formField}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formField}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles={styles.buttonContainer}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff", // Change background to white
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Make sure scroll view can grow and fill the screen
    justifyContent: "center", // Center content vertically
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#FFF", // Make form background white
    borderRadius: 16, // Border radius for the container
    padding: 30,
    width: "100%", // Full width of the screen
    maxWidth: 400, // Max width for large screens
    alignSelf: "center", // Center the form horizontally
    shadowColor: "#000", // Shadow for elevation (iOS and Android)
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android
  },
  logo: {
    width: 115,
    height: 34,
    alignSelf: "center", // Center the logo
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#333", // Change the title color to dark for better contrast
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center", // Center the title text
  },
  formField: {
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SignIn;
