import React, {useState, useEffect, useRef} from 'react';

export default function CallCard(props) {
    const [callRecording, setCallRecording] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const time = props.date.split(' ')[1].slice(0, 5);
    const phoneRegExp = /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/;
    const recordingUrl = `https://api.skilla.ru/mango/getRecord?record=${props.record}&partnership_id=${props.partnershipId}`;
    const pauseButton = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="white"/>
            <path d="M8 16H10.6667V8H8V16ZM13.3333 8V16H16V8H13.3333Z" fill="#002CFB"/>
        </svg>
    );
    const playButton = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="white"/>
            <path
                d="M9.28742 7.06938C9.3761 7.02316 9.47535 7 9.57475 7C9.67389 7 9.77311 7.02316 9.86218 7.06938L16.7125 11.5519C16.8901 11.6442 17 11.8152 17 12.0001C17 12.1849 16.8904 12.3559 16.7125 12.4481L9.86218 16.9308C9.68439 17.0231 9.46523 17.0231 9.28757 16.9308C9.10976 16.8382 9 16.6672 9 16.4825V7.51755C9 7.33278 9.10958 7.16182 9.28742 7.06938Z"
                fill="#002CFB"
            />
        </svg>
    );

    const handlePlayPause = () => {
        if (!callRecording && props.record) {
            // Загружаем запись при нажатии на кнопку воспроизведения
            fetch(recordingUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer testtoken`,
                    'Content-Type': 'audio/mpeg',
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    setCallRecording(url);

                    // Устанавливаем аудиофайл в плеер
                    audioRef.current.src = url;

                    // Ждем, когда аудиофайл будет готов к воспроизведению
                    audioRef.current.addEventListener('canplaythrough', () => {
                        audioRef.current.play();
                        setIsPlaying(true);
                    }, { once: true });
                })
                .catch((error) => console.error('Ошибка при запросе записи:', error));
        } else {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };




    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setProgress((currentTime / duration) * 100);
    };

    const handleProgressClick = (e) => {
        const progressContainer = e.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newProgress = (offsetX / progressContainer.clientWidth) * 100;
        const newTime = (newProgress / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
    };

    const handleDownload = () => {
        if (!callRecording && props.record) {
            // Если аудиофайл еще не загружен, загружаем его при нажатии на кнопку "Скачать"
            fetch(recordingUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer testtoken`,
                    'Content-Type': 'audio/mpeg',
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    setCallRecording(url);

                    // Создаем и инициируем загрузку файла
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'call_recording.mp3';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((error) => console.error('Ошибка при запросе записи:', error));
        } else {
            // Если файл уже загружен, просто инициируем его скачивание
            const link = document.createElement('a');
            link.href = callRecording;
            link.download = 'call_recording.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleReset = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
    };

    const formatMinutes = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <tr>
            <td>
                {props.inOut === 1 && props.status === "Дозвонился" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.5217 7.17704L17.3447 6L7.66957 15.6751V10.1739H6V18.5217H14.3478V16.8522H8.84661L18.5217 7.17704Z"
                            fill="#002CFB"
                        />
                    </svg>
                )}
                {props.inOut === 1 && props.status === "Не дозвонился" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.5217 7.17704L17.3447 6L7.66957 15.6751V10.1739H6V18.5217H14.3478V16.8522H8.84661L18.5217 7.17704Z"
                            fill="#EA1A4F"
                        />
                    </svg>
                )}
                {props.inOut === 0 && props.status === "Дозвонился" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.00023 17.3447L7.17728 18.5217L16.8524 8.8466V14.3478H18.522V5.99999L10.1741 5.99999V7.66955L15.6754 7.66955L6.00023 17.3447Z"
                            fill="#28A879"
                        />
                    </svg>
                )}
                {props.inOut === 0 && props.status === "Не дозвонился" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.00023 17.3447L7.17728 18.5217L16.8524 8.8466V14.3478H18.522V5.99999L10.1741 5.99999V7.66955L15.6754 7.66955L6.00023 17.3447Z"
                            fill="#EA1A4F"
                        />
                    </svg>
                )}
            </td>
            <td>{time}</td>
            <td>
                <img src={props.personAvatar} alt="Сотрудник"/>
            </td>
            <td>{props.phoneNumber.replace(phoneRegExp, '+$1 ($2) $3-$4-$5')}</td>
            <td className="sourse">{props.sourses}</td>
            <td className="error">{props.errors}</td>
            <td>
                {props.record ? (
                    <div className="audio-container" style={styles.container}>
                        <div>{formatMinutes(props.time)}</div>
                        <div className="audio-flex">
                <span onClick={handlePlayPause}>
                    {isPlaying ? pauseButton : playButton}
                </span>
                            <audio
                                ref={audioRef}
                                src={callRecording}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => setIsPlaying(false)}
                                style={{display: 'none'}}
                            />
                            <div
                                className="progress-container"
                                style={styles.progressContainer}
                                onClick={handleProgressClick}
                            >
                                <div style={{...styles.progressFill, width: `${progress}%`}}/>
                            </div>
                        </div>

                        <svg
                            onClick={handleDownload}
                            className="download-button"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 20H19V18.1176H6V20ZM19 9.64706H15.2857V4H9.71429V9.64706H6L12.5 16.2353L19 9.64706Z"
                                fill="#ADBFDF"
                            />
                        </svg>

                        <svg
                            onClick={handleReset}
                            className="reset-button"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_1_258)">
                                <path
                                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                    fill="#ADBFDF"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_1_258">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                ) : props.time ? (
                    formatMinutes(props.time)
                ) : (
                    ''
                )}
            </td>
        </tr>
    );
}

const styles = {
    progressFill: {
        height: '5px',
        backgroundColor: '#3b82f6',
        borderRadius: '5px',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
};
