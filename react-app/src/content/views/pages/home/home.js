import React, { useEffect, useRef, useState } from 'react';
import { getMovies } from 'api/tmdbApi';
import './home.css';
import { useNavigate } from 'react-router-dom';
import routes from 'routes.json';

const HomePage = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [pageMap, setPageMap] = useState({});
    const [featuredMovie, setFeaturedMovie] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const sections = [
        { title: '최신 컨텐츠', category: 'now_playing' },
        { title: '인기 컨텐츠', category: 'popular' },
        { title: '최고 평점 컨텐츠', category: 'top_rated' },
        { title: '내가 찜한 컨텐츠', category: 'upcoming' }
    ];

    // 무한 스크롤을 위해 페이지별 데이터를 불러오는 함수
    const loadMoreMovies = async (category) => {
        const nextPage = pageMap[category] + 1;
        const newMovies = await getMovies(category, nextPage);

        setMovies((prevMovies) =>
            prevMovies.map((section) =>
                section.category === category
                    ? { ...section, movies: [...section.movies, ...newMovies] }
                    : section
            )
        );
        setPageMap((prevPageMap) => ({ ...prevPageMap, [category]: nextPage }));
    };

    useEffect(() => {
        const loadMovies = async () => {
            const initialMovies = await Promise.all(
                sections.map(async (section) => ({
                    title: section.title,
                    category: section.category,
                    movies: await getMovies(section.category, 1)
                }))
            );
            setMovies(initialMovies);
            setPageMap(sections.reduce((acc, section) => ({ ...acc, [section.category]: 1 }), {}));

            // Featured 영화 배열 설정
            if (initialMovies.length > 0 && initialMovies[0].movies.length > 0) {
                setFeaturedMovie(initialMovies[0].movies.slice(0, 5)); // 첫 번째 섹션에서 5개의 영화를 사용
            }
        };
        loadMovies();
    }, []);

    // 배너 자동 슬라이드 효과
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentBannerIndex((prevIndex) =>
                (prevIndex + 1) % setFeaturedMovie.length
            );
        }, 5000); // 5초마다 배너 변경

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
    }, [setFeaturedMovie]);


    const handleMovieClick = (movieId) => {
        const path = routes.movieInfo.replace(':id', movieId);
        navigate(path);
    };

    return (
        <div className="home">
            {featuredMovie.length > 0 && (
                <div
                    className="banner"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredMovie[currentBannerIndex].backdrop_path})` }}
                >
                    <div className="banner-content">
                        <h1>{featuredMovie[currentBannerIndex].title}</h1>
                        <p>{featuredMovie[currentBannerIndex].overview}</p>
                        <button onClick={() => handleMovieClick(featuredMovie[currentBannerIndex].id)}>바로보기</button>
                    </div>
                </div>
            )}

            {movies.map((section, idx) => (
                <div key={idx} className="content-section">
                    <h2>{section.title}</h2>
                    <ContentRow
                        movies={section.movies}
                        onMovieClick={handleMovieClick}
                        category={section.category}
                        loadMoreMovies={loadMoreMovies} // loadMoreMovies 함수 전달
                    />
                </div>
            ))}
        </div>
    );
};


const ContentRow = ({ movies, onMovieClick, category, loadMoreMovies }) => {
    const rowRef = useRef(null);
    const scrollInterval = useRef(null); // Scroll interval reference
    const touchStartX = useRef(0); // Touch start position
    const scrollLeft = useRef(0);   // Scroll left position

    const startScrollLeft = () => {
        stopScroll(); // 기존 스크롤 중지
        scrollInterval.current = setInterval(() => {
            if (rowRef.current) {
                rowRef.current.scrollLeft -= 10;
            }
        }, 10);
    };

    // 오른쪽으로 스크롤
    const startScrollRight = () => {
        stopScroll(); // 기존 스크롤 중지
        scrollInterval.current = setInterval(() => {
            if (rowRef.current) {
                rowRef.current.scrollLeft += 10;
            }
        }, 10);
    };

    // 스크롤 멈춤
    const stopScroll = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
        }
    };

    const handleScroll = () => {
        if (rowRef.current.scrollLeft + rowRef.current.clientWidth >= rowRef.current.scrollWidth - 10) {
            loadMoreMovies(category); // 스크롤 끝에 도달하면 더 많은 영화 로드
        }
    };

    const handleTouchStart = (e) => {
        touchStartX.current =  e.touches[0].clientX;    // 터치 시작 위치 저장
        scrollLeft.current = rowRef.current.scrollLeft; // 현재 스크롤 위치 저장
    };

    const handleTouchMove = (e) => {
        const touchX = e.touches[0].clientX;
        const moveDistance = touchStartX.current - touchX; // 터치 이동 거리 계산
        rowRef.current.scrollLeft = scrollLeft.current + moveDistance; // 스크롤 위치 변경
    }

    const renderStarRating = (voteAverage) => {
        // 평점을 5점 만점으로 환산
        const rating = voteAverage / 2;

        // 별 개수를 담을 배열
        const stars = [];

        // 5개의 별 중 채워진 별과 반별을 계산
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="full-star">★</span>);  // 채워진 별
            } else if (i - 0.5 <= rating) {
                stars.push(<span key={i} className="half-star">★</span>);  // 반별
            } else {
                stars.push(<span key={i} className="empty-star">☆</span>); // 빈 별
            }
        }

        return stars;
    };


    useEffect(() => {
        const rowElement = rowRef.current;
        rowElement.addEventListener('scroll', handleScroll);
        return () => {
            rowElement.removeEventListener('scroll', handleScroll);
            stopScroll(); // 컴포넌트가 언마운트될 때 스크롤 중지
        };
    }, []);


    return (
        <div className="content-row-container">
            <button
                className="slide-button left"
                onMouseDown={startScrollLeft}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
            >
                {"<"}
            </button>
            <div className="content-row"
                 ref={rowRef}
                 onTouchStart={handleTouchStart}
                 onTouchMove={handleTouchMove}
            >
                {movies.map((movie) => (
                    <div key={movie.id} className="content-item" onClick={() => onMovieClick(movie.id)}>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                        <p className="movie-title">{movie.title}</p>
                        <div className="movie-info-hover">
                            <div className="star-rating">
                                {renderStarRating(movie.vote_average)}
                            </div>
                            <p><strong>개봉일:</strong> {movie.release_date}</p>
                            {movie.genres &&
                                <p><strong>장르:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="slide-button right"
                onMouseDown={startScrollRight}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
            >
                {">"}
            </button>
        </div>
    );
};


export default HomePage;
