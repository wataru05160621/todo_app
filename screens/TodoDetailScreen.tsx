import type { StackScreenProps } from "@react-navigation/stack";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { RootStackParamList } from "../App";
import { db } from "../firebaseConfig";

type Props = StackScreenProps<RootStackParamList, "Detail">;

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt?: { toDate: () => Date };
};

const TodoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getDoc(doc(db, "todos", id)).then((snap) => {
      const data = snap.data();
      if (data) setTodo({ id: snap.id, ...(data as Omit<Todo, "id">) });
    });
  }, [id]);

  const remove = async () => {
    await deleteDoc(doc(db, "todos", id));
    navigation.goBack();
  };

  if (!todo) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
      <Text>完了: {todo.done ? "はい" : "いいえ"}</Text>
      {todo.createdAt && (
        <Text>作成日: {todo.createdAt.toDate().toLocaleString()}</Text>
      )}
      <View style={styles.actions}>
        <Button
          title="編集"
          onPress={() => navigation.navigate("Form", { id })}
        />
        <View style={{ width: 16 }} />
        <Button title="削除" onPress={remove} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 8 },
  actions: { flexDirection: "row", marginTop: 16 },
});

export default TodoDetailScreen;
