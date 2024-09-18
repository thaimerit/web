import Script from "next/script";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function FacebookChat({ pageId }) {
    if (!pageId || pageId == "")
        return (
            <div
                style={{
                    position: "fixed",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50% 50%",
                    backgroundColor: "#F00",
                    color: "#FFF",
                    right: "24px",
                    bottom: "24px",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="text-center">
                    <div><ErrorOutlineIcon color="#F00" sx={{fontSize:"30px"}} /></div>
                    <div style={{fontSize:"10px"}}>FACEBOOK CHAT<br/>NO PAGE ID</div>
                </div>

            </div>
        );
    return (
        <div>
            <div id="fb-root"></div>
            <div id="fb-customer-chat" className="fb-customerchat"></div>

            <Script id="fb-customer-chat-script" strategy="lazyOnload">
                {`
            var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "${pageId}");
            chatbox.setAttribute("attribution", "biz_inbox");
      
            window.fbAsyncInit = function() {
              FB.init({
                xfbml            : true,
                version          : 'v12.0'
              });
            };
      
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        `}
            </Script>
        </div>
    );
}
