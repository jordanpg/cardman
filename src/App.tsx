import Menu from './components/Menu';
import Page from './pages/Page';
import CardMaker from './pages/CardMaker';
import DeckBuilder from './pages/DeckBuilder';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => {

  return (
    <IonApp>
      {/* why do i have to do this -____- */}
      <svg width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{position:'absolute'}}>
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image0" transform="translate(0 -0.324447) scale(0.00108578 0.0018001)" />
          </pattern>
          <linearGradient id="paint_colorless" x1="4585" y1="0" x2="4585" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C6CEDA"/>
              <stop offset="1" stopColor="#7D7F91"/>
          </linearGradient>
          <linearGradient id="paint_green" x1="3743" y1="0" x2="3743" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#83D75C"/>
              <stop offset="1" stopColor="#2D8A31"/>
          </linearGradient>
          <linearGradient id="paint_blue" x1="2901" y1="0" x2="2901" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3BA0FD"/>
              <stop offset="1" stopColor="#3B42F4"/>
          </linearGradient>
          <linearGradient id="paint_red" x1="2059" y1="0" x2="2059" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FC7C34"/>
              <stop offset="1" stopColor="#DD342F"/>
          </linearGradient>
          <linearGradient id="paint_yellow" x1="1217" y1="0" x2="1217" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9D65B"/>
              <stop offset="1" stopColor="#FC7C34"/>
          </linearGradient>
          <linearGradient id="paint_purple" x1="375" y1="0" x2="375" y2="1050" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9145CD" />
              <stop offset="1" stopColor="#5435AD" />
          </linearGradient>
          <clipPath id="clip0">
              <rect width="194" height="60" fill="white" transform="matrix(1 0 0 -1 278 976)" />
          </clipPath>
        </defs>
      </svg>

      <IonReactRouter>
        <IonSplitPane contentId="main" when="false">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/page/:name" component={Page} exact />
            <Route path="/page/CardMaker" component={CardMaker} exact />
            <Route path="/page/DeckBuilder" component={DeckBuilder} exact />
            <Redirect from="/" to="/page/CardMaker" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
