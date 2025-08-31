import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const Root = () => {
    return (
        <div className="bg-[#F8FAFC] text-[#1E293B]">
            {/* Navbar at the top */}
            <header>
                <Navbar />
            </header>

            {/* Main content area */}
            <main className=" px-4 sm:px-6 lg:px-16 my-10">
                {/* Each page rendered via Outlet */}
                <Outlet />
            </main>

            {/* Footer at the bottom */}
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Root;
