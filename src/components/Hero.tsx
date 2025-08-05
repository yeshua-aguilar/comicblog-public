import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Comic } from '../types/Comic';

interface HeroProps {
  featuredComics: Comic[];
  onSelectComic: (comic: Comic) => void;
}

const HeroContainer = styled.section`
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-top: 70px;
  
  @media (max-width: 768px) {
    height: 70vh;
    min-height: 500px;
  }
`;

const BackgroundImage = styled.div<{ backgroundImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(0,0,0,0.8) 0%,
      rgba(0,0,0,0.4) 50%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 70%,
      rgba(0,0,0,0.8) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  color: var(--netflix-white);
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 500px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--netflix-white);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    -webkit-line-clamp: 2;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .star {
    color: #ffd700;
    width: 20px;
    height: 20px;
  }
  
  .rating-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--netflix-white);
  }
`;

const PublishDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--netflix-text-gray);
  
  .calendar {
    width: 18px;
    height: 18px;
  }
`;

const Genres = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Genre = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: var(--netflix-white);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--netflix-white);
  color: var(--netflix-black);
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
  }
  
  .play-icon {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const InfoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(109, 109, 110, 0.7);
  color: var(--netflix-white);
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(109, 109, 110, 0.9);
    transform: translateY(-2px);
  }
  
  .info-icon {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
  
  @media (max-width: 768px) {
    bottom: 1rem;
  }
`;

const Indicator = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'var(--netflix-white)' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--netflix-white);
    transform: scale(1.2);
  }
`;

const Hero: React.FC<HeroProps> = ({ featuredComics, onSelectComic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentComic = featuredComics[currentIndex];

  useEffect(() => {
    if (featuredComics.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredComics.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [featuredComics.length]);

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePlayClick = () => {
    if (currentComic) {
      onSelectComic(currentComic);
    }
  };

  const handleInfoClick = () => {
    if (currentComic) {
      onSelectComic(currentComic);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (!currentComic) {
    return null;
  }

  return (
    <HeroContainer>
      <BackgroundImage 
        backgroundImage={imageError ? '/placeholder-hero.svg' : currentComic.coverImage}
      />
      
      <Content>
        <HeroContent>
          <Title>{currentComic.title}</Title>
          
          <MetaInfo>
            <Rating>
              <Star className="star" fill="currentColor" />
              <span className="rating-text">{currentComic.rating}</span>
            </Rating>
            
            <PublishDate>
              <Calendar className="calendar" />
              <span>{formatDate(currentComic.publishDate)}</span>
            </PublishDate>
            
            <Genres>
              {currentComic.genre.slice(0, 3).map((genre, index) => (
                <Genre key={index}>{genre}</Genre>
              ))}
            </Genres>
          </MetaInfo>
          
          <Description>{currentComic.description}</Description>
          
          <Actions>
            <PlayButton onClick={handlePlayClick}>
              <Play className="play-icon" fill="currentColor" />
              Leer Ahora
            </PlayButton>
            
            <InfoButton onClick={handleInfoClick}>
              <Info className="info-icon" />
              Más Información
            </InfoButton>
          </Actions>
        </HeroContent>
      </Content>
      
      {featuredComics.length > 1 && (
        <Indicators>
          {featuredComics.map((_, index) => (
            <Indicator
              key={index}
              active={index === currentIndex}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </Indicators>
      )}
    </HeroContainer>
  );
};

export default Hero;