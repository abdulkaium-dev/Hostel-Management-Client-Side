import React from 'react';
import Slider from './Slider';
import FeaturesSection from './FeaturesSection';
import RealTimeRequests from './RealTimeRequests';
import MembershipSection from './MembershipSection';
import MealsTabs from './MealsTabs';
import SalesPromotion from './SalesPromotion';
import Promotion from './Promotion';
import CustomerReviews from './CustomerReviews';

const Home = () => {
    return (
        <div>
            <div className="my-10">
                <Slider />                    {/* Hero section */}
            </div>
            <div className="my-10">
                <SalesPromotion />            {/* Limited-time offer */}
            </div>
            <div className="my-10">
                <MembershipSection />        {/* Premium subscription */}
            </div>
            <div className="my-10">
                <MealsTabs />                {/* Meal categories */}
            </div>
            <div className="my-10">
                <FeaturesSection />          {/* App / Service Features */}
            </div>
            <div className="my-10">
                <CustomerReviews />          {/* Social proof / Testimonials */}
            </div>
            <div className="my-10">
                <RealTimeRequests />         {/* Dynamic user activity */}
            </div>
            <div className="my-10">
                <Promotion />                {/* Secondary / additional offers */}
            </div>
        </div>
    );
};

export default Home;
