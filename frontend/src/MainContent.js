// src/MainContent.js
import React from 'react';
import styled from 'styled-components';

const MainContent = () => {
    return (
        <Main>
            <Section id="home">
                <h2>Home Section</h2>
                <p>Welcome to the home section of this beautiful UI.</p>
            </Section>
            <Section id="about">
                <h2>About Section</h2>
                <p>Learn more about us in this section.</p>
            </Section>
            <Section id="contact">
                <h2>Contact Section</h2>
                <p>Get in touch with us here.</p>
            </Section>
        </Main>
    );
};

const Main = styled.main`
  padding: 2rem;
`;

const Section = styled.section`
  background: #f1f1f1;
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: #e1e1e1;
  }

  h2 {
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

export default MainContent;
