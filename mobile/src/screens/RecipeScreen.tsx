import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeScreen() {
    return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.recipeTitle}>今日のごちそう</Text>

        <View style={styles.featuredRecipeCard}>
            <Image
                source={{
                    uri: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
                }}
                style={styles.featuredRecipeImage}
            />
            <View style={styles.featuredRecipeOverlay}>
            <View style={styles.featuredRecipeBadge}>
                <Text style={styles.featuredRecipeBadgeText}>PICK UP</Text>
            </View>
            <Text style={styles.featuredRecipeTitle}>
                余った野菜で！{'\n'}彩り豊かなラタトゥイユ
            </Text>
            <View style={styles.featuredRecipeMeta}>
                <View style={styles.featuredRecipeMetaItem}>
                <Ionicons name="time-outline" size={12} color="#ffffff" />
                <Text style={styles.featuredRecipeMetaText}>20min</Text>
                </View>
                <View style={styles.featuredRecipeMetaItem}>
                <Ionicons name="heart-outline" size={12} color="#ffffff" />
                <Text style={styles.featuredRecipeMetaText}>1.2k</Text>
                </View>
            </View>
            </View>
        </View>

        <View style={styles.aiRecipeSection}>
            <View style={styles.aiRecipeSectionHeader}>
            <Ionicons name="star" size={18} color="#6B8E6B" />
            <Text style={styles.aiRecipeSectionTitle}>冷蔵庫にあるもので提案</Text>
            </View>
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipeList}
            >
            {[
                { title: '卵とほうれん草の炒め物', time: '10分', icon: '🍳' },
                { title: '鶏肉のガリバタ焼き', time: '15分', icon: '🍗' },
                { title: '簡単アボカドサラダ', time: '5分', icon: '🥗' },
            ].map((r, i) => (
                <View key={i} style={styles.recipeCard}>
                <Text style={styles.recipeCardIcon}>{r.icon}</Text>
                <Text style={styles.recipeCardTitle} numberOfLines={2}>
                    {r.title}
                </Text>
                <Text style={styles.recipeCardTime}>{r.time}</Text>
                </View>
            ))}
            </ScrollView>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingBottom: 96,
    },
    recipeTitle: {
        fontSize: 24,
        fontFamily: 'serif',
        color: '#3A4D3A',
        marginBottom: 24,
        textAlign: 'center',
        paddingTop: 24,
    },
    featuredRecipeCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        borderRadius: 40,
        overflow: 'hidden',
        aspectRatio: 4 / 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        alignSelf: 'center',
    },
    featuredRecipeImage: {
        width: '100%',
        height: '100%',
    },
    featuredRecipeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    featuredRecipeBadge: {
        backgroundColor: '#6B8E6B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    featuredRecipeBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    featuredRecipeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    featuredRecipeMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    featuredRecipeMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredRecipeMetaText: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.8,
    },
    aiRecipeSection: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    aiRecipeSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    aiRecipeSectionTitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#3A4D3A',
    },
    recipeList: {
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    recipeCard: {
        minWidth: 140,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f9fafb',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    recipeCardIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    recipeCardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        color: '#1f2937',
    },
    recipeCardTime: {
        fontSize: 10,
        color: '#9ca3af',
    },
});

