import React, { useState } from 'react';
import MainContent from './components/MainContent';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
    const [filter, setFilter] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 2)), // По умолчанию последние 3 дня
        endDate: new Date(), // Сегодня
    });

    const handleFilterChange = (filterType) => {
        setFilter(filterType); // Установка фильтра напрямую
        console.log(filterType);
    };


    const handleDateChange = (range) => {
        setDateRange(range); // Обновить диапазон дат
    };

    return (
        <React.Fragment>
            <Header onFilterChange={handleFilterChange} onDateChange={handleDateChange} />
            <MainContent filter={filter} dateRange={dateRange} /> {/* Передача фильтра и диапазона дат */}
            <Footer />
        </React.Fragment>
    );
}
