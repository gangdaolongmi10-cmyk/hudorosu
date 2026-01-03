import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScreenHeaderProps {
    title: string;
    onBack?: () => void;
    rightComponent?: React.ReactNode;
    titleStyle?: TextStyle;
}

export default function ScreenHeader({ title, onBack, rightComponent, titleStyle }: ScreenHeaderProps) {
    return (
        <View style={styles.header}>
            {onBack ? (
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#3A4D3A" />
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}
            
            <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
            
            {rightComponent ? (
                <View style={styles.rightComponent}>{rightComponent}</View>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3A4D3A',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    rightComponent: {
        width: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

