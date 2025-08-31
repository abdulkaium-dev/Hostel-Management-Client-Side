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
            <Slider />                    {/* Hero section */}
            <SalesPromotion />            {/* Limited-time offer */}
            <MembershipSection />        {/* Premium subscription */}
            <MealsTabs />                {/* Meal categories */}
            <FeaturesSection />          {/* App / Service Features */}
            <CustomerReviews />          {/* Social proof / Testimonials */}
            <RealTimeRequests />         {/* Dynamic user activity */}
            <Promotion />                {/* Secondary / additional offers */}
        </div>
    );
};

export default Home;