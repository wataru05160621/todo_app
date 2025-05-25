import type { StackScreenProps } from "@react-navigation/stack";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import type { RootStackParamList } from "../App";
import { db } from "../firebaseConfig";

type Props = StackScreenProps<RootStackParamList, "Form">;

const TodoFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route.params?.id;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDoc(doc(db, "todos", id))
        .then((snap) => {
          const data = snap.data();
          if (data) setTitle((data as { title: string }).title);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert("タイトルを入力してください");
      return;
    }
    setLoading(true);
    if (id) {
      await updateDoc(doc(db, "todos", id), { title });
    } else {
      await addDoc(collection(db, "todos"), {
        title,
        done: false,
        createdAt: new Date(),
      });
    }
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            placeholder="タスクタイトル"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <Button title="保存" onPress={save} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
});

export default TodoFormScreen;
