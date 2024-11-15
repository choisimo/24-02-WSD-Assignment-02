import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSimilarMovies } from 'api/tmdbApi';
import './SimilarMoviesList.css';
import { useNavigate } from "react-router-dom";
import MovieCard from 'content/views/pages/movieCardView/MovieCard';
import { getLikedMovies, toggleLikeMovie } from 'content/components/utility/bookMark/likeMovies';

const SimilarMoviesList = ({ genreIds }) => {
    const [similarMovies, setSimilarMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const [totalPages, setTotalPages] = useState(1);
    const [showExpand, setShowExpand] = useState(false);
    const [likedMovies, setLikedMovies] = useState([]);
    const navigate = useNavigate();

    // 마지막 요소를 관찰하여 페이지를 증가시키는 IntersectionObserver
    const lastMovieElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && page < totalPages) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, page, totalPages]);

    // 비슷한 영화 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const movies = await getSimilarMovies(genreIds, page);
                setSimilarMovies((prevMovies) =>
                    page === 1 ? movies.results : [...prevMovies, ...movies.results]
                );
                setTotalPages(movies.total_pages);
            } catch (error) {
                console.error('Error fetching similar movies:', error);
            } finally {
                setLoading(false);
            }
        };

        if (genreIds && genreIds.length > 0) {
            fetchMovies();
        }
    }, [genreIds, page]);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/detail/${movieId}`);
    };

    const toggleShowExpand = () => {
        setShowExpand((prevShowExpand) => !prevShowExpand);
    };

    const handleToggleRecommend = (movie) => {
        const updatedMovies = toggleLikeMovie(movie); // toggleLikeMovie를 사용
        setLikedMovies(updatedMovies); // 상태를 업데이트
    };


    return (
        <div className="similar-movies-container">
            <h3>비슷한 영화 추천</h3>
            <div className={`similar-movies-list ${showExpand ? 'expanded' : ''}`}>
                {similarMovies.map((movie, index) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        likedMovies={likedMovies}
                        onMovieClick={handleMovieClick}
                        onToggleRecommend={handleToggleRecommend}
                        ref={index === similarMovies.length - 1 ? lastMovieElementRef : null}
                    />
                ))}
            </div>
            <button className="show-all-btn" onClick={toggleShowExpand}>
                {showExpand ? '간략히 보기' : '전체 보기'}
            </button>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-for-loading"></div>
                </div>
            )}
        </div>
    );
};

export default SimilarMoviesList;
