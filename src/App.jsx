import logo from '/logo.svg'
import './App.css'

function App() {
    const scriptTag = `<script src="https://cdn.bobgroganconsulting.com/js/smallville.min.js"></script>`;

    return (
        <>
            <div>
                <a href="!#">
                    <img src={logo} className="logo" alt="Vite logo" />
                </a>
            </div>
            <p>Smallville CDN</p>
            <div className="carsd carsd-body">
                <h6></h6>
                <p>SMV js V1.0.1</p>
                <textarea readOnly rows="3"  style={{ width: '50vw', outline:"none",border:"none",color:'#000',background:'rgba(0,0,0,0.06)',padding:10}} >
                    {scriptTag}
                </textarea>
            </div>
        </>
    )
}

export default App;
