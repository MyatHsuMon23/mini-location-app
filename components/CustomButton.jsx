import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading && styles.buttonLoading]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#87CEEB", // Sky blue background color
    borderRadius: 16, // rounded corners
    minHeight: 62, // height of the button
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Padding inside the button
  },
  buttonLoading: {
    opacity: 0.5, // Apply opacity when loading
  },
  text: {
    color: "#fff", // White text color
    fontFamily: "Poppins-SemiBold", // Assuming this is the font you want to use
    fontSize: 18,
  },
  loader: {
    marginLeft: 10, // Space between text and loader
  },
});

export default CustomButton;
