import { useRef } from 'react';


const Home = () => {
    const form = useRef();

    const submitPortfolio = (e) => {
        e.preventDefault();
    }



    return (
        <div className="dashboard">

            <form ref={form} onSubmit={submitPortfolio}>
                <p><input type="text" placeholder="Name" /></p>
                <p><textarea placeholder="Description" /></p>
                <p><input type="text" placeholder="Url" /></p>
                <p><input type="file" placeholder="Image" /></p>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Home;