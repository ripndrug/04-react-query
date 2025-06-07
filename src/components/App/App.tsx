import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import fetchData from '../../services/movieService';
import { type Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchData(query, currentPage),
    enabled: query !== '',
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  async function handleSearch(newMovies: string) {
    setQuery(newMovies);
    setCurrentPage(1);
  }

  const totalPages = data?.total_pages ?? 0;

  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading ? (
        <Loader />
      ) : (
        <MovieGrid onSelect={handleSelectMovie} movies={data?.results || []} />
      )}
      {totalPages > 1 && query !== '' && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}
