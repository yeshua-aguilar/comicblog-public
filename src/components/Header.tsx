import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  padding: 1rem 0;
  
  &.scrolled {
    background: var(--netflix-black);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--netflix-red);
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
    
    &.mobile-open {
      display: flex;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--netflix-black);
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
  }
`;

const NavLink = styled.a`
  color: var(--netflix-white);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: var(--netflix-red);
  }
  
  &.active {
    color: var(--netflix-red);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  &.expanded {
    .search-input {
      width: 300px;
      padding-left: 2.5rem;
      background: var(--netflix-dark-gray);
      border: 1px solid var(--netflix-gray);
    }
  }
  
  @media (max-width: 768px) {
    &.expanded .search-input {
      width: 200px;
    }
  }
`;

const SearchInput = styled.input`
  width: 0;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--netflix-white);
  font-size: 1rem;
  transition: all 0.3s ease;
  border-radius: 4px;
  
  &::placeholder {
    color: var(--netflix-text-gray);
  }
  
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.5rem;
  width: 20px;
  height: 20px;
  color: var(--netflix-white);
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--netflix-red);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--netflix-white);
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer className={isScrolled ? 'scrolled' : ''}>
      <Nav>
        <Logo>ComicFlix</Logo>
        
        <NavLinks className={isMobileMenuOpen ? 'mobile-open' : ''}>
          <NavLink href="#" className="active">Inicio</NavLink>
          <NavLink href="#">Destacados</NavLink>
          <NavLink href="#">Géneros</NavLink>
          <NavLink href="#">Trending</NavLink>
          <NavLink href="#">Mi Lista</NavLink>
        </NavLinks>
        
        <SearchContainer>
          <SearchBox className={isSearchExpanded ? 'expanded' : ''}>
            <SearchIcon onClick={handleSearchClick} />
            <SearchInput
              className="search-input"
              type="text"
              placeholder="Buscar comics..."
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => {
                if (!searchQuery) {
                  setIsSearchExpanded(false);
                }
              }}
            />
          </SearchBox>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </SearchContainer>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;