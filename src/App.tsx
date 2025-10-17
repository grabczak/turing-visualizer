import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Table } from "src/components/Table";
import { Tape } from "src/components/Tape";
import { store, persistor } from "src/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="container mx-auto flex flex-col items-center p-4">
          <Table />
          <Tape />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
