import { StyleSheet } from "react-native";
import { CelerColors } from "ui/styles";

export const DropdownStyle = StyleSheet.create({

    container: {
        marginVertical: 5,
    },

    title: {
        fontSize: 16,
        color: "#222222",
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#efefef',
        height: 50,
        width: '90%',
        paddingHorizontal: 10,
        zIndex: 1,
    },

    buttonText: {
        flex: 1,
        textAlign: 'center',
    },
    
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        top: 50,
    },   


});
