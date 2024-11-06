
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useLaunchParams,
  useMiniApp,
  useViewport,
  useThemeParams,
  useMainButton,
  retrieveLaunchParams,
  useUtils,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { type FC, useEffect, useCallback, useRef} from 'react';
import copy from 'copy-to-clipboard';

const sharedText = "Come and play with me, let's be friends and get Airdrop tokens for free!\n\
💸  10k Coins as a first-time gift\n\
🔥  50k Coins if you have Telegram Premium"
const socialSeedSharedText = "Come to my homeland and assistance my seeds mature. Together, We will all get air drop tokens!\n\
💎💎💎 New users will get 1,000,000 coins for first assistance\n\
💰💰💰 Long-term users will earn 100,000 coins for each assistance they provide"

const appUrl = "https://t.me/my_dev01_bot/miniapp?startapp="
const apiUrl = "https://seed-test.9x9168.com:9100/"
const telegramLink = "https://t.me/SeedsofTON"
const xLink = "https://twitter.com/SeedsofTon"
const youtubeLink = "https://www.youtube.com/@seedsofton"

function handleCacheControl(url: string) {
  if (url.match(/\.unityweb/) || url.match(/\.bundle/)) {
    return "must-revalidate";
  }
  if (url.match(/\.mp4/) || url.match(/\.wav/)) {
    return "immutable";
  }
  return "no-store";
}

export const UnityApp: FC = () => {
  
  const { unityProvider, 
    sendMessage, 
    addEventListener, 
    removeEventListener, 
    loadingProgression, 
    isLoaded 
  } = useUnityContext({
    loaderUrl: 'build/StageBuild.loader.js',
    dataUrl: 'build/StageBuild.data.unityweb',
    frameworkUrl: 'build/StageBuild.framework.js.unityweb',
    codeUrl: 'build/StageBuild.wasm.unityweb',
    cacheControl: handleCacheControl
  });

  const rootDivRef = useRef<HTMLDivElement>(null); 
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const viewport = useViewport();
  const themeParams = useThemeParams();
  const mainButton = useMainButton();
  const utils = useUtils();
  const { initDataRaw } = retrieveLaunchParams();

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

  const handleGameIsReady = useCallback(() => {  
    
    const startParam = lp.startParam ? lp.startParam : "";  
    sendMessage('WebMessage', 'SetStartParam', startParam);
    sendMessage('WebMessage', 'SetInitDataRaw', initDataRaw);
    console.log("" + apiUrl);
    sendMessage('WebMessage', 'SetAPIURL', apiUrl);
  }, [isLoaded]);

  const handleShareURL = useCallback((...parameters: any[]) => {  
    
    const type = parameters[0]
    switch(type)
    {
      case 1:
        utils.shareURL(appUrl + parameters[1], sharedText);
        break;
      case 2:
        utils.shareURL(appUrl + parameters[1], socialSeedSharedText);
        break;
    }
    
  }, [isLoaded]);

  const handleCopyURL = useCallback((...parameters: any[]) => {  
    try {  

      const type = parameters[0]
      var text = appUrl + parameters[1] + "\n" + sharedText;  
      switch(type)
      {
        case 1:
          text = appUrl + parameters[1] + "\n" + sharedText;  
          break;
        case 2:
          text = appUrl + parameters[1] + "\n" + socialSeedSharedText;  
          break;
      }

      copy(text);
      //console.log('Copy to clipboard');  
    } catch (err) {  
      console.error('Copy to clipboard fail:', err);  
    }  
  }, [isLoaded]);

  const handleOpenSomething = useCallback((...parameters: any[]) => {  
    console.log({ parameters });
    try {  
      const handle = parameters[0]
      switch(handle)
      {
        case "tg_community":
          utils.openTelegramLink(telegramLink);
          break;
        case "xxx":
          utils.openLink(xLink);
          break;
        case "youtube":
          utils.openLink(youtubeLink);
          break;
      }
    } catch (err) {  
      
    }  
  }, [isLoaded]);

  const handleOpenLink = useCallback((...parameters: any[]) => {  
    console.log({ parameters });
    try {  
      const handle = parameters[0]
      const url = parameters[1]
      switch(handle)
      {
        case "telegram_link":
          utils.openTelegramLink(url);
          break;
        case "link":
          utils.openLink(url);
          break;
      }
    } catch (err) {  
      
    }  
  }, [isLoaded]);


  const handleTelegramClick = () => {  
    utils.openTelegramLink(telegramLink);  
  };  
  
  const handleXClick = () => {  
    utils.openLink(xLink);
  };  
  
  const handleYoutubeClick = () => {  
    utils.openLink(youtubeLink);  
  };

  useEffect(() => {  
    addEventListener("OnGameIsReady", handleGameIsReady);  
    addEventListener("ShareURL", handleShareURL);  
    addEventListener("CopyURL", handleCopyURL); 
    addEventListener("OpenSomething", handleOpenSomething);
    addEventListener("OpenLink", handleOpenLink);
    return () => {  
      removeEventListener("OnGameIsReady", handleGameIsReady);  
      removeEventListener("ShareURL", handleShareURL);  
      removeEventListener("CopyURL", handleCopyURL);  
      removeEventListener("OpenSomething", handleOpenSomething);
      removeEventListener("OpenLink", handleOpenLink);
    };  
  }, [addEventListener, removeEventListener, isLoaded]);

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
        {!isLoaded ? (
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
                fontSize: '38px',  
                color: 'white',   
                //textShadow: '2px 2px 4px #000000',
              }}  
            >  
              loading...{Math.round(loadingProgression * 100)}%  
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

            <p  
              style={{  
                position: 'absolute',  
                bottom: '5px', // Adjust this value to move the version number up or down  
                width: '100%',  
                textAlign: 'center',  
                fontFamily: 'LanaPixel',  
                fontSize: '16px',  
                color: 'white',  
              }}  
            >  
              Version 0.0.6  
            </p>
          </div>
        ) : null}
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            visibility: isLoaded ? "visible" : "hidden"
          }}
        />
      </div>
    </AppRoot>
  );
};
