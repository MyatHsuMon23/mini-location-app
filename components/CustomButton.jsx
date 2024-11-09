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
    backgroundColor: "#87CEEB",
    borderRadius: 16,
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonLoading: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  loader: {
    marginLeft: 10,
  },
});

export default CustomButton;
