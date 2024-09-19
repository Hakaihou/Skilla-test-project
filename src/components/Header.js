import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Header({onFilterChange, onDateChange}) {
    const [isOpenDropdown1, setIsOpenDropdown1] = useState(false);
    const [isOpenDropdown2, setIsOpenDropdown2] = useState(false);

    const [selectedOption1, setSelectedOption1] = useState('Все типы');
    const [selectedOption2, setSelectedOption2] = useState('3 дня');

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 2)));
    const [endDate, setEndDate] = useState(new Date());
    const [customDateRange, setCustomDateRange] = useState('__.__.__-__.__.__');

    const today = new Date();

    const toggleDropdown1 = () => {
        setIsOpenDropdown1(!isOpenDropdown1);
        setIsOpenDropdown2(false);
    };

    const toggleDropdown2 = () => {
        setIsOpenDropdown2(!isOpenDropdown2);
        setIsOpenDropdown1(false);
    };

    const getDateRange = (option) => {
        const today = new Date();
        let startDate = null;
        let endDate = today;

        switch (option) {
            case '3 дня':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 2);
                break;
            case 'Неделя':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 6);
                break;
            case 'Месяц':
                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'Год':
                startDate = new Date(today);
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            default:
                startDate = null;
        }
        return {startDate, endDate};
    };

    const handleOptionClick1 = (option) => {
        setSelectedOption1(option);
        let filterValue = null;
        if (option === 'Входящие') {
            filterValue = 1;
        } else if (option === 'Исходящие') {
            filterValue = 0;
        }
        onFilterChange(filterValue);
        setIsOpenDropdown1(false);
    };

    const handleOptionClick2 = (option) => {
        if (option === 'Указать даты') {
            setIsDatePickerOpen(true);
        } else {
            setSelectedOption2(option);
            setIsOpenDropdown2(false);
            setIsDatePickerOpen(false);

            const {startDate, endDate} = getDateRange(option);
            onDateChange({startDate, endDate});
        }
    };

    const handleDateRangeClick = () => {
        setIsDatePickerOpen(true);
        setIsOpenDropdown2(false);
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            const formattedRange = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
            setCustomDateRange(formattedRange);
            setSelectedOption2(formattedRange);
            setIsDatePickerOpen(false);
            onDateChange({startDate: start, endDate: end});
        }
    };

    const handleArrowClick = (direction) => {
        const options = ['3 дня', 'Неделя', 'Месяц', 'Год'];
        let currentIndex = options.indexOf(selectedOption2);

        if (direction === 'prev' && currentIndex > 0) {
            currentIndex -= 1;
        } else if (direction === 'next' && currentIndex < options.length - 1) {
            currentIndex += 1;
        }

        const nextOption = options[currentIndex];

        setSelectedOption2(nextOption);

        const {startDate, endDate} = getDateRange(nextOption);
        onDateChange({startDate, endDate});
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDatePickerOpen && !event.target.closest('.react-datepicker')) {
                setIsDatePickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDatePickerOpen]);

    function filtersClear() {
        if (selectedOption1 !== 'Все типы') {
            setSelectedOption1('Все типы');
            onFilterChange(null);
        }
        setSelectedOption2('3 дня');
        const {startDate, endDate} = getDateRange('3 дня');
        onDateChange({startDate, endDate});
    }



    return (
        <header>
            <div className="dropdown-container">
                <div className="dropdown">
                    <button
                        className={`dropdown-toggle ${['Входящие', 'Исходящие'].includes(selectedOption1) ? 'dropdown-active' : ''}`}
                        onClick={toggleDropdown1}>
                        {selectedOption1}
                        <svg className={`arrow ${isOpenDropdown1 ? 'rotate' : ''}`} width="18" height="21"
                             viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.9001 8.60117L13.3991 8.10024C13.3324 8.03334 13.2555 8 13.1685 8C13.0818 8 13.0049 8.03334 12.9382 8.10024L9.00005 12.0382L5.06209 8.10034C4.9953 8.03345 4.91844 8.00011 4.83161 8.00011C4.74475 8.00011 4.66789 8.03345 4.60113 8.10034L4.10024 8.60131C4.03334 8.66806 4 8.74492 4 8.83179C4 8.91858 4.03345 8.99544 4.10024 9.06219L8.76957 13.7316C8.83633 13.7984 8.91322 13.8318 9.00005 13.8318C9.08688 13.8318 9.16364 13.7984 9.23036 13.7316L13.9001 9.06219C13.9668 8.99541 14 8.91854 14 8.83179C14 8.74492 13.9668 8.66806 13.9001 8.60117Z"
                                fill="#ADBFDF"
                            />
                        </svg>
                    </button>
                    {isOpenDropdown1 && (
                        <ul className="dropdown-menu">
                            <li className={selectedOption1 === 'Все типы' ? 'active' : ''}
                                onClick={() => handleOptionClick1('Все типы')}>
                                Все типы
                            </li>
                            <li className={selectedOption1 === 'Входящие' ? 'active' : ''}
                                onClick={() => handleOptionClick1('Входящие')}>
                                Входящие
                            </li>
                            <li className={selectedOption1 === 'Исходящие' ? 'active' : ''}
                                onClick={() => handleOptionClick1('Исходящие')}>
                                Исходящие
                            </li>
                        </ul>
                    )}
                </div>
                {selectedOption1 === 'Все типы' && selectedOption2 === '3 дня' ? '' :
                    <div onClick={filtersClear} className="filters-clear">
                        <p>Сбросить фильтры</p>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1_517)">
                                <path
                                    d="M12.75 3.88125L11.8688 3L8.375 6.49375L4.88125 3L4 3.88125L7.49375 7.375L4 10.8688L4.88125 11.75L8.375 8.25625L11.8688 11.75L12.75 10.8688L9.25625 7.375L12.75 3.88125Z"
                                    fill="#ADBFDF"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_1_517">
                                    <rect width="15" height="15" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>}
            </div>

            <div className="dropdown date">
                <button className="dropdown-toggle">
                    <svg onClick={() => handleArrowClick('prev')} width="16" height="24" viewBox="0 0 16 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_3190_1441)">
                            <path d="M6.175 15.825L2.35833 12L6.175 8.175L5 7L0 12L5 17L6.175 15.825Z" fill="#ADBFDF"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_3190_1441">
                                <rect width="16" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <div className="date-flex" onClick={toggleDropdown2}>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.4 1.63636H13.6V0H12V1.63636H4V0H2.4V1.63636H1.6C0.72 1.63636 0 2.37273 0 3.27273V16.3636C0 17.2636 0.72 18 1.6 18H14.4C15.28 18 16 17.2636 16 16.3636V3.27273C16 2.37273 15.28 1.63636 14.4 1.63636ZM14.4 16.3636H1.6V5.72727H14.4V16.3636Z"
                                fill="#ADBFDF"
                            />
                        </svg>
                        <p>{selectedOption2}</p>
                    </div>
                    <svg onClick={() => handleArrowClick('next')} width="17" height="24" viewBox="0 0 17 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_3190_1447)">
                            <path
                                d="M9.58997 15.825L13.4066 12L9.58997 8.175L10.765 7L15.765 12L10.765 17L9.58997 15.825Z"
                                fill="#ADBFDF"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_3190_1447">
                                <rect width="17" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                </button>
                {isOpenDropdown2 && (
                    <ul className="dropdown-menu">
                        <li className={selectedOption2 === '3 дня' ? 'active' : ''}
                            onClick={() => handleOptionClick2('3 дня')}>
                            3 дня
                        </li>
                        <li className={selectedOption2 === 'Неделя' ? 'active' : ''}
                            onClick={() => handleOptionClick2('Неделя')}>
                            Неделя
                        </li>
                        <li className={selectedOption2 === 'Месяц' ? 'active' : ''}
                            onClick={() => handleOptionClick2('Месяц')}>
                            Месяц
                        </li>
                        <li className={selectedOption2 === 'Год' ? 'active' : ''}
                            onClick={() => handleOptionClick2('Год')}>
                            Год
                        </li>
                        <p className="date-specify">Указать даты</p>
                        <li className={selectedOption2 === customDateRange ? 'active' : ''}
                            onClick={handleDateRangeClick}>
                            <div className="custom-date-range">
                                <p className={customDateRange === "__.__.__-__.__.__" ? '' : 'date-range'}>{customDateRange}</p>
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.4 1.60012H13.6V0.00012207H12V1.60012H4V0.00012207H2.4V1.60012H1.6C0.72 1.60012 0 2.32012 0 3.20012V16.0001C0 16.8801 0.72 17.6001 1.6 17.6001H14.4C15.28 17.6001 16 16.8801 16 16.0001V3.20012C16 2.32012 15.28 1.60012 14.4 1.60012ZM14.4 16.0001H1.6V5.60012H14.4V16.0001Z"
                                        fill="#ADBFDF"/>
                                </svg>
                            </div>
                        </li>
                    </ul>
                )}
                {isDatePickerOpen && (
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        maxDate={today}
                    />
                )}
            </div>
        </header>
    );
}
