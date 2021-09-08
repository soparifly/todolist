import "./App.css";

/* <컴포넌트 import하는 여러가지방법>
import Header from "./comps/header";
import RemBody from "./comps/RemBody";
import Footer from "./comps/Footer";
import { Header, RemBody, Footer } from "./comps/index.jsx";
App.js 는  index의 특징 개별이름을 찾고 그다음에 index를 찾아 importgksek
./comps 폴더에 index.js(jsx)가 있으면 파일이름을 생략할수 있다
import { Header, Footer } from "./comps";
import { Rembody } from "./comps";
처럼사용할 수있다(팀플할때 좋을듯..) */

import { Header, RemBody, Footer } from "./comps";

function App() {
  return (
    <div className="App">
      <Header />
      <RemBody />
      <Footer />
    </div>
  );
}

export default App;
