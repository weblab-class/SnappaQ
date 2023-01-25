import React, { useState, useEffect } from "react";

import Active from "../modules/Active.js";
import QueueList from "../modules/QueueList.js";
import "../../utilities.css";
import "./Queues.css";
import { get, post } from "../../utilities";

const GOOGLE_CLIENT_ID = "421107140891-uodmhhbac912d2ns75u0npip3geh3t4d.apps.googleusercontent.com";

// const activeData = {
//   items: [
//     { position: 1, players: ["fee", "foo"] },
//     { position: 2, players: ["pee", "poo"] },
//   ],
// };

// const data = {
//   items: [
//     { position: 1, players: ["Brady", "Peter"] },
//     { position: 2, players: ["Siegel", "Tgod"] },
//     { position: 3, players: ["Mango", "Mongo"] },
//   ],
// };

function queueDataToProp(queuedata) {
  let queuesDataObj = {
    activeData: {
      items: [
        { position: 1, players: queuedata.activeGame.team1 },
        { position: 2, players: queuedata.activeGame.team2 },
      ],
    },
    data: {
      items: queuedata.queue.map((players) => {
        return { position: queuedata.queue.indexOf(players) + 1, players: players };
      }),
    },
  };
  return queuesDataObj;
}

/**
 * Page component to display when at the "/chat" route
 *
 * Proptypes
 * @param {string} userId id of current logged in user
 */

const Queues = (props) => {
  /**
   * @typedef UserObject
   * @property {string} _id
   * @property {string} name
   */
  /**
   * @typedef ItemObject
   * @property {number} position
   * @property {string[]} players
   */
  /**
   * @typedef QueueData
   * @property {ItemObject[]} items
   */

  const [activeQueues, setActiveQueues] = useState(["Snappa", "Beer Die", "Pool", "Darts"]);
  // this won't matter until game types are dynamic and new queues can be added

  const [activeQueue, setActiveQueue] = useState({
    name: "Snappa", // defaults activeQueue to Snappa
  });

  const [queuesData, setQueuesData] = useState(null);

  function updateQueuesData() {
    return get("/api/queues").then((queuedata) => {
      setQueuesData(queueDataToProp(queuedata));
    });
  }

  useEffect(() => {
    updateQueuesData();
  }, []);

  const updateQueuesDataCallback = React.useCallback(() => updateQueuesData(), []);

  // const loadActiveQueue = () => {
  //   // get("/api/chat", { recipient_id: recipient._id }).then((messages) => {
  //   //   setActiveChat({
  //   //     recipient: recipient,
  //   //     messages: messages,
  //   //   });
  //   // });
  // };

  // const addMessages = (data) => {
  //   // TODO (step 9.2) If the messages don't belong in the currently active
  //   // chat, don't add them to the state!
  //   setActiveChat((prevActiveChat) => ({
  //     recipient: prevActiveChat.recipient,
  //     messages: prevActiveChat.messages.concat(data),
  //   }));
  // };

  useEffect(() => {
    document.title = "Queues";
  }, []);

  // useEffect(() => {
  //   loadMessageHistory(activeChat.recipient);
  // }, [activeChat.recipient._id]);

  // useEffect(() => {
  //   get("/api/activeUsers").then((data) => {
  //     // If user is logged in, we load their chats. If they are not logged in,
  //     // there's nothing to load. (Also prevents data races with socket event)
  //     if (props.userId) {
  //       setActiveUsers([ALL_CHAT].concat(data.activeUsers));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   socket.on("message", addMessages);
  //   return () => {
  //     socket.off("message", addMessages);
  //   };
  // }, []);

  // useEffect(() => {
  //   // const callback = (data) => {
  //   //   setActiveUsers([ALL_CHAT].concat(data.activeUsers));
  //   // };
  //   // socket.on("activeUsers", callback);
  //   // return () => {
  //   //   socket.off("activeUsers", callback);
  //   // };
  // }, []);

  // const setActiveUser = (user) => {
  //   if (user._id !== activeChat.recipient._id) {
  //     setActiveChat({
  //       recipient: user,
  //       messages: [],
  //     });
  //   }
  // };

  // if (!props.userId) {
  //   return <div>Log in before using SnappaQ</div>;
  // }
  if (queuesData === null) {
    return <div>Loading</div>;
  }
  return (
    <>
      <div className="u-flex u-relative Queues-container">
        <div className="Queues-queueList">
          <QueueList
            setActiveQueue={setActiveQueue}
            userId={props.userId}
            queues={activeQueues}
            active={activeQueue.name}
          />
        </div>
        {/* <div className="Queues-activeContainer u-relative">
          <div className="Queues-queueContainer">
            <ActiveGame data={activeData} />
          </div>
          <div className="Queues-queueContainer">
            <ActiveQueue data={data} />
          </div>
        </div> */}
        <div className="Queues-queueContainer">
          <Active
            activeData={queuesData.activeData}
            data={queuesData.data}
            callback={updateQueuesDataCallback}
          />
        </div>
      </div>
    </>
  );
};

export default Queues;
