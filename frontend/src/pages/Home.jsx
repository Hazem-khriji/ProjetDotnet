import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <div className="w-full overflow-hidden">
            <Header />
            <About />
            <Testimonials />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;