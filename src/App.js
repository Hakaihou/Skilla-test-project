import React, { useState } from 'react';
import MainContent from './components/MainContent';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
    const [filter, setFilter] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        endDate: new Date(),
    });

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    };


    const handleDateChange = (range) => {
        setDateRange(range);
    };

    return (
        <React.Fragment>
            <Header onFilterChange={handleFilterChange} onDateChange={handleDateChange} />
            <MainContent filter={filter} dateRange={dateRange} />
            <Footer />
        </React.Fragment>
    );
}
