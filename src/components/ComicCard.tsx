import React, { useState } from 'react';
import styled from 'styled-components';
import { Star, Play, Plus, ThumbsUp, Info } from 'lucide-react';
import { Comic } from '../types/Comic';

interface ComicCardProps {
  comic: Comic;
  onSelect: (comic: Comic) => void;
  size?: 'small' | 'medium' | 'large';
}

const CardContainer = styled.div<{ size: string }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--netflix-dark-gray);
  
  width: ${props => {
    switch (props.size) {
      case 'small': return '200px';
      case 'large': return '300px';
      default: return '250px';
    }
  }};
  
  height: ${props => {
    switch (props.size) {
      case 'small': return '300px';
      case 'large': return '450px';
      default: return '375px';
    }
  }};
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
    
    .overlay {
      opacity: 1;
    }
    
    .actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    width: 180px;
    height: 270px;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0,0,0,0.7) 70%,
    rgba(0,0,0,0.9) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: var(--netflix-white);
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Author = styled.p`
  font-size: 0.9rem;
  color: var(--netflix-text-gray);
  margin-bottom: 0.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  
  .star {
    color: #ffd700;
    width: 16px;
    height: 16px;
  }
  
  .rating-text {
    font-size: 0.9rem;
    color: var(--netflix-white);
    font-weight: 600;
  }
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const Genre = styled.span`
  background: var(--netflix-red);
  color: var(--netflix-white);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: var(--netflix-white);
    color: var(--netflix-black);
    
    &:hover {
      background: var(--netflix-text-gray);
    }
  }
  
  &.secondary {
    background: rgba(42, 42, 42, 0.8);
    color: var(--netflix-white);
    border: 2px solid var(--netflix-light-gray);
    
    &:hover {
      border-color: var(--netflix-white);
      background: rgba(42, 42, 42, 1);
    }
  }
`;

const Badges = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Badge = styled.span<{ type: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => {
    switch (props.type) {
      case 'featured': return 'var(--netflix-red)';
      case 'trending': return '#ff6b35';
      default: return 'var(--netflix-gray)';
    }
  }};
  
  color: var(--netflix-white);
`;

const ComicCard: React.FC<ComicCardProps> = ({ comic, onSelect, size = 'medium' }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(comic);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementar lógica para agregar a lista
    console.log('Agregado a Mi Lista:', comic.title);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementar lógica de like
    console.log('Like:', comic.title);
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(comic);
  };

  return (
    <CardContainer size={size} onClick={() => onSelect(comic)}>
      <CoverImage
        src={imageError ? '/placeholder-comic.svg' : comic.coverImage}
        alt={comic.title}
        onError={handleImageError}
      />
      
      <Overlay className="overlay" />
      
      <Badges>
        {comic.featured && <Badge type="featured">Destacado</Badge>}
        {comic.trending && <Badge type="trending">Trending</Badge>}
      </Badges>
      
      <Content>
        <Title>{comic.title}</Title>
        <Author>por {comic.author}</Author>
        
        <Rating>
          <Star className="star" fill="currentColor" />
          <span className="rating-text">{comic.rating}</span>
        </Rating>
        
        <Genres>
          {comic.genre.slice(0, 2).map((genre, index) => (
            <Genre key={index}>{genre}</Genre>
          ))}
        </Genres>
        
        <Actions className="actions">
          <ActionButton className="primary" onClick={handlePlayClick} title="Leer">
            <Play size={18} fill="currentColor" />
          </ActionButton>
          
          <ActionButton className="secondary" onClick={handleAddToList} title="Agregar a Mi Lista">
            <Plus size={18} />
          </ActionButton>
          
          <ActionButton className="secondary" onClick={handleLike} title="Me gusta">
            <ThumbsUp size={18} />
          </ActionButton>
          
          <ActionButton className="secondary" onClick={handleInfo} title="Más información">
            <Info size={18} />
          </ActionButton>
        </Actions>
      </Content>
    </CardContainer>
  );
};

export default ComicCard;