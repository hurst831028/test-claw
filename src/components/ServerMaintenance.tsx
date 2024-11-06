
import {
    bindMiniAppCSSVars,
    bindThemeParamsCSSVars,
    useMiniApp,
    useViewport,
    useThemeParams,
    useMainButton,
    useUtils,
  } from '@telegram-apps/sdk-react';
  import { AppRoot } from '@telegram-apps/telegram-ui';
  import { type FC, useEffect, useRef} from 'react';

  const telegramLink = "https://t.me/SeedsofTON"
  const xLink = "https://twitter.com/SeedsofTon"
  const youtubeLink = "https://www.youtube.com/@seedsofton"
  
  export const ServerMaintenance: FC = () => {
  
    const rootDivRef = useRef<HTMLDivElement>(null); 
    const miniApp = useMiniApp();
    const viewport = useViewport();
    const themeParams = useThemeParams();
    const mainButton = useMainButton();
    const utils = useUtils();
  
    const canvasWidth = viewport?.width;
    const canvasHeight = viewport?.height;
    
    useEffect(() => {  
      miniApp.setBgColor('#000000');
      miniApp.setHeaderColor('#000000');
      miniApp.ready()
      mainButton.hide();
    }, []);
  
    useEffect(() => {  
      viewport?.expand();  
    }, [viewport]);
  
    useEffect(() => {
      return bindMiniAppCSSVars(miniApp, themeParams);
    }, [miniApp, themeParams]);
  
    useEffect(() => {
      return bindThemeParamsCSSVars(themeParams);
    }, [themeParams]);
  
    const handleTelegramClick = () => {  
      utils.openTelegramLink(telegramLink);  
    };  
    
    const handleXClick = () => {  
      utils.openLink(xLink);
    };  
    
    const handleYoutubeClick = () => {  
      utils.openLink(youtubeLink);  
    };
  
    return (
      <AppRoot>
        <div
          ref={rootDivRef}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
              style={{
                width: canvasWidth,
                height: canvasHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 1)',
              }}
            >
              <img src="./loading-web.png"
                alt="Loading"  
                style={{  
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  //marginBottom: '20px',
                }}  
              />
              <p  
                style={{  
                  position: 'absolute',  
                  fontFamily: 'LanaPixel',  
                  fontSize: '18px',  
                  color: 'white',   
                  //textShadow: '2px 2px 4px #000000',
                }}  
              >  
                The game server is now maintenance 
                <br />please wait..........^_^
              </p> 
              
              <img src="./buttons/telegram.png"
                alt="Loading"  
                style={{  
                  width: 'auto',  
                  height: 'auto',  
                  maxWidth: '100%',  
                  maxHeight: '100%',  
                  position: 'absolute',  
                  bottom: '100px',
                  left: 'calc(50% - 100px)', 
                  transform: 'translateX(-50%)',
                }}  
                onClick={handleTelegramClick}
              />
  
              <img src="./buttons/x.png"
                alt="Loading"  
                style={{  
                  width: 'auto',  
                  height: 'auto',  
                  maxWidth: '100%',  
                  maxHeight: '100%',  
                  position: 'absolute',  
                  bottom: '100px', 
                  left: 'calc(50%)',   
                  transform: 'translateX(-50%)',
                }}
                onClick={handleXClick}
              />
  
              <img src="./buttons/youtube.png"
                alt="Loading"  
                style={{  
                  width: 'auto',  
                  height: 'auto',  
                  maxWidth: '100%',  
                  maxHeight: '100%',  
                  position: 'absolute',  
                  bottom: '100px', 
                  left: 'calc(50% + 100px)',
                  transform: 'translateX(-50%)',
                }}
                onClick={handleYoutubeClick}  
              />
            </div>
        </div>
      </AppRoot>
    );
  };
  