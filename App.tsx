// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import TodoDetailScreen from "./screens/TodoDetailScreen";
import TodoFormScreen from "./screens/TodoFormScreen";
import TodoListScreen from "./screens/TodoListScreen";

// 画面パラメータの型
export type RootStackParamList = {
  List: undefined;
  Form: { id?: string };
  Detail: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={TodoListScreen}
        options={{ title: "Todo一覧" }}
      />
      <Stack.Screen
        name="Form"
        component={TodoFormScreen}
        options={{ title: "タスク作成・編集" }}
      />
      <Stack.Screen
        name="Detail"
        component={TodoDetailScreen}
        options={{ title: "タスク詳細" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
