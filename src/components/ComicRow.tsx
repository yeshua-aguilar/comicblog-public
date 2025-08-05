import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Comic } from '../types/Comic';
import ComicCard from './ComicCard';

interface ComicRowProps {
  title: string;
  comics: Comic[];
  onSelectComic: (comic: Comic) => void;
  size?: 'small' | 'medium' | 'large';
}

const RowContainer = styled.div`
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const RowTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--netflix-white);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: var(--netflix-text-gray);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--netflix-white);
  }
`;

const RowWrapper = styled.div`
  position: relative;
  
  &:hover .nav-button {
    opacity: 1;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding: 0 2rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.75rem;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.8);
  color: var(--netflix-white);
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.left {
    left: 0.5rem;
  }
  
  &.right {
    right: 0.5rem;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    opacity: 1;
    background: rgba(0, 0, 0, 0.6);
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--netflix-text-gray);
  font-size: 1.1rem;
  padding: 0 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 2rem;
  overflow: hidden;
`;

const LoadingCard = styled.div`
  width: 250px;
  height: 375px;
  background: var(--netflix-gray);
  border-radius: 8px;
  animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 180px;
    height: 270px;
  }
`;

const ComicRow: React.FC<ComicRowProps> = ({ 
  title, 
  comics, 
  onSelectComic, 
  size = 'medium' 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [comics]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Check scroll buttons after animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  const handleViewAll = () => {
    // Implementar navegación a página de categoría
    console.log(`Ver todos los comics de: ${title}`);
  };

  if (isLoading) {
    return (
      <RowContainer>
        <RowHeader>
          <RowTitle>{title}</RowTitle>
        </RowHeader>
        <LoadingContainer>
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </LoadingContainer>
      </RowContainer>
    );
  }

  if (!comics || comics.length === 0) {
    return (
      <RowContainer>
        <RowHeader>
          <RowTitle>{title}</RowTitle>
        </RowHeader>
        <EmptyState>
          No hay comics disponibles en esta categoría
        </EmptyState>
      </RowContainer>
    );
  }

  return (
    <RowContainer>
      <RowHeader>
        <RowTitle>{title}</RowTitle>
        {comics.length > 6 && (
          <ViewAllButton onClick={handleViewAll}>
            Ver todos
          </ViewAllButton>
        )}
      </RowHeader>
      
      <RowWrapper>
        {canScrollLeft && (
          <NavButton 
            className="nav-button left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </NavButton>
        )}
        
        {canScrollRight && (
          <NavButton 
            className="nav-button right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </NavButton>
        )}
        
        <ScrollContainer 
          ref={scrollRef} 
          onScroll={handleScroll}
        >
          {comics.map((comic) => (
            <ComicCard
              key={comic.id}
              comic={comic}
              onSelect={onSelectComic}
              size={size}
            />
          ))}
        </ScrollContainer>
      </RowWrapper>
    </RowContainer>
  );
};

export default ComicRow;