import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, MovieDataProps } from '../api';
import { makeImagePath } from '../utils';

interface CardProps {
  title: string;
  image: string;
}

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search)
    .get('keyword')
    ?.toLowerCase();
  const [cards, setCards] = useState<CardProps[]>([]);

  const { data, isLoading } = useQuery<MovieDataProps>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  console.log('data::', data);

  const findKeyword = () => {
    if (keyword && data) {
      const newCards = data.results
        .filter((item) => item.title.toLowerCase().includes(keyword))
        .map((item) => ({
          title: item.title,
          image: item.backdrop_path,
        }));
      setCards(newCards);
      console.log('cards::', cards);
    }
  };

  useEffect(() => {
    findKeyword();
  }, [keyword, data]);

  return (
    <SearchWrap>
      {cards.length > 0 ? (
        cards.map((card, index) => (
          <Card key={index}>
            <Image
              style={{ backgroundImage: `url(${makeImagePath(card.image)})` }}
            />
            <Title>{card.title}</Title>
          </Card>
        ))
      ) : (
        <p>No results found</p>
      )}
    </SearchWrap>
  );
}
export default Search;

const SearchWrap = styled.div`
  margin-top: 150px;
  padding: 0 100px;
  width: 100vw;
  display: flex;
  gap: 10px;
`;

const Card = styled.div`
  width: 300px;
  height: 300px;
`;

const Image = styled.div`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 300px;
  height: 200px;
`;

const Title = styled.p`
  margin-top: 10px;
  font-size: 18px;
`;
