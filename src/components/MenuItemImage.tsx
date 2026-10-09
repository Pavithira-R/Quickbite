import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { MenuItem } from '../types';

interface MenuItemImageProps {
  item: MenuItem;
  style: StyleProp<ImageStyle>;
  iconSize?: number;
}

// Not every dish has a photo yet; show a neutral placeholder instead of an empty box
export const MenuItemImage: React.FC<MenuItemImageProps> = ({ item, style, iconSize = 40 }) => {
  if (item.image) {
    return <Image source={item.image} style={style} resizeMode="cover" />;
  }

  return (
    <View style={[style, styles.placeholder]}>
      <Ionicons name="fast-food-outline" size={iconSize} color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
