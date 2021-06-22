import Axios from "axios";
import { useEffect, useState } from "react";

const Test = (props) => {

    const [data, setData] = useState(null);

    useEffect(() => {
      Axios.get("/api/event")
        .then((res) => setData(res.data.data))
    }, []);

    return (
        <>
            <h1>this is a test</h1>
        </>
    )
}

export default Test;