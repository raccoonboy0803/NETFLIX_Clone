import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, MovieDataProps } from '../api';
import { makeImagePath } from '../utils';
import useWindowDimensions from '../utils/windowResize';
import YouTube from 'react-youtube';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { YoutubeMovieTitle } from '../youtubeVideoId';

function Home() {
  const offset = 6;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');
  const { scrollY } = useScroll();
  const windowWidth = useWindowDimensions();
  const { data, isLoading } = useQuery<MovieDataProps>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  const YoutubeTitles = YoutubeMovieTitle.map((item) => item.title);
  const YoutubeVideoIds = YoutubeMovieTitle.map((item) => item.videoId);

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + '' === bigMovieMatch?.params.movieId
    );

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 2;
      const maxIndex = Math.ceil(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex - 1 ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const clickOverlay = () => navigate('/');

  const rowVariants = {
    hidden: {
      x: windowWidth + 5,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -windowWidth - 5,
    },
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgImage={makeImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
              >
                {data?.results
                  .slice(1, 19)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      key={movie.id}
                      onClick={() => onBoxClicked(movie.id)}
                      $bgImage={makeImagePath(
                        movie.backdrop_path,
                        'w500' || ''
                      )}
                      variants={boxVariant}
                      initial="normal"
                      whileHover="hover"
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {bigMovieMatch ? (
            <AnimatePresence>
              <>
                <Overlay
                  onClick={clickOverlay}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieModal
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      {YoutubeTitles.includes(clickedMovie.title) ? (
                        <YouTube
                          videoId={
                            YoutubeVideoIds[
                              YoutubeTitles.findIndex(
                                (item) => item === clickedMovie.title
                              )
                            ]
                          }
                          opts={{
                            width: '100%',
                            height: '400px',
                            playerVars: {
                              autoplay: 1,
                              modestbranding: 1,
                            },
                          }}
                          onReady={(e) => {}}
                        />
                      ) : (
                        <ModalImage
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)) , url(${makeImagePath(
                              clickedMovie.backdrop_path
                            )})`,
                          }}
                        />
                      )}
                      <ModalTitle>{clickedMovie.title}</ModalTitle>
                      <ModalOverview>{clickedMovie.overview}</ModalOverview>
                    </>
                  )}
                </MovieModal>
              </>
            </AnimatePresence>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}
export default Home;

const boxVariant = {
  normal: {
    scale: 1,
    transition: {
      type: 'tween',
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.2,
    y: -30,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const Wrapper = styled.div`
  background-color: black;
  height: 115vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImage});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  width: 50%;
  font-size: 26px;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgImage: string }>`
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  height: 150px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const documentHeight = document.documentElement.scrollHeight;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${documentHeight}px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 5px;
`;

const ModalImage = styled.div`
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const ModalTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 28px;
  position: relative;
  top: 0px;
`;

const ModalOverview = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: 0px;
`;
