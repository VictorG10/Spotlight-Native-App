import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Post = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

const Post = ({ post }: { post: any }) => {
  const handleDelete = () => {};

  return (
    <View style={styles.post}>
      {/* Post Header  */}

      <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </TouchableOpacity>
        </Link>

        {/* show a delete button  */}
        {/* <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Post Image  */}
      <Image
        source={post.author.image}
        style={styles.postAvatar}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Post Actions  */}

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;
