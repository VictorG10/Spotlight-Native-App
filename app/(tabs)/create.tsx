import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [userIdReady, setUserIdReady] = useState(false);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    const registerUser = async () => {
      if (!user) return;

      try {
        await createUser({
          clerkId: user.id,
          username:
            user.username || user.emailAddresses[0]?.emailAddress || "unknown",
          fullname: user.fullName || "Unnamed User",
          email: user.emailAddresses[0]?.emailAddress || "no-email@example.com",
          image: user.imageUrl || "",
          bio: "",
        });
        setUserIdReady(true); // ✅ allow share only when user is registered
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    };

    registerUser();
  }, [user]);

  // useEffect(() => {
  //   if (user) {
  //     createUser({
  //       clerkId: user.id,
  //       username:
  //         user.username || user.emailAddresses[0]?.emailAddress || "unknown",
  //       fullname: user.fullName || "Unnamed User",
  //       email: user.emailAddresses[0]?.emailAddress || "no-email@example.com",
  //       image: user.imageUrl || "", // Optional fallback
  //       bio: "", // Optional
  //     });
  //   }
  // }, [user]);

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        }
      );

      if (uploadResult.status !== 200) throw new Error("Upload failed");

      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption });

      router.push("/(tabs)");
    } catch (error) {
      console.error("Error sharing post", error);
    } finally {
      setIsSharing(false);
    }
    // setCaption("");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {!selectedImage ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <View style={{ width: 28 }} />
          </View>

          <TouchableOpacity
            style={styles.emptyImageContainer}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={48} color={COLORS.grey} />
            <Text style={styles.emptyImageText}>Tap to select an image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
                setCaption("");
              }}
              disabled={isSharing}
            >
              <Ionicons
                name="close-outline"
                size={28}
                color={isSharing ? COLORS.grey : COLORS.white}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <TouchableOpacity
              style={[
                styles.shareButton,
                isSharing && styles.shareButtonDisabled,
              ]}
              disabled={isSharing || !selectedImage || !userIdReady}
              onPress={handleShare}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.shareText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentOffset={{ x: 0, y: 100 }}
          >
            <View style={[styles.content, isSharing && styles.contentDisabled]}>
              <View style={styles.imageSection}>
                <Image
                  source={selectedImage}
                  style={styles.previewImage}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={pickImage}
                  disabled={isSharing}
                >
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color={COLORS.white}
                  />
                  <Text style={styles.changeImageText}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <View style={styles.captionContainer}>
                  <Image
                    source={user?.imageUrl}
                    style={styles.userAvatar}
                    contentFit="cover"
                    transition={200}
                  />
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Write a caption..."
                    placeholderTextColor={COLORS.grey}
                    multiline
                    value={caption}
                    onChangeText={setCaption}
                    editable={!isSharing}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;
