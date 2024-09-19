import React, { useEffect, useState } from 'react';
import CallCard from './CallCard';

export default function MainContent({ filter, dateRange }) {
    const [groupedCalls, setGroupedCalls] = useState({});
    const [sortedCalls, setSortedCalls] = useState({});
    const [timeSortDirection, setTimeSortDirection] = useState("DESC"); // Сортировка по умолчанию по убыванию
    const [durationSortDirection, setDurationSortDirection] = useState("ASC");

    useEffect(() => {
        let url = `https://api.skilla.ru/mango/getList?`;
        const params = new URLSearchParams();
        params.append('limit', '5000');
        params.append('sort_by', 'date');
        params.append('order', 'DESC'); // По умолчанию сортировка по убыванию по времени

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            const dateStart = dateRange.startDate.toISOString().split('T')[0];
            const dateEnd = dateRange.endDate.toISOString().split('T')[0];
            params.append('date_start', dateStart);
            params.append('date_end', dateEnd);
        }

        url += params.toString();

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer testtoken',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data && data.results) {
                    groupCallsByDate(data.results);
                } else {
                    setGroupedCalls({});
                }
                console.log(data.results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setGroupedCalls({});
            });
    }, [dateRange]);

    // Применение сортировки по времени при изменении направлений сортировки или данных
    useEffect(() => {
        applyTimeSort();
    }, [groupedCalls, timeSortDirection]);

    const applyTimeSort = () => {
        const sorted = { ...groupedCalls };
        const today = 'Сегодня';
        const yesterday = 'Вчера';

        const sortDates = (a, b) => {
            if (a === today) return timeSortDirection === "ASC" ? 1 : -1;
            if (b === today) return timeSortDirection === "ASC" ? -1 : 1;
            if (a === yesterday) return timeSortDirection === "ASC" ? 1 : -1;
            if (b === yesterday) return timeSortDirection === "ASC" ? -1 : 1;

            const dateA = new Date(a);
            const dateB = new Date(b);

            return timeSortDirection === "ASC" ? dateA - dateB : dateB - dateA;
        };

        const sortedGroups = Object.keys(sorted).sort(sortDates);
        const newSortedCalls = {};

        sortedGroups.forEach(group => {
            newSortedCalls[group] = sorted[group].sort((a, b) => {
                const timeA = new Date(a.date).getTime();
                const timeB = new Date(b.date).getTime();
                return timeB - timeA; // По умолчанию сортировка по убыванию времени
            });
        });

        setSortedCalls(newSortedCalls);
    };

    const filterCalls = (calls) => {
        if (!calls) return [];
        if (filter === null) return calls; // Показываем все вызовы, если фильтр не выбран
        return calls.filter(call => call.in_out === filter); // Фильтруем по входящим/исходящим
    };

    const groupCallsByDate = (calls) => {
        if (!calls) return;
        const grouped = {};
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

        calls.forEach(call => {
            const callDate = call.date.split(' ')[0];

            let groupKey;
            if (callDate === today) {
                groupKey = 'Сегодня';
            } else if (callDate === yesterday) {
                groupKey = 'Вчера';
            } else {
                groupKey = callDate;
            }

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(call);
        });

        setGroupedCalls(grouped);
    };

    // Сортировка по длительности НЕ сбрасывает сортировку по времени
    const durationSort = (event) => {
        event.preventDefault();
        const sorted = { ...sortedCalls }; // Используем текущие отсортированные данные
        Object.keys(sorted).forEach(group => {
            sorted[group] = sorted[group].sort((a, b) => {
                const durationA = a.time || 0;
                const durationB = b.time || 0;
                return durationSortDirection === "ASC" ? durationA - durationB : durationB - durationA;
            });
        });
        setSortedCalls(sorted);
        setDurationSortDirection(durationSortDirection === "ASC" ? "DESC" : "ASC");
    };

    const timeSort = () => {
        setTimeSortDirection(timeSortDirection === "ASC" ? "DESC" : "ASC");
    };

    return (
        <main className="main-container">
            <table>
                <thead>
                <tr>
                    <th>Тип</th>
                    <th onClick={timeSort} className="sort-method">Время
                        <svg className={`arrow ${timeSortDirection === "ASC" ? 'rotate' : ''}`} width="18" height="21" viewBox="0 0 18 21" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.9001 8.60117L13.3991 8.10024C13.3324 8.03334 13.2555 8 13.1685 8C13.0818 8 13.0049 8.03334 12.9382 8.10024L9.00005 12.0382L5.06209 8.10034C4.9953 8.03345 4.91844 8.00011 4.83161 8.00011C4.74475 8.00011 4.66789 8.03345 4.60113 8.10034L4.10024 8.60131C4.03334 8.66806 4 8.74492 4 8.83179C4 8.91858 4.03345 8.99544 4.10024 9.06219L8.76957 13.7316C8.83633 13.7984 8.91322 13.8318 9.00005 13.8318C9.08688 13.8318 9.16364 13.7984 9.23036 13.7316L13.9001 9.06219C13.9668 8.99541 14 8.91854 14 8.83179C14 8.74492 13.9668 8.66806 13.9001 8.60117Z"
                                fill="#ADBFDF" />
                        </svg>
                    </th>
                    <th>Сотрудник</th>
                    <th>Звонок</th>
                    <th>Источник</th>
                    <th>Оценка</th>
                    <th onClick={durationSort} className="sort-method">Длительность
                        <svg className={`arrow right ${durationSortDirection === "ASC" ? '' : 'rotate'}`} width="18" height="21" viewBox="0 0 18 21" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.9001 8.60117L13.3991 8.10024C13.3324 8.03334 13.2555 8 13.1685 8C13.0818 8 13.0049 8.03334 12.9382 8.10024L9.00005 12.0382L5.06209 8.10034C4.9953 8.03345 4.91844 8.00011 4.83161 8.00011C4.74475 8.00011 4.66789 8.03345 4.60113 8.10034L4.10024 8.60131C4.03334 8.66806 4 8.74492 4 8.83179C4 8.91858 4.03345 8.99544 4.10024 9.06219L8.76957 13.7316C8.83633 13.7984 8.91322 13.8318 9.00005 13.8318C9.08688 13.8318 9.16364 13.7984 9.23036 13.7316L13.9001 9.06219C13.9668 8.99541 14 8.91854 14 8.83179C14 8.74492 13.9668 8.66806 13.9001 8.60117Z"
                                fill="#ADBFDF" />
                        </svg>
                    </th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(sortedCalls).map(group => (
                    <React.Fragment key={group}>
                        {group !== '' && (
                            <tr className="date-row">
                                <td colSpan="7">{group}</td>
                                <td className={group === 'Сегодня' ? 'calls-today' : group === 'Вчера' ? 'calls-yesterday' : 'calls-amount'}>
                                    {filterCalls(groupedCalls[group]).length}
                                </td>
                            </tr>
                        )}
                        {filterCalls(groupedCalls[group])
                            .filter(call => call.time !== undefined && call.time !== null)
                            .map(call => (
                                <CallCard
                                    key={call.id}
                                    inOut={call.in_out}
                                    status={call.status}
                                    date={call.date}
                                    dateRange={call.dateRange}
                                    personAvatar={call.person_avatar}
                                    phoneNumber={call.partner_data.phone}
                                    sourses={call.sourses}
                                    errors={call.errors[0]}
                                    time={call.time} // Длительность вызова
                                    partnershipId={call.partnership_id}
                                    record={call.record}
                                />
                            ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </main>
    );
}
