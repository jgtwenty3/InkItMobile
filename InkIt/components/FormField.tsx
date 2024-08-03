import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TextInputProps,
  StyleSheet,
} from "react-native";



type FormFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: object;
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({
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
            
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    color: '#D1D5DB', // text-gray-100
    fontFamily: 'Courier',
  },
  inputContainer: {
    width: '100%',
    height: 64, // 16 * 4 (assuming 16 is the base unit)
    paddingHorizontal: 16, // px-4
    backgroundColor: '#1A1A1A', // black-100
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: '#2D2D2D', // border-black-200
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#FFFFFF', // text-white
    fontFamily: 'Courier',
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
