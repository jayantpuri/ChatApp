import Home from "./pages/Home.component.jsx";
import ChatsPage from "./pages/ChatsPage.component.jsx";
import { Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Route path="/" component={Home} exact />
      <Route path="/chats" index component={ChatsPage} />
    </div>
  );
};

export default App;
