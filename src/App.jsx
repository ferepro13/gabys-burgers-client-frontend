import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Highlights } from './components/sections/Highlights'
import { Menu } from './components/sections/Menu'
//import { Promo } from './components/sections/Promo'
import { OrderForm } from './components/sections/OrderForm'



export default function App() {


  return (
    <>
          <Header />
          <main>
            <Hero />
            <About />
            <Highlights />
            <Menu />
            {/*<Promo />*/}
            <OrderForm />
          </main>
          <Footer />

    </>
  )
}
