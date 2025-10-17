import { Provider } from "react-redux";

import { Table } from "src/components/Table";
import { Tape } from "src/components/Tape";
import { store } from "src/store";

function App() {
  return (
    <Provider store={store}>
      <div className="container mx-auto flex flex-col items-center p-4">
        <Table />
        <Tape />
      </div>
    </Provider>
  );
}

export default App;
