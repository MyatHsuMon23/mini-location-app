import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image, StyleSheet } from "react-native";

import { images } from "../constants";
import { CustomButton, FormField } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const SignIn = () => {
  const { login } = useGlobalContext();
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
      await login(form.username, form.password);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/");
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
          <Image source={images.logo} resizeMode="contain" style={styles.logo} />
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
    backgroundColor: "#ffffff",
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 400,
    height: 80,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  formField: {
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SignIn;
