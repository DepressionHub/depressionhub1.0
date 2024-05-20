/* eslint-disable react/no-direct-mutation-state */
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
const Chatbox = () => {
  const chatboxRef = useRef(null);

  useEffect(() => {
    const initChatbox = () => {
      class ChatboxClass {
        constructor(chatboxElement) {
          this.args = {
            openButton: chatboxElement.querySelector('.chatbox__button'),
            chatBox: chatboxElement.querySelector('.chatbox__support'),
            sendButton: chatboxElement.querySelector('.send__button'),
          };

          this.state = false;
          this.messages = [];
        }

        display() {
          const { openButton, chatBox, sendButton } = this.args;

          openButton.addEventListener('click', () => this.toggleState(chatBox));
          sendButton.addEventListener('click', () => this.onSendButton(chatBox));

          const node = chatBox.querySelector('input');
          node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
              this.onSendButton(chatBox);
            }
          });
        }

        toggleState(chatbox) {
          this.state = !this.state;
          if (this.state) {
            chatbox.classList.add('chatbox--active');
          } else {
            chatbox.classList.remove('chatbox--active');
          }
        }

        onSendButton(chatbox) {
          const textField = chatbox.querySelector('input');
          const text1 = textField.value;
          if (text1 === "") {
            return;
          }

          const msg1 = { name: "tanmay", message: text1 };
          this.messages.push(msg1);

          fetch('https://ai-chatbot-for-depressionhub-1-fee4.onrender.com/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then(r => r.json())
            .then(r => {
            console.log(r);
              const msg2 = { name: "Sam", message: r.answer };
              this.messages.push(msg2);
              this.updateChatText(chatbox);
              textField.value = '';
            })
            .catch((error) => {
              console.error('Error:', error);
              this.updateChatText(chatbox);
              textField.value = '';
            });
        }
        updateChatText(chatbox) {
          let html = '';
          this.messages.slice().reverse().forEach(function (item) {
            if (item.name === "Sam") {
              html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
              html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
          });

          const chatmessage = chatbox.querySelector('.chatbox__messages');
          chatmessage.innerHTML = html;
        }
      }

      const chatboxElement = chatboxRef.current;
      if (chatboxElement) {
        const chatbox = new ChatboxClass(chatboxElement);
        chatbox.display();
      }
    };

    if (typeof window !== 'undefined') {
      initChatbox();
    }
  }, []);

  return (
    <div ref={chatboxRef} className="container">
      <div className="chatbox">
        <div className="chatbox__support">
          <div className="chatbox__header">
            <div className="chatbox__image--header">
                <Image
                src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-5--v1.png"
                alt="image"
                width={48}
                height={48}
              />
            </div>
            <div className="chatbox__content--header">
              <h4 className="chatbox__heading--header">Chat support</h4>
              <p className="chatbox__description--header">Hi. My name is tanmay. How can I help you?</p>
            </div>
          </div>
          <div className="chatbox__messages">
            <div></div>
          </div>
          <div className="chatbox__footer">
            <input type="text" placeholder="Write a message..." />
            <button className="chatbox__send--footer send__button">Send</button>
          </div>
        </div>
        <div className="chatbox__button">
          <button>
    <svg
      width="24"
      height="24"
      viewBox="0 0 36 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.2857 10.5714C28.2857 4.88616 21.9576 0.285714 14.1429 0.285714C6.32813 0.285714 0 4.88616 0 10.5714C0 13.8259 2.08929 16.7388 5.34375 18.6272C4.66071 20.2946 3.77679 21.0781 2.9933 21.9621C2.77232 22.2232 2.51116 22.4643 2.59152 22.846C2.65179 23.1875 2.93304 23.4286 3.23438 23.4286C3.25446 23.4286 3.27455 23.4286 3.29464 23.4286C3.89732 23.3482 4.47991 23.2478 5.02232 23.1071C7.05134 22.5848 8.93973 21.721 10.6071 20.5357C11.7321 20.7366 12.9174 20.8571 14.1429 20.8571C21.9576 20.8571 28.2857 16.2567 28.2857 10.5714ZM36 15.7143C36 12.3594 33.7902 9.38616 30.3951 7.51786C30.6964 8.50223 30.8571 9.52679 30.8571 10.5714C30.8571 14.1674 29.0089 17.4821 25.654 19.933C22.5402 22.183 18.4621 23.4286 14.1429 23.4286C13.5603 23.4286 12.9576 23.3884 12.375 23.3482C14.8862 24.9955 18.221 26 21.8571 26C23.0826 26 24.2679 25.8795 25.3929 25.6786C27.0603 26.8638 28.9487 27.7277 30.9777 28.25C31.5201 28.3906 32.1027 28.4911 32.7054 28.5714C33.0268 28.6116 33.3281 28.3504 33.4085 27.9888C33.4888 27.6071 33.2277 27.3661 33.0067 27.1049C32.2232 26.221 31.3393 25.4375 30.6563 23.7701C33.9107 21.8817 36 18.9888 36 15.7143Z"
        fill="#581B98"
      />
    </svg>
  </button>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Nunito', sans-serif;
          font-weight: 400;
          font-size: 100%;
          background: #F1F1F1;
        }

        *, html {
          --primaryGradient: linear-gradient(93.12deg, #581B98 0.52%, #9C1DE7 100%);
          --secondaryGradient: linear-gradient(268.91deg, #581B98 -2.14%, #9C1DE7 99.69%);
          --primaryBoxShadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          --secondaryBoxShadow: 0px -10px 15px rgba(0, 0, 0, 0.1);
          --primary: #581B98;
        }

        /* CHATBOX =============== */
        .chatbox {
          position: fixed;
          bottom: 20px;
          right: 20px;
        }

        /* CONTENT IS CLOSE */
        .chatbox__support {
          display: flex;
          flex-direction: column;
          background: #eee;
          width: 300px;
          height: 350px;
          z-index: -123456;
          opacity: 0;
          transition: all .5s ease-in-out;
        }

        /* CONTENT ISOPEN */
        .chatbox--active {
          transform: translateY(-40px);
          z-index: 123456;
          opacity: 1;
        }

        /* BUTTON */
        .chatbox__button {
          text-align: right;
        }

        .send__button {
          padding: 6px;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
        }

        /* HEADER */
        .chatbox__header {
          position: sticky;
          top: 0;
          background: orange;
        }

        /* MESSAGES */
        .chatbox__messages {
          margin-top: auto;
          display: flex;
          overflow-y: scroll;
          flex-direction: column-reverse;
        }

        .messages__item {
          background: orange;
          max-width: 60.6%;
          width: fit-content;
        }

        .messages__item--operator {
          margin-left: auto;
        }

        .messages__item--visitor {
          margin-right: auto;
        }

        /* FOOTER */
        .chatbox__footer {
          position: sticky;
          bottom: 0;
        }

        .chatbox__support {
          background: #f9f9f9;
          height: 450px;
          width: 350px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        /* HEADER */
        .chatbox__header {
          background: var(--primaryGradient);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 15px 20px;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: var(--primaryBoxShadow);
        }

        .chatbox__image--header {
          margin-right: 10px;
        }

        .chatbox__heading--header {
          font-size: 1.2rem;
          color: white;
        }

        .chatbox__description--header {
          font-size: .9rem;
          color: white;
        }

        /* Messages */
        .chatbox__messages {
          padding: 0 20px;
        }

        .messages__item {
          margin-top: 10px;
          background: #E0E0E0;
          padding: 8px 12px;
          max-width: 70%;
        }

        .messages__item--visitor, .messages__item--typing {
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }

        .messages__item--operator {
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          border-bottom-left-radius: 20px;
          background: var(--primary);
          color: white;
        }

        /* FOOTER */
        .chatbox__footer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px;
          background: var(--secondaryGradient);
          box-shadow: var(--secondaryBoxShadow);
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          margin-top: 20px;
        }

        .chatbox__footer input {
          width: 80%;
          border: none;
          padding: 10px 10px;
          border-radius: 30px;
          text-align: left;
        }

        .chatbox__send--footer {
          color: white;
        }

        .chatbox__button button, .chatbox__button button:focus, .chatbox__button button:visited {
          padding: 10px;
          background: white;
          border: none;
          outline: none;
          border-top-left-radius: 50px;
          border-top-right-radius: 50px;
          border-bottom-left-radius: 50px;
          box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chatbox;