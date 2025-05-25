import type { StackScreenProps } from "@react-navigation/stack";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { RootStackParamList } from "../App";
import { db } from "../firebaseConfig";

type Props = StackScreenProps<RootStackParamList, "List">;

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

const TodoListScreen: React.FC<Props> = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "todos"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Todo, "id">),
      }));
      setTodos(items);
    });
    return () => unsub();
  }, []);

  const toggleDone = async (item: Todo) => {
    await updateDoc(doc(db, "todos", item.id), { done: !item.done });
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <View style={styles.container}>
      <Button title="+ 新規作成" onPress={() => navigation.navigate("Form")} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Detail", { id: item.id })}
          >
            <Text onPress={() => toggleDone(item)} style={styles.checkbox}>
              {item.done ? "✅" : "⬜"}
            </Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text onPress={() => remove(item.id)} style={styles.delete}>
              🗑️
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  checkbox: { marginRight: 8 },
  title: { flex: 1 },
  delete: { marginLeft: 8 },
});

export default TodoListScreen;
