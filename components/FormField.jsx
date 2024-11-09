import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { icons } from "../constants"; // Assuming you have an icons object

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f3f3f3", // Sky blue color
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#66B3FF", // Light blue border color to match the background
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#000", // Black text for better contrast
    fontSize: 16,
    fontWeight: "600",
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
