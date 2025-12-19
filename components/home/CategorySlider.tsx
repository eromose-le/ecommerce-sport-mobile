import { BodyText } from "@/components/ui";
import { FIVE_MINUTES } from "@/constants";
import { PRODUCTS_PROTECTED, PRODUCTS_PUBLIC } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { useTheme, useThemedStyles } from "@/providers/theme";
import { CategoryService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const CategorySlider = () => {
  const theme = useThemedStyles();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.fetchCategories,
    staleTime: FIVE_MINUTES,
  });

  const categories = data?.data && Array.isArray(data.data) ? data.data : [];
  const targetRoute = user ? PRODUCTS_PROTECTED : PRODUCTS_PUBLIC;

  const handleCategoryPress = (categoryId?: string) => {
    if (!categoryId) {
      router.push(targetRoute);
      return;
    }
    router.push({ pathname: targetRoute, params: { category: categoryId } });
  };

  const borderStyle = isDark ? { borderColor: "#0f172a" } : undefined;

  return (
    <View className="mt-5 mb-7">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <TouchableOpacity
          onPress={() => handleCategoryPress(undefined)}
          className={`flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border ${theme.primaryBorderColor} rounded-3xl`}
          style={borderStyle}
        >
          <Ionicons
            name="bag-handle-outline"
            size={18}
            color={theme.iconMuted}
          />
          <BodyText
            size="sm"
            tone={theme.headingTone}
            weight="medium"
            className="ml-2"
          >
            All
          </BodyText>
        </TouchableOpacity>

        {isLoading && (
          <View
            className={`flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border ${theme.primaryBorderColor} rounded-3xl`}
            style={borderStyle}
          >
            <ActivityIndicator size="small" color={theme.iconMuted} />
            <BodyText
              size="sm"
              tone={theme.labelTone}
              weight="medium"
              className="ml-2"
            >
              Loading
            </BodyText>
          </View>
        )}

        {error && (
          <TouchableOpacity
            onPress={() => refetch()}
            className={`flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border ${theme.primaryBorderColor} rounded-3xl`}
          >
            <Ionicons name="reload-outline" size={18} color={theme.iconMuted} />
            <BodyText
              size="sm"
              tone={theme.labelTone}
              weight="medium"
              className="ml-2"
            >
              Retry
            </BodyText>
          </TouchableOpacity>
        )}

        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCategoryPress(item.id)}
            className={`flex-row items-center px-4 py-3 mr-3 bg-transparent h-12 border ${theme.primaryBorderColor} rounded-3xl`}
            style={borderStyle}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={theme.iconMuted}
            />
            <BodyText
              size="sm"
              tone={theme.headingTone}
              weight="medium"
              className="ml-2"
            >
              {item.name}
            </BodyText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySlider;
