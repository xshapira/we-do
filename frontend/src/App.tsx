import { ThemeProvider } from "styled-components";
import { darkTheme } from "./styles/theme";

import { FC } from "react";
import GlobalStyles from "../src/styles/global";
import { TodoList } from "./components/TodoList";
import styled from "styled-components";

const App: FC = () => {
  const theme = darkTheme; // set darkTheme as default

  return (
    <ThemeProvider theme={theme}>
      <Header>Success List</Header>
      <TodoList />
      <Footer>
        Double click on a task to edit <br />
      </Footer>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;

export const Header = styled.h1`
  text-align: center;
  font-size: 48px;
  padding: 50px 0 50px 0;
`;

export const Footer = styled.h6`
  text-align: center;
  font-size: 14px;
  font-weight: 200;
  font-style: italic;
  opacity: 0.5;
  padding-top: 25px;
  padding-bottom: 25px;
`;

export default App;
