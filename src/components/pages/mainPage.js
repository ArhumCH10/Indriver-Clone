import React from 'react';
import Header from '../ui/Header';
import Hero from '../ui/Hero';
import Services from '../ui/Services';
import About from '../ui/About';
import Work from '../ui/Work';
import Footer from '../ui/Footer';

function MainPage()
{
    return(
        <div className="App">
        <Header />
        <Hero/>
        <Services/>
        <About/>
        <Work/>
        <Footer/>
      </div>
    );
}

export default MainPage;