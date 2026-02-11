import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import SignupForm from '../components/SignupForm';
import headerImg from '/assets/header_img.png'
import Navbar from '../components/Navbar';

const Signup = () => {
    return (
        <div className="w-full overflow-hidden">
            <div className="min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden"
                 style={{backgroundImage: `url('${headerImg}')`}} id="Header">
                <Navbar />
                <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <SignupForm />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default Signup;