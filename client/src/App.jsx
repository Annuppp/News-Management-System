import { useEffect } from "react";
import axios from "axios";

function App() {
    useEffect(() => {
        axios
            .get("/api/test")
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    }, []);

    return <h1>Frontend</h1>;
}

export default App;
