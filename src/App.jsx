import logo from '/logo.svg'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="!#">
          <img src={logo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <p>Smallville CDN</p>
        <div className="card card-body">
            <h6>SMV js V1.0.1</h6>
            <p>https://cdn.bobgroganconsulting.com/js/smallville.min.js</p>
        </div>
    </>
  )
}

export default App
